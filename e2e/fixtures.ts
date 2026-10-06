import {test as base,expect} from '@playwright/test';

// Existing operational scenarios use examples; switching to Trabajo remains persistent.
export const test=base.extend({
  context:async({context},use)=>{
    await context.addInitScript(()=>{
      if(!sessionStorage.getItem('quote-assistant-space-v1'))sessionStorage.setItem('quote-assistant-space-v1','demo');
    });
    await use(context);
  },
});
export {expect};
