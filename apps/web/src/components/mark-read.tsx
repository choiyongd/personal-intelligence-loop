'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {markEditionRead} from '@/app/beta-actions';

// Opening a scheduled edition marks it read, then refreshes so the header badge drops.
export function MarkRead({editionKey,unread}:{editionKey:string;unread:boolean}){
  const router=useRouter();
  useEffect(()=>{if(unread)markEditionRead(editionKey).then(()=>router.refresh());},[editionKey,unread,router]);
  return null;
}
