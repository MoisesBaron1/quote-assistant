import {useEffect,useRef} from 'react';
import {X,ArrowUpRight,Inbox} from 'lucide-react';
import type {ReactNode} from 'react';
import type {Person} from './domain';
const currencyFormat=new Intl.NumberFormat('es-MX',{style:'currency',currency:'USD',maximumFractionDigits:0});
export const money=(n:number)=>currencyFormat.format(n);
const dateFormats=[false,true].map(short=>new Intl.DateTimeFormat('es',{day:'numeric',month:short?'short':'long',timeZone:'UTC'}));
export const dateLabel=(day:string,short=false)=>dateFormats[Number(short)].format(new Date(day+'T12:00:00Z'));
const timeFormats=new Map<string,Intl.DateTimeFormat>();
export const timeLabel=(stamp:string,tz='UTC')=>{let formatter=timeFormats.get(tz);if(!formatter){formatter=new Intl.DateTimeFormat('es',{hour:'2-digit',minute:'2-digit',timeZone:tz});timeFormats.set(tz,formatter);}return formatter.format(new Date(stamp));};
export function Avatar({person,small=false}:{person:Person;small?:boolean}){return <span className={`avatar ${small?'small':''}`} style={{background:person.color+'16',color:'#465166'}}>{person.initials}</span>;}
export function Badge({label}:{label:string}){const kind=['Retrasada','Alto','Crítica','Riesgo alto'].includes(label)?'danger':['Postergada','Medio','Alta'].includes(label)?'warning':['A tiempo','Entregada','Bajo','Completada'].includes(label)?'success':'neutral';return <span className={`badge ${kind}`}><span className="badge-dot"/>{label}</span>;}
export function Empty({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="empty"><Inbox size={34}/><h3>{title}</h3><p>{description}</p>{action}</div>;}
export function Modal({title,onClose,children,drawer=false,closeDisabled=false}:{title:string;onClose:()=>void;children:ReactNode;drawer?:boolean;closeDisabled?:boolean}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const el=ref.current!;el.showModal();return()=>el.close();},[]);
  return <dialog ref={ref} className={drawer?'dialog drawer':'dialog'} aria-label={title} onCancel={e=>{e.preventDefault();if(!closeDisabled)onClose();}} onClick={e=>{if(!closeDisabled&&e.target===e.currentTarget){const b=e.currentTarget.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)onClose();}}}><div className="dialog-heading"><h2>{title}</h2><button className="icon-button" disabled={closeDisabled} aria-label={drawer?'Cerrar detalle':'Cerrar ventana'} onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}
export function SectionHeading({title,description,action}:{title:string;description?:string;action?:ReactNode}){return <div className="section-heading"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</div>;}
export function TextAction({children,onClick}:{children:ReactNode;onClick:()=>void}){return <button className="text-action" onClick={onClick}>{children}<ArrowUpRight size={15}/></button>;}
