import {test,expect} from './fixtures';

test.beforeEach(async({page})=>{await page.clock.install({time:new Date('2026-10-02T15:00:00Z')});await page.goto('/');await page.evaluate(()=>localStorage.clear());await page.reload();});
async function createManual(page:any,takeoff=true){
  await page.getByRole('button',{name:'Nueva cotización'}).click();
  await page.getByLabel('Proyecto',{exact:true}).fill('Proyecto con takeoff');
  await page.getByLabel('Cliente',{exact:true}).fill('Cliente aceptación');
  await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Retail menor');
  await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-09');
  if(takeoff)await page.getByLabel('Incluye takeoff').check();
}
test('manual assignment requires a type, previews takeoff and survives reload without accumulating days',async({page})=>{
  await page.getByRole('button',{name:'Nueva cotización'}).click();
  await page.getByLabel('Proyecto',{exact:true}).fill('Validar tipo');await page.getByLabel('Cliente',{exact:true}).fill('Cliente');
  await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Selecciona el tipo antes de asignar la cotización')).toBeVisible();
  await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Retail menor');
  await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-09');await page.getByLabel('Incluye takeoff').check();
  await expect(page.getByTestId('deadline-preview')).toContainText('12 de octubre');
  await page.getByLabel('Incluye takeoff').uncheck();await expect(page.getByTestId('deadline-preview')).toContainText('9 de octubre');await page.getByLabel('Incluye takeoff').check();
  await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Cotización creada',{exact:true})).toBeVisible();
  await page.reload();await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Validar tipo');await page.getByRole('button',{name:/Abrir Q-/}).click();
  await expect(page.getByRole('dialog').getByText('Fecha de entrega',{exact:true}).locator('..')).toContainText('12 de octubre');
  await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Comentarios',{exact:true}).fill('Sin sumar otro día');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await expect(page.getByRole('dialog').getByText('Fecha de entrega',{exact:true}).locator('..')).toContainText('12 de octubre');
});
test('configured business deadlines are frozen until explicit recalculation',async({page})=>{
  await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Plazo base de Proyecto mayor').fill('1');await page.getByRole('button',{name:'Guardar configuración'}).click();await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Nueva cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Regla congelada');await page.getByLabel('Cliente',{exact:true}).fill('Cliente');await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Proyecto mayor');await page.getByLabel('Incluye takeoff').check();
  await expect(page.getByTestId('deadline-preview')).toContainText('6 de octubre');await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Cotización creada',{exact:true})).toBeVisible();await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByLabel('Plazo base de Proyecto mayor').fill('5');await expect(page.getByLabel('Plazo base de Proyecto mayor')).toHaveValue('5');await page.getByRole('button',{name:'Guardar configuración'}).click();await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Cotizaciones',exact:true}).click();await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Regla congelada');await page.getByRole('button',{name:/Abrir Q-/}).click();await page.getByRole('button',{name:'Editar cotización'}).click();
  await expect(page.getByTestId('deadline-preview')).toContainText('6 de octubre');await page.getByRole('button',{name:'Recalcular con la regla vigente'}).click();await expect(page.getByTestId('deadline-preview')).toContainText('12 de octubre');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await expect(page.getByRole('dialog').getByText('Compromiso original',{exact:true}).locator('..')).toContainText('6 de octubre');
});
test('cards and table share sorting, filters and persisted view preference',async({page})=>{
  await expect(page.getByRole('button',{name:'Tarjetas',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.locator('.quote-card')).toHaveCount(8);
  await page.getByRole('button',{name:'Filtros',exact:true}).click();await page.getByLabel('Filtrar por tipo').selectOption('Retail menor');await page.getByLabel('Filtrar por takeoff').selectOption('with');
  const count=await page.locator('.quote-card').count();expect(count).toBeGreaterThan(0);await page.getByRole('button',{name:'Tabla',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(count);
  await page.reload();await expect(page.getByRole('button',{name:'Tabla',exact:true})).toHaveAttribute('aria-pressed','true');
});
test('legacy workspace keeps dates and requires classification before manual reassignment',async({page})=>{
  await page.evaluate(()=>{const key='epica-workspace-v1',data=JSON.parse(localStorage.getItem(key)!);data.quotes.forEach((q:any)=>{delete q.quoteType;delete q.takeoff;delete q.deadline;});delete data.settings.leadDays;data.quotes[0].dueDate='2026-10-10';data.quotes[0].originalDueDate='2026-10-10';localStorage.setItem(key,JSON.stringify(data));});await page.reload();await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Q-10300');
  await page.getByRole('button',{name:'Abrir Q-10300'}).click();await expect(page.getByRole('dialog')).toContainText('Sin clasificar');await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Comentarios',{exact:true}).fill('Conservar sábado');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await expect(page.getByText('Cambios guardados',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Estimator',{exact:true}).selectOption('moises');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await expect(page.getByText('Selecciona el tipo antes de asignar la cotización')).toBeVisible();await page.getByLabel('Tipo de cotización',{exact:true}).selectOption('Proyecto menor');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await expect(page.getByRole('dialog').getByText('Fecha de entrega',{exact:true}).locator('..')).toContainText('10 de octubre');
});
test('policy settings are read only outside senior role and invalid values do not save',async({page})=>{
  await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Plazo base de Retail mayor').fill('0');await page.getByRole('button',{name:'Guardar configuración'}).click();await expect(page.getByText('Introduce un entero de 1 a 365, o deja el plazo vacío')).toBeVisible();
  await page.getByLabel('Perfil actual').selectOption('estimator-danilo');await expect(page.getByLabel('Plazo base de Retail mayor')).toBeDisabled();await expect(page.getByRole('button',{name:'Guardar configuración'})).toBeDisabled();
});
test('new manual weekend dates are blocked while weekdays work',async({page})=>{
  await createManual(page);await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-10');await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Selecciona una fecha base de lunes a viernes')).toBeVisible();
  await page.getByLabel('Fecha base manual',{exact:true}).fill('2026-10-09');await page.getByRole('button',{name:'Crear cotización',exact:true}).click();await expect(page.getByText('Cotización creada',{exact:true})).toBeVisible();
});
test('new policies survive backup import and reload',async({page})=>{
  await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Plazo base de Cotización de adicional').fill('3');await page.getByRole('button',{name:'Guardar configuración'}).click();
  await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const backup=await download;const file=await backup.path();expect(file).toBeTruthy();
  await page.getByLabel('Plazo base de Cotización de adicional').fill('7');await page.getByRole('button',{name:'Guardar configuración'}).click();
  await expect(page.getByText('Configuración guardada',{exact:true})).toBeVisible();
  await page.locator('input[type=file]').setInputFiles(file!);await page.getByRole('button',{name:'Importar datos',exact:true}).click();await expect(page.getByText('Respaldo importado',{exact:true})).toBeVisible();await page.reload();await expect(page.getByLabel('Plazo base de Cotización de adicional')).toHaveValue('3');
});
test('mobile cards fit the page and are accessible by keyboard',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.reload();await expect(page.locator('.quote-card')).toHaveCount(8);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Abrir Q-10300'}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();
});
test('concurrent policy updates preserve drafts and block stale configuration writes',async({page,context})=>{
  await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByLabel('Plazo base de Retail menor').fill('2');
  const other=await context.newPage();await other.goto('/');await other.getByRole('button',{name:'Configuración',exact:true}).click();await other.getByLabel('Plazo base de Retail menor').fill('5');await other.getByRole('button',{name:'Guardar configuración'}).click();await expect(other.getByText('Configuración guardada',{exact:true})).toBeVisible();
  await expect(page.getByText('La configuración cambió en otra pestaña.')).toBeVisible();await expect(page.getByLabel('Plazo base de Retail menor')).toHaveValue('2');await expect(page.getByRole('button',{name:'Guardar configuración'})).toBeDisabled();await page.getByRole('button',{name:'Recargar configuración actual'}).click();await expect(page.getByLabel('Plazo base de Retail menor')).toHaveValue('5');
});
test('cards retain modified commitment information for postponed overdue work',async({page})=>{
  await page.getByRole('searchbox',{name:'Buscar cotizaciones'}).fill('Q-10306');
  const card=page.locator('.quote-card');await expect(card.getByText('Retrasada',{exact:true})).toBeVisible();await expect(card.getByText('Fecha modificada',{exact:true})).toBeVisible();
});
