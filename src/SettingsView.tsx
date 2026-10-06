import {useEffect,useState} from 'react';
import {CalendarDays,Save,Download,Upload,ChevronRight,Bell,ShieldCheck,RefreshCw} from 'lucide-react';
import {quoteTypes,normalizeLeadDays,normalizeWorkStandards,effortRows,workTimeInput,parseWorkTime} from './domain';
import type {RefObject} from 'react';
import type {Person} from './domain';
import type {Workspace,Settings} from './data';
import {Avatar,SectionHeading} from './components';

type WorkTimes=Record<typeof effortRows[number]['key'],string>;
export type SettingsDraft={settings:Settings;people:Person[];baseline:string;workTimes:WorkTimes};
type Props={workspace:Workspace;save:(settings:Settings,people:Person[],baseline:string)=>Promise<boolean>;backup:()=>void;importFile:()=>void;reset:()=>void;notify:(s:string)=>void;canManage:boolean;requestNotifications:()=>void;draftRef:RefObject<SettingsDraft|null>;demo:boolean};
const timesFor=(settings:Settings)=>Object.fromEntries(effortRows.map(row=>[row.key,workTimeInput(settings.workMinutes[row.key])])) as WorkTimes;
export function settingsSignature(settings:Settings,people:Person[]):string{return JSON.stringify({settings,people});}
export function SettingsView({workspace,save,backup,importFile,reset,notify,canManage,requestNotifications,draftRef,demo}:Props){
  const signature=settingsSignature(workspace.settings,workspace.people);
  const [settings,setSettings]=useState(()=>(canManage&&draftRef.current?.settings)||workspace.settings),[people,setPeople]=useState(()=>(canManage&&draftRef.current?.people)||workspace.people.map(p=>({...p}))),[baseline,setBaseline]=useState(()=>(canManage&&draftRef.current?.baseline)||signature),[workTimes,setWorkTimes]=useState(()=>(canManage&&draftRef.current?.workTimes)||timesFor(workspace.settings)),[errors,setErrors]=useState<Record<string,string>>({}),[saving,setSaving]=useState(false);
  const currentMinutes=Object.fromEntries(effortRows.map(row=>{try{return [row.key,parseWorkTime(workTimes[row.key])];}catch{return [row.key,NaN];}}));
  const draftSignature=settingsSignature({...settings,workMinutes:currentMinutes as Settings['workMinutes']},people);
  const dirty=draftSignature!==baseline&&draftSignature!==signature,conflict=signature!==baseline&&dirty;
  useEffect(()=>{if(!canManage)return;draftRef.current=dirty?{settings,people,baseline,workTimes}:null;},[dirty,settings,people,baseline,workTimes,draftRef,canManage]);
  useEffect(()=>{if(signature!==baseline&&!dirty){setSettings(workspace.settings);setPeople(workspace.people.map(p=>({...p})));setWorkTimes(timesFor(workspace.settings));setBaseline(signature);}},[signature,baseline,dirty,workspace.settings,workspace.people]);
  function reload(){setSettings(workspace.settings);setPeople(workspace.people.map(p=>({...p})));setWorkTimes(timesFor(workspace.settings));setBaseline(signature);setErrors({});}
  async function submit(e:React.FormEvent){
    e.preventDefault();if(!canManage||conflict||saving)return;
    const invalid:Record<string,string>={};
    for(const type of quoteTypes){const days=settings.leadDays[type];if(days!==null&&(!Number.isInteger(days)||days<1||days>365))invalid[type]='Introduce un entero de 1 a 365, o deja el plazo vacío';}
    for(const row of effortRows)try{parseWorkTime(workTimes[row.key]);}catch(e){invalid[row.key]=e instanceof Error?e.message:'Tiempo inválido';}
    setErrors(invalid);if(Object.keys(invalid).length){const first=Object.keys(invalid)[0],index=quoteTypes.indexOf(first as typeof quoteTypes[number]);document.getElementById(index>=0?'lead-days-'+index:'work-time-'+first)?.focus();return;}
    if(people.some(p=>!Number.isFinite(p.capacity)||p.capacity<1||p.capacity>168)){notify('La capacidad debe estar entre 1 y 168 horas por semana');return;}
    const next={...settings,leadDays:normalizeLeadDays(settings.leadDays),workMinutes:normalizeWorkStandards(currentMinutes)};
    const submittedDraft=draftRef.current;
    setSaving(true);try{const saved=await save(next,people,baseline);if(saved){
      // A save can finish after this view unmounts; only settle the draft it submitted.
      if(draftRef.current===submittedDraft)draftRef.current=null;
      setSettings(next);setWorkTimes(timesFor(next));setBaseline(settingsSignature(next,people));
    }}finally{setSaving(false);}
  }
  return <div className="settings-grid"><form className="panel settings-panel" onSubmit={submit} noValidate>
    <SectionHeading title="Reglas del workspace" description="El Senior Estimator define los plazos y la capacidad de referencia."/>
    {conflict&&<div className="storage-warning" role="alert"><div><strong>La configuración cambió en otra pestaña.</strong><p>Tu borrador se conserva. Revisa la versión actual antes de guardar.</p><button className="text-action" type="button" onClick={reload}>Recargar configuración actual</button></div></div>}
    {!canManage&&<p className="form-note">Vista de consulta. Solo el Senior Estimator puede guardar las reglas.</p>}
    <fieldset className="form-fields" disabled={!canManage||saving}>
      <label className="form-field">Zona horaria de negocio<select value={settings.timezone} onChange={e=>setSettings({...settings,timezone:e.target.value})}>{[['UTC','UTC'],['America/Mexico_City','Ciudad de México'],['America/Bogota','Bogotá'],['America/New_York','Nueva York'],['Europe/Madrid','Madrid']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label className="form-field">Avisar cuando la entrega esté a<select value={settings.alertDays} onChange={e=>setSettings({...settings,alertDays:Number(e.target.value)})}>{[1,2,3,5,7].map(n=><option key={n} value={n}>{n} día{n===1?'':'s'} calendario</option>)}</select></label>
      <div className="setting-info"><CalendarDays size={17}/><p>El contador de días restantes usa fechas de calendario: una entrega que vence hoy tiene 0 días restantes.</p></div>
      <section className="lead-days-section" aria-labelledby="lead-days-title">
        <h3 id="lead-days-title">Plazos por tipo</h3><p className="form-note">Días hábiles de lunes a viernes, sin excluir festivos. El día de asignación no cuenta. Deja un plazo vacío para usar una fecha base manual.</p>
        <div className="lead-days-list">{quoteTypes.map((type,index)=><label className="lead-days-row" key={type} htmlFor={'lead-days-'+index}><span>{type}<small>{settings.leadDays[type]===null?'Sin configurar':'Plazo base'}</small></span><div><input id={'lead-days-'+index} aria-label={'Plazo base de '+type} type="number" min={1} max={365} step={1} inputMode="numeric" placeholder="—" value={settings.leadDays[type]??''} onChange={e=>{setSettings({...settings,leadDays:{...settings.leadDays,[type]:e.target.value===''?null:Number(e.target.value)}});setErrors({});}} aria-invalid={!!errors[type]} aria-describedby={errors[type]?'lead-error-'+index:undefined}/><span>días hábiles</span></div>{errors[type]&&<small id={'lead-error-'+index} className="field-error">{errors[type]}</small>}</label>)}</div>
        <div className="takeoff-rule"><strong>Takeoff: +1 día hábil</strong><p>Aplica a todos los tipos. Cambiar estos plazos no modifica cotizaciones ya guardadas.</p></div>
      </section>
      <section className="lead-days-section" aria-labelledby="work-times-title"><h3 id="work-times-title">Tiempos de trabajo por tipo</h3><p className="form-note">Formato HH:MM. Son horas de esfuerzo, independientes de los días hábiles de entrega. Los nuevos valores no modifican horas ya guardadas.</p><div className="lead-days-list work-times-list">{effortRows.map(row=><label className="lead-days-row" key={row.key} htmlFor={'work-time-'+row.key}><span>{row.label}</span><div><input id={'work-time-'+row.key} aria-label={'Tiempo de '+row.label} placeholder="HH:MM" maxLength={13} value={workTimes[row.key]} onChange={e=>{setWorkTimes({...workTimes,[row.key]:e.target.value});setErrors({});}} aria-invalid={!!errors[row.key]} aria-describedby={errors[row.key]?'work-error-'+row.key:undefined}/><span>HH:MM</span></div>{errors[row.key]&&<small id={'work-error-'+row.key} className="field-error" role="alert">{errors[row.key]}</small>}</label>)}</div></section>
      <h3>Capacidad semanal de referencia</h3>{people.filter(p=>!p.archived).map(p=><label className="capacity-setting" key={p.id}><span><Avatar person={p} small/>{p.name}</span><div><input type="number" min={1} max={168} value={p.capacity} aria-label={`Capacidad de ${p.name}`} onChange={e=>setPeople(people.map(x=>x.id===p.id?{...x,capacity:Number(e.target.value)}:x))}/><span>h / semana</span></div></label>)}
    </fieldset>
    <button className="button primary full-button" type="submit" disabled={!canManage||conflict||saving}><Save size={16}/>{saving?'Guardando…':'Guardar configuración'}</button>
    {dirty&&canManage&&<button type="button" className="text-action settings-discard" disabled={saving} onClick={reload}>Descartar cambios de configuración</button>}
    {dirty&&<p className="form-note" role="status">Tienes cambios sin guardar. El borrador se conserva al cambiar de sección; guarda antes de cerrar.</p>}
  </form><div className="settings-right">
    <section className="panel settings-panel"><SectionHeading title="Datos y respaldos" description="Conserva una copia del espacio actual o importa un respaldo."/><button className="settings-action" onClick={backup}><Download size={20}/><span><strong>Descargar respaldo JSON</strong><small>Incluye cotizaciones, tipos, takeoff, plazos e historial.</small></span><ChevronRight size={17}/></button><button className="settings-action" onClick={importFile} disabled={!canManage}><Upload size={20}/><span><strong>Importar respaldo JSON</strong><small>Se revisa el archivo antes de reemplazar los datos.</small></span><ChevronRight size={17}/></button><button className="settings-action" onClick={requestNotifications}><Bell size={20}/><span><strong>Avisos del navegador</strong><small>Actívalos para recibir alertas mientras la app esté abierta.</small></span><ChevronRight size={17}/></button></section>
    <section className="panel settings-panel demo-explainer"><ShieldCheck size={25}/><h3>{demo?'Ejemplos para explorar':'Tu equipo, listo para trabajar'}</h3><p>{demo?'Las cotizaciones de esta sección son ficticias. Trabajo mantiene un registro separado.':'Registra las cotizaciones reales en Trabajo. Kevin administra la asignación, los tiempos y los plazos.'}</p><p>Los perfiles son locales: no requieren contraseña. Los datos se conservan en este navegador y se comparten entre sus pestañas. El acceso desde otros dispositivos requiere almacenamiento e identidad compartidos.</p><button className="button secondary" onClick={reset} disabled={!canManage}><RefreshCw size={15}/>{demo?'Restaurar datos de ejemplo':'Ver datos de ejemplo'}</button></section>
  </div></div>;
}
