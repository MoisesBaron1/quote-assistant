import type {Quote,Person} from './domain';
import {accountManagers} from './data';
export function newQuote(quotes:Quote[],people:Person[],today:string):Quote {
  const next=Math.max(10299,...quotes.map(q=>Number(q.code.match(/\d+$/)?.[0])||0))+1,now=new Date().toISOString();
  return {id:crypto.randomUUID(),code:`Q-${next}`,project:'',client:'',am:accountManagers[0],estimator:people[0].id,assignedDate:today,originalDueDate:'',dueDate:'',quoteType:null,takeoff:false,deadline:{mode:'manual',baseDueDate:'',baseBusinessDays:null},status:'Pendiente',priority:'Normal',estimatedHours:8,remainingHours:8,value:0,comments:'',updatedAt:now,history:[]};
}
