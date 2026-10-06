import {addDays,addBusinessDays,isBusinessDay,normalizeLeadDays,normalizeWorkStandards,quoteTypes,workflows} from './domain.ts';
import type {Quote,Person,LeadDays,WorkStandards} from './domain';
import {teamProfiles} from './team.ts';
export type Settings={timezone:string;alertDays:number;desktopAlerts:boolean;leadDays:LeadDays;workMinutes:WorkStandards};
export type WorkspaceEvent={id:string;at:string;actor:string;text:string};
export type Workspace={version:1;quotes:Quote[];people:Person[];settings:Settings;dismissed:string[];events:WorkspaceEvent[];savedAt:string};
export const accountManagers=teamProfiles.filter(p=>p.role==='account').map(p=>p.name);
export const initialPeople:Person[]=[
  {id:'danilo',name:'Danilo Heredia',initials:'DH',color:'#5363ca',capacity:40},
  {id:'moises',name:'Moisés Barón',initials:'MB',color:'#327969',capacity:40},
  {id:'daniela',name:'Daniela Torres',initials:'DT',color:'#986944',capacity:40},
];
const projects=[
  ['Torre Meridian · Fachada norte','Meridian Developments'],['Hospital San Rafael · Fase II','Grupo San Rafael'],['Campus Nova · Edificio B','Nova Education'],['Residencias del Parque','Parque Living'],['Centro Logístico Atlas','Atlas Logistics'],['Hotel Costa Azul · Lobby','Costa Azul Hospitality'],['Plaza Aurora · Locales','Aurora Retail'],['Oficinas Horizonte · Nivel 8','Horizonte Group'],['Museo del Diseño · Ampliación','Fundación Diseño'],['Aeropuerto Regional · Terminal','Infra Regional'],['Villas del Lago · Etapa 3','Lago Developments'],['Centro Médico Alameda','Alameda Health'],['Distrito Central · Torre A','Distrito Central'],['Hotel Mirador · Renovación','Mirador Hotels'],['Estación Norte · Cubiertas','Metro Norte'],['Parque Industrial Delta','Delta Industrial'],['Biblioteca Universidad Sur','Universidad Sur'],['The Greenhouse · Oficinas','Greenhouse Studio'],['Marina Bay · Áreas comunes','Marina Bay'],['Centro Deportivo Olimpika','Olimpika Sports'],['Mercado de San Lucas','San Lucas Retail'],['Edificio Prisma · Interiores','Prisma Partners'],['Escuela Montessori · Aulas','Montessori Schools'],['Torre Lumen · Etapa 1','Lumen Developments'],
];
export function createDemo(today:string,now=new Date()):Workspace {
  const owners=['danilo','danilo','moises','moises','danilo','daniela','moises','danilo','moises','daniela','danilo','moises','moises','daniela','danilo','moises','moises','daniela','danilo','moises','moises','daniela','danilo','moises'];
  const offsets=[-2,0,1,3,2,4,-1,5,6,2,7,1,4,5,3,8,2,6,-3,7,8,4,9,10];
  const hours=[12,8,10,5,9,4,8,10,6,5,8,6,4,3,7,8,6,5,0,0,0,0,4,5];
  const quotes:Quote[]=projects.map(([project,client],i)=>{
    const assigned=addDays(today,-10-i%5),takeoff=i%4===0;
    let base=addDays(today,offsets[i]);while(!isBusinessDay(base))base=addDays(base,1);
    const due=takeoff?addBusinessDays(base,1):base;
    const changed=[2,6,10,15,21].includes(i),status=i>=18&&i<=21?(i===21?'Lista para enviar':'Entregada'):workflows[i%3];
    const updatedAt=new Date(now.getTime()-(i%6+1)*18*60000).toISOString();
    return {quoteType:quoteTypes[i%quoteTypes.length],takeoff,deadline:{mode:'manual',baseDueDate:base,baseBusinessDays:null},id:`demo-${i+1}`,code:`Q-${10300+i}`,project,client,am:accountManagers[i%accountManagers.length],estimator:owners[i],assignedDate:assigned,originalDueDate:changed?addDays(due,-3):due,dueDate:due,status,priority:[0,1,2,6].includes(i)?'Crítica':i%3===0?'Alta':'Normal',estimatedHours:hours[i]+(i%4+1)*4,remainingHours:hours[i],value:18000+i*7200,comments:i===0?'Pendiente confirmar el acabado de los paneles con el cliente. Priorizar revisión técnica.':i===2?'El cliente amplió el alcance. Nueva fecha acordada; revisar disponibilidad del equipo.':i%3===0?'Revisar especificaciones y cantidades antes de enviar.':'Documentación de referencia disponible para el equipo.',updatedAt,history:[{id:`demo-update-${i}`,at:updatedAt,actor:initialPeople.find(p=>p.id===owners[i])!.name,text:changed?'Fecha de entrega actualizada tras un cambio de alcance':'Avance y horas pendientes actualizados'},{id:`demo-create-${i}`,at:assigned+'T09:00:00Z',actor:'Kevin Amaya',text:`Cotización asignada a ${initialPeople.find(p=>p.id===owners[i])!.name}`}]};
  });
  return {version:1,quotes,people:initialPeople.map(p=>({...p})),settings:{timezone:'UTC',alertDays:2,desktopAlerts:false,leadDays:normalizeLeadDays(undefined),workMinutes:normalizeWorkStandards(undefined)},dismissed:[],events:[],savedAt:now.toISOString()};
}
export function createEmptyWorkspace(today:string,now=new Date()):Workspace{return {...createDemo(today,now),quotes:[],events:[],dismissed:[]};}
