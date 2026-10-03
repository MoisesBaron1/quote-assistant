import {useEffect,useState} from 'react';
import {CalendarDays,Save,Download,Upload,ChevronRight,Bell,ShieldCheck,RefreshCw} from 'lucide-react';
import {quoteTypes,normalizeLeadDays} from './domain';
import type {Person} from './domain';
import type {Workspace,Settings} from './data';
import {Avatar,SectionHeading} from './components';

type Props={workspace:Workspace;save:(settings:Settings,people:Person[],baseline:string)=>Promise<boolean>;backup:()=>void;importFile:()=>void;reset:()=>void;notify:(s:string)=>void;canManage:boolean;requestNotifications:()=>void};
export function settingsSignature(settings:Settings,people:Person[]):string{return JSON.stringify({settings,people});}
export function SettingsView({workspace,save,backup,importFile,reset,notify,canManage,requestNotifications}:Props){
  const signature=settingsSignature(workspace.settings,workspace.people);
  const [settings,setSettings]=useState(workspace.settings),[people,setPeople]=useState(workspace.people.map(p=>({...p}))),[baseline,setBaseline]=useState(signature),[errors,setErrors]=useState<Record<string,string>>({}),[saving,setSaving]=useState(false);
  const dirty=settingsSignature(settings,people)!==baseline,conflict=signature!==baseline&&dirty;
  useEffect(()=>{if(signature!==baseline&&!dirty){setSettings(workspace.settings);setPeople(workspace.people.map(p=>({...p})));setBaseline(signature);}},[signature,baseline,dirty,workspace.settings,workspace.people]);
  async function submit(e:React.FormEvent){
    e.preventDefault();if(!canManage||conflict||saving)return;
    const invalid:Record<string,string>={};
    for(const type of quoteTypes){const days=settings.leadDays[type];if(days!==null&&(!Number.isInteger(days)||days<1||days>365))invalid[type]='Introduce un entero de 1 a 365, o deja el plazo vacío';}
    setErrors(invalid);if(Object.keys(invalid).length){document.getElementById('lead-days-'+quoteTypes.indexOf(Object.keys(invalid)[0] as typeof quoteTypes[number]))?.focus();return;}
    if(people.some(p=>!Number.isFinite(p.capacity)||p.capacity<1||p.capacity>168)){notify('La capacidad debe estar entre 1 y 168 horas por semana');return;}
    setSaving(true);try{const saved=await save({...settings,leadDays:normalizeLeadDays(settings.leadDays)},people,baseline);if(saved)setBaseline(settingsSignature(settings,people));}finally{setSaving(false);}
  }
  return <div className="settings-grid"><form className="panel settings-panel" onSubmit={submit} noValidate>
    <SectionHeading title="Reglas del workspace" description="El Senior Estimator define los plazos y la capacidad de referencia."/>
    {conflict&&<div className="storage-warning" role="alert"><div><strong>La configuración cambió en otra pestaña.</strong><p>Tu borrador se conserva. Revisa la versión actual antes de guardar.</p><button className="text-action" type="button" onClick={()=>{setSettings(workspace.settings);setPeople(workspace.people.map(p=>({...p})));setBaseline(signature);setErrors({});}}>Recargar configuración actual</button></div></div>}
    {!canManage&&<p className="form-note">Vista de consulta. Solo el Senior Estimator puede guardar las reglas.</p>}
    <fieldset className="form-fields" disabled={!canManage||saving}>
      <label className="form-field">Zona horaria de negocio<select value={settings.timezone} onChange={e=>setSettings({...settings,timezone:e.target.value})}>{[['UTC','UTC'],['America/Mexico_City','Ciudad de México'],['America/Bogota','Bogotá'],['America/New_York','Nueva York'],['Europe/Madrid','Madrid']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label className="form-field">Avisar cuando la entrega esté a<select value={settings.alertDays} onChange={e=>setSettings({...settings,alertDays:Number(e.target.value)})}>{[1,2,3,5,7].map(n=><option key={n} value={n}>{n} día{n===1?'':'s'} calendario</option>)}</select></label>
      <div className="setting-info"><CalendarDays size={17}/><p>El contador de días restantes usa fechas de calendario: una entrega que vence hoy tiene 0 días restantes.</p></div>
      <section className="lead-days-section" aria-labelledby="lead-days-title">
        <h3 id="lead-days-title">Plazos por tipo</h3><p className="form-note">Días hábiles de lunes a viernes, sin excluir festivos. El día de asignación no cuenta. Deja un plazo vacío para usar una fecha base manual.</p>
        <div className="lead-days-list">{quoteTypes.map((type,index)=><label className="lead-days-row" key={type} htmlFor={'lead-days-'+index}><span>{type}<small>{settings.leadDays[type]===null?'Sin configurar':'Plazo base'}</small></span><div><input id={'lead-days-'+index} aria-label={'Plazo base de '+type} type="number" min={1} max={365} step={1} inputMode="numeric" placeholder="—" value={settings.leadDays[type]??''} onChange={e=>{setSettings({...settings,leadDays:{...settings.leadDays,[type]:e.target.value===''?null:Number(e.target.value)}});setErrors({});}} aria-invalid={!!errors[type]} aria-describedby={errors[type]?'lead-error-'+index:undefined}/><span>días hábiles</span></div>{errors[type]&&<small id={'lead-error-'+index} className="field-error">{errors[type]}</small>}</label>)}</div>
        <div className="takeoff-rule"><strong>Takeoff: +1 día hábil</strong><p>Aplica a los cinco tipos. Cambiar estos plazos no modifica cotizaciones ya guardadas.</p></div>
      </section>
      <h3>Capacidad semanal de referencia</h3>{people.map(p=><label className="capacity-setting" key={p.id}><span><Avatar person={p} small/>{p.name}</span><div><input type="number" min={1} max={168} value={p.capacity} aria-label={`Capacidad de ${p.name}`} onChange={e=>setPeople(people.map(x=>x.id===p.id?{...x,capacity:Number(e.target.value)}:x))}/><span>h / semana</span></div></label>)}
    </fieldset>
    <button className="button primary full-button" type="submit" disabled={!canManage||conflict||saving}><Save size={16}/>{saving?'Guardando…':'Guardar configuración'}</button>
  </form><div className="settings-right">
    <section className="panel settings-panel"><SectionHeading title="Datos y respaldos" description="Conserva una copia o importa un workspace de demostración."/><button className="settings-action" onClick={backup}><Download size={20}/><span><strong>Descargar respaldo JSON</strong><small>Incluye cotizaciones, tipos, takeoff, plazos e historial.</small></span><ChevronRight size={17}/></button><button className="settings-action" onClick={importFile} disabled={!canManage}><Upload size={20}/><span><strong>Importar respaldo JSON</strong><small>Se revisa el archivo antes de reemplazar los datos.</small></span><ChevronRight size={17}/></button><button className="settings-action" onClick={requestNotifications}><Bell size={20}/><span><strong>Avisos del navegador</strong><small>Actívalos para recibir alertas mientras la app esté abierta.</small></span><ChevronRight size={17}/></button></section>
    <section className="panel settings-panel demo-explainer"><ShieldCheck size={25}/><h3>Una demo lista para explorar</h3><p>Los proyectos y personas son ejemplos. Los cambios se guardan en este navegador y se sincronizan entre sus pestañas.</p><p>Las vistas de rol sirven para probar la experiencia. Para operación compartida se requiere conectar una fuente de datos y acceso de usuarios.</p><button className="button secondary" onClick={reset} disabled={!canManage}><RefreshCw size={15}/>Restaurar datos de ejemplo</button></section>
  </div></div>;
}
