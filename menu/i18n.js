/* Языки гостевого меню.
 *
 * Вынесено отдельным файлом, чтобы правки текстов не задевали логику страницы.
 * Загружается обычным <script> — сборки нет, всё как есть.
 *
 * 🔴 СОСТАВ БЛЮД НЕ ВЫДУМЫВАТЬ. Заполняется только по словам Рашида:
 * ошибка в составе — это не опечатка, а аллергия у гостя.
 * Пока состав не задан, карточка блюда просто не показывает этот раздел.
 */

var LANGS = [
  ['ru', 'Рус'],
  ['en', 'Eng'],
  ['zh', '中文'],
  ['es', 'Esp'],
  ['fr', 'Fra'],
  ['pt', 'Por']
];

// Тексты самого приложения.
var UI = {
  ru: {
    sub: 'Узбекская и таджикская кухня',
    table: 'Стол {n}', street: 'Улица {n}', dot: '.',
    add: 'Добавить', left: 'осталось', out: 'закончилось',
    pcs: 'шт.', send: 'Отправить официанту', sending: 'Отправляю…',
    sent: '✅ <b>Заказ отправлен официанту.</b> Он подойдёт подтвердить. Если что-то нужно изменить — скажите ему.',
    failSend: '⚠️ <b>Не получилось отправить заказ.</b><br><b>Позовите официанта</b> — он примет заказ за вашим столом.',
    failOrder: '⚠️ Заказ не приняли: ',
    callWaiter: '<b>Позовите официанта</b> — он примет заказ.',
    footPlain: 'Для заказа <b>позовите официанта</b> — он примет заказ за вашим столом.',
    footTable: 'Для заказа <b>позовите официанта</b> и назовите ваше место: ',
    comp: 'Состав', close: 'Закрыть', price: 'Цена',
    noComp: 'Состав уточните у официанта.'
  },
  en: {
    sub: 'Uzbek and Tajik cuisine',
    table: 'Table {n}', street: 'Terrace {n}', dot: '.',
    add: 'Add', left: 'left', out: 'sold out',
    pcs: 'pcs', send: 'Send to waiter', sending: 'Sending…',
    sent: '✅ <b>Your order was sent to the waiter.</b> He will come to confirm it. Tell him if anything needs changing.',
    failSend: '⚠️ <b>Could not send the order.</b><br><b>Please call the waiter</b> — he will take your order.',
    failOrder: '⚠️ Order was not accepted: ',
    callWaiter: '<b>Please call the waiter</b> — he will take your order.',
    footPlain: 'To order, <b>please call the waiter</b> — he will take your order at your table.',
    footTable: 'To order, <b>call the waiter</b> and tell him your seat: ',
    comp: 'Ingredients', close: 'Close', price: 'Price',
    noComp: 'Please ask the waiter about the ingredients.'
  },
  zh: {
    sub: '乌兹别克与塔吉克风味',
    table: '{n}号桌', street: '露台{n}号', dot: '。',
    add: '添加', left: '剩余', out: '已售完',
    pcs: '份', send: '发送给服务员', sending: '发送中…',
    sent: '✅ <b>订单已发送给服务员。</b>他会过来与您确认。如需修改，请告诉他。',
    failSend: '⚠️ <b>订单发送失败。</b><br><b>请呼叫服务员</b>，他会为您点单。',
    failOrder: '⚠️ 订单未被接受：',
    callWaiter: '<b>请呼叫服务员</b>，他会为您点单。',
    footPlain: '点餐请<b>呼叫服务员</b>，他会到您的餐桌为您点单。',
    footTable: '点餐请<b>呼叫服务员</b>，并告知您的座位：',
    comp: '配料', close: '关闭', price: '价格',
    noComp: '配料详情请询问服务员。'
  },
  es: {
    sub: 'Cocina uzbeka y tayika',
    table: 'Mesa {n}', street: 'Terraza {n}', dot: '.',
    add: 'Añadir', left: 'quedan', out: 'agotado',
    pcs: 'uds.', send: 'Enviar al camarero', sending: 'Enviando…',
    sent: '✅ <b>Su pedido fue enviado al camarero.</b> Vendrá a confirmarlo. Dígale si desea cambiar algo.',
    failSend: '⚠️ <b>No se pudo enviar el pedido.</b><br><b>Llame al camarero</b>, él tomará su pedido.',
    failOrder: '⚠️ El pedido no fue aceptado: ',
    callWaiter: '<b>Llame al camarero</b>, él tomará su pedido.',
    footPlain: 'Para pedir, <b>llame al camarero</b>: él tomará su pedido en la mesa.',
    footTable: 'Para pedir, <b>llame al camarero</b> e indique su sitio: ',
    comp: 'Ingredientes', close: 'Cerrar', price: 'Precio',
    noComp: 'Consulte los ingredientes con el camarero.'
  },
  fr: {
    sub: 'Cuisine ouzbèke et tadjike',
    table: 'Table {n}', street: 'Terrasse {n}', dot: '.',
    add: 'Ajouter', left: 'restant', out: 'épuisé',
    pcs: 'pcs', send: 'Envoyer au serveur', sending: 'Envoi…',
    sent: '✅ <b>Votre commande a été envoyée au serveur.</b> Il viendra la confirmer. Dites-lui si vous voulez changer quelque chose.',
    failSend: '⚠️ <b>Impossible d’envoyer la commande.</b><br><b>Appelez le serveur</b>, il prendra votre commande.',
    failOrder: '⚠️ Commande refusée : ',
    callWaiter: '<b>Appelez le serveur</b>, il prendra votre commande.',
    footPlain: 'Pour commander, <b>appelez le serveur</b> : il prendra votre commande à table.',
    footTable: 'Pour commander, <b>appelez le serveur</b> et indiquez votre place : ',
    comp: 'Ingrédients', close: 'Fermer', price: 'Prix',
    noComp: 'Demandez les ingrédients au serveur.'
  },
  pt: {
    sub: 'Cozinha uzbeque e tajique',
    table: 'Mesa {n}', street: 'Esplanada {n}', dot: '.',
    add: 'Adicionar', left: 'restam', out: 'esgotado',
    pcs: 'un.', send: 'Enviar ao garçom', sending: 'Enviando…',
    sent: '✅ <b>O seu pedido foi enviado ao garçom.</b> Ele virá confirmar. Avise-o se quiser mudar algo.',
    failSend: '⚠️ <b>Não foi possível enviar o pedido.</b><br><b>Chame o garçom</b> — ele anotará o seu pedido.',
    failOrder: '⚠️ Pedido não aceito: ',
    callWaiter: '<b>Chame o garçom</b> — ele anotará o seu pedido.',
    footPlain: 'Para pedir, <b>chame o garçom</b>: ele anotará o pedido na sua mesa.',
    footTable: 'Para pedir, <b>chame o garçom</b> e diga o seu lugar: ',
    comp: 'Ingredientes', close: 'Fechar', price: 'Preço',
    noComp: 'Pergunte ao garçom sobre os ingredientes.'
  }
};

