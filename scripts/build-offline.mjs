import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const output=new URL('../dist/',import.meta.url);
const files=(await readdir(new URL('assets/',output))).sort().map(name=>'/assets/'+name);
const version=createHash('sha256').update(files.join('\n')).update(await readFile(new URL('index.html',output))).digest('hex').slice(0,16);
const script=`
const CACHE='epica-static-${version}';
let networkAvailable=true;
self.addEventListener('message',event=>{if(event.data?.type==='epica-connectivity')event.source?.postMessage({type:'epica-connectivity',online:networkAvailable});});
const FILES=${JSON.stringify(['/', '/favicon.svg',...files])};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=(await caches.keys()).filter(key=>key.startsWith('epica-static-'));
 const old=keys.filter(key=>key!==CACHE);
 await Promise.all(old.slice(0,-1).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{networkAvailable=true;return response;}).catch(async()=>{
   networkAvailable=false;
   const cache=await caches.open(CACHE);
   return (await cache.match('/'))||Response.error();
  }));
 }else if(url.pathname.startsWith('/assets/')||url.pathname==='/favicon.svg'){
  event.respondWith(caches.match(request,{ignoreVary:true}).then(cached=>cached||fetch(request)));
 }
});
`;
await writeFile(new URL('sw.js',output),script.trim()+'\n');
console.log(`Offline cache: ${files.length+2} static resources, version ${version}`);
