;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_nutricion_dietetica',
  urlsToCache = [
    './',
    './vendor/bootstrap/css/bootstrap.min.css',
    './vendor/font-awesome/css/font-awesome.min.css',
    'https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800',
    'https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic,900,900italic',
    './vendor/magnific-popup/magnific-popup.css" rel="stylesheet',
    './css/creative.css',
    './vendor/scrollreveal/scrollreveal-4.0.0.js',
    './vendor/jquery/jquery.js',
    './vendor/bootstrap/js/bootstrap.bundle.js',
    './vendor/jquery-easing/jquery.easing.min.js',
    './vendor/magnific-popup/jquery.magnific-popup.min.js',
    './js/creative.js',
    './index.js',
    './img/escudo-unimar-200.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})