'use client';
import {useEffect} from 'react';

// Keeps word tips inside the screen: when a tip would spill past either edge, slide it back in.
export function TermFit(){
  useEffect(()=>{
    const fit=(e:Event)=>{
      const term=(e.target as Element|null)?.closest?.('.term');const tip=term?.querySelector<HTMLElement>('.term-tip');
      if(!tip)return;
      tip.style.setProperty('--shift','0px');
      requestAnimationFrame(()=>{const r=tip.getBoundingClientRect(),pad=12,w=document.documentElement.clientWidth;
        const shift=r.left<pad?pad-r.left:r.right>w-pad?w-pad-r.right:0;tip.style.setProperty('--shift',`${shift}px`);});
    };
    document.addEventListener('mouseover',fit);document.addEventListener('focusin',fit);
    return ()=>{document.removeEventListener('mouseover',fit);document.removeEventListener('focusin',fit);};
  },[]);
  return null;
}
