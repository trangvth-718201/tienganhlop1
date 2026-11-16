// Service worker: Tiếng Anh 1 app. Version is a hash of the site content.
const VER='6f40763f', SHELL='ta1-shell-'+VER, DATA='ta1-data';
const SHELL_FILES=["./", "index.html", "404.html", "manifest.webmanifest", "offline.json", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "images/unit-1.webp", "images/unit-2.webp", "images/unit-3.webp", "images/unit-4.webp", "images/unit-5.webp", "images/unit-6.webp", "images/unit-7.webp", "images/unit-8.webp", "unit-1.html", "unit-2.html", "unit-3.html", "unit-4.html", "unit-5.html", "unit-6.html", "unit-7.html", "unit-8.html"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(SHELL_FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ta1-shell-')&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  const page=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
  if(page){ // network first so new lessons show up; fall back to cache when offline
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(SHELL).then(x=>x.put(r,c));return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return;}
  if(r.headers.has('range')){ // audio seeking: serve whole file from cache if present
    e.respondWith(caches.match(u.href,{ignoreSearch:true}).then(m=>m||fetch(r)));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>{
    const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(DATA).then(x=>x.put(r,c))}return res}).catch(()=>m);
    return m||net;}));
});
