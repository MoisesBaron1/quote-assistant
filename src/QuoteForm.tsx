import {useEffect,useState} from 'react';
import {Save,CalendarDays,RefreshCw} from 'lucide-react';
import {calculateDeadline,normalizeQuote,validateAssignment,workflows,priorities,isTerminal,quoteTypes,standardMinutes,formatDuration} from './domain';
import type {Quote,Person,Workflow,Priority,QuoteType,LeadDays,WorkStandards} from './domain';
import {dateLabel} from './components';
import {accountManagers} from './data';

type Props={quote:Quote;people:Person[];allQuotes:Quote[];isNew:boolean;leadDays:LeadDays;workMinutes:WorkStandards;onSave:(q:Quote)=>Promise<boolean>;onCancel:()=>void;today:string;onDirty:(dirty:boolean)=>void;saving:boolean};
export function QuoteForm({quote,people,allQuotes,isNew,leadDays,workMinutes,onSave,onCancel,today,onDirty,saving}:Props){
  const [draft,setFormDraft]=useState(()=>normalizeQuote(quote)),[errors,setErrors]=useState<Record<string,string>>({}),[manualPreferred,setManualPreferred]=useState(!isNew);
  const [automaticHours,setAutomaticHours]=useState(isNew),[automaticRemaining,setAutomaticRemaining]=useState(isNew);
  const minutes=standardMinutes(draft.quoteType,draft.takeoff,workMinutes);
  useEffect(()=>onDirty(JSON.stringify(draft)!==JSON.stringify(normalizeQuote(quote))),[draft,quote,onDirty]);
  const conflict=!isNew&&draft.updatedAt!==quote.updatedAt;
  const configured=draft.quoteType?leadDays[draft.quoteType]:null;
  let preview:ReturnType<typeof calculateDeadline>|null=null;
  try{preview=calculateDeadline(draft.assignedDate,draft.deadline,draft.takeoff);}catch{/* Incomplete date inputs stay editable. */}
  function setDraft(next:typeof draft){setFormDraft(next);setErrors({});onDirty(JSON.stringify(next)!==JSON.stringify(normalizeQuote(quote)));}
  function schedule(next:typeof draft){
    const standard=standardMinutes(next.quoteType,next.takeoff,workMinutes);
    if(isNew&&automaticHours&&standard!==null)next={...next,estimatedHours:standard/60,remainingHours:isTerminal(next)?0:automaticRemaining?standard/60:next.remainingHours};
    try{const calculated=calculateDeadline(next.assignedDate,next.deadline,next.takeoff);setDraft({...next,dueDate:calculated.dueDate,deadline:{...next.deadline,baseDueDate:calculated.baseDueDate}});}
    catch{setDraft({...next,dueDate:''});}
  }
  function chooseType(value:string){
    const quoteType=(value||null) as QuoteType|null,days=quoteType?leadDays[quoteType]:null;
    const automatic=days!==null&&((isNew&&!manualPreferred)||draft.deadline.mode==='policy');
    const deadline=automatic?{mode:'policy' as const,baseBusinessDays:days,baseDueDate:draft.deadline.baseDueDate}:{mode:'manual' as const,baseBusinessDays:null,baseDueDate:isNew&&draft.deadline.mode==='policy'?'':draft.deadline.baseDueDate};
    schedule({...draft,quoteType,deadline});
  }
  function usePolicy(){if(configured===null)return;setManualPreferred(false);schedule({...draft,deadline:{mode:'policy',baseBusinessDays:configured,baseDueDate:draft.deadline.baseDueDate}});}
  function useStandard(){if(minutes===null)return;setAutomaticHours(isNew);setDraft({...draft,estimatedHours:minutes/60,remainingHours:isTerminal(draft)?0:isNew&&automaticRemaining?minutes/60:draft.remainingHours});}
  function save(e:React.FormEvent){
    e.preventDefault();if(conflict||saving)return;
    const next={...draft,code:draft.code.trim(),project:draft.project.trim(),client:draft.client.trim(),originalDueDate:isNew?draft.dueDate:quote.originalDueDate};
    const invalid=validateAssignment(next,people,isNew?undefined:quote);
    if(allQuotes.some(q=>q.id!==next.id&&q.code.toLowerCase()===next.code.toLowerCase()))invalid.code='Este número de cotización ya existe';
    setErrors(invalid);
    if(Object.keys(invalid).length){const first=Object.keys(invalid)[0],key=['dueDate','originalDueDate','deadline'].includes(first)?'baseDueDate':first;document.getElementById('field-'+key)?.focus();return;}
    void onSave({...next,remainingHours:isTerminal(next)?0:next.remainingHours});
  }
  const error=(key:string)=>errors[key]?<small id={`error-${key}`} className="field-error">{errors[key]}</small>:null;
  const field=(key:'code'|'project'|'client'|'assignedDate'|'estimatedHours'|'remainingHours'|'value',label:string,type='text')=><label className="form-field" key={key} htmlFor={`field-${key}`}>{label}<input id={`field-${key}`} type={type} aria-label={label} disabled={key==='remainingHours'&&isTerminal(draft)} value={type==='number'&&!Number.isFinite(draft[key])?'':String(draft[key])} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`error-${key}`:undefined} maxLength={type==='text'?200:undefined} step={type==='number'?'any':undefined} min={type==='number'?0:undefined} onChange={e=>{const next={...draft,[key]:type==='number'?(e.target.value===''?NaN:Number(e.target.value)):e.target.value};if(key==='estimatedHours'){setAutomaticHours(false);if(isNew&&automaticRemaining)next.remainingHours=next.estimatedHours;}if(key==='remainingHours')setAutomaticRemaining(false);key==='assignedDate'?schedule(next):setDraft(next);}}/>{type==='number'&&key!=='value'&&Number.isFinite(draft[key])&&<small className="form-note">{formatDuration(Number(draft[key]))}</small>}{error(key)}</label>;
  const deadlineError=errors.baseDueDate||errors.deadline||errors.dueDate||errors.originalDueDate;
  return <form className="quote-form" onSubmit={save} noValidate>
    <p className="form-intro">Define el tipo, responsables y compromiso de entrega. El takeoff añade un día hábil a todos los tipos.</p>
    {conflict&&<div className="storage-warning" role="alert"><div><strong>Esta cotización cambió en otra pestaña.</strong><p>Conserva tu texto antes de recargar y revisar la versión actual.</p><button type="button" className="text-action" onClick={()=>setDraft(normalizeQuote(quote))}>Recargar versión actual</button></div></div>}
    <fieldset disabled={saving} className="form-fields"><div className="form-grid">
      {field('code','Número de cotización')}{field('project','Proyecto')}{field('client','Cliente')}
      <label className="form-field">Account Manager<select value={draft.am} onChange={e=>setDraft({...draft,am:e.target.value})}>{[...new Set([...accountManagers,...allQuotes.map(q=>q.am),draft.am])].map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="form-field" htmlFor="field-quoteType">Tipo de cotización<select id="field-quoteType" aria-label="Tipo de cotización" value={draft.quoteType||''} onChange={e=>chooseType(e.target.value)} aria-invalid={!!errors.quoteType} aria-describedby={errors.quoteType?'error-quoteType':undefined}><option value="">Seleccionar tipo</option>{quoteTypes.map(type=><option key={type}>{type}</option>)}</select>{error('quoteType')}</label>
      <label className="form-field" htmlFor="field-estimator">Estimator<select id="field-estimator" aria-label="Estimator" value={draft.estimator} onChange={e=>setDraft({...draft,estimator:e.target.value})} aria-invalid={!!errors.estimator}>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>{error('estimator')}</label>
      {field('assignedDate','Fecha de asignación','date')}
      <label className="form-field">Método de entrega<select value={draft.deadline.mode} onChange={e=>{if(e.target.value==='policy')usePolicy();else{setManualPreferred(true);schedule({...draft,deadline:{mode:'manual',baseBusinessDays:null,baseDueDate:draft.deadline.baseDueDate}});}}}><option value="manual">Fecha base manual</option><option value="policy" disabled={configured===null&&draft.deadline.mode!=='policy'}>Plazo por tipo</option></select></label>
      <div className="deadline-fields full">
        {draft.deadline.mode==='manual'?<label className="form-field" htmlFor="field-baseDueDate">Fecha base manual<input id="field-baseDueDate" aria-label="Fecha base manual" type="date" min={draft.assignedDate} value={draft.deadline.baseDueDate} onChange={e=>schedule({...draft,deadline:{...draft.deadline,baseDueDate:e.target.value}})} aria-invalid={!!deadlineError} aria-describedby={deadlineError?'error-baseDueDate':'deadline-help'}/>{deadlineError&&<small id="error-baseDueDate" className="field-error">{deadlineError}</small>}</label>:<p className="saved-policy">Plazo guardado: <strong>{draft.deadline.baseBusinessDays} día{draft.deadline.baseBusinessDays===1?'':'s'} hábil{draft.deadline.baseBusinessDays===1?'':'es'}</strong> desde la asignación.{deadlineError&&<small className="field-error">{deadlineError}</small>}</p>}
        <p id="deadline-help" className="form-note">Lunes a viernes, sin excluir festivos. {draft.deadline.mode==='manual'?'Elige la fecha base sin añadir el takeoff.':'El día de asignación no cuenta.'} {draft.quoteType&&configured===null?'Este tipo aún no tiene un plazo configurado.':''}</p>
        <label className="takeoff-control"><input id="field-takeoff" type="checkbox" checked={draft.takeoff} onChange={e=>schedule({...draft,takeoff:e.target.checked})}/><span><strong>Incluye takeoff</strong><small>Añade 1 día hábil a la fecha base</small></span></label>
        <div className="deadline-preview" data-testid="deadline-preview" aria-live="polite"><CalendarDays size={19}/><div><span>Entrega final</span><strong>{preview?dateLabel(preview.dueDate):'Completa la fecha base'}</strong>{preview&&<small>Base: {dateLabel(preview.baseDueDate)}{draft.takeoff?' + 1 día hábil por takeoff':' · Sin takeoff'}</small>}</div></div>
        {!isNew&&<button type="button" className="button secondary recalculate-button" disabled={configured===null} onClick={usePolicy}><RefreshCw size={14}/>Recalcular con la regla vigente</button>}
        {!isNew&&configured!==null&&draft.deadline.mode==='policy'&&configured!==draft.deadline.baseBusinessDays&&<p className="form-note">La regla vigente es de {configured} días hábiles. Tu compromiso conserva el plazo guardado hasta que lo recalcules.</p>}
      </div>
      <label className="form-field">Estado de trabajo<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value as Workflow,remainingHours:['Lista para enviar','Entregada'].includes(e.target.value)?0:draft.remainingHours})}>{workflows.map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="form-field">Prioridad<select value={draft.priority} onChange={e=>setDraft({...draft,priority:e.target.value as Priority})}>{priorities.map(s=><option key={s}>{s}</option>)}</select></label>
      <div className="work-standard full" data-testid="work-standard"><div><strong>Tiempo estándar: {minutes===null?'Selecciona el tipo':formatDuration(minutes/60)}</strong><p className="form-note">Estimación de trabajo, independiente del plazo de entrega.{!isNew?' Al aplicarla, el tiempo pendiente se conserva.':' Puedes ajustar las horas manualmente.'}</p></div><button type="button" className="button secondary" disabled={minutes===null} onClick={useStandard}>Aplicar tiempo estándar</button></div>
      {field('estimatedHours','Horas estimadas','number')}{field('remainingHours','Horas pendientes','number')}{field('value','Importe estimado (USD)','number')}
      <label className="form-field full" htmlFor="field-comments">Comentarios<textarea id="field-comments" aria-label="Comentarios" value={draft.comments} maxLength={5000} rows={4} onChange={e=>setDraft({...draft,comments:e.target.value})}/>{error('comments')}</label>
    </div></fieldset>
    {Object.keys(errors).length>0&&<p className="field-error error-summary" role="alert">Revisa los campos marcados antes de guardar.</p>}
    {!isNew&&<p className="form-note">Compromiso original: {dateLabel(quote.originalDueDate)}. Se conserva aunque modifiques la entrega vigente.</p>}
    <div className="form-actions"><button type="button" className="button secondary" disabled={saving} onClick={onCancel}>Cancelar</button><button className="button primary" type="submit" disabled={conflict||saving}><Save size={16}/>{saving?'Guardando…':isNew?'Crear cotización':'Guardar cambios'}</button></div><span className="sr-only">Fecha de referencia: {today}</span>
  </form>;
}
