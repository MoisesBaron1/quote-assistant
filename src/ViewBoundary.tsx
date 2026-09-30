import {Component} from 'react';
import type {ReactNode} from 'react';
import {Empty} from './components';
export class ViewBoundary extends Component<{children:ReactNode;onHome:()=>void;fallback?:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){
  if(!this.state.failed)return this.props.children;
  if(this.props.fallback!==undefined)return this.props.fallback;
  return <section className="panel"><Empty title="Esta vista no se pudo cargar" description="Revisa la conexión. Puedes volver al resumen o recargar la app. Si tienes cambios sin guardar, descarga un respaldo antes de recargar." action={<div className="form-actions"><button className="button secondary" onClick={this.props.onHome}>Volver al resumen</button><button className="button primary" onClick={()=>location.reload()}>Recargar aplicación</button></div>}/></section>;
 }
}
