/* loop. service worker: push notifications and an offline page. No other caching, so pages are never stale. */
const OFFLINE_CACHE='loop-offline-v1';
const OFFLINE_URL='/offline';

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(OFFLINE_CACHE).then(cache=>cache.add(new Request(OFFLINE_URL,{cache:'reload'}))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const key of await caches.keys())if(key!==OFFLINE_CACHE)await caches.delete(key);
    if(self.registration.navigationPreload)await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});
// Only page navigations are touched: try the network, fall back to the offline page.
self.addEventListener('fetch',event=>{
  if(event.request.mode!=='navigate')return;
  event.respondWith((async()=>{
    try{
      const preload=await event.preloadResponse;
      return preload||await fetch(event.request);
    }catch{
      const cached=await caches.match(OFFLINE_URL);
      return cached||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch{data={body:event.data?event.data.text():''};}
  const title=data.title||'loop.';
  event.waitUntil(self.registration.showNotification(title,{
    body:data.body||'',
    icon:'/icons/icon-192.png',
    badge:'/icons/badge-96.png',
    tag:data.tag||'loop',
    renotify:Boolean(data.tag),
    lang:data.lang||'ko',
    data:{url:typeof data.url==='string'&&data.url.startsWith('/')?data.url:'/my'},
  }));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=new URL(event.notification.data&&event.notification.data.url||'/my',self.location.origin).href;
  event.waitUntil((async()=>{
    const open=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of open){
      if(new URL(client.url).origin===self.location.origin&&'focus' in client){
        await client.focus();
        if('navigate' in client)return client.navigate(url);
        return;
      }
    }
    return self.clients.openWindow(url);
  })());
});
