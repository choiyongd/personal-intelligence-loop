import type {ReactNode} from 'react';

// One illustration per edition, drawn from the cover story's field and seeded by the edition, so every issue
// gets its own picture without stock photos. Colours come from the newsletter theme (CSS variables).
const A='var(--mg-accent)',L='var(--art-line)',D='var(--art-deep)',S='var(--art-soft)',I='var(--art-ink)';
function rng(seed:string){let h=2166136261;for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
  return ()=>{h+=0x6d2b79f5;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
type R=()=>number;
const range=(n:number)=>Array.from({length:n},(_,i)=>i);
const between=(r:R,a:number,b:number)=>a+(b-a)*r();

const motifs:Record<string,(r:R)=>ReactNode>={
  technology:r=>{const x=220+between(r,-30,30),y=130+between(r,-20,20),w=160;return <>
    {range(9).map(i=><path key={'h'+i} d={`M0 ${60+i*40} H${x-20} l20 ${i%2?14:-14} H${x+w+40} l20 ${i%2?-14:14} H600`} stroke={L} strokeWidth="2" fill="none"/>)}
    {range(9).map(i=><circle key={'n'+i} cx={between(r,40,560)} cy={60+i*40} r="5" fill={i%3===0?A:L}/>)}
    <rect x={x} y={y} width={w} height={w} rx="14" fill={D}/><rect x={x+26} y={y+26} width={w-52} height={w-52} rx="6" fill={A}/>
    {range(6).map(i=><rect key={'p'+i} x={x+18+i*24} y={y-14} width="10" height="14" fill={L}/>)}{range(6).map(i=><rect key={'q'+i} x={x+18+i*24} y={y+w} width="10" height="14" fill={L}/>)}
    {range(3).map(i=><rect key={'g'+i} x={x+44} y={y+46+i*24} width={w-88-i*18} height="8" rx="4" fill={D} opacity=".55"/>)}</>;},
  business:r=>{let x=30;const bars=range(12).map(i=>{const w=between(r,26,44),h=between(r,90,250);const b=<rect key={i} x={x} y={380-h} width={w} height={h} fill={i%4===1?A:D} opacity={i%4===1?1:.85}/>;x+=w+8;return b;});
    const pts=range(7).map(i=>`${40+i*88},${300-i*34+between(r,-24,24)}`).join(' ');return <>{bars}
    {range(14).map(i=><rect key={'w'+i} x={between(r,40,560)} y={between(r,180,360)} width="6" height="9" fill={L} opacity=".7"/>)}
    <polyline points={pts} fill="none" stroke={I} strokeWidth="5" strokeLinejoin="round"/><path d="M560 92 l26 -6 -10 24 z" fill={I}/></>;},
  science:r=>{const cx=300+between(r,-60,60),cy=210;const hex=(x:number,y:number,s:number)=>range(6).map(k=>{const a=Math.PI/3*k+Math.PI/6;return `${x+s*Math.cos(a)},${y+s*Math.sin(a)}`;}).join(' ');
    const cells=[[0,0],[1,0],[-1,0],[.5,.87],[-.5,.87],[.5,-.87],[1.5,.87]];return <>
    {range(40).map(i=><circle key={'s'+i} cx={between(r,10,590)} cy={between(r,10,410)} r={between(r,1,2.6)} fill={L}/>)}
    {cells.map(([u,v],i)=><polygon key={i} points={hex(cx+u*104,cy+v*104,58)} fill={i===0?A:'none'} stroke={i===0?A:I} strokeWidth="5"/>)}
    {cells.map(([u,v],i)=><circle key={'a'+i} cx={cx+u*104} cy={cy+v*104} r="9" fill={i===0?S:D}/>)}</>;},
  energy:r=>{const sx=between(r,90,190);return <>
    <circle cx={sx} cy="110" r="52" fill={A}/>{range(12).map(i=>{const a=Math.PI/6*i;return <line key={i} x1={sx+Math.cos(a)*70} y1={110+Math.sin(a)*70} x2={sx+Math.cos(a)*90} y2={110+Math.sin(a)*90} stroke={A} strokeWidth="5" strokeLinecap="round"/>;})}
    <path d={`M0 330 Q150 ${between(r,250,290)} 300 310 T600 ${between(r,270,300)} V420 H0Z`} fill={D}/><path d="M0 370 Q200 330 400 360 T600 350 V420 H0Z" fill={S} opacity=".5"/>
    {[0,1,2].map(i=>{const x=330+i*90,y=300-i*12,h=150-i*20,rot=between(r,0,120);return <g key={i}><line x1={x} y1={y} x2={x} y2={y-h} stroke={I} strokeWidth="6"/>
      <g transform={`rotate(${rot} ${x} ${y-h})`}>{[0,120,240].map(a=><path key={a} transform={`rotate(${a} ${x} ${y-h})`} d={`M${x} ${y-h} q8 -30 0 -70 q-8 40 0 70z`} fill={I}/>)}</g><circle cx={x} cy={y-h} r="7" fill={A}/></g>;})}</>;},
  health:r=>{const y=230;let d=`M0 ${y}`;let x=0;while(x<600){const beat=r()<.35;d+=beat?` L${x+30} ${y} l14 -70 l16 120 l14 -80 l10 30`:` L${x+84} ${y}`;x+=84;}
    return <><rect x="0" y="0" width="600" height="420" fill="none"/>{range(12).map(i=><line key={i} x1={i*50} y1="0" x2={i*50} y2="420" stroke={L} strokeWidth="1" opacity=".5"/>)}{range(9).map(i=><line key={'h'+i} x1="0" y1={i*50} x2="600" y2={i*50} stroke={L} strokeWidth="1" opacity=".5"/>)}
    <path d={d} fill="none" stroke={A} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
    <g transform={`translate(${between(r,420,500)} 70)`}><rect x="30" y="0" width="34" height="94" rx="6" fill={I}/><rect x="0" y="30" width="94" height="34" rx="6" fill={I}/></g></>;},
  finance:r=>{let p=300;const c=range(16).map(i=>{const o=p,cl=Math.max(80,Math.min(360,p+between(r,-50,40)));p=cl;const up=cl<o,x=30+i*35;return <g key={i}>
    <line x1={x+10} y1={Math.min(o,cl)-between(r,10,30)} x2={x+10} y2={Math.max(o,cl)+between(r,10,30)} stroke={I} strokeWidth="3"/><rect x={x} y={Math.min(o,cl)} width="20" height={Math.max(6,Math.abs(cl-o))} fill={up?A:D}/></g>;});
    return <>{range(6).map(i=><line key={i} x1="0" y1={70+i*60} x2="600" y2={70+i*60} stroke={L} strokeDasharray="4 8"/>)}{c}</>;},
  design:r=>{const n=5;return <>{range(n).map(i=>{const x=40+i*108,h=between(r,170,260);return <g key={i}><path d={`M${x} 380 V${380-h+44} a44 44 0 0 1 88 0 V380`} fill={i===Math.floor(r()*n)?A:D}/><path d={`M${x+18} 380 V${380-h+62} a26 26 0 0 1 52 0 V380`} fill={S} opacity=".55"/></g>;})}
    <rect x="0" y="380" width="600" height="40" fill={I}/></>;},
  policy:r=>{const cols=6;return <><path d="M80 150 L300 60 L520 150Z" fill={A}/><rect x="80" y="150" width="440" height="20" fill={I}/>
    {range(cols).map(i=><rect key={i} x={110+i*70} y="180" width="30" height="150" rx="4" fill={D}/>)}<rect x="60" y="330" width="480" height="18" fill={I}/><rect x="40" y="348" width="520" height="18" fill={D}/><rect x="20" y="366" width="560" height="18" fill={I}/>
    {range(5).map(i=><circle key={'s'+i} cx={between(r,40,560)} cy={between(r,20,60)} r="3" fill={L}/>)}</>;},
  mobility:r=>{const vx=300+between(r,-40,40);return <><path d={`M${vx-14} 120 L${vx+14} 120 L600 420 L0 420Z`} fill={D}/>
    {range(6).map(i=>{const t=i/6,y1=130+t*290,y2=y1+20+t*30;return <path key={i} d={`M${vx-2-t*10} ${y1} L${vx+2+t*10} ${y1} L${vx+4+t*14} ${y2} L${vx-4-t*14} ${y2}Z`} fill={A}/>;})}
    <path d={`M0 118 H600`} stroke={L} strokeWidth="2"/><path d={`M${between(r,60,200)} 70 q120 -40 260 0`} stroke={I} strokeWidth="4" fill="none" strokeDasharray="10 10"/><path d="M470 60 l26 8 -26 8 6 -8z" fill={I}/></>;},
  food:r=>{return <><path d="M0 330 Q300 290 600 330 V420 H0Z" fill={D}/>{range(11).map(i=>{const x=40+i*52+between(r,-8,8),h=between(r,150,230),y=330;return <g key={i}><path d={`M${x} ${y} Q${x+between(r,-14,14)} ${y-h/2} ${x} ${y-h}`} stroke={I} strokeWidth="3" fill="none"/>
    {range(5).map(k=><ellipse key={k} cx={x+(k%2?7:-7)} cy={y-h+10+k*16} rx="6" ry="12" transform={`rotate(${k%2?25:-25} ${x+(k%2?7:-7)} ${y-h+10+k*16})`} fill={i%3===0?A:S}/>)}</g>;})}</>;},
  education:r=>{return <><path d="M300 330 Q200 290 70 300 V120 Q200 110 300 150Z" fill={S}/><path d="M300 330 Q400 290 530 300 V120 Q400 110 300 150Z" fill={S} opacity=".8"/>
    {range(6).map(i=><path key={i} d={`M95 ${150+i*26} Q190 ${142+i*24} 280 ${172+i*26}`} stroke={D} strokeWidth="3" fill="none" opacity=".6"/>)}
    {range(6).map(i=><path key={'r'+i} d={`M320 ${172+i*26} Q410 ${142+i*24} 505 ${150+i*26}`} stroke={D} strokeWidth="3" fill="none" opacity=".6"/>)}<line x1="300" y1="150" x2="300" y2="330" stroke={I} strokeWidth="4"/>
    {range(4).map(i=><path key={'k'+i} d={`M${between(r,180,420)} ${between(r,40,90)} l10 22 24 3 -18 16 5 24 -21 -12 -21 12 5 -24 -18 -16 24 -3z`} fill={A} transform={`scale(.7)`}/>)}</>;},
  entertainment:r=>{return <>{range(40).map(i=>{const h=between(r,20,260)*(i>12&&i<28?1:.55);return <rect key={i} x={20+i*14} y={210-h/2} width="8" height={h} rx="4" fill={i%7===3?A:D}/>;})}
    <circle cx="300" cy="210" r="62" fill={I}/><path d="M282 178 L330 210 L282 242Z" fill={A}/></>;},
  sports:r=>{const lanes=6;return <>{range(lanes+1).map(i=><path key={i} d={`M-40 ${250+i*26} Q300 ${40+i*26} 640 ${250+i*26}`} stroke={i===3?A:L} strokeWidth={i===3?8:4} fill="none"/>)}
    {range(lanes).map(i=><text key={'n'+i} x={30} y={258+i*26} fontSize="18" fontWeight="700" fill={I} opacity=".75">{i+1}</text>)}
    <circle cx={between(r,250,350)} cy={between(r,120,150)} r="16" fill={I}/><path d="M0 410 H600" stroke={L}/></>;},
  lifestyle:r=>{const sx=between(r,380,500);return <><circle cx={sx} cy="120" r="46" fill={A}/><path d={`M0 330 L150 ${between(r,140,190)} L250 260 L360 ${between(r,120,170)} L600 330 V420 H0Z`} fill={D}/>
    <path d="M0 360 L200 260 L320 330 L460 250 L600 340 V420 H0Z" fill={S} opacity=".7"/><path d={`M300 420 Q260 380 320 350 T340 290`} stroke={I} strokeWidth="5" fill="none" strokeDasharray="12 10"/></>;},
  environment:r=>{return <>{range(5).map(i=><path key={i} d={`M0 ${200+i*44} Q75 ${180+i*44+between(r,-12,12)} 150 ${200+i*44} T300 ${200+i*44} T450 ${200+i*44} T600 ${200+i*44} V420 H0Z`} fill={i%2?S:D} opacity={.35+i*.15}/>)}
    <g transform={`translate(${between(r,330,420)} 40) rotate(${between(r,-20,20)})`}><path d="M60 0 C130 30 130 120 60 160 C-10 120 -10 30 60 0Z" fill={A}/><line x1="60" y1="20" x2="60" y2="170" stroke={I} strokeWidth="4"/>{range(4).map(k=><line key={k} x1="60" y1={50+k*25} x2={k%2?92:28} y2={30+k*25} stroke={I} strokeWidth="3"/>)}</g></>;},
  career:r=>{const steps=6;return <>{range(steps).map(i=><rect key={i} x={60+i*80} y={360-(i+1)*44} width="80" height={(i+1)*44} fill={i===steps-1?A:D} opacity={i===steps-1?1:.6+i*.06}/>)}
    <line x1="540" y1="96" x2="540" y2="30" stroke={I} strokeWidth="4"/><path d="M540 30 h44 l-10 12 10 12 h-44z" fill={I}/>{range(8).map(i=><circle key={i} cx={between(r,40,300)} cy={between(r,40,160)} r="3" fill={L}/>)}</>;},
};
export function CoverArt({industry,seed,label}:{industry:string;seed:string;label:string}){
  const draw=motifs[industry]||motifs.business;const r=rng(seed);const id=`art${seed.replace(/[^a-zA-Z0-9]/g,'').slice(-16)}`;
  const tilt=between(r,-8,8);
  return <figure className="nl-cover-art"><svg viewBox="0 0 600 420" role="img" aria-label={`이번 호 대표 이미지: ${label}`} preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${tilt})`}><stop offset="0" stopColor="var(--art-bg1)"/><stop offset="1" stopColor="var(--art-bg2)"/></linearGradient></defs>
    <rect width="600" height="420" fill={`url(#${id})`}/>{draw(r)}</svg>
    <figcaption>{label}</figcaption></figure>;
}
