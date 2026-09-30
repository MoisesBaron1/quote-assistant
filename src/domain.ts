export type Workflow = 'Pendiente'|'En curso'|'En revisión'|'Lista para enviar'|'Entregada';
export type Priority = 'Normal'|'Alta'|'Crítica';
export type HistoryEntry = {id:string;at:string;actor:string;text:string};
export type Quote = {id:string;code:string;project:string;client:string;am:string;estimator:string;assignedDate:string;originalDueDate:string;dueDate:string;status:Workflow;priority:Priority;estimatedHours:number;remainingHours:number;value:number;comments:string;updatedAt:string;completedAt?:string;history:HistoryEntry[]};
export type Person = {id:string;name:string;initials:string;color:string;capacity:number};
export type Filters = {search?:string;estimator?:string;am?:string;status?:string;delivery?:string;dueFrom?:string;dueTo?:string;overdue?:boolean;postponed?:boolean};
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
export function daysRemaining(due:string,today:string):number {
  if(!isDay(due)||!isDay(today))throw new Error('Fecha inválida');
  return Math.round((Date.parse(due+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
}
export const isTerminal=(q:Quote)=>q.status==='Entregada'||q.status==='Lista para enviar';
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
  const available=Math.max(1,days+1)*capacity/5;
  if(quote.remainingHours>available)return {level:'Alto',reason:`${quote.remainingHours} h pendientes superan las ${Math.round(available)} h nominales disponibles hasta la entrega`};
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
  return quotes.filter(q=>{const d=delivery(q,today);return (!filters.search||normalize([q.code,q.project,q.client,q.am].join(' ')).includes(normalize(filters.search.trim())))&&(!filters.estimator||q.estimator===filters.estimator)&&(!filters.am||q.am===filters.am)&&(!filters.status||q.status===filters.status)&&(!filters.delivery||d.label===filters.delivery)&&(!filters.dueFrom||q.dueDate>=filters.dueFrom)&&(!filters.dueTo||q.dueDate<=filters.dueTo)&&(!filters.overdue||d.overdue)&&(!filters.postponed||d.postponed);});
}
export function suggestRebalance(quotes:Quote[],people:Person[]):Move[] {
  const simulated=quotes.map(q=>({...q})),moves:Move[]=[];
  for(let round=0;round<people.length*2;round++) {
    const load=workload(simulated,people),score=load.reduce((n,p)=>n+(p.hours/p.capacity)**2,0);
    let best:{gain:number;move:Move}|undefined;
    for(const q of simulated.filter(q=>!isTerminal(q)&&q.remainingHours>0&&!moves.some(m=>m.quoteId===q.id))) {
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
  if(!Array.isArray(quote.history)||quote.history.length>500||quote.history.some(e=>!e||typeof e.id!=='string'||typeof e.text!=='string'||e.text.length>10000||typeof e.actor!=='string'||!Number.isFinite(Date.parse(e.at))))errors.history='Historial inválido';
  return errors;
}
export function updateQuote(quote:Quote,patch:Partial<Quote>,actor:string,at:string):Quote {
  const changes:string[]=[];
  if(patch.dueDate&&patch.dueDate!==quote.dueDate)changes.push(`Fecha de entrega: ${quote.dueDate} → ${patch.dueDate}`);
  if(patch.estimator&&patch.estimator!==quote.estimator)changes.push('Estimator reasignado');
  if(patch.status&&patch.status!==quote.status)changes.push(`Estado: ${quote.status} → ${patch.status}`);
  if(patch.priority&&patch.priority!==quote.priority)changes.push(`Prioridad: ${patch.priority}`);
  if(patch.comments!==undefined&&patch.comments!==quote.comments)changes.push('Comentarios actualizados');
  const result={...quote,...patch,id:quote.id,originalDueDate:quote.originalDueDate,updatedAt:at};
  if(isTerminal(result))result.completedAt=quote.completedAt||at;else delete result.completedAt;
  result.history=[{id:crypto.randomUUID(),at,actor,text:changes.join(' · ')||'Datos de la cotización actualizados'},...quote.history].slice(0,500);
  return result;
}
export function quoteCsv(quotes:Quote[],people:Person[],today:string):string {
  const cell=(value:string|number)=>{if(typeof value==='number')return String(value);let text=value;if(/^\s*[=+\-@]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
  const header=['Quote','Proyecto','Cliente','Account Manager','Estimator','Fecha asignada','Entrega original','Entrega vigente','Estado','Estado de entrega','Días restantes','Prioridad','Horas estimadas','Horas pendientes','Valor USD','Última actualización','Comentarios'];
  return '\uFEFF'+[header,...quotes.map(q=>[q.code,q.project,q.client,q.am,people.find(p=>p.id===q.estimator)?.name||q.estimator,q.assignedDate,q.originalDueDate,q.dueDate,q.status,delivery(q,today).label,daysRemaining(q.dueDate,today),q.priority,q.estimatedHours,q.remainingHours,q.value,q.updatedAt,q.comments])].map(row=>row.map(cell).join(',')).join('\r\n');
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
  return {quotes,people};
}
