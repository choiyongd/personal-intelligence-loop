// Labels for the share buttons, kept outside the client component so server pages can pass them in.
export type ShareText={label:string;copy:string;copied:string;copyFailed:string;kakao:string;x:string;more:string;button:string};
export const shareText=(en:boolean):ShareText=>en
  ?{label:'Share',copy:'Copy link',copied:'Link copied.',copyFailed:'Select the link below and copy it.',kakao:'KakaoTalk',x:'Post on X',more:'More…',button:'Read the story'}
  :{label:'공유하기',copy:'링크 복사',copied:'링크를 복사했어요.',copyFailed:'아래 링크를 길게 눌러 복사해 주세요.',kakao:'카카오톡',x:'X에 올리기',more:'다른 앱으로',button:'기사 읽기'};
// A Kakao JavaScript key is public by design (it only works on the domains registered in Kakao Developers).
export const kakaoKey=()=>process.env.NEXT_PUBLIC_KAKAO_JS_KEY||undefined;
