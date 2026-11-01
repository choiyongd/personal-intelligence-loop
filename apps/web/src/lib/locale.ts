import 'server-only';
import {cookies,headers} from 'next/headers';
import {isLocale,LANG_COOKIE,lx,preferredLocale,type Locale} from './i18n';

// A language picked with the switcher wins; otherwise the browser's language decides.
export async function getLocale():Promise<Locale>{
  const picked=(await cookies()).get(LANG_COOKIE)?.value;
  if(isLocale(picked))return picked;
  return preferredLocale((await headers()).get('accept-language'));
}
export async function getL(){const loc=await getLocale();return {loc,L:lx(loc)};}
