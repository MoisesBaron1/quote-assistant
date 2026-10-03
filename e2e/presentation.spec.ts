import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');await page.evaluate(()=>localStorage.clear());await page.goto('/');await page.reload();});
test('Escape preserves an unsaved quotation until the user chooses to discard',async({page})=>{
 await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Conservar mi borrador');await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog',{name:'Descartar cambios sin guardar'})).toBeVisible();await page.getByRole('button',{name:'Seguir editando'}).click();await expect(page.getByLabel('Proyecto',{exact:true})).toHaveValue('Conservar mi borrador');
 await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await expect(page.getByText('Cambios guardados',{exact:true})).toBeVisible();
});
test('navigation survives reload and the browser back button',async({page})=>{
 await page.getByRole('button',{name:'Equipo',exact:true}).click();await expect(page).toHaveURL(/#team$/);await page.reload();await expect(page.getByRole('heading',{name:'Un equipo, una vista clara.'})).toBeVisible();await page.getByRole('button',{name:'Calendario',exact:true}).click();await page.goBack();await expect(page.getByRole('heading',{name:'Un equipo, una vista clara.'})).toBeVisible();
});
test('damaged local data can be explicitly replaced with working demo data',async({page})=>{
 await page.evaluate(()=>localStorage.setItem('epica-workspace-v1','{damaged'));await page.reload();await expect(page.locator('.storage-warning')).toBeVisible();
 await page.getByRole('button',{name:'Configuración',exact:true}).click();await page.getByRole('button',{name:'Restaurar datos de ejemplo',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Restaurar ejemplos',exact:true}).click();
 await expect(page.getByText('Datos de ejemplo restaurados',{exact:true})).toBeVisible();await page.reload();await expect(page.locator('.storage-warning')).toHaveCount(0);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes.length)).toBe(24);
});
test('presentation guide walks through the main story without changing quotations',async({page})=>{
 const before=await page.evaluate(()=>localStorage.getItem('epica-workspace-v1'));
 await page.getByRole('button',{name:'Guía de presentación',exact:true}).click();await expect(page.getByRole('region',{name:'Guía de presentación'})).toBeVisible();
 await expect(page.getByRole('region',{name:'Guía de presentación'})).toContainText('1 de 6');
 for(let i=0;i<5;i++)await page.getByRole('button',{name:'Siguiente paso',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Informe ejecutivo',exact:true})).toBeVisible();await page.getByRole('button',{name:'Finalizar guía',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('epica-workspace-v1'))).toBe(before);
});
test('all validation failures are announced and focus the first invalid field',async({page})=>{
 await page.getByRole('button',{name:'Nueva cotización'}).click();await page.getByRole('button',{name:'Crear cotización',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Revisa los campos');await expect(page.getByLabel('Proyecto',{exact:true})).toBeFocused();
});
test('dashboard indicator opens the corresponding actionable filter',async({page})=>{
 await expect(page.getByRole('button',{name:'Ver cotizaciones retrasadas',exact:false})).toBeVisible();await page.getByRole('button',{name:'Ver cotizaciones retrasadas',exact:false}).click();
 await expect(page.getByRole('button',{name:'Retrasadas',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Tabla',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(2);await page.getByRole('button',{name:'Limpiar filtros'}).first().click();await expect(page.locator('tbody tr')).toHaveCount(8);
});
test('JSON backup roundtrip preserves edits and importing can be cancelled',async({page})=>{
 await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Editar cotización'}).click();await page.getByLabel('Proyecto',{exact:true}).fill('Proyecto respaldado');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await expect(page.getByText('Cambios guardados',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Cerrar detalle'}).click();await page.getByRole('button',{name:'Configuración',exact:true}).click();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON',exact:false}).click();const download=await downloadPromise,path=await download.path();expect(path).not.toBeNull();
 await page.getByRole('button',{name:'Restaurar datos de ejemplo',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Restaurar ejemplos',exact:true}).click();await expect(page.getByText('Datos de ejemplo restaurados',{exact:true})).toBeVisible();
 await page.getByLabel('Archivo de respaldo JSON').setInputFiles(path!);await expect(page.getByRole('dialog',{name:'Importar respaldo'})).toContainText('24 cotizaciones');await page.getByRole('dialog').getByRole('button',{name:'Cancelar',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes[0].project)).not.toBe('Proyecto respaldado');
 await page.getByLabel('Archivo de respaldo JSON').setInputFiles(path!);await page.getByRole('button',{name:'Importar datos',exact:true}).click();await expect(page.getByText('Respaldo importado',{exact:true})).toBeVisible();await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('epica-workspace-v1')!).quotes[0].project)).toBe('Proyecto respaldado');
});
test('client draft copies the user reviewed text',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.getByRole('button',{name:'Abrir Q-10300'}).click();await page.getByRole('button',{name:'Mensaje al cliente',exact:true}).click();await page.getByRole('textbox',{name:'Borrador para el cliente'}).fill('Mensaje revisado para compartir con el cliente');await page.getByRole('button',{name:'Copiar mensaje',exact:true}).click();await expect(page.getByText('Mensaje copiado',{exact:true})).toBeVisible();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('Mensaje revisado para compartir con el cliente');
});
test('the executive report remains readable in print without application chrome',async({page})=>{
 await page.getByRole('button',{name:'Resumen ejecutivo',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('.sidebar')).not.toBeVisible();await expect(page.getByRole('heading',{name:'Informe ejecutivo',exact:true})).toBeVisible();await expect(page.locator('.report-table')).toBeVisible();expect((await page.pdf({format:'A4'})).length).toBeGreaterThan(5000);
});
test('a failed lazy view offers a usable return path instead of a blank screen',async({page})=>{
 await page.route('**/src/Views.tsx*',route=>route.abort());await page.getByRole('button',{name:'Equipo',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Esta vista no se pudo cargar'})).toBeVisible();await page.getByRole('button',{name:'Volver al resumen',exact:true}).click();await expect(page.getByRole('heading',{name:'Cotizaciones, bajo control.'})).toBeVisible();
});
test('a failed quotation download leaves the dashboard usable',async({page})=>{
 await page.route('**/src/QuoteDrawer.tsx*',route=>route.abort());await page.getByRole('button',{name:'Abrir Q-10300'}).click();
 await expect(page.getByRole('dialog',{name:'No se pudo abrir la cotización'})).toBeVisible();await page.getByRole('dialog').getByRole('button',{name:'Volver al dashboard',exact:true}).click();await expect(page.getByRole('heading',{name:'Cotizaciones, bajo control.'})).toBeVisible();
});
