import {chooseTheme} from '@/app/beta-actions';
import Link from 'next/link';
import {themes,themesEn,type Theme} from '@/lib/newsletter';

// One-tap look switcher shown above a newsletter; each button submits its own theme.
export function ThemePicker({current,loc='ko'}:{current:Theme;loc?:'ko'|'en'}){
  const en=loc==='en';
  return <form action={chooseTheme} className="theme-picker" aria-label={en?'Newsletter design':'뉴스레터 디자인'}>
    <span className="theme-picker-label">{en?'Design':'디자인'}</span>
    {themes.map(([id,koLabel,koHint])=>{const [label,hint]=en?themesEn[id]:[koLabel,koHint];return <button key={id} name="theme" value={id} className={`theme-swatch theme-swatch-${id}`} aria-pressed={current===id} title={hint}><i aria-hidden="true"/>{label}</button>;})}
  </form>;
}

export function ThemeLinks({current,loc='ko',hrefFor}:{current:Theme;loc?:'ko'|'en';hrefFor:(theme:Theme)=>string}){
  const en=loc==='en';
  return <nav className="theme-picker" aria-label={en?'Newsletter design':'뉴스레터 디자인'}>
    <span className="theme-picker-label">{en?'Design':'디자인'}</span>
    {themes.map(([id,koLabel,koHint])=>{
      const [label,hint]=en?themesEn[id]:[koLabel,koHint];
      return <Link key={id} href={hrefFor(id)} scroll={false} aria-current={current===id?'true':undefined}
        className={`theme-swatch theme-swatch-${id}`} title={hint}><i aria-hidden="true"/>{label}</Link>;
    })}
  </nav>;
}
