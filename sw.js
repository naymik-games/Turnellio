var cacheName = 'numberMatch v1.2';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/preload.js',
  '/scenes/startGame.js',

  '/assets/fonts/lato.png',
  '/assets/fonts/lato.xml',

  '/classes/match3.js',
  '/classes/settings.js',


  '/assets/sprites/gems_numbers.png',
  '/assets/sprites/menu.png',
  '/assets/sprites/particles.png',
  '/assets/sprites/remove.png',
  '/assets/sprites/square.png',
  '/assets/sprites/unlocked.png',


  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});