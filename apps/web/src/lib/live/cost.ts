// What each Claude call cost, so the operator can see spend per article and per day.
// Dollars per million tokens (Claude API list prices, checked 2026-11). Unknown models are logged without a price.
const PRICES:Record<string,{input:number;output:number}>={
  'claude-opus-5-5':{input:4,output:20},'claude-opus-5':{input:5,output:25},
  'claude-sonnet-5-5':{input:2,output:10},'claude-sonnet-5':{input:2,output:10},
  'claude-haiku-5-5':{input:0.1,output:0.5},'claude-fable-5-1':{input:10,output:50},
};
export type CallUsage={model:string;input:number;output:number;cacheRead:number;cacheWrite:number;usd:number|null};
type RawUsage={input_tokens?:number|null;output_tokens?:number|null;cache_read_input_tokens?:number|null;cache_creation_input_tokens?:number|null};
export function callUsage(model:string,u:RawUsage|null|undefined):CallUsage{
  const input=u?.input_tokens||0,output=u?.output_tokens||0,cacheRead=u?.cache_read_input_tokens||0,cacheWrite=u?.cache_creation_input_tokens||0;
  const p=PRICES[model]??PRICES[model.replace(/-\d{8}$/,'')];
  // Cache reads bill at a tenth of input, cache writes at 1.25x.
  const usd=p?Math.round(((input+cacheWrite*1.25+cacheRead*0.1)*p.input+output*p.output)/1e6*1e5)/1e5:null;
  return {model,input,output,cacheRead,cacheWrite,usd};
}
export function addUsage(list:CallUsage[]){
  return {calls:list.length,input:list.reduce((n,u)=>n+u.input+u.cacheRead+u.cacheWrite,0),output:list.reduce((n,u)=>n+u.output,0),
    usd:list.some(u=>u.usd===null)?null:Math.round(list.reduce((n,u)=>n+(u.usd||0),0)*1e5)/1e5};
}
