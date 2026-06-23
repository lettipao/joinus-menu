const CACHE = "menu-cache-v1";

const FILES = [
 "/",
 "/index.html",
 "/css/style.css",
 "/js/menu.js",
 "/manifest.json"
];

self.addEventListener("install", e => {
 e.waitUntil(
  caches.open(CACHE).then(cache => {
   return cache.addAll(FILES);
  })
 );
});

self.addEventListener("fetch", e => {
 e.respondWith(
  caches.match(e.request).then(res => {
   return res || fetch(e.request);
  })
 );
});