// Категории меню. Ключ — как в кассе.
var CAT = {
  'Основные': { en: 'Main dishes', zh: '主菜', es: 'Platos principales', fr: 'Plats principaux', pt: 'Pratos principais' },
  'Супы':     { en: 'Soups', zh: '汤类', es: 'Sopas', fr: 'Soupes', pt: 'Sopas' },
  'Салаты':   { en: 'Salads', zh: '沙拉', es: 'Ensaladas', fr: 'Salades', pt: 'Saladas' },
  'Выпечка':  { en: 'Bread', zh: '面点', es: 'Panadería', fr: 'Pains', pt: 'Pães' },
  'Напитки':  { en: 'Drinks', zh: '饮品', es: 'Bebidas', fr: 'Boissons', pt: 'Bebidas' },
  'Прочее':   { en: 'Other', zh: '其他', es: 'Otros', fr: 'Autres', pt: 'Outros' }
};

/* Названия блюд. Ключ — название в кассе.
 * Здесь намеренно транслитерация, а не «перевод по смыслу»: написать
 * «рисовое блюдо с бараниной» значит заявить состав, которого я не знаю.
 * Когда Рашид даст составы, названия можно будет уточнить вместе с ними. */
var DISHNAME = {
  'Плов':                         { en: 'Plov (pilaf)', zh: '抓饭', es: 'Plov (pilaf)', fr: 'Plov (pilaf)', pt: 'Plov (pilaf)' },
  'Казан-кебаб':                  { en: 'Kazan-kebab', zh: '卡赞烤肉 (Kazan-kebab)', es: 'Kazán-kebab', fr: 'Kazan-kébab', pt: 'Kazan-kebab' },
  'Курутоби гушти':               { en: 'Qurutob with meat', zh: '库鲁托布 (肉) Qurutob', es: 'Qurutob con carne', fr: 'Qurutob à la viande', pt: 'Qurutob com carne' },
  'Курутоб':                      { en: 'Qurutob', zh: '库鲁托布 (Qurutob)', es: 'Qurutob', fr: 'Qurutob', pt: 'Qurutob' },
  'Манты':                        { en: 'Manti', zh: '曼提 (Manti)', es: 'Manti', fr: 'Manti', pt: 'Manti' },
  'Котлета с жареным картофелем': { en: 'Cutlet with fried potatoes', zh: '肉饼配煎土豆', es: 'Filete ruso con patatas fritas', fr: 'Croquette et pommes de terre sautées', pt: 'Bife à milanesa com batatas' },
  'Чахохбили':                    { en: 'Chakhokhbili', zh: '恰霍赫比利 (Chakhokhbili)', es: 'Chajojbili', fr: 'Tchakhokhbili', pt: 'Chakhokhbili' },
  'Шурпа':                        { en: 'Shurpa', zh: '舒尔帕汤 (Shurpa)', es: 'Shurpa', fr: 'Chorba (Shurpa)', pt: 'Shurpa' },
  'Мастава':                      { en: 'Mastava', zh: '马斯塔瓦汤 (Mastava)', es: 'Mastava', fr: 'Mastava', pt: 'Mastava' },
  'Чечевичный суп':               { en: 'Lentil soup', zh: '扁豆汤', es: 'Sopa de lentejas', fr: 'Soupe de lentilles', pt: 'Sopa de lentilha' },
  'Оливье':                       { en: 'Olivier salad', zh: '奥利维耶沙拉', es: 'Ensaladilla Olivier', fr: 'Salade Olivier', pt: 'Salada Olivier' },
  'Свежий салат':                 { en: 'Fresh salad', zh: '鲜蔬沙拉', es: 'Ensalada fresca', fr: 'Salade fraîche', pt: 'Salada fresca' },
  'Лепёшка':                      { en: 'Lepyoshka (flatbread)', zh: '烤饼 (Lepyoshka)', es: 'Pan plano (lepyoshka)', fr: 'Galette (lepiochka)', pt: 'Pão achatado (lepyoshka)' },
  'Чай с лимоном':                { en: 'Tea with lemon', zh: '柠檬茶', es: 'Té con limón', fr: 'Thé au citron', pt: 'Chá com limão' },
  'Кефир':                        { en: 'Kefir', zh: '开菲尔酸奶 (Kefir)', es: 'Kéfir', fr: 'Képhir', pt: 'Kefir' },
  'Дайао':                        { en: 'Dayao', zh: '大窑', es: 'Dayao', fr: 'Dayao', pt: 'Dayao' },
  'Кола 0.33':                    { en: 'Cola 0.33', zh: '可乐 0.33', es: 'Cola 0,33', fr: 'Cola 0,33', pt: 'Cola 0,33' },
  'Пепси':                        { en: 'Pepsi', zh: '百事可乐', es: 'Pepsi', fr: 'Pepsi', pt: 'Pepsi' },
  'Фанта':                        { en: 'Fanta', zh: '芬达', es: 'Fanta', fr: 'Fanta', pt: 'Fanta' },
  'Спрайт':                       { en: 'Sprite', zh: '雪碧', es: 'Sprite', fr: 'Sprite', pt: 'Sprite' },
  'Вода без газа':                { en: 'Still water', zh: '纯净水', es: 'Agua sin gas', fr: 'Eau plate', pt: 'Água sem gás' }
};

