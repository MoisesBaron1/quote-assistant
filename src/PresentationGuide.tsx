import {ArrowLeft,ArrowRight,Check,Play,X} from 'lucide-react';
export const presentationSteps=[
  {tab:'overview',title:'Compromisos visibles',text:'Empieza por los seis indicadores. Muestra qué está a tiempo, qué venció y cómo se reparte la carga.'},
  {tab:'quotes',title:'El contexto de cada cotización',text:'Compara Tarjetas y Tabla. Abre una cotización para mostrar tipo, takeoff, responsable y entrega final. El historial conserva el compromiso original.'},
  {tab:'team',title:'Carga y decisiones de asignación',text:'Compara las horas pendientes con la capacidad semanal. Revisa una propuesta de redistribución antes de aplicarla.'},
  {tab:'calendar',title:'Una semana de compromisos',text:'Recorre las entregas de la semana. Puedes abrir cada cotización y volver a la fecha de hoy.'},
  {tab:'alerts',title:'Priorizar el seguimiento',text:'Revisa los compromisos vencidos y el riesgo explicado. Prepara un mensaje o marca una alerta como revisada.'},
  {tab:'report',title:'Un resumen para decidir',text:'Cierra con el informe ejecutivo. Usa Imprimir / PDF para llevarte un reporte y CSV para trabajar con los datos.'},
] as const;
export function PresentationGuide({step,onStep,onClose,onExample}:{step:number;onStep:(step:number)=>void;onClose:()=>void;onExample:()=>void}){
 const current=presentationSteps[step];
 return <section className="presentation-guide" aria-label="Guía de presentación">
  <div className="guide-description"><div className="guide-progress"><Play size={14}/><span>Guía de presentación · {step+1} de {presentationSteps.length}</span></div><h2>{current.title}</h2><p>{current.text}</p>{step===1&&<button className="text-action" onClick={onExample}>Abrir cotización de ejemplo <ArrowRight size={14}/></button>}</div>
  <div className="guide-controls"><button className="icon-button" aria-label="Paso anterior" disabled={step===0} onClick={()=>onStep(step-1)}><ArrowLeft size={17}/></button><button className="button primary" onClick={()=>step===presentationSteps.length-1?onClose():onStep(step+1)}>{step===presentationSteps.length-1?'Finalizar guía':'Siguiente paso'}{step===presentationSteps.length-1?<Check size={16}/>:<ArrowRight size={16}/>}</button><button className="icon-button" aria-label="Cerrar guía" onClick={onClose}><X size={17}/></button></div>
 </section>;
}
