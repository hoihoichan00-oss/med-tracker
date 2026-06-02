const CACHE='med-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/index.html'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SCHEDULE'){if(self._timer)clearTimeout(self._timer);const{startDate,notifTime}=e.data;const[h,m]=notifTime.split(':').map(Number);const now=new Date();const next=new Date();next.setHours(h,m,0,0);if(next<=now)next.setDate(next.getDate()+1);const delay=next-now;self._timer=setTimeout(()=>fireDaily(startDate,notifTime),delay);}});
function isMedDay(s,c){return Math.floor((new Date(c)-new Date(s))/86400000)%2===0;}
function today(){return new Date().toISOString().split('T')[0];}
function fireDaily(startDate,notifTime){if(isMedDay(startDate,today())){self.registration.showNotification('💊 甲亢藥物提示',{body:'今日係食藥日！記得食你嘅甲亢藥 😊',tag:'med-reminder',requireInteraction:true});}const[h,m]=notifTime.split(':').map(Number);const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);tomorrow.setHours(h,m,0,0);self._timer=setTimeout(()=>fireDaily(startDate,notifTime),tomorrow-new Date());}
