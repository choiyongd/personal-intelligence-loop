// Browser side of the word book. Words always live in this browser's localStorage, so the book works for every
// visitor; a reader who has a server account also gets them saved on the server through /api/words.
import {cleanWords,mergeWords,WORDS_EVENT,WORDS_KEY,type Word} from './words';

const SYNC_OFF='pil_words_sync_off';
export function loadLocal():Word[]{
  try{return cleanWords(JSON.parse(localStorage.getItem(WORDS_KEY)||'[]'));}catch{return [];}
}
export function saveLocal(list:Word[]){
  try{localStorage.setItem(WORDS_KEY,JSON.stringify(list));}catch{/* storage full or blocked: keep going in memory */}
  try{window.dispatchEvent(new CustomEvent(WORDS_EVENT,{detail:list.length}));}catch{}
}
// Remembered per tab, so visitors without a server account do not send a request for every word.
const syncOff=()=>{try{return sessionStorage.getItem(SYNC_OFF)==='1';}catch{return false;}};
const markSync=(on:boolean)=>{try{if(on)sessionStorage.removeItem(SYNC_OFF);else sessionStorage.setItem(SYNC_OFF,'1');}catch{}};

export async function pushWords(words:Word[],keepalive=false){
  if(!words.length||syncOff())return;
  try{
    const res=await fetch('/api/words',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({words}),keepalive});
    const body=await res.json().catch(()=>null) as {sync?:boolean}|null;
    if(body&&body.sync===false)markSync(false);
  }catch{/* offline: the words stay in this browser and go up on the next visit to the word book */}
}
// Merges the server copy into this browser and sends back whatever the server lacks. Returns the merged list.
export async function syncAll(local:Word[]):Promise<{list:Word[];synced:boolean}>{
  try{
    const res=await fetch('/api/words',{cache:'no-store'});
    const body=await res.json() as {sync:boolean;words?:unknown};
    markSync(body.sync);
    if(!body.sync)return {list:local,synced:false};
    const merged=mergeWords(cleanWords(body.words),local);
    saveLocal(merged);
    await pushWords(merged);
    return {list:merged,synced:true};
  }catch{return {list:local,synced:false};}
}
export async function deleteRemote(word:Pick<Word,'term'|'lang'>){
  if(syncOff())return;
  try{await fetch('/api/words',{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({term:word.term,lang:word.lang})});}catch{}
}
