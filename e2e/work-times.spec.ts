import {test,expect} from './fixtures';
test.beforeEach(async({page})=>{await page.clock.install({time:new Date('2026-10-05T15:00:00Z')});await page.goto('/');await page.evaluate(()=>localStorage.clear());await page.reload();});
test('new quotes use supplied times and manual overrides survive type changes',async({page})=>{
 await page.getByRole('button',{name:'Nueva cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Adicional de 21 minutos');await page.getByLabel('Cliente',{exact:true}).fill('Cliente');await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Cotización de adicional');
 await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('0.35');await expect(page.getByLabel('Horas pendientes',{exact:true})).toHaveValue('0.35');await expect(page.getByTestId('work-standard')).toContainText('21 min');
 await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Proyecto mayor');await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('6');await page.getByLabel('Incluye takeoff').check();await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('4');await page.getByLabel('Incluye takeoff').uncheck();await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('6');
 await page.getByLabel('Horas estimadas',{exact:true}).fill('7.25');await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Recotización retail');await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('7.25');await page.getByRole('button',{name:'Aplicar tiempo estándar',exact:true}).click();await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('1');
 await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-09');await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Cotización creada',{exact:true})).toBeVisible();await page.reload();await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Adicional de 21 minutos');await expect(page.locator('.quote-card')).toContainText('1 h');
});
test('clearing a numeric field requires correction instead of silently saving zero',async({page})=>{
 await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Horas pendientes',{exact:true}).fill('');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await expect(page.getByLabel('Horas pendientes',{exact:true})).toHaveAttribute('aria-invalid','true');await expect(page.getByLabel('Horas pendientes',{exact:true})).toBeFocused();await expect(page.getByText('Cambios guardados',{exact:true})).toHaveCount(0);
});
test('unfinished configuration survives navigation and persists after saving',async({page})=>{
 await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Plazo base de Retail menor').fill('3');await page.getByRole('button',{name:'Equipo',exact:true}).click();await page.getByRole('button',{name:'Configuración',exact:true}).click();await expect(page.getByLabel('Plazo base de Retail menor')).toHaveValue('3');await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();await page.reload();await expect(page.getByLabel('Plazo base de Retail menor')).toHaveValue('3');
});
test('legacy quote hours and deadlines are untouched until applying the current standard',async({page})=>{
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes[0]);await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue(String(before.estimatedHours));await page.getByLabel('Comentarios',{exact:true}).fill('Conservar horas existentes');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes[0]);expect(saved.estimatedHours).toBe(before.estimatedHours);expect(saved.remainingHours).toBe(before.remainingHours);expect(saved.dueDate).toBe(before.dueDate);
 await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByRole('button',{name:'Aplicar tiempo estándar',exact:true}).click();await expect(page.getByLabel('Horas estimadas',{exact:true})).toHaveValue('0.35');await expect(page.getByLabel('Horas pendientes',{exact:true})).toHaveValue(String(before.remainingHours));
});
test('Senior work time rules validate HH:MM and survive JSON backup import',async({page})=>{
 await page.getByRole('button',{name:'Configuración',exact:true}).click();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:21');await page.getByLabel('Tiempo de Cotización de adicional').fill('03:60');await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();await expect(page.getByText('Usa HH:MM, por ejemplo 00:21 o 03:30')).toBeVisible();
 await page.getByLabel('Tiempo de Cotización de adicional').fill('00:25');await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const file=await (await downloaded).path();await page.getByLabel('Tiempo de Cotización de adicional').fill('01:00');await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();await page.getByLabel('Archivo de respaldo JSON').setInputFiles(file!);await page.getByRole('button',{name:'Importar datos',exact:true}).click();await expect(page.getByText('Respaldo importado',{exact:true})).toBeVisible();await page.reload();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:25');
 await page.getByLabel('Perfil actual').selectOption('estimator-danilo');await expect(page.getByLabel('Tiempo de Cotización de adicional')).toBeDisabled();
});
test('21 minute quote starts at zero progress and reports exact minutes',async({page})=>{
 await page.getByRole('button',{name:'Nueva cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Adicional exacto');await page.getByLabel('Cliente',{exact:true}).fill('Cliente');await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Cotización de adicional');await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-07');await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Cotización creada',{exact:true})).toBeVisible();await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Adicional exacto');await page.getByRole('button',{name:'Tabla',exact:true}).click();await expect(page.locator('.progress-label')).toContainText('0%');await expect(page.locator('tbody')).toContainText('21 min pendientes');
 await page.getByRole('button',{name:/Abrir Q-/}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Horas pendientes',{exact:true}).fill('0.175');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await page.getByRole('button',{name:'Cerrar detalle',exact:true}).click();await expect(page.locator('.progress-label')).toContainText('50%');await expect(page.locator('tbody')).toContainText('10 min 30 s pendientes');
});
test('work time drafts remain protected when another tab changes rules during navigation',async({page,context})=>{
 await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Tiempo de Cotización de adicional').fill('00:25');await page.getByRole('button',{name:'Equipo',exact:true}).click();
 const other=await context.newPage();await other.goto('/');await other.getByRole('button',{name:'Configuración',exact:true}).click();await other.getByLabel('Tiempo de Cotización de adicional').fill('00:30');await other.getByRole('button',{name:'Guardar configuración',exact:true}).click();await expect(other.getByText('Configuración guardada',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Configuración',exact:true}).click();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:25');await expect(page.getByText('La configuración cambió en otra pestaña.')).toBeVisible();await expect(page.getByRole('button',{name:'Guardar configuración',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Recargar configuración actual'}).click();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:30');
});
test('older saved workspaces get defaults without changing saved hours',async({page})=>{
 const previous=await page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('epica-workspace-v1')!);delete data.settings.workMinutes;delete data.settings.leadDays['Recotización proyecto'];delete data.settings.leadDays['Recotización retail'];localStorage.setItem('epica-workspace-v1',JSON.stringify(data));return data.quotes[0];});await page.reload();await page.getByRole('button',{name:'Configuración',exact:true}).click();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:21');await expect(page.getByLabel('Plazo base de Recotización proyecto')).toHaveValue('');await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes[0]);expect(saved.estimatedHours).toBe(previous.estimatedHours);expect(saved.remainingHours).toBe(previous.remainingHours);expect(saved.dueDate).toBe(previous.dueDate);
});
test('new quotation form keeps WCAG text contrast with the work time preview',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.getByRole('button',{name:'Nueva cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Contraste de formulario');await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Cotización de adicional');await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-09');await page.locator('.form-intro').scrollIntoViewIfNeeded();await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 const failures=await page.evaluate(async()=>{const result=await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return result.violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>({target:n.target,summary:n.failureSummary}))}));});expect(failures).toEqual([]);
});

