import type {Quote} from './domain';

export type Role='senior'|'estimator'|'account';
export type TeamProfile={id:string;name:string;initials:string;role:Role;estimatorId?:string};
export const teamProfiles:TeamProfile[]=[
 {id:'senior-kevin',name:'Kevin Amaya',initials:'KA',role:'senior'},
 {id:'estimator-danilo',name:'Danilo Heredia',initials:'DH',role:'estimator',estimatorId:'danilo'},
 {id:'estimator-moises',name:'Moisés Barón',initials:'MB',role:'estimator',estimatorId:'moises'},
 {id:'estimator-daniela',name:'Daniela Torres',initials:'DT',role:'estimator',estimatorId:'daniela'},
 {id:'account-nayib',name:'Nayib Farah',initials:'NF',role:'account'},
 {id:'account-carlos-obregon',name:'Carlos Obregón',initials:'CO',role:'account'},
 {id:'account-anthony',name:'Anthony Coronell',initials:'AC',role:'account'},
 {id:'account-andres-gianneo',name:'Andrés Gianneo',initials:'AG',role:'account'},
 {id:'account-andres-franco',name:'Andrés Franco',initials:'AF',role:'account'},
 {id:'account-carlos-sierra',name:'Carlos Sierra',initials:'CS',role:'account'},
 {id:'account-eduardo',name:'Eduardo Jiménez',initials:'EJ',role:'account'},
];
export const roleLabels:Record<Role,string>={senior:'Senior Estimator',estimator:'Estimator',account:'Account Manager'};
export function canViewQuote(profile:TeamProfile,quote:Quote):boolean{return profile.role==='senior'||(profile.role==='estimator'?quote.estimator===profile.estimatorId:quote.am===profile.name);}
const workFields=new Set<keyof Quote>(['status','estimatedHours','remainingHours','comments']);
export function canSaveQuote(profile:TeamProfile,next:Quote,previous?:Quote):boolean{
 if(profile.role==='senior')return true;
 if(profile.role!=='estimator'||next.estimator!==profile.estimatorId)return false;
 if(!previous)return false;
 if(previous.estimator!==profile.estimatorId)return false;
 const fields=new Set([...Object.keys(previous),...Object.keys(next)] as (keyof Quote)[]);
 return [...fields].every(field=>workFields.has(field)||JSON.stringify(next[field])===JSON.stringify(previous[field]));
}
