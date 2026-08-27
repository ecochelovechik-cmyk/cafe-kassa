-- База заказов от гостей. Живёт недолго: подтверждённое уезжает в кассу,
-- всё старше часа удаляется само.

CREATE TABLE IF NOT EXISTS orders (
  id     TEXT PRIMARY KEY,          -- случайный, гостю его знать необязательно
  tbl    INTEGER NOT NULL,          -- номер стола 1..13, как в кассе
  items  TEXT    NOT NULL,          -- JSON: [{n:название, q:количество, note:пожелание}]
  status TEXT    NOT NULL DEFAULT 'new',   -- new | taken | rejected
  ts     INTEGER NOT NULL           -- когда пришёл, миллисекунды
);

-- касса спрашивает «что нового» на каждый опрос, это самый частый запрос
CREATE INDEX IF NOT EXISTS idx_orders_new ON orders(status, ts);
-- ограничение «не больше пяти неподтверждённых на стол»
CREATE INDEX IF NOT EXISTS idx_orders_tbl ON orders(tbl, status);

-- Меню, выложенное кассой для гостей. Всегда одна строка.
CREATE TABLE IF NOT EXISTS menu (
  id   INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT    NOT NULL,            -- JSON: [{n,p,c,left}]
  ts   INTEGER NOT NULL
);
