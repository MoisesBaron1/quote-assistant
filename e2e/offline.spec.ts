import {test,expect} from '@playwright/test';
test.use({baseURL:'http://127.0.0.1:4173',serviceWorkers:'allow'});
test('after the first online visit, offline reload and every demo view work',async({page,context})=>{
 await page.goto('/');await page.waitForFunction(()=>!!navigator.serviceWorker.controller,undefined,{timeout:8000});
 await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:'Cotizaciones, bajo control.'})).toBeVisible();await expect(page.getByText('Sin conexión. Puedes seguir trabajando;', {exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Edición sin internet');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await expect(page.getByText('Cambios guardados',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Cerrar detalle'}).click();
 for(const name of ['Equipo','Calendario','Alertas','Actividad','Configuración','Resumen ejecutivo']){await page.getByRole('button',{name,exact:true}).click();await expect(page.locator('.view-loading')).toHaveCount(0);if(name==='Configuración'){await page.getByLabel('Plazo base de Retail menor').fill('2');await page.getByRole('button',{name:'Guardar configuración'}).click();await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();}}
 await expect(page.getByRole('heading',{name:'Informe ejecutivo',exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Informe ejecutivo',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes.find((q:{code:string})=>q.code==='Q-10300').project)).toBe('Edición sin internet');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).settings.leadDays['Retail menor'])).toBe(2);
});
