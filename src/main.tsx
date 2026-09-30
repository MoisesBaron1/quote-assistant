import {createRoot} from 'react-dom/client';
import App from './App';
import './fonts.css';
if(import.meta.env.PROD&&'serviceWorker' in navigator){window.addEventListener('load',()=>{void navigator.serviceWorker.register('/sw.js').catch(()=>{/* The online app stays usable when offline caching is unavailable. */});});}
createRoot(document.getElementById('root')!).render(<App/>);
