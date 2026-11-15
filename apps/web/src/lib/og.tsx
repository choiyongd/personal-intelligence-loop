import 'server-only';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {ImageResponse} from 'next/og';

// Link-preview images (KakaoTalk, X, messengers) at the 1200×630 size every service accepts.
// Pretendard is trimmed to Latin plus the 2,350 common Hangul syllables so the image server stays small.
export const OG_SIZE={width:1200,height:630};
let fonts:Promise<{name:string;data:Buffer;weight:500|700;style:'normal'}[]>|null=null;
function loadFonts(){
  fonts??=Promise.all(([['Medium',500],['Bold',700]] as const).map(async([file,weight])=>({name:'Pretendard',data:await readFile(join(process.cwd(),`assets/og/Pretendard-${file}.subset.otf`)),weight,style:'normal' as const})));
  return fonts;
}
const cut=(s:string,n:number)=>[...s].length>n?[...s].slice(0,n-1).join('').trimEnd()+'…':s;

export async function ogImage({kicker,title,dek,foot,en}:{kicker:string;title:string;dek?:string;foot:string;en?:boolean}){
  const t=cut(title,64),size=[...t].length>40?60:[...t].length>24?70:80;
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'64px 76px',background:'#0d0d0e',color:'#fff',fontFamily:'Pretendard',position:'relative'}}>
      <div style={{position:'absolute',right:-180,top:-200,width:620,height:620,borderRadius:620,background:'radial-gradient(circle, rgba(147,149,255,.42) 0%, rgba(147,149,255,0) 70%)',display:'flex'}}/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',fontSize:40,fontWeight:700,letterSpacing:'-0.02em'}}>loop<span style={{color:'#9395ff'}}>.</span></div>
        <div style={{display:'flex',fontSize:24,fontWeight:500,color:'#9395ff',letterSpacing:'0.06em'}}>{cut(kicker,40)}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',fontSize:size,fontWeight:700,lineHeight:1.22,letterSpacing:'-0.03em',wordBreak:'keep-all',maxWidth:1040}}>{t}</div>
        {dek&&<div style={{display:'flex',marginTop:26,fontSize:28,fontWeight:500,lineHeight:1.5,color:'#b8b8c4',maxWidth:1000}}>{cut(dek,78)}</div>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'2px solid #2a2a31',paddingTop:24,fontSize:22,fontWeight:500,color:'#8c8c98'}}>
        <span>{foot}</span><span style={{color:'#c6c6cf'}}>{en?'From the source to your next thought.':'원문에서 다음 생각까지.'}</span>
      </div>
    </div>,
    {...OG_SIZE,fonts:await loadFonts(),headers:{'Cache-Control':'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'}}
  );
}
