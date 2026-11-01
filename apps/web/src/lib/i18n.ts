// Site languages. Korean is the original edition; English opens the service to US readers.
// Pure helpers only, so both server and client code can import this file.
export const locales=['ko','en'] as const;
export type Locale=typeof locales[number];
export const LANG_COOKIE='pil_lang';
export const isLocale=(v:unknown):v is Locale=>v==='ko'||v==='en';
// Inline translation: L('한국어','English') picks the text for the current language.
export function lx(loc:Locale){return <T,>(ko:T,en:T):T=>loc==='en'?en:ko;}
export const intlLocale=(loc:Locale)=>loc==='en'?'en-US':'ko-KR';
// The first language tag a browser asks for decides; anything other than Korean gets English.
export function preferredLocale(acceptLanguage:string|null|undefined):Locale{
  const first=(acceptLanguage||'').split(',')[0]?.trim().toLowerCase()||'';
  if(!first)return 'ko';
  return first.startsWith('ko')?'ko':'en';
}
