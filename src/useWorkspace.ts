import {useEffect,useRef,useState} from 'react';
import {businessDate,parseBackup} from './domain';
import {createDemo,initialPeople} from './data';
import type {Workspace} from './data';
export const STORAGE_KEY='epica-workspace-v1';
export function restoreWorkspace(raw:string):Workspace {
  const data=JSON.parse(raw),checked=parseBackup(raw,initialPeople);
  const timezone=typeof data.settings?.timezone==='string'?data.settings.timezone:'UTC';
  businessDate(new Date(),timezone);
  return {version:1,...checked,settings:{timezone,alertDays:[1,2,3,5,7].includes(data.settings?.alertDays)?data.settings.alertDays:2,desktopAlerts:data.settings?.desktopAlerts===true},dismissed:Array.isArray(data.dismissed)?data.dismissed.filter((x:unknown)=>typeof x==='string').slice(-1000):[],events:Array.isArray(data.events)?data.events.filter((e:Record<string,unknown>)=>e&&typeof e.id==='string'&&typeof e.text==='string'&&typeof e.actor==='string'&&typeof e.at==='string'&&Number.isFinite(Date.parse(e.at))).slice(0,500):[],savedAt:typeof data.savedAt==='string'&&Number.isFinite(Date.parse(data.savedAt))?data.savedAt:new Date().toISOString()};
}
export function useWorkspace() {
  const [initial]=useState(()=>{
    let raw:string|null=null;
    try{raw=localStorage.getItem(STORAGE_KEY);return {state:raw?restoreWorkspace(raw):createDemo(businessDate(new Date())),warning:'',raw,damaged:false};}
    catch{return {state:createDemo(businessDate(new Date())),warning:'No pudimos leer los datos guardados. Descarga el archivo original o restaura los ejemplos desde Configuración.',raw,damaged:!!raw};}
  });
  const [workspace,setWorkspace]=useState(initial.state),[storageError,setStorageError]=useState(initial.warning),[recovery,setRecovery]=useState(initial.damaged?initial.raw:null);
  const latest=useRef(workspace),dirty=useRef(false),persisted=useRef<string|null>(initial.raw),invalid=useRef(initial.damaged);
  const save=(state:Workspace)=>{
    try{const raw=JSON.stringify(state);localStorage.setItem(STORAGE_KEY,raw);persisted.current=raw;dirty.current=false;invalid.current=false;setRecovery(null);setStorageError('');return 'saved' as const;}
    catch{dirty.current=true;setStorageError('Los cambios no se pudieron guardar en este navegador. Descarga un respaldo antes de cerrar.');return 'unsaved' as const;}
  };
  useEffect(()=>{
    if(!initial.warning&&!initial.raw)save(latest.current);
    const receive=(event:StorageEvent)=>{
      if(event.key!==STORAGE_KEY||!event.newValue)return;
      if(dirty.current){setStorageError('Hay cambios locales sin guardar y otra pestaña cambió los datos. Descarga un respaldo antes de recargar.');return;}
      try{const next=restoreWorkspace(event.newValue);persisted.current=event.newValue;invalid.current=false;setRecovery(null);setStorageError('');latest.current=next;setWorkspace(next);}
      catch{invalid.current=true;setRecovery(event.newValue);setStorageError('Otra pestaña guardó datos inválidos. Conservamos la última versión válida; puedes descargar el archivo original.');}
    };
    window.addEventListener('storage',receive);return()=>window.removeEventListener('storage',receive);
  },[]);
  async function commit(change:(current:Workspace)=>Workspace,options:{replaceInvalid?:boolean}={}):Promise<'saved'|'unsaved'|'conflict'> {
    const apply=()=>{
      let raw:string|null;
      try{raw=localStorage.getItem(STORAGE_KEY);}
      catch{setStorageError('No fue posible leer la versión guardada. Descarga un respaldo antes de continuar.');return 'conflict' as const;}
      if(dirty.current&&raw!==persisted.current)return 'conflict' as const;
      if(raw&&!dirty.current&&(raw!==persisted.current||invalid.current)){
        try{latest.current=restoreWorkspace(raw);persisted.current=raw;invalid.current=false;}
        catch{invalid.current=true;setRecovery(raw);if(!options.replaceInvalid){setStorageError('Los datos guardados están dañados. Descarga el archivo original y restaura los ejemplos o importa un respaldo desde Configuración.');return 'conflict' as const;}}
      }
      const changed=change(latest.current);
      if(changed===latest.current){setWorkspace(latest.current);return 'conflict' as const;}
      const next={...changed,savedAt:new Date().toISOString()};latest.current=next;setWorkspace(next);return save(next);
    };
    return navigator.locks?navigator.locks.request(STORAGE_KEY,apply):apply();
  }
  return {workspace,commit,storageError,recovery};
}
