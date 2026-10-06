import {createDemo,initialPeople} from './data.ts';
import {addDays} from './domain.ts';
import type {Person,Quote} from './domain';

const previousNames:Record<string,string>={alicia:'Alicia Torres',mateo:'Mateo Ruiz',camila:'Camila Vega',bruno:'Bruno Díaz'};
const previousManagers=['Elena Martín','Daniel López','Valeria Santos'];
const previousOwners=['alicia','alicia','bruno','mateo','alicia','camila','bruno','alicia','mateo','camila','alicia','bruno','mateo','camila','alicia','bruno','mateo','camila','alicia','bruno','mateo','camila','alicia','bruno'];
const fixedFields: (keyof Quote)[]=['code','project','client','status','priority','estimatedHours','remainingHours','value','comments'];
function untouchedExample(quote:Quote,people:Person[]):Quote|undefined{
 const match=/^demo-(\d+)$/.exec(quote.id),index=match?Number(match[1])-1:-1;
 if(index<0||index>=24||!quote.quoteType||quote.estimator!==previousOwners[index]||quote.am!==previousManagers[index%3]||people.find(p=>p.id===quote.estimator)?.name!==previousNames[quote.estimator])return;
 if(quote.history.length!==2||quote.history[0].id!==`demo-update-${index}`||quote.history[1].id!==`demo-create-${index}`||quote.history[0].actor!==previousNames[quote.estimator]||quote.history[1].actor!=='Senior Estimator')return;
 const expected=createDemo(addDays(quote.assignedDate,10+index%5),new Date(quote.updatedAt)).quotes[index];
 if(fixedFields.some(key=>quote[key]!==expected[key]))return;
 return expected;
}
const normalizedName=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase('es');
export function reconcileTeam(people:Person[],quotes:Quote[]):{people:Person[];quotes:Quote[]}{
 const aliases=new Map<string,string>();
 const current=initialPeople.map(person=>{
  const existing=people.find(p=>p.id===person.id||normalizedName(p.name)===normalizedName(person.name));
  if(existing)aliases.set(existing.id,person.id);
  return {...person,...existing,id:person.id,name:person.name,initials:person.initials,archived:false};
 });
 const updated=quotes.map(quote=>{
  const alias=aliases.get(quote.estimator);
  if(alias&&alias!==quote.estimator)return {...quote,estimator:alias};
  const example=untouchedExample(quote,people);
  return example?{...quote,estimator:example.estimator,am:example.am}:quote;
 });
 const referenced=new Set(updated.map(q=>q.estimator));
 const archived=people.filter(p=>referenced.has(p.id)&&!current.some(c=>c.id===p.id)&&!aliases.has(p.id)).map(p=>({...p,archived:true}));
 // A normalized backup must still fit the parser's 50 legacy + 3 current limit.
 // Reject before replacement rather than persisting a workspace that cannot reload.
 if(archived.length>50)throw new Error('El respaldo conserva más de 50 responsables anteriores. Revisa el equipo del archivo antes de importarlo.');
 return {people:[...current,...archived],quotes:updated};
}