for(const navigation of ['stay away','reopen unchanged','reopen with newer edits'] as const)test(`delayed settings save settles its retained draft: ${navigation}`,async({page})=>{
 await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Tiempo de Cotización de adicional').fill('00:25');
 await page.evaluate(async()=>{
  let acquired!:()=>void;
  const ready=new Promise<void>(resolve=>{acquired=resolve;});
  const held=new Promise<void>(resolve=>{(window as any).releaseSettingsLock=resolve;});
  (window as any).settingsLock=navigator.locks.request('epica-workspace-v1',async()=>{acquired();await held;});
  await ready;
 });
 await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();await expect(page.getByRole('button',{name:'Guardando…',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Equipo',exact:true}).click();
 if(navigation!=='stay away'){
  await page.getByRole('button',{name:'Configuración',exact:true}).click();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:25');
  if(navigation==='reopen with newer edits')await page.getByLabel('Tiempo de Cotización de adicional').fill('00:30');
 }
 await page.evaluate(()=>{(window as any).releaseSettingsLock();});await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).settings.workMinutes.additional)).toBe(25);
 if(navigation==='reopen with newer edits'){
  await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:30');await expect(page.getByText('La configuración cambió en otra pestaña.')).toBeVisible();await expect(page.getByRole('button',{name:'Guardar configuración',exact:true})).toBeDisabled();
  expect(await page.evaluate(()=>window.dispatchEvent(new Event('beforeunload',{cancelable:true})))).toBe(false);
  await page.getByRole('button',{name:'Recargar configuración actual'}).click();await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:25');
 }else{
  expect(await page.evaluate(()=>window.dispatchEvent(new Event('beforeunload',{cancelable:true})))).toBe(true);
  if(navigation==='stay away')await page.getByRole('button',{name:'Configuración',exact:true}).click();
  await expect(page.getByLabel('Tiempo de Cotización de adicional')).toHaveValue('00:25');await expect(page.getByText('La configuración cambió en otra pestaña.')).toHaveCount(0);await expect(page.getByText('Tienes cambios sin guardar.',{exact:false})).toHaveCount(0);await expect(page.getByRole('button',{name:'Guardar configuración',exact:true})).toBeEnabled();
 }
});
