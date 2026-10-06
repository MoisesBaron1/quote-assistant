import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Quote} from '../src/domain.ts';
import * as team from '../src/team.ts';

const quotation={id:'q',code:'Q-1',project:'Proyecto',client:'Cliente',am:'Carlos Obregón',estimator:'moises',assignedDate:'2026-10-06',originalDueDate:'2026-10-09',dueDate:'2026-10-09',status:'En curso',priority:'Normal',estimatedHours:2,remainingHours:2,value:0,comments:'',updatedAt:'2026-10-06T10:00:00Z',history:[]} as Quote;
test('the requested roster has one Senior, three Estimators and seven Account Managers',()=>{
 assert.deepEqual(team.teamProfiles.map(p=>p.name),['Kevin Amaya','Danilo Heredia','Moisés Barón','Daniela Torres','Nayib Farah','Carlos Obregón','Anthony Coronell','Andrés Gianneo','Andrés Franco','Carlos Sierra','Eduardo Jiménez']);
 assert.equal(new Set(team.teamProfiles.map(p=>p.id)).size,11);
 assert.equal(team.teamProfiles.filter(p=>p.role==='senior').length,1);
 assert.equal(team.teamProfiles.filter(p=>p.role==='estimator').length,3);
 assert.equal(team.teamProfiles.filter(p=>p.role==='account').length,7);
});
test('each profile sees only its own scope while Kevin sees the whole team',()=>{
 for(const profile of team.teamProfiles){const expected=profile.role==='senior'||profile.estimatorId===quotation.estimator||profile.role==='account'&&profile.name===quotation.am;assert.equal(team.canViewQuote(profile,quotation),expected,profile.name);}
});
test('Estimators can update their work without altering assignments or commitments',()=>{
 const moises=team.teamProfiles.find(p=>p.name==='Moisés Barón')!;
 assert.equal(team.canSaveQuote(moises,{...quotation,status:'Lista para enviar',remainingHours:0,comments:'Revisión lista'},quotation),true);
 for(const patch of [{estimator:'danilo'},{am:'Nayib Farah'},{dueDate:'2026-10-12'},{originalDueDate:'2026-10-12'},{priority:'Crítica'},{value:15000}])assert.equal(team.canSaveQuote(moises,{...quotation,...patch} as Quote,quotation),false);
 assert.equal(team.canSaveQuote(team.teamProfiles.find(p=>p.name==='Danilo Heredia')!,quotation,quotation),false);
 assert.equal(team.canSaveQuote(moises,quotation),false);
});
test('Account Managers consult their quotations and never save changes',()=>{
 const carlos=team.teamProfiles.find(p=>p.name==='Carlos Obregón')!;
 assert.equal(team.canViewQuote(carlos,quotation),true);
 assert.equal(team.canSaveQuote(carlos,{...quotation,comments:'Cambiar'},quotation),false);
 assert.equal(team.canSaveQuote(carlos,quotation),false);
 assert.equal(team.canSaveQuote(team.teamProfiles[0],{...quotation,estimator:'daniela'},quotation),true);
});
