import {defineConfig} from '@playwright/test';

const browserPath=process.env.QUOTE_ASSISTANT_BROWSER_PATH;

export default defineConfig({
 testDir:'./e2e',
 timeout:30000,
 use:{
  baseURL:'http://127.0.0.1:5173',
  launchOptions:{...(browserPath?{executablePath:browserPath}:{}),args:['--no-sandbox']},
 },
 webServer:[
  {command:'npm run dev -- --port 5173 --strictPort',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI,timeout:60000},
  {command:'npm run build && npm run preview -- --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:120000},
 ],
 reporter:process.env.CI?[['list'],['html',{open:'never'}]]:'list',
 workers:1,
});
