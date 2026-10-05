import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as domain from '../src/domain.ts';
import type {Quote,Person} from '../src/domain.ts';

const people:Person[]=[{id:'a',name:'Alicia',initials:'AT',color:'#5363ca',capacity:40},{id:'b',name:'Mateo',initials:'MR',color:'#327969',capacity:40}];
const oldQuote=():Quote=>({id:'q',code:'Q-1',project:'Proyecto',client:'Cliente',am:'Elena',estimator:'a',assignedDate:'2026-10-02',originalDueDate:'2026-10-09',dueDate:'2026-10-09',status:'En curso',priority:'Normal',estimatedHours:12,remainingHours:8,value:0,comments:'',updatedAt:'2026-10-02T10:00:00Z',history:[]});

test('business deadlines skip weekends, include leap days and exclude assignment day',()=>{
  assert.equal(typeof domain.addBusinessDays,'function');
  assert.equal(domain.addBusinessDays('2026-10-02',1),'2026-10-05');
  assert.equal(domain.addBusinessDays('2026-10-03',1),'2026-10-05');
  assert.equal(domain.addBusinessDays('2026-12-31',1),'2027-01-01');
  assert.equal(domain.addBusinessDays('2028-02-28',1),'2028-02-29');
  assert.equal(domain.addBusinessDays('2026-10-02',5),'2026-10-09');
  assert.throws(()=>domain.addBusinessDays('2026-02-30',1));
  assert.throws(()=>domain.addBusinessDays('2026-10-02',1.5));
});
test('all quotation types accept exactly one extra business day for takeoff',()=>{
  assert.equal(domain.quoteTypes?.length,7);
  for(const type of domain.quoteTypes){
    const q=domain.normalizeQuote({...oldQuote(),quoteType:type,takeoff:true,deadline:{mode:'policy',baseBusinessDays:1,baseDueDate:'2026-10-05'},dueDate:'2026-10-06'});
    assert.deepEqual(domain.validateAssignment(q,people),{});
    assert.equal(domain.calculateDeadline(q.assignedDate,q.deadline,true).dueDate,'2026-10-06');
    assert.equal(domain.calculateDeadline(q.assignedDate,q.deadline,false).dueDate,'2026-10-05');
    assert.equal(domain.calculateDeadline(q.assignedDate,q.deadline,true).dueDate,'2026-10-06');
  }
});
test('missing lead times stay unset and invalid configured values are rejected',()=>{
  assert.equal(typeof domain.normalizeLeadDays,'function');
  const days=domain.normalizeLeadDays(undefined);
  assert.equal(Object.values(days).length,7);
  assert.ok(Object.values(days).every(d=>d===null));
  for(const value of [0,366,1.5,'3',-1])assert.throws(()=>domain.normalizeLeadDays({[domain.quoteTypes[0]]:value}));
  assert.equal(domain.normalizeLeadDays({[domain.quoteTypes[0]]:365})[domain.quoteTypes[0]],365);
});
test('manual base date gets takeoff once and weekends are rejected for new assignments',()=>{
  assert.equal(typeof domain.calculateDeadline,'function');
  const q=domain.normalizeQuote({...oldQuote(),quoteType:domain.quoteTypes[0],takeoff:true,deadline:{mode:'manual',baseBusinessDays:null,baseDueDate:'2026-10-09'},dueDate:'2026-10-12'});
  assert.equal(domain.calculateDeadline(q.assignedDate,q.deadline,true).dueDate,'2026-10-12');
  assert.deepEqual(domain.validateAssignment(q,people),{});
  assert.ok(domain.validateAssignment({...q,deadline:{...q.deadline,baseDueDate:'2026-10-10'},dueDate:'2026-10-12'},people).baseDueDate);
});
test('legacy imports keep weekend commitments and require a type only for assignment',()=>{
  const original={...oldQuote(),dueDate:'2026-10-10',originalDueDate:'2026-10-10'};
  const restored=domain.parseBackup(JSON.stringify({version:1,quotes:[original],people}),people).quotes[0];
  assert.equal(restored.quoteType,null);
  assert.equal(restored.dueDate,original.dueDate);
  assert.deepEqual(domain.validateAssignment({...restored,comments:'Comentario'},people,restored),{});
  assert.ok(domain.validateAssignment({...restored,estimator:'b'},people,restored).quoteType);
  assert.deepEqual(domain.validateAssignment({...restored,estimator:'b',quoteType:'Proyecto menor',deadline:{mode:'manual',baseBusinessDays:null,baseDueDate:'2026-10-10'}},people,restored),{});
});
test('invalid type, takeoff and deadline metadata cannot enter a backup',()=>{
  for(const patch of [{quoteType:'Tipo inventado'},{takeoff:'sí'},{takeoff:true},{deadline:{mode:'policy',baseBusinessDays:5,baseDueDate:'2026-10-09'}},{deadline:{mode:'policy',baseBusinessDays:0,baseDueDate:'2026-10-09'}},{deadline:{mode:'manual',baseBusinessDays:null,baseDueDate:'2026-02-30'}}]){
    assert.throws(()=>domain.parseBackup(JSON.stringify({quotes:[{...oldQuote(),...patch}],people}),people));
  }
});
test('type and takeoff filters combine with ownership and unknown classification',()=>{
  const q={...oldQuote(),quoteType:'Retail menor',takeoff:true};
  const rows=[q,{...oldQuote(),id:'old'}];
  assert.equal(domain.filterQuotes(rows,{quoteType:'Retail menor',takeoff:'with',estimator:'a'},'2026-10-02').length,1);
  assert.equal(domain.filterQuotes(rows,{quoteType:'unclassified'},'2026-10-02')[0].id,'old');
  assert.equal(domain.filterQuotes(rows,{takeoff:'without'},'2026-10-02').length,1);
});
test('redistribution omits legacy unclassified quotes',()=>{
  assert.deepEqual(domain.suggestRebalance([{...oldQuote(),remainingHours:40},{...oldQuote(),id:'q2',remainingHours:20}],people),[]);
});
test('history and CSV include classification, takeoff and calculation snapshot',()=>{
  const initial=oldQuote();
  const q=domain.updateQuote(initial,{quoteType:'Retail menor',takeoff:true,deadline:{mode:'manual',baseBusinessDays:null,baseDueDate:'2026-10-09'},dueDate:'2026-10-12'},'Senior','2026-10-02T11:00:00Z');
  assert.match(q.history[0].text,/Retail menor/);
  assert.match(q.history[0].text,/takeoff/i);
  assert.equal(q.originalDueDate,initial.originalDueDate);
  const csv=domain.quoteCsv([q],people,'2026-10-02');
  assert.match(csv,/Tipo de cotización/);
  assert.match(csv,/Retail menor/);
  assert.match(csv,/Takeoff/);
  assert.match(csv,/Fecha base/);
});
