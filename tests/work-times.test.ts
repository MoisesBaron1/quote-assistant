import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as d from '../src/domain.ts';
import type {Quote} from '../src/domain.ts';

test('provided times use minutes and preserve all nine variants',()=>{
  assert.equal(typeof d.standardMinutes,'function');
  const values=[['Cotización de adicional',false,21],['Proyecto mayor',true,240],['Proyecto mayor',false,360],['Proyecto menor',true,210],['Proyecto menor',false,270],['Recotización proyecto',false,120],['Recotización retail',false,60],['Retail mayor',false,180],['Retail menor',false,120]] as const;
  for(const [type,takeoff,minutes] of values)assert.equal(d.standardMinutes(type,takeoff),minutes);
  assert.equal(d.standardMinutes('Cotización de adicional',true),21);
  assert.equal(d.standardMinutes('Recotización retail',true),60);
  assert.equal(d.standardMinutes(null,false),null);
});
test('recotizations remain distinct classifications with business-day takeoff',()=>{
  assert.ok(d.quoteTypes.includes('Recotización proyecto'));
  assert.ok(d.quoteTypes.includes('Recotización retail'));
  for(const type of ['Recotización proyecto','Recotización retail'] as const){
    const q={id:'q',code:'Q-1',project:'Test',client:'Client',am:'AM',estimator:'p',assignedDate:'2026-10-02',originalDueDate:'2026-10-06',dueDate:'2026-10-06',status:'Pendiente',priority:'Normal',estimatedHours:2,remainingHours:2,value:0,comments:'',updatedAt:'2026-10-02T10:00:00Z',history:[],quoteType:type,takeoff:true,deadline:{mode:'policy',baseDueDate:'2026-10-05',baseBusinessDays:1}} as Quote;
    assert.deepEqual(d.validateAssignment(q,[{id:'p',name:'Person',initials:'P',color:'#112233',capacity:40}]),{});
  }
});
test('work standards default additively without accepting malformed rules',()=>{
  assert.equal(typeof d.normalizeWorkStandards,'function');
  const defaults=d.normalizeWorkStandards(undefined);
  assert.equal(Object.keys(defaults).length,9);assert.equal(defaults.additional,21);
  assert.equal(d.normalizeWorkStandards({additional:25}).additional,25);
  for(const invalid of [{additional:0},{additional:21.5},{additional:'21'},{unknown:20},null,[]])assert.throws(()=>d.normalizeWorkStandards(invalid));
});
test('human durations retain minutes without floating point artifacts',()=>{
  assert.equal(typeof d.formatDuration,'function');
  assert.equal(d.formatDuration(.35),'21 min');assert.equal(d.formatDuration(3.5),'3 h 30 min');assert.equal(d.formatDuration(0),'0 min');
  assert.equal(d.formatDuration(.1+.2),'18 min');assert.equal(d.formatDuration(6),'6 h');
});
test('HH:MM settings parse the additional as 21 minutes',()=>{
  assert.equal(typeof d.parseWorkTime,'function');
  assert.equal(d.parseWorkTime('0:21:00'),21);assert.equal(d.parseWorkTime('03:30'),210);assert.equal(d.workTimeInput(21),'00:21');
  for(const invalid of ['00:00','03:60','-1:30','hello','0:21:01'])assert.throws(()=>d.parseWorkTime(invalid));
});
test('deadline risk does not invent capacity on weekends',()=>{
  const q={dueDate:'2026-10-05',remainingHours:17,status:'En curso'} as Quote;
  assert.equal(d.risk(q,'2026-10-02',40,2).level,'Alto');
  assert.equal(d.risk({...q,remainingHours:9},'2026-10-03',40,2).level,'Alto');
  assert.equal(d.risk({...q,remainingHours:0},'2026-10-05',40,2).level,'Medio');
});
test('hour changes record both estimates and pending work in history',()=>{
  const quote={id:'q',originalDueDate:'2026-10-09',estimatedHours:6,remainingHours:4,status:'En curso',history:[]} as Quote;
  const updated=d.updateQuote(quote,{estimatedHours:3.5,remainingHours:.35},'Senior','2026-10-05T10:00:00Z');
  assert.match(updated.history[0].text,/Tiempo estimado: 6 h → 3 h 30 min/);
  assert.match(updated.history[0].text,/Tiempo pendiente: 4 h → 21 min/);
});
test('sub-hour progress uses its actual estimate',()=>{
  assert.equal(typeof d.quoteProgress,'function');
  assert.equal(d.quoteProgress({estimatedHours:.35,remainingHours:.35,status:'Pendiente'} as Quote),0);
  assert.equal(d.quoteProgress({estimatedHours:.35,remainingHours:.175,status:'En curso'} as Quote),50);
  assert.equal(d.quoteProgress({estimatedHours:0,remainingHours:3,status:'En curso'} as Quote),0);
  assert.equal(d.quoteProgress({estimatedHours:0,remainingHours:0,status:'Entregada'} as Quote),100);
});
