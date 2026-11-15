'use client';
import {useEffect} from 'react';
import {recordRead} from '@/app/beta-actions';

// Opening an article adds it to the reader's reading history (kept in this browser), which shapes their recommendations.
export function TrackRead({id}:{id:string}){
  useEffect(()=>{recordRead(id).catch(()=>undefined);},[id]);
  return null;
}
