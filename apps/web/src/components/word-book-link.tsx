'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {dueWords,WORDS_EVENT} from '@/lib/words';
import {loadLocal} from '@/lib/word-store';

// A link to the word book that shows how many words are waiting for review. The count is read after the page
// loads (the words live in this browser), and goes up as soon as the reader opens another word's meaning.
export function WordBookLink({loc,className='text-link'}:{loc:'ko'|'en';className?:string}){
  const [n,setN]=useState<{all:number;due:number}|null>(null);
  useEffect(()=>{
    const read=()=>{const list=loadLocal();setN({all:list.length,due:dueWords(list).length});};
    read();window.addEventListener(WORDS_EVENT,read);window.addEventListener('storage',read);
    return ()=>{window.removeEventListener(WORDS_EVENT,read);window.removeEventListener('storage',read);};
  },[]);
  const en=loc==='en';
  const label=en?'Word book':'단어장';
  const extra=n&&n.all>0?(n.due>0?(en?` · ${n.due} to review`:` · 복습 ${n.due}`):(en?` · ${n.all}`:` · ${n.all}개`)):'';
  return <Link className={`${className} word-book-link`} href="/my/words" aria-live="polite">{label}<span className="word-book-count">{extra}</span> →</Link>;
}
