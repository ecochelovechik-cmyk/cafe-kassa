/* Сервер приёма заказов от гостей кафе «Центр плова».
 *
 * Гость (страница menu/ на github.io) отправляет сюда состав заказа и номер стола.
 * Касса раз в несколько секунд спрашивает «что нового», официант подтверждает.
 *
 * Чего сервер НЕ делает намеренно:
 *  - не принимает цены от гостя. Цены знает только касса, иначе подделка цены
 *    занимает пять секунд;
 *  - не хранит ничего дольше часа. Подтверждённый заказ живёт в кассе, здесь он
 *    лишь перевалочный пункт;
 *  - не решает, верный ли заказ. Это решает официант кнопкой «Принять».
 *
 * Ключ кассы (KASSA_KEY) задаётся секретом Cloudflare, в коде и в репозитории
 * его нет — репозиторий публичный.
 */

const HOUR = 60 * 60 * 1000;

// сколько мусора готовы принять
const LIMITS = {
  items: 30,        // позиций в одном заказе
  nameLen: 60,      // длина названия блюда
  noteLen: 200,     // длина пожелания
  qty: 99,          // порций одного блюда
  table: 99,        // номер стола
  pendingPerTable: 5,
  bodyBytes: 16384,
};

function cors(extra) {
  return Object.assign({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,X-Kassa-Key',
    'Access-Control-Max-Age': '86400',
  }, extra || {});
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: cors({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }),
  });
}

function bad(msg, status) { return json({ ok: false, error: msg }, status || 400); }

// Ключ сравниваем посимвольно до конца, чтобы время ответа не подсказывало,
// сколько символов угадано.
function keyOk(request, env) {
  const got = request.headers.get('X-Kassa-Key') || '';
  const want = env.KASSA_KEY || '';
  if (!want || got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= got.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}

async function readJson(request) {
  const raw = await request.text();
  if (raw.length > LIMITS.bodyBytes) throw new Error('слишком большой запрос');
  try { return JSON.parse(raw); } catch (e) { throw new Error('это не JSON'); }
}

function clampStr(v, max) {
  return String(v === undefined || v === null ? '' : v).slice(0, max).trim();
}

// Количество кратно половине порции — так же, как в кассе.
function cleanQty(v) {
  const q = Math.round((Number(v) || 0) * 2) / 2;
  if (!(q > 0)) return 0;
  return Math.min(q, LIMITS.qty);
}

function cleanItems(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const it of list.slice(0, LIMITS.items)) {
    const n = clampStr(it && it.n, LIMITS.nameLen);
    const q = cleanQty(it && it.q);
    if (!n || !q) continue;
    const one = { n: n, q: q };
    const note = clampStr(it && it.note, LIMITS.noteLen);
    if (note) one.note = note;
    out.push(one);
  }
  return out;
}

// Чистка старого. Дёргается попутно, отдельного расписания не заводим:
// заказов мало, а лишний механизм — лишняя поломка.
async function sweep(env) {
  await env.DB.prepare('DELETE FROM orders WHERE ts < ?').bind(Date.now() - HOUR).run();
}

async function postOrder(request, env) {
  const body = await readJson(request);
  const tbl = Math.floor(Number(body && body.t) || 0);
  if (!(tbl >= 1 && tbl <= LIMITS.table)) return bad('неизвестный стол');

  const items = cleanItems(body && body.items);
  if (!items.length) return bad('пустой заказ');

  await sweep(env);

  const pending = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM orders WHERE tbl = ? AND status = 'new'"
  ).bind(tbl).first();
  if (pending && pending.c >= LIMITS.pendingPerTable) {
    return bad('за этим столом уже несколько заказов ждут официанта', 429);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO orders (id, tbl, items, status, ts) VALUES (?, ?, ?, 'new', ?)"
  ).bind(id, tbl, JSON.stringify(items), Date.now()).run();

  return json({ ok: true, id: id });
}

async function getPending(env) {
  await sweep(env);
  const rows = await env.DB.prepare(
    "SELECT id, tbl, items, ts FROM orders WHERE status = 'new' ORDER BY ts"
  ).all();
  const list = (rows.results || []).map(function (r) {
    let items = [];
    try { items = JSON.parse(r.items); } catch (e) { items = []; }
    return { id: r.id, t: r.tbl, items: items, ts: r.ts };
  });
  return json({ ok: true, orders: list });
}

async function ack(request, env) {
  const body = await readJson(request);
  const id = clampStr(body && body.id, 64);
  const action = clampStr(body && body.action, 16);
  if (!id) return bad('нет номера заказа');
  if (action !== 'accept' && action !== 'reject') return bad('неизвестное действие');
  await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?')
    .bind(action === 'accept' ? 'taken' : 'rejected', id).run();
  return json({ ok: true });
}

async function putMenu(request, env) {
  const body = await readJson(request);
  if (!Array.isArray(body && body.items)) return bad('нет меню');
  const items = body.items.slice(0, 300).map(function (m) {
    const one = {
      n: clampStr(m && m.n, LIMITS.nameLen),
      p: Math.max(0, Number(m && m.p) || 0),
      c: clampStr(m && m.c, 40) || 'Прочее',
    };
    // left: сколько порций осталось. null — остаток не ведут, блюдо всегда доступно.
    one.left = (m && (m.left === null || m.left === undefined)) ? null : cleanQty(m.left);
    if (m && m.img) one.img = clampStr(m.img, 200);
    return one;
  }).filter(function (m) { return m.n; });

  await env.DB.prepare(
    'INSERT INTO menu (id, data, ts) VALUES (1, ?, ?) ' +
    'ON CONFLICT(id) DO UPDATE SET data = excluded.data, ts = excluded.ts'
  ).bind(JSON.stringify(items), Date.now()).run();

  return json({ ok: true, count: items.length });
}

async function getMenu(env) {
  const row = await env.DB.prepare('SELECT data, ts FROM menu WHERE id = 1').first();
  if (!row) return json({ ok: true, updated: 0, items: [] });
  let items = [];
  try { items = JSON.parse(row.data); } catch (e) { items = []; }
  return json({ ok: true, updated: row.ts, items: items });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });

    try {
      if (path === '/api/health') return json({ ok: true, ts: Date.now() });

      // --- гость, без ключа ---
      if (path === '/api/menu' && request.method === 'GET') return await getMenu(env);
      if (path === '/api/order' && request.method === 'POST') return await postOrder(request, env);

      // --- касса, с ключом ---
      const kassaRoutes = ['/api/pending', '/api/ack', '/api/menu'];
      if (kassaRoutes.indexOf(path) >= 0) {
        if (!keyOk(request, env)) return bad('нужен ключ кассы', 401);
        if (path === '/api/pending') return await getPending(env);
        if (path === '/api/ack' && request.method === 'POST') return await ack(request, env);
        if (path === '/api/menu' && request.method === 'POST') return await putMenu(request, env);
      }

      return bad('нет такого адреса', 404);
    } catch (e) {
      return bad(String((e && e.message) || e), 400);
    }
  },
};
