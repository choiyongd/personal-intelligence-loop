import {chooseTheme} from '@/app/beta-actions';
import {themes,type Theme} from '@/lib/newsletter';

// One-tap look switcher shown above a newsletter; each button submits its own theme.
export function ThemePicker({current}:{current:Theme}){
  return <form action={chooseTheme} className="theme-picker" aria-label="뉴스레터 디자인">
    <span className="theme-picker-label">디자인</span>
    {themes.map(([id,label,hint])=><button key={id} name="theme" value={id} className={`theme-swatch theme-swatch-${id}`} aria-pressed={current===id} title={hint}><i aria-hidden="true"/>{label}</button>)}
  </form>;
}