/* 🔴 СОСТАВ БЛЮД. Пусто — Рашид ещё не давал данные.
 * Заполнять ТОЛЬКО с его слов. Формат:
 *
 *   'Плов': {
 *     ru: ['рис', 'баранина', 'морковь', 'лук', 'зира'],
 *     en: ['rice', 'lamb', 'carrot', 'onion', 'cumin'],
 *     zh: ['米饭', '羊肉', '胡萝卜', '洋葱', '孜然'],
 *     es: [...], fr: [...], pt: [...]
 *   },
 */
var COMP = {
  // со слов Рашида 27.08.2026
  'Казан-кебаб': {
    ru: ['баранина', 'жареный картофель', 'растительное масло', 'соль', 'перец чёрный', 'зира'],
    en: ['lamb', 'fried potatoes', 'vegetable oil', 'salt', 'black pepper', 'cumin'],
    zh: ['羊肉', '炸土豆', '植物油', '盐', '黑胡椒', '孜然'],
    es: ['cordero', 'patatas fritas', 'aceite vegetal', 'sal', 'pimienta negra', 'comino'],
    fr: ['agneau', 'pommes de terre frites', 'huile végétale', 'sel', 'poivre noir', 'cumin'],
    pt: ['cordeiro', 'batatas fritas', 'óleo vegetal', 'sal', 'pimenta-do-reino', 'cominho']
  },
  'Шурпа': {
    ru: ['говядина', 'лук', 'морковь', 'картофель', 'помидор', 'болгарский перец', 'нут', 'соль', 'перец чёрный', 'зира'],
    en: ['beef', 'onion', 'carrot', 'potato', 'tomato', 'bell pepper', 'chickpeas', 'salt', 'black pepper', 'cumin'],
    zh: ['牛肉', '洋葱', '胡萝卜', '土豆', '番茄', '甜椒', '鹰嘴豆', '盐', '黑胡椒', '孜然'],
    es: ['ternera', 'cebolla', 'zanahoria', 'patata', 'tomate', 'pimiento', 'garbanzos', 'sal', 'pimienta negra', 'comino'],
    fr: ['bœuf', 'oignon', 'carotte', 'pomme de terre', 'tomate', 'poivron', 'pois chiches', 'sel', 'poivre noir', 'cumin'],
    pt: ['carne bovina', 'cebola', 'cenoura', 'batata', 'tomate', 'pimentão', 'grão-de-bico', 'sal', 'pimenta-do-reino', 'cominho']
  },
  'Мастава': {
    ru: ['говядина', 'растительное масло', 'лук', 'морковь', 'картофель', 'болгарский перец', 'рис', 'нут', 'соль', 'перец чёрный', 'зира'],
    en: ['beef', 'vegetable oil', 'onion', 'carrot', 'potato', 'bell pepper', 'rice', 'chickpeas', 'salt', 'black pepper', 'cumin'],
    zh: ['牛肉', '植物油', '洋葱', '胡萝卜', '土豆', '甜椒', '大米', '鹰嘴豆', '盐', '黑胡椒', '孜然'],
    es: ['ternera', 'aceite vegetal', 'cebolla', 'zanahoria', 'patata', 'pimiento', 'arroz', 'garbanzos', 'sal', 'pimienta negra', 'comino'],
    fr: ['bœuf', 'huile végétale', 'oignon', 'carotte', 'pomme de terre', 'poivron', 'riz', 'pois chiches', 'sel', 'poivre noir', 'cumin'],
    pt: ['carne bovina', 'óleo vegetal', 'cebola', 'cenoura', 'batata', 'pimentão', 'arroz', 'grão-de-bico', 'sal', 'pimenta-do-reino', 'cominho']
  }
};
