'use client';
import {useEffect} from 'react';

// Registers /sw.js on every page: it shows push notices and an offline page, and makes the site installable.
export function ServiceWorker(){
  useEffect(()=>{
    if(!('serviceWorker' in navigator))return;
    navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).catch(()=>{/* unsupported or blocked; the site works without it */});
  },[]);
  return null;
}
