import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDemo} from '../src/data.ts';
import {reconcileTeam} from '../src/upgradeTeam.ts';
import {parseBackup,validateAssignment} from '../src/domain.ts';
const legacyPeople=[{id:'alicia',name:'Alicia Torres',initials:'AT',color:'#5363ca',capacity:32},{id:'mateo',name:'Mateo Ruiz',initials:'MR',color:'#327969',capacity:36},{id:'camila',name:'Camila Vega',initials:'CV',color:'#986944',capacity:32},{id:'bruno',name:'Bruno Díaz',initials:'BD',color:'#8463a0',capacity:28}];
const original=()=>{
 const q=createDemo('2026-10-06',new Date('2026-10-06T10:00:00Z')).quotes[0];
 return {...q,am:'Elena Martín',estimator:'alicia',history:q.history.map((h,i)=>({...h,actor:i===0?'Alicia Torres':'Senior Estimator',text:i===0?h.text:'Cotización asignada a Alicia Torres'}))};
};
test('fresh examples contain all real Estimators and all seven Account Managers',()=>{
 const sample=createDemo('2026-10-06');
 assert.deepEqual(sample.people.map(p=>p.name),['Danilo Heredia','Moisés Barón','Daniela Torres']);
 assert.equal(new Set(sample.quotes.map(q=>q.am)).size,7);
 assert.deepEqual(new Set(sample.quotes.map(q=>q.estimator)),new Set(['danilo','moises','daniela']));
});
test('only recognizable untouched examples receive the new team automatically',()=>{
 const untouched=original(),edited={...original(),id:'saved-real',project:'Proyecto del usuario',comments:'Trabajo real',history:[...original().history,{id:'user-edit',at:'2026-10-06T11:00:00Z',actor:'Senior Estimator',text:'Cambios guardados'}]};
 const before=JSON.stringify([untouched,edited]),result=reconcileTeam(legacyPeople,[untouched,edited]);
 assert.equal(JSON.stringify([untouched,edited]),before);
 assert.equal(result.quotes[0].estimator,'danilo');assert.equal(result.quotes[0].am,'Nayib Farah');
 assert.equal(result.quotes[0].dueDate,untouched.dueDate);assert.equal(result.quotes[0].originalDueDate,untouched.originalDueDate);assert.equal(result.quotes[0].estimatedHours,untouched.estimatedHours);assert.deepEqual(result.quotes[0].history,untouched.history);
 assert.deepEqual(result.quotes[1],edited);
 assert.equal(result.people.find(p=>p.id==='alicia')?.archived,true);
 assert.equal(result.people.filter(p=>!p.archived).length,3);
 assert.deepEqual(reconcileTeam(result.people,result.quotes),result);
});
test('unknown saved team members and their quotation records remain recoverable',()=>{
 const person={id:'previous-owner',name:'Responsable anterior',initials:'RA',color:'#112233',capacity:42},q={...original(),id:'user-quote',estimator:person.id};
 const result=reconcileTeam([person],[q]);assert.deepEqual(result.quotes[0],q);assert.deepEqual(result.people.find(p=>p.id===person.id),{...person,archived:true});
});
test('a maximum-size legacy team still roundtrips after adding the three real Estimators',()=>{
 const people=Array.from({length:50},(_,i)=>({id:'previous-'+i,name:'Anterior '+i,initials:'PA',color:'#112233',capacity:40}));
 const quotes=people.map((p,i)=>({...original(),id:'quote-'+i,code:'Q-'+i,estimator:p.id})),upgraded=reconcileTeam(people,quotes);
 assert.equal(upgraded.people.length,53);assert.equal(parseBackup(JSON.stringify({...upgraded,version:1}),upgraded.people).quotes.length,50);
});
test('archived owners remain editable on existing records but cannot receive new assignments',()=>{
 const q=original(),people=[...legacyPeople.map(p=>({...p,archived:true})),...createDemo('2026-10-06').people];
 assert.equal(validateAssignment(q,people).estimator,'Selecciona un Estimator del equipo actual');
 assert.equal(validateAssignment(q,people,q).estimator,undefined);
});
test('an accepted raw backup cannot be reconciled into an unreadable oversized team',()=>{
 const people=Array.from({length:53},(_,i)=>({id:'previous-'+i,name:'Anterior '+i,initials:'PA',color:'#112233',capacity:40}));
 const quotes=people.map((p,i)=>({...original(),id:'quote-'+i,code:'Q-'+i,estimator:p.id}));
 const parsed=parseBackup(JSON.stringify({people,quotes,version:1}),people),unchanged=JSON.stringify(parsed);
 assert.throws(()=>reconcileTeam(parsed.people,parsed.quotes),/50 responsables anteriores/);
 assert.equal(JSON.stringify(parsed),unchanged);
});
