'use client';
import {useEffect} from 'react';

// Shows a word's meaning in one floating layer attached to <body>, above every page section, so containers that
// clip their content (newsletter paper, article card) can never cut it off. It sits above the word, or below it
// when there is no room above, and is kept inside the screen. Without script the inline CSS tip still works.
export function TermFit(){
  useEffect(()=>{
    document.documentElement.classList.add('term-layer');
    let layer=document.getElementById('term-layer');
    if(!layer){layer=document.createElement('div');layer.id='term-layer';layer.setAttribute('role','tooltip');document.body.appendChild(layer);}
    const box=layer;let current:Element|null=null;
    const hide=()=>{current=null;box.classList.remove('show');};
    const show=(term:Element):void=>{
      const tip=term.querySelector('.term-tip');if(!tip)return;
      current=term;box.innerHTML=tip.innerHTML;box.classList.add('show');
      const t=term.getBoundingClientRect(),b=box.getBoundingClientRect(),pad=12,gap=10,w=document.documentElement.clientWidth;
      const left=Math.min(Math.max(pad,t.left+t.width/2-b.width/2),w-pad-b.width);
      const above=t.top-gap-b.height>=pad;
      box.style.left=`${left}px`;box.style.top=`${above?t.top-gap-b.height:t.bottom+gap}px`;box.dataset.side=above?'top':'bottom';
    };
    const over=(e:Event)=>{const term=(e.target as Element|null)?.closest?.('.term');if(term&&term!==current)show(term);else if(!term&&e.type==='mouseover'&&current)hide();};
    const out=(e:FocusEvent)=>{if(current&&!(e.relatedTarget as Element|null)?.closest?.('.term'))hide();};
    document.addEventListener('mouseover',over);document.addEventListener('focusin',over);document.addEventListener('focusout',out);
    // Follow the word while the page scrolls; hide once it leaves the screen.
    const follow=()=>{if(!current)return;const r=current.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight)hide();else show(current);};
    window.addEventListener('scroll',follow,{passive:true});window.addEventListener('resize',follow);
    return ()=>{document.removeEventListener('mouseover',over);document.removeEventListener('focusin',over);document.removeEventListener('focusout',out);window.removeEventListener('scroll',follow);window.removeEventListener('resize',follow);};
  },[]);
  return null;
}
