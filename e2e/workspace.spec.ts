import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');await page.evaluate(()=>localStorage.clear());await page.reload();});
test('all epic data is visible and combined filters can be cleared',async({page})=>{
  await expect(page.getByRole('heading',{name:'Cotizaciones, bajo control.'})).toBeVisible();
  await expect(page.getByText('Demo interactiva · datos de ejemplo')).toBeVisible();
  await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Meridian');
  await expect(page.getByRole('button',{name:'Abrir Q-10300'})).toBeVisible();
  await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('sin-coincidencias');
  await expect(page.getByText('No hay cotizaciones con estos filtros')).toBeVisible();
  await page.getByRole('button',{name:'Limpiar filtros'}).first().click();
  await expect(page.getByRole('button',{name:'Abrir Q-10300'})).toBeVisible();
});
test('create, edit, history and reload preserve a quotation',async({page})=>{
  await page.getByRole('button',{name:'Nueva cotización'}).click();
  await page.getByLabel('Proyecto',{exact:true}).fill('Proyecto prueba de aceptación');
  await page.getByLabel('Cliente',{exact:true}).fill('Cliente de prueba');
  await page.getByRole('button',{name:'Crear cotización',exact:true}).click();
  await expect(page.getByText('Cotización creada')).toBeVisible();
  await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Proyecto prueba de aceptación');
  await page.getByRole('button',{name:/Abrir Q-/}).click();
  await page.getByRole('button',{name:'Editar cotización'}).click();
  await page.getByRole('textbox',{name:'Comentarios',exact:true}).fill('Revisión acordada con el cliente');
  await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await page.getByRole('button',{name:/^Historial/}).click();
  await expect(page.getByText('Comentarios actualizados',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Cerrar detalle'}).click();
  await page.reload();
  await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Proyecto prueba de aceptación');
  await expect(page.getByRole('button',{name:/Abrir Q-/})).toBeVisible();
});
test('team rebalancing applies and records changes',async({page})=>{
  await page.getByRole('button',{name:'Equipo',exact:true}).click();
  await page.getByRole('button',{name:'Equilibrar carga',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Propuesta de redistribución'})).toBeVisible();
  await page.getByRole('button',{name:'Aplicar redistribución',exact:true}).click();
  await expect(page.getByText('Carga redistribuida')).toBeVisible();
});
test('role views change consultation scope and expose no editing action for account managers',async({page})=>{
  await page.getByLabel('Vista de rol').selectOption('account');
  await expect(page.getByRole('button',{name:'Nueva cotización'})).toHaveCount(0);
  await page.getByLabel('Usuario de la vista').selectOption('Daniel López');
  await page.getByRole('button',{name:'Cotizaciones',exact:true}).click();
  await expect(page.locator('tbody tr')).toHaveCount(8);
});
test('calendar, alerts, settings, export and executive report are usable',async({page})=>{
  await page.getByRole('button',{name:'Calendario',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Calendario de entregas'})).toBeVisible();
  await page.getByRole('button',{name:'Alertas',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Tu centro de atención'})).toBeVisible();
  await page.getByRole('button',{name:'Configuración',exact:true}).click();
  await page.getByLabel('Zona horaria de negocio').selectOption('America/Bogota');
  await page.getByRole('button',{name:'Guardar configuración'}).click();
  await expect(page.getByText('Configuración guardada')).toBeVisible();
  await page.getByRole('button',{name:'Resumen ejecutivo',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Informe ejecutivo'})).toBeVisible();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar CSV',exact:true}).click();
  expect((await download).suggestedFilename()).toMatch(/\.csv$/);
});
test('mobile has no page overflow and opens accessible navigation',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.reload();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Abrir menú'}).click();
  await page.getByRole('button',{name:'Calendario',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Calendario de entregas'})).toBeVisible();
});
test('last update and history dates honor the selected business timezone',async({page})=>{
  await page.evaluate(()=>{const key='epica-workspace-v1',data=JSON.parse(localStorage.getItem(key)!);data.settings.timezone='America/Mexico_City';data.quotes[0].updatedAt='2026-10-01T00:30:00Z';data.quotes[0].history[0].at='2026-10-01T00:30:00Z';localStorage.setItem(key,JSON.stringify(data));});
  await page.reload();await page.getByRole('button',{name:'Abrir Q-10300'}).click();
  await expect(page.getByRole('dialog').getByText('Última actualización',{exact:true}).locator('..')).toContainText('30 de septiembre');
  await page.getByRole('button',{name:/^Historial/}).click();
  await expect(page.locator('.history-list article').first().locator('time')).toContainText('30 sept');
});
test('stale tab edits are blocked and can reload the latest quote',async({page,context})=>{
  await page.getByRole('button',{name:'Abrir Q-10300'}).click();
  await page.getByRole('button',{name:'Editar cotización'}).click();
  await page.getByRole('textbox',{name:'Comentarios',exact:true}).fill('Borrador anterior');
  const other=await context.newPage();await other.goto('/');
  await other.getByRole('button',{name:'Abrir Q-10300'}).click();await other.getByRole('button',{name:'Editar cotización'}).click();
  await other.getByLabel('Proyecto',{exact:true}).fill('Proyecto actualizado en otra pestaña');
  await other.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await expect(page.getByText('Esta cotización cambió en otra pestaña.')).toBeVisible();
  await expect(page.getByRole('button',{name:'Guardar cambios',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Recargar versión actual'}).click();
  await expect(page.getByLabel('Proyecto',{exact:true})).toHaveValue('Proyecto actualizado en otra pestaña');
  await page.getByRole('textbox',{name:'Comentarios',exact:true}).fill('Comentario sobre la versión actual');
  await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await expect(page.getByText('Cambios guardados',{exact:true})).toBeVisible();
  await page.reload();await page.getByRole('button',{name:'Abrir Q-10300'}).click();
  await expect(page.getByRole('dialog')).toContainText('Proyecto actualizado en otra pestaña');
  await expect(page.getByRole('dialog')).toContainText('Comentario sobre la versión actual');
});
test('replacement confirmation cannot discard changes from another tab',async({page,context})=>{
  await page.getByRole('button',{name:'Configuración',exact:true}).click();
  await page.getByRole('button',{name:'Restaurar datos de ejemplo',exact:true}).click();
  const other=await context.newPage();await other.goto('/');await other.getByRole('button',{name:'Abrir Q-10300'}).click();await other.getByRole('button',{name:'Editar cotización'}).click();
  await other.getByLabel('Proyecto',{exact:true}).fill('Conservar este proyecto');await other.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Restaurar ejemplos',exact:true}).click();
  await expect(page.getByText('Los datos cambiaron en otra pestaña. Revisa la versión actual y vuelve a intentarlo.')).toBeVisible();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes[0].project)).toBe('Conservar este proyecto');
});
test('mobile closed navigation is not focusable and Escape restores opener focus',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.reload();
  await expect(page.locator('.sidebar')).toHaveAttribute('inert','');
  const opener=page.getByRole('button',{name:'Abrir menú'});await opener.click();
  await expect(opener).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');
  await expect(page.locator('.sidebar')).toHaveAttribute('inert','');await expect(opener).toBeFocused();
  await page.setViewportSize({width:820,height:1000});await expect(page.locator('.sidebar')).toHaveAttribute('inert','');await opener.click();await page.keyboard.press('Escape');await expect(opener).toBeFocused();
});

test('near simultaneous edits to different quotes retain both changes',async({page,context})=>{
  const other=await context.newPage();await other.goto('/');
  for(const [tab,code,value] of [[page,'Q-10300','Edición A'],[other,'Q-10306','Edición B']] as const){
    await tab.getByRole('button',{name:`Abrir ${code}`}).click();await tab.getByRole('button',{name:'Editar cotización'}).click();await tab.getByLabel('Proyecto',{exact:true}).fill(value);
  }
  await Promise.all([page.getByRole('button',{name:'Guardar cambios',exact:true}).click(),other.getByRole('button',{name:'Guardar cambios',exact:true}).click()]);
  await expect(page.getByText('Cambios guardados',{exact:true})).toBeVisible();await expect(other.getByText('Cambios guardados',{exact:true})).toBeVisible();
  const quotes=await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes);
  expect(quotes.find((q:{code:string})=>q.code==='Q-10300').project).toBe('Edición A');expect(quotes.find((q:{code:string})=>q.code==='Q-10306').project).toBe('Edición B');
});
test('storage failure is explicit and never claims changes were saved',async({page})=>{
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Quota exceeded','QuotaExceededError');};});
  await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Solo en memoria');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await expect(page.getByText('Cambios aplicados sin guardar. Descarga un respaldo.')).toBeVisible();await expect(page.getByText('Cambios guardados',{exact:true})).toHaveCount(0);
  await expect(page.locator('.storage-warning')).toBeVisible();
});
test('key surfaces meet automated WCAG checks including imported light avatars',async({page})=>{
  await page.evaluate(()=>{const key='epica-workspace-v1',d=JSON.parse(localStorage.getItem(key)!);d.people.forEach((p:{color:string})=>p.color='#ffffff');localStorage.setItem(key,JSON.stringify(d));});await page.reload();
  const audit=async(name:string)=>{await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const violations=await page.evaluate(async()=>{const result=await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return result.violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)}));});expect(violations,name).toEqual([]);};
  await audit('overview');await page.getByRole('button',{name:'Abrir Q-10300'}).click();await audit('drawer');await page.getByRole('button',{name:/^Historial/}).click();await audit('history');await page.getByRole('button',{name:'Cerrar detalle'}).click();
  await page.getByRole('button',{name:'Configuración',exact:true}).click();await audit('settings');await page.getByRole('button',{name:'Resumen ejecutivo',exact:true}).click();await audit('report');
});
