import {ArrowUpRight} from 'lucide-react';
import {workload,formatDuration} from './domain';
import type {Quote,Person} from './domain';
import {Avatar} from './components';
export function Capacity({quotes,people,onPerson,compact=false}:{quotes:Quote[];people:Person[];onPerson?:(id:string)=>void;compact?:boolean}){
  const load=workload(quotes,people);
  return <div className={`capacity-grid ${compact?'compact':''}`}>{load.map(p=><button className="capacity-person" key={p.id} onClick={()=>onPerson?.(p.id)} disabled={!onPerson} aria-label={`Ver cotizaciones de ${p.name}`}><div className="capacity-head"><Avatar person={p}/><div><strong>{p.name}</strong><span>{quotes.filter(q=>q.estimator===p.id).length} asignadas · {p.count} activas</span></div><ArrowUpRight size={15}/></div><div className="capacity-values"><strong title={formatDuration(p.hours)}>{new Intl.NumberFormat('es',{maximumFractionDigits:2}).format(p.hours)}<small> / {p.capacity} h</small></strong><span className={p.percent>100?'overloaded':''}>{p.percent}%</span></div><div className="capacity-track"><span className={p.percent>100?'overloaded':''} style={{width:Math.min(p.percent,100)+'%'}}/></div><div className="capacity-status">{p.percent>100?'Por encima de capacidad':p.percent>=80?'Carga elevada':'Capacidad disponible'}</div></button>)}</div>;
}
