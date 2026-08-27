/* Офлайн-режим кассы.
   Приложение кладётся в кэш при установке и дальше открывается без интернета.
   ВАЖНО: при каждом обновлении кассы менять номер версии ниже,
   иначе на планшете останется старая копия. */

var CACHE = 'kassa-v20';

var FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  './apple-touch-icon.png',
  './dishes/plov.jpg',
  './dishes/kazan.jpg',
  './dishes/manti.jpg',
  './dishes/kotleta.jpg',
  './dishes/chahohbili.jpg',
  './dishes/shurpa.jpg',
  './dishes/mastava.jpg',
  './dishes/lentil.jpg',
  './dishes/salat.jpg',
  './dishes/olivie.jpg',
  './dishes/lepeshka.jpg',
  './dishes/tea.jpg',
  './dishes/kefir.jpg',
  './dishes/water.jpg',
  './dishes/kurutob.jpg',
  './dishes/kurutob-meat.jpg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // сеть в приоритете, чтобы обновления доезжали; нет сети — отдаём из кэша
  var fresh = e.request.mode === 'navigate' || /\.(html|js|webmanifest)$/.test(new URL(e.request.url).pathname);
  e.respondWith(
    fetch(fresh ? new Request(e.request, { cache: 'reload' }) : e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () {
      return caches.match(e.request).then(function (r) {
        return r || caches.match('./index.html');
      });
    })
  );
});
