'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

// Elements that rise in as they scroll into view. Anything already on screen at load stays put (no flash).
const REVEAL=['.how-columns article','.closing-note','.hero-paper-frame','.nl-cards article','.nl-more li','.nl-aside','.nl-think','.nl-foot',
  '.explainer-page','.glossary','.sources li','.delivery-card','.archive-list li','.industry-choice','.level-choice','.region-choice','.plan-card','.inbox-row','.theme-choice'].join(',');
export function MotionLayer(){
  const pathname=usePathname();
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    document.documentElement.classList.add('motion');
    const pending=new Set<HTMLElement>(),seen=new WeakSet<Element>();
    // Reveal everything whose top has crossed the lower edge of the viewport; fast scrolls never skip an element.
    const reveal=()=>pending.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.94){el.classList.add('is-in');pending.delete(el);}});
    const scan=()=>{document.querySelectorAll<HTMLElement>(REVEAL).forEach(el=>{
      if(seen.has(el))return;seen.add(el);
      if(el.getBoundingClientRect().top<innerHeight)return;
      // Stagger siblings so rows of cards arrive one after another.
      const i=Array.prototype.indexOf.call(el.parentElement?.children||[],el);
      el.style.setProperty('--reveal-delay',`${Math.min(Math.max(i,0),6)*70}ms`);
      el.setAttribute('data-reveal','');pending.add(el);
    });};
    let frame=0;const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(reveal);};
    scan();
    // Builder steps and client navigations add new elements after the first paint.
    const mo=new MutationObserver(()=>scan());mo.observe(document.body,{childList:true,subtree:true});
    addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
    return ()=>{mo.disconnect();removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll);cancelAnimationFrame(frame);};
  },[pathname]);
  return null;
}
