import {ogImage} from '@/lib/og';

// Preview image for the home page and friend invites.
export async function GET(request:Request){
  const en=new URL(request.url).searchParams.get('lang')==='en';
  return ogImage(en
    ?{kicker:'A PERSONAL NEWSLETTER',title:'Your interests, on one page.',dek:'Sourced explainers on the fields you choose, written at your level.',foot:'Free during the beta',en}
    :{kicker:'나만의 뉴스레터',title:'당신의 관심이, 하나의 지면으로.',dek:'고른 분야의 변화를 출처 붙은 해설로, 내 수준에 맞춰 받아 보세요.',foot:'베타 기간 무료'});
}
