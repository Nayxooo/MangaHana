const CACHE_NAME = "v1";
const ASSETS_PATH = "/styles/";
const JS_PATH = "/script/";
const IMG_PATH = "/img/";

const urlsToCache = [
    "/", 
    "/index.html", 
    "/font/Montserrat/static/Montserrat-Medium.ttf", 
    "/font/Poppins/Poppins-Medium.ttf", 
    `${ASSETS_PATH}style.css`, 
    `${ASSETS_PATH}navbar-footer.css`, 
    `${ASSETS_PATH}style-accueil.css`, 
    `${ASSETS_PATH}resp-accueil.css`, 
    `${JS_PATH}script-main.js`, 
    `${JS_PATH}script-cookies.js`, 
    `${IMG_PATH}mangahana-icon.png`, 
    `${IMG_PATH}mangahana-logo.png`, 
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
