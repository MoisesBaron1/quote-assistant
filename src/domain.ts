export type Workflow = 'Pendiente'|'En curso'|'En revisión'|'Lista para enviar'|'Entregada';
export type Priority = 'Normal'|'Alta'|'Crítica';
export const quoteTypes=['Cotización de adicional','Retail menor','Retail mayor','Proyecto menor','Proyecto mayor','Recotización proyecto','Recotización retail'] as const;
export type QuoteType = typeof quoteTypes[number];
export type LeadDays = Record<QuoteType,number|null>;
export const effortRows=[
  {key:'additional',type:'Cotización de adicional',takeoff:null,label:'Cotización de adicional',minutes:21},
  {key:'projectMajorTakeoff',type:'Proyecto mayor',takeoff:true,label:'Proyecto mayor · Con takeoff',minutes:240},
  {key:'projectMajor',type:'Proyecto mayor',takeoff:false,label:'Proyecto mayor · Sin takeoff',minutes:360},
  {key:'projectMinorTakeoff',type:'Proyecto menor',takeoff:true,label:'Proyecto menor · Con takeoff',minutes:210},
  {key:'projectMinor',type:'Proyecto menor',takeoff:false,label:'Proyecto menor · Sin takeoff',minutes:270},
  {key:'requoteProject',type:'Recotización proyecto',takeoff:null,label:'Recotización proyecto',minutes:120},
  {key:'requoteRetail',type:'Recotización retail',takeoff:null,label:'Recotización retail',minutes:60},
  {key:'retailMajor',type:'Retail mayor',takeoff:null,label:'Retail mayor',minutes:180},
  {key:'retailMinor',type:'Retail menor',takeoff:null,label:'Retail menor',minutes:120},
] as const;
export type WorkStandards=Record<typeof effortRows[number]['key'],number>;
export function normalizeWorkStandards(raw:unknown):WorkStandards {
  if(raw!==undefined&&(!raw||typeof raw!=='object'||Array.isArray(raw)))throw new Error('Tiempos de trabajo inválidos');
  const values=(raw||{}) as Record<string,unknown>;
  if(Object.keys(values).some(key=>!effortRows.some(row=>row.key===key)))throw new Error('Tipo de tiempo desconocido');
  return Object.fromEntries(effortRows.map(row=>{const value=values[row.key]??row.minutes;
    if(values[row.key]===null||typeof value!=='number'||!Number.isInteger(value)||value<1||value>60e9)throw new Error('El tiempo debe ser un número entero positivo de minutos');
    return [row.key,value];})) as WorkStandards;
}
export function standardMinutes(type:QuoteType|null|undefined,takeoff:boolean,rules:WorkStandards=normalizeWorkStandards(undefined)):number|null {
  const row=effortRows.find(row=>row.type===type&&(row.takeoff===null||row.takeoff===takeoff));
  return row?rules[row.key]:null;
}
export function workTimeInput(minutes:number):string {return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;}
export function parseWorkTime(value:string):number {
  const match=value.trim().match(/^(\d{1,10}):([0-5]\d)(?::00)?$/);
  if(!match)throw new Error('Usa HH:MM, por ejemplo 00:21 o 03:30');
  const minutes=Number(match[1])*60+Number(match[2]);
  if(minutes<1||minutes>60e9)throw new Error('Introduce un tiempo mayor que cero');
  return minutes;
}
export function formatDuration(hours:number):string {
  if(!Number.isFinite(hours)||hours<0)return '—';
  const seconds=Math.round(hours*3600),h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;
  return [h?`${h} h`:'',m?`${m} min`:'',s?`${s} s`:''].filter(Boolean).join(' ')||'0 min';
}
export type DeadlineSnapshot = {mode:'manual'|'policy';baseDueDate:string;baseBusinessDays:number|null};
export type HistoryEntry = {id:string;at:string;actor:string;text:string};
export type Quote = {id:string;code:string;project:string;client:string;am:string;estimator:string;assignedDate:string;originalDueDate:string;dueDate:string;status:Workflow;priority:Priority;estimatedHours:number;remainingHours:number;value:number;comments:string;updatedAt:string;completedAt?:string;history:HistoryEntry[];quoteType?:QuoteType|null;takeoff?:boolean;deadline?:DeadlineSnapshot};
export type Person = {id:string;name:string;initials:string;color:string;capacity:number};
export type Filters = {search?:string;estimator?:string;am?:string;status?:string;delivery?:string;dueFrom?:string;dueTo?:string;overdue?:boolean;postponed?:boolean;quoteType?:QuoteType|'unclassified'|'';takeoff?:'with'|'without'|''};
export type Delivery = {label:string;overdue:boolean;postponed:boolean;terminal:boolean;days:number};
export type Load = Person & {hours:number;count:number;percent:number};
export type Move = {quoteId:string;from:string;to:string;hours:number};
export const workflows:Workflow[]=['Pendiente','En curso','En revisión','Lista para enviar','Entregada'];
export const priorities:Priority[]=['Normal','Alta','Crítica'];
const businessFormats=new Map<string,Intl.DateTimeFormat>();
export function businessDate(now:Date,timezone='UTC'):string {
  let formatter=businessFormats.get(timezone);if(!formatter){formatter=new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'});businessFormats.set(timezone,formatter);}
  const parts=formatter.formatToParts(now);
  return ['year','month','day'].map(key=>parts.find(p=>p.type===key)!.value).join('-');
}
function isDay(day:unknown):day is string {
  if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
  const date=new Date(day+'T00:00:00Z');
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===day;
}
export function addDays(day:string,amount:number):string {
  if(!isDay(day))throw new Error('Fecha inválida');
  return new Date(new Date(day+'T00:00:00Z').getTime()+amount*86400000).toISOString().slice(0,10);
}
export function isBusinessDay(day:string):boolean {
  if(!isDay(day))return false;
  const weekday=new Date(day+'T00:00:00Z').getUTCDay();
  return weekday!==0&&weekday!==6;
}
export function addBusinessDays(day:string,amount:number):string {
  if(!isDay(day)||!Number.isInteger(amount)||amount<0||amount>366)throw new Error('Plazo hábil inválido');
  let result=day;
  for(let remaining=amount;remaining>0;){result=addDays(result,1);if(isBusinessDay(result))remaining--;}
  return result;
}
export function normalizeLeadDays(raw:unknown):LeadDays {
  if(raw!==undefined&&(!raw||typeof raw!=='object'||Array.isArray(raw)))throw new Error('Plazos por tipo inválidos');
  const values=(raw||{}) as Record<string,unknown>;
  if(Object.keys(values).some(key=>!quoteTypes.includes(key as QuoteType)))throw new Error('Tipo de cotización desconocido en los plazos');
  return Object.fromEntries(quoteTypes.map(type=>{
    const days=values[type]===undefined?null:values[type];
    if(days!==null&&(typeof days!=='number'||!Number.isInteger(days)||days<1||days>365))throw new Error('Los plazos deben ser enteros de 1 a 365 días hábiles');
    return [type,days];
  })) as LeadDays;
}
export function normalizeQuote(q:Quote):Quote & {quoteType:QuoteType|null;takeoff:boolean;deadline:DeadlineSnapshot} {
  return {...q,quoteType:q.quoteType??null,takeoff:q.takeoff??false,deadline:q.deadline??{mode:'manual',baseDueDate:q.dueDate,baseBusinessDays:null}};
}
function sameDeadline(a:DeadlineSnapshot,b:DeadlineSnapshot):boolean {
  return a.mode===b.mode&&a.baseDueDate===b.baseDueDate&&a.baseBusinessDays===b.baseBusinessDays;
}
export function calculateDeadline(assignedDate:string,deadline:DeadlineSnapshot,takeoff=false):{baseDueDate:string;dueDate:string} {
  if(!isDay(assignedDate))throw new Error('Fecha de asignación inválida');
  if(deadline.mode==='policy'&&(!Number.isInteger(deadline.baseBusinessDays)||deadline.baseBusinessDays!<1||deadline.baseBusinessDays!>365))throw new Error('Plazo base inválido');
  const baseDueDate=deadline.mode==='policy'?addBusinessDays(assignedDate,deadline.baseBusinessDays!):deadline.baseDueDate;
  if(!isDay(baseDueDate)||baseDueDate<assignedDate)throw new Error('La fecha base no puede ser anterior a la asignación');
  return {baseDueDate,dueDate:takeoff?addBusinessDays(baseDueDate,1):baseDueDate};
}
export function daysRemaining(due:string,today:string):number {
  if(!isDay(due)||!isDay(today))throw new Error('Fecha inválida');
  return Math.round((Date.parse(due+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
}
export const isTerminal=(q:Quote)=>q.status==='Entregada'||q.status==='Lista para enviar';
export function quoteProgress(q:Quote):number {
  if(isTerminal(q))return 100;
  if(q.estimatedHours<=0)return q.remainingHours<=0?100:0;
  return Math.max(0,Math.min(100,Math.round((1-q.remainingHours/q.estimatedHours)*100)));
}
export function delivery(quote:Quote,today:string):Delivery {
  const terminal=isTerminal(quote), days=daysRemaining(quote.dueDate,today);
  const overdue=!terminal&&days<0,postponed=quote.dueDate!==quote.originalDueDate;
  const label=quote.status==='Entregada'?'Entregada':terminal?'Completada':overdue?'Retrasada':postponed?'Postergada':'A tiempo';
  return {label,overdue,postponed,terminal,days};
}
export function risk(quote:Quote,today:string,capacity:number,alertDays:number):{level:'Bajo'|'Medio'|'Alto';reason:string} {
  if(isTerminal(quote))return {level:'Bajo',reason:'Trabajo finalizado'};
  const days=daysRemaining(quote.dueDate,today);
  if(days<0)return {level:'Alto',reason:`El compromiso venció hace ${Math.abs(days)} ${Math.abs(days)===1?'día':'días'}`};
  const span=days+1,weekday=new Date(today+'T00:00:00Z').getUTCDay();
  let weekdays=Math.floor(span/7)*5;
  for(let i=0;i<span%7;i++)if((weekday+i)%7!==0&&(weekday+i)%7!==6)weekdays++;
  const available=weekdays*capacity/5;
  if(quote.remainingHours>available)return {level:'Alto',reason:`${formatDuration(quote.remainingHours)} pendientes superan las ${formatDuration(available)} nominales disponibles de lunes a viernes hasta la entrega`};
  if(days<=alertDays||quote.remainingHours>available*.7)return {level:'Medio',reason:days===0?'La entrega vence hoy':`Entrega en ${days} ${days===1?'día':'días'}; conviene revisar el avance`};
  return {level:'Bajo',reason:'Plazo suficiente para las horas pendientes declaradas'};
}
export function workload(quotes:Quote[],people:Person[]):Load[] {
  return people.map(p=>{const open=quotes.filter(q=>q.estimator===p.id&&!isTerminal(q));const hours=open.reduce((n,q)=>n+q.remainingHours,0);return {...p,hours,count:open.length,percent:Math.round(hours/p.capacity*100)};});
}
export function summarize(quotes:Quote[],today:string) {
  return {total:quotes.length,onTime:quotes.filter(q=>delivery(q,today).label==='A tiempo').length,overdue:quotes.filter(q=>delivery(q,today).overdue).length,postponed:quotes.filter(q=>delivery(q,today).postponed).length,delivered:quotes.filter(q=>q.status==='Entregada').length,active:quotes.filter(q=>!isTerminal(q)).length};
}
export function filterQuotes(quotes:Quote[],filters:Filters,today:string):Quote[] {
  const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return quotes.filter(q=>{const d=delivery(q,today);return (!filters.search||normalize([q.code,q.project,q.client,q.am].join(' ')).includes(normalize(filters.search.trim())))&&(!filters.estimator||q.estimator===filters.estimator)&&(!filters.am||q.am===filters.am)&&(!filters.status||q.status===filters.status)&&(!filters.delivery||d.label===filters.delivery)&&(!filters.dueFrom||q.dueDate>=filters.dueFrom)&&(!filters.dueTo||q.dueDate<=filters.dueTo)&&(!filters.overdue||d.overdue)&&(!filters.postponed||d.postponed)&&(!filters.quoteType||(filters.quoteType==='unclassified'?!q.quoteType:q.quoteType===filters.quoteType))&&(!filters.takeoff||(filters.takeoff==='with'?!!q.takeoff:!q.takeoff));});
}
export function suggestRebalance(quotes:Quote[],people:Person[]):Move[] {
  const simulated=quotes.map(q=>({...q})),moves:Move[]=[];
  for(let round=0;round<people.length*2;round++) {
    const load=workload(simulated,people),score=load.reduce((n,p)=>n+(p.hours/p.capacity)**2,0);
    let best:{gain:number;move:Move}|undefined;
    for(const q of simulated.filter(q=>q.quoteType&&!isTerminal(q)&&q.remainingHours>0&&!moves.some(m=>m.quoteId===q.id))) {
      const from=load.find(p=>p.id===q.estimator);if(!from||from.percent<=90)continue;
      for(const to of load.filter(p=>p.id!==from.id&&p.percent<from.percent)) {
        const next=score-(from.hours/from.capacity)**2-(to.hours/to.capacity)**2+((from.hours-q.remainingHours)/from.capacity)**2+((to.hours+q.remainingHours)/to.capacity)**2;
        const gain=score-next;
        if(gain>.02&&(!best||gain>best.gain))best={gain,move:{quoteId:q.id,from:from.id,to:to.id,hours:q.remainingHours}};
      }
    }
    if(!best)break;
    moves.push(best.move);simulated.find(q=>q.id===best!.move.quoteId)!.estimator=best.move.to;
  }
  return moves;
}
export function validateQuote(quote:Quote,people:Person[]):Record<string,string> {
  const errors:Record<string,string>={};
  if(!quote||typeof quote!=='object')return {quote:'Cotización inválida'};
  for(const key of ['id','code','project','client','am'] as const)if(typeof quote[key]!=='string'||!quote[key].trim()||quote[key].length>200)errors[key]='Este campo es requerido (máximo 200 caracteres)';
  if(!people.some(p=>p.id===quote.estimator))errors.estimator='Selecciona un Estimator válido';
  for(const key of ['assignedDate','originalDueDate','dueDate'] as const)if(!isDay(quote[key]))errors[key]='Introduce una fecha válida';
  if(isDay(quote.dueDate)&&isDay(quote.assignedDate)&&quote.dueDate<quote.assignedDate)errors.dueDate='La entrega no puede ser anterior a la asignación';
  if(!workflows.includes(quote.status))errors.status='Estado inválido';
  if(!priorities.includes(quote.priority))errors.priority='Prioridad inválida';
  for(const key of ['estimatedHours','remainingHours','value'] as const)if(typeof quote[key]!=='number'||!Number.isFinite(quote[key])||quote[key]<0||quote[key]>1e9)errors[key]='Introduce un número válido mayor o igual a cero';
  if(typeof quote.comments!=='string'||quote.comments.length>5000)errors.comments='Máximo 5.000 caracteres';
  if(typeof quote.updatedAt!=='string'||!Number.isFinite(Date.parse(quote.updatedAt)))errors.updatedAt='Actualización inválida';
  if(quote.quoteType!==undefined&&quote.quoteType!==null&&!quoteTypes.includes(quote.quoteType))errors.quoteType='Selecciona un tipo de cotización válido';
  if(quote.takeoff!==undefined&&typeof quote.takeoff!=='boolean')errors.takeoff='Takeoff inválido';
  if(quote.takeoff===true&&!quote.deadline)errors.deadline='Una cotización con takeoff requiere su fecha base guardada';
  if(quote.deadline!==undefined){
    const plan=quote.deadline;
    if(plan?.mode==='policy'&&!quote.quoteType)errors.quoteType='Un plazo por tipo requiere una clasificación';
    if(!plan||!['manual','policy'].includes(plan.mode)||!isDay(plan.baseDueDate)||(plan.mode==='manual'?plan.baseBusinessDays!==null:!Number.isInteger(plan.baseBusinessDays)||plan.baseBusinessDays!<1||plan.baseBusinessDays!>365))errors.deadline='Datos del cálculo inválidos';
    else try{const result=calculateDeadline(quote.assignedDate,plan,!!quote.takeoff);if(result.dueDate!==quote.dueDate||result.baseDueDate!==plan.baseDueDate)errors.dueDate='La entrega no coincide con su cálculo guardado';}catch{errors.deadline='Fecha base o plazo inválido';}
  }
  if(!Array.isArray(quote.history)||quote.history.length>500||quote.history.some(e=>!e||typeof e.id!=='string'||typeof e.text!=='string'||e.text.length>10000||typeof e.actor!=='string'||!Number.isFinite(Date.parse(e.at))))errors.history='Historial inválido';
  return errors;
}
export function validateAssignment(quote:Quote,people:Person[],previous?:Quote):Record<string,string> {
  const errors=validateQuote(quote,people);
  if((!previous||previous.estimator!==quote.estimator)&&!quote.quoteType)errors.quoteType='Selecciona el tipo antes de asignar la cotización';
  const current=normalizeQuote(quote),before=previous?normalizeQuote(previous):undefined;
  const replanned=!before||current.assignedDate!==before.assignedDate||current.takeoff!==before.takeoff||!sameDeadline(current.deadline,before.deadline);
  if(replanned&&current.deadline.mode==='manual'&&!isBusinessDay(current.deadline.baseDueDate))errors.baseDueDate='Selecciona una fecha base de lunes a viernes';
  return errors;
}
export function updateQuote(quote:Quote,patch:Partial<Quote>,actor:string,at:string):Quote {
  const changes:string[]=[];
  if(patch.dueDate&&patch.dueDate!==quote.dueDate)changes.push(`Fecha de entrega: ${quote.dueDate} → ${patch.dueDate}`);
  if(patch.estimator&&patch.estimator!==quote.estimator)changes.push('Estimator reasignado');
  if(patch.status&&patch.status!==quote.status)changes.push(`Estado: ${quote.status} → ${patch.status}`);
  if(patch.priority&&patch.priority!==quote.priority)changes.push(`Prioridad: ${patch.priority}`);
  if(patch.quoteType!==undefined&&patch.quoteType!==quote.quoteType)changes.push(`Tipo de cotización: ${patch.quoteType||'Sin clasificar'}`);
  if(patch.takeoff!==undefined&&!!patch.takeoff!==!!quote.takeoff)changes.push(`Takeoff: ${patch.takeoff?'incluido (+1 día hábil)':'sin takeoff'}`);
  if(patch.deadline&&!sameDeadline(patch.deadline,normalizeQuote(quote).deadline))changes.push(`Cálculo: ${patch.deadline.mode==='policy'?patch.deadline.baseBusinessDays+' días hábiles':'fecha base manual'} · base ${patch.deadline.baseDueDate}`);
  if(patch.comments!==undefined&&patch.comments!==quote.comments)changes.push('Comentarios actualizados');
  if(patch.estimatedHours!==undefined&&patch.estimatedHours!==quote.estimatedHours)changes.push(`Tiempo estimado: ${formatDuration(quote.estimatedHours)} → ${formatDuration(patch.estimatedHours)}`);
  if(patch.remainingHours!==undefined&&patch.remainingHours!==quote.remainingHours)changes.push(`Tiempo pendiente: ${formatDuration(quote.remainingHours)} → ${formatDuration(patch.remainingHours)}`);
  const result={...quote,...patch,id:quote.id,originalDueDate:quote.originalDueDate,updatedAt:at};
  if(isTerminal(result))result.completedAt=quote.completedAt||at;else delete result.completedAt;
  result.history=[{id:crypto.randomUUID(),at,actor,text:changes.join(' · ')||'Datos de la cotización actualizados'},...quote.history].slice(0,500);
  return result;
}
export function quoteCsv(quotes:Quote[],people:Person[],today:string):string {
  const cell=(value:string|number)=>{if(typeof value==='number')return String(value);let text=value;if(/^\s*[=+\-@]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
  const header=['Quote','Proyecto','Cliente','Account Manager','Estimator','Fecha asignada','Entrega original','Entrega vigente','Estado','Estado de entrega','Días restantes','Prioridad','Horas estimadas','Horas pendientes','Valor USD','Última actualización','Comentarios','Tipo de cotización','Takeoff','Método de cálculo','Días base hábiles','Fecha base'];
  return '\uFEFF'+[header,...quotes.map(q=>[q.code,q.project,q.client,q.am,people.find(p=>p.id===q.estimator)?.name||q.estimator,q.assignedDate,q.originalDueDate,q.dueDate,q.status,delivery(q,today).label,daysRemaining(q.dueDate,today),q.priority,q.estimatedHours,q.remainingHours,q.value,q.updatedAt,q.comments,q.quoteType||'Sin clasificar',q.takeoff?'Sí':'No',q.deadline?.mode==='policy'?'Plazo por tipo':'Fecha manual',q.deadline?.baseBusinessDays??'',q.deadline?.baseDueDate||q.dueDate])].map(row=>row.map(cell).join(',')).join('\r\n');
}
export function parseBackup(text:string,existingPeople:Person[]):{quotes:Quote[];people:Person[]} {
  if(text.length>4e6)throw new Error('El archivo excede el máximo de 4 MB');
  let data:Record<string,unknown>;try{data=JSON.parse(text);}catch{throw new Error('Archivo JSON inválido');}
  if(!data||typeof data!=='object'||!Array.isArray(data.quotes)||data.quotes.length>5000)throw new Error('Formato inválido: se requiere una lista de cotizaciones');
  if(data.version!==undefined&&data.version!==1)throw new Error('Versión de respaldo no compatible');
  const people=(data.people||existingPeople) as Person[];
  if(!Array.isArray(people)||!people.length||people.length>50||people.some(p=>!p||typeof p.id!=='string'||!p.id.trim()||typeof p.name!=='string'||!p.name.trim()||typeof p.initials!=='string'||typeof p.color!=='string'||!/^#[0-9a-f]{6}$/i.test(p.color)||!Number.isFinite(p.capacity)||p.capacity<1||p.capacity>168)||new Set(people.map(p=>p.id)).size!==people.length)throw new Error('Equipo inválido');
  const ids=new Set<string>(),codes=new Set<string>();
  const quotes=data.quotes as Quote[];
  for(const q of quotes){if(Object.keys(validateQuote(q,people)).length)throw new Error('Cotización inválida: revisa los campos requeridos');const code=q.code.trim().toUpperCase();if(ids.has(q.id)||codes.has(code))throw new Error('Cotizaciones duplicadas en el archivo');ids.add(q.id);codes.add(code);}
  return {quotes:quotes.map(normalizeQuote),people};
}
