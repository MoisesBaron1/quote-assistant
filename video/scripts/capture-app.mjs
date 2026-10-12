import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browserPath=process.env.QUOTE_ASSISTANT_BROWSER_PATH;
const browser=await chromium.launch({...(browserPath?{executablePath:browserPath}:{}),args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
const page=await context.newPage();page.setDefaultTimeout(15000);
const errors=[],manifest=[];page.on('pageerror',e=>errors.push(e.message));
const out=path.join(root,'assets/screens/');
await mkdir(out,{recursive:true});
async function shot(name,locator,limit=720){
 await page.evaluate(()=>document.fonts.ready);
 let clip;
 if(locator){await locator.scrollIntoViewIfNeeded();const b=await locator.boundingBox();assert(b);clip={x:Math.max(0,b.x),y:Math.max(0,b.y),width:Math.min(b.width,1440-Math.max(0,b.x)),height:Math.min(b.height,limit,900-Math.max(0,b.y))};}
 await page.screenshot({path:out+name,clip,animations:'disabled'});
 manifest.push({name,clip:clip??{x:0,y:0,width:1440,height:900},url:page.url()});
}
async function nav(name){await page.getByRole('button',{name,exact:true}).click();await page.locator('.view-loading').waitFor({state:'detached'});await page.locator('h1').waitFor();}
try{
 const response=await page.goto(process.env.QUOTE_ASSISTANT_CAPTURE_URL||'http://127.0.0.1:4173/?space=demo');assert.equal(response.status(),200);
 await page.getByRole('heading',{name:'Cotizaciones, bajo control.'}).waitFor();
 assert.match(await page.title(),/Quote Assistant/);
 assert(!((await page.locator('body').innerText()).toLowerCase().includes('epica')));
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller,undefined,{timeout:15000});
 await shot('overview.png');
 await shot('metrics.png',page.locator('.metric-strip'));
 await shot('capacity.png',page.locator('.capacity-grid'));
 await page.getByRole('button',{name:'Ver cotizaciones retrasadas',exact:false}).click();
 await shot('filtered.png',page.locator('.ledger'),610);
 await page.getByRole('button',{name:'Limpiar filtros',exact:true}).first().click();
 await page.getByRole('button',{name:'Filtros',exact:true}).click();
 await shot('filters.png',page.locator('.ledger'),620);
 await page.getByRole('button',{name:'Nueva cotización',exact:true}).click();
 await shot('new-quote.png',page.getByRole('dialog'),900);
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Abrir Q-10300',exact:true}).click();
 await shot('detail.png',page.getByRole('dialog'),560);
 await page.getByRole('button',{name:'Editar cotización',exact:true}).click();
 await page.getByRole('textbox',{name:'Comentarios',exact:true}).fill('Próximo paso: confirmar los planos de la fachada con el cliente.');
 await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
 await page.getByText('Cambios guardados',{exact:true}).waitFor();
 await shot('edited.png',page.getByRole('dialog'),620);
 await page.getByRole('button',{name:/^Historial/}).click();
 await shot('history.png',page.getByRole('dialog'),620);
 await page.getByRole('button',{name:'Cerrar detalle',exact:true}).click();
 await nav('Equipo');await shot('team.png',page.locator('.main-content'),740);
 await page.getByRole('button',{name:'Equilibrar carga',exact:true}).click();
 await shot('rebalance.png',page.getByRole('dialog'),740);
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await nav('Calendario');await shot('calendar.png',page.locator('.main-content'),720);
 await nav('Alertas');await shot('alerts.png',page.locator('.main-content'),660);
 await page.getByRole('button',{name:'Ver cotización',exact:true}).first().click();
 await page.getByRole('button',{name:'Mensaje al cliente',exact:true}).click();
 await shot('message.png',page.getByRole('dialog'),600);
 await page.getByRole('button',{name:'Cerrar detalle',exact:true}).click();
 await nav('Resumen ejecutivo');await shot('report.png',page.locator('.report-panel'),730);
 await page.emulateMedia({media:'print'});await page.pdf({path:path.join(root,'../public/descargas/quote-assistant-informe-demo.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
 await nav('Configuración');await shot('settings.png',page.locator('.settings-grid'),720);
 await shot('offline-ready.png',page.locator('.page-footer'),180);
 await page.locator('.toast').waitFor({state:'detached'});
 await page.getByRole('button',{name:'Guía de presentación',exact:true}).click();
 await shot('guide.png');
 await page.getByRole('button',{name:'Cerrar guía',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo(0,0));
 await shot('mobile.png');
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.brand-name').getBoundingClientRect().left>=0);
 const brand=await page.locator('.brand-name').boundingBox();assert(brand&&brand.x>=0&&brand.x+brand.width<390);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);
 await writeFile(path.join(out,'manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),http:200,brand:'Quote Assistant',runtimeErrors:errors,captures:manifest},null,2));
 console.log(JSON.stringify({screenshots:manifest.length,brand:'Quote Assistant',http:200,runtimeErrors:errors}));
}catch(error){console.log(JSON.stringify({title:await page.title(),url:page.url(),body:(await page.locator('body').innerText()).slice(0,600),runtimeErrors:errors}));throw error;}finally{await browser.close();}
