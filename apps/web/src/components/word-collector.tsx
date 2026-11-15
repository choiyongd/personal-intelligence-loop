'use client';
import {useEffect} from 'react';
import {addSighting,type Word,type WordLang} from '@/lib/words';
import {loadLocal,pushWords,saveLocal} from '@/lib/word-store';

// Saves a marked word to the reader's word book once its meaning is opened: by tap or keyboard focus at once,
// or by resting the pointer on it for a moment (passing over a word on the way somewhere else does not count).
const HOVER_MS=700;
export function WordCollector({lang,articleId,articleTitle}:{lang:WordLang;articleId?:string;articleTitle?:string}){
  useEffect(()=>{
    const done=new Set<string>();
    let pending:Word[]=[],flush:number|undefined,hover:number|undefined,hovered:Element|null=null;
    const send=(keepalive=false)=>{const batch=pending;pending=[];if(batch.length)void pushWords(batch,keepalive);};
    const record=(el:Element)=>{
      const d=(el as HTMLElement).dataset,term=d.term,meaning=d.meaning;
      if(!term||!meaning||done.has(term))return;
      done.add(term);
      const id=d.article||articleId,title=d.article?d.title:articleTitle;
      const {list,word}=addSighting(loadLocal(),{term,meaning,lang,articleId:id,articleTitle:title});
      if(!word)return;
      saveLocal(list);
      pending.push(word);window.clearTimeout(flush);flush=window.setTimeout(()=>send(),1500);
    };
    const termOf=(e:Event)=>(e.target as Element|null)?.closest?.('.term[data-term]')||null;
    const now=(e:Event)=>{const t=termOf(e);if(t)record(t);};
    const over=(e:Event)=>{
      const t=termOf(e);if(t===hovered)return;
      window.clearTimeout(hover);hovered=t;
      if(t)hover=window.setTimeout(()=>record(t),HOVER_MS);
    };
    const leave=()=>{if(document.visibilityState==='hidden')send(true);};
    document.addEventListener('focusin',now);document.addEventListener('click',now);document.addEventListener('mouseover',over);
    document.addEventListener('visibilitychange',leave);
    return ()=>{
      document.removeEventListener('focusin',now);document.removeEventListener('click',now);document.removeEventListener('mouseover',over);
      document.removeEventListener('visibilitychange',leave);window.clearTimeout(hover);window.clearTimeout(flush);send(true);
    };
  },[lang,articleId,articleTitle]);
  return null;
}
