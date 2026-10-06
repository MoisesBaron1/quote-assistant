import {teamProfiles,roleLabels} from './team';
import type {TeamProfile,Role} from './team';
import type {WorkspaceSpace} from './useWorkspace';

export function ProfileControls({profile,space,onProfile,onSpace}:{profile:TeamProfile;space:WorkspaceSpace;onProfile:(id:string)=>void;onSpace:(space:WorkspaceSpace)=>void}){
 return <div className="role-controls profile-controls"><label>Espacio<select aria-label="Espacio de trabajo" value={space} onChange={e=>onSpace(e.target.value as WorkspaceSpace)}><option value="work">Trabajo</option><option value="demo">Ejemplos</option></select></label><label>Perfil · {roleLabels[profile.role]}<select id="active-profile" aria-label="Perfil actual" value={profile.id} onChange={e=>onProfile(e.target.value)}>{(['senior','estimator','account'] as Role[]).map(role=><optgroup key={role} label={roleLabels[role]}>{teamProfiles.filter(p=>p.role===role).map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</optgroup>)}</select></label></div>;
}
