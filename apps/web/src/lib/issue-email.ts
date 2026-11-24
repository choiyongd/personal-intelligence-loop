import {wordsPerLevel,contentLabel,countryName,industryName,levelLabel,regionLabel,scheduleLabel,type NewsletterSelection} from './newsletter';
import {localize,type Article} from './articles';
import {lx,type Locale} from './i18n';
import {fill,josa,lensFor,shortTitle} from './discussion';
import {operatorLine,operator} from './operator';
import {newsletterPalettes,newsletterPhoto} from './newsletter-design';

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const font="font-family:'Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif;";
// Article type is Pretendard; mail clients that cannot load it fall back to the system Korean sans.
const serif="font-family:'Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif;";

// Table layout with inline styles: mail clients ignore stylesheets and most modern CSS.
export function renderIssueEmail({selection,articles:raw,hotIds=[],origin,dateLabel,readerName,unsubscribeUrl,archiveUrl}:{selection:NewsletterSelection;articles:Article[];hotIds?:string[];origin:string;dateLabel:string;readerName:string;unsubscribeUrl:string;archiveUrl:string}){
  const loc=selection.lang,L=lx(loc),en=loc==='en';
  const theme=selection.theme??'magazine';
  const {paper,ink,muted,rule,accent,card,cardAlt}=newsletterPalettes[theme];
  const headlineFont="font-family:'Noto Serif KR',Batang,Georgia,serif;";
  const articles=raw.map(a=>localize(a,loc));
  const link=(a:Article)=>`${origin}/article/${a.id}?level=${selection.level}`;
  const cat=(a:Article)=>`${contentLabel(a.type,loc)} · ${industryName(a.industry,loc)}${a.regions.filter(r=>r!=='GLOBAL').length?' · '+a.regions.filter(r=>r!=='GLOBAL').slice(0,3).map(r=>countryName(r,loc)).join(', '):''}`;
  // Widening prompts and talk topics, one per field, mirroring the end of the web edition.
  const short=shortTitle;
  const byField=articles.filter((a,i)=>articles.findIndex(b=>b.industry===a.industry)===i).slice(0,2);
  const widen=[...byField.map(a=>fill(lensFor(a.industry,loc).world,short(a.title))),byField[0]?lensFor(byField[0].industry,loc).personal:''].filter(Boolean);
  const talks=byField.map((a,i)=>{const m=lensFor(a.industry,loc).motions[i%2];return {t:short(a.title),motion:m[0],pro:m[1],con:m[2]};});
  const label=(t:string)=>`<div style="${font}font-size:12px;font-weight:700;color:${accent};margin:16px 0 6px">${t}</div>`;
  const words=selection.terms==='off'?[]:articles.flatMap(a=>a.glossary.slice(0,2)).filter((g,i,l)=>l.findIndex(x=>x.term===g.term)===i).slice(0,Math.min(6,wordsPerLevel[selection.level]));
  const wordsHtml=words.length?`${label(L('이번 호의 낱말','Words in this issue'))}${words.map(w=>`<div style="font-size:14px;line-height:1.6;margin:0 0 6px"><b>${esc(w.term)}</b> <span style="color:${muted}">${esc(w.meaning)}</span></div>`).join('')}`:'';
  const widenHtml=widen.length?`${label(L('생각 넓히기','Think wider'))}<ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7">${widen.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`:'';
  const talkHtml=talks.length?`${label(L('함께 이야기해 볼 주제','Talk it over'))}${talks.map(t=>`<div style="border-left:1px solid ${accent};padding:6px 0 6px 12px;margin:0 0 10px;font-size:14px;line-height:1.6"><b>“${esc(t.motion)}”</b><br><span style="color:${muted}">${en?`After “${esc(t.t)}” · For: ${esc(t.pro)} / Against: ${esc(t.con)}`:`${esc(josa(`‘${t.t}’`,'을를'))} 읽고 · 찬성: ${esc(t.pro)} / 반대: ${esc(t.con)}`}</span></div>`).join('')}`:'';
  const [lead,...rest]=articles;
  const photo=newsletterPhoto(theme,lead.id);
  const excerpt=selection.level==='intro'?lead.pages[0]?.easy:lead.pages[0]?.paragraphs[0];
  const hotLabel=(a:Article)=>hotIds.includes(a.id)?`<strong style="color:${accent};margin-right:8px">${L('세계의 화제','Global hot')}</strong>`:'';
  const storyRow=(a:Article,index:number)=>`<tr><td bgcolor="${index%2?cardAlt:card}" style="background:${index%2?cardAlt:card};border-top:1px solid ${rule};padding:12px 14px"><div style="font-size:12px;color:${muted}">${hotLabel(a)}${esc(cat(a))}</div><a href="${esc(link(a))}" style="display:block;margin:5px 0;${headlineFont}font-size:18px;line-height:1.45;font-weight:700;color:${ink};text-decoration:none">${esc(a.title)}</a><div style="font-size:14px;line-height:1.65;color:${ink}">${esc(a.dek)}</div></td></tr>`;
  const sourceLinks=lead.sources.flatMap((source,index)=>{
    try{
      const url=new URL(source.url);
      if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return [];
      return [`<li value="${index+1}"><a href="${esc(url.href)}" style="color:${accent};text-decoration:underline">${esc(source.publisher+' · '+source.title)}</a></li>`];
    }catch{return [];}
  });
  const html=`<!doctype html><html lang="${loc}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(selection.name)}</title></head>
<body style="margin:0;padding:0;background:${paper}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${paper}"><tr><td align="center" style="padding:18px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${paper}" style="max-width:680px;background:${paper};color:${ink};${font}">
<tr><td style="padding:16px 22px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${theme==='magazine'?accent:rule}">
<tr><td style="${theme==='magazine'||theme==='night'?headlineFont:font}font-size:36px;font-weight:700;letter-spacing:-.07em;padding-bottom:12px;color:${ink}">loop.</td><td align="right" style="font-size:12px;line-height:1.5;color:${muted};padding-bottom:12px"><strong style="color:${ink}">${esc(selection.name)}</strong><br>${esc(dateLabel)} · ${esc(regionLabel(selection,loc))}</td></tr>
</table></td></tr>
<tr><td style="padding:24px 22px 14px;color:${ink}"><div style="font-size:12px;color:${muted}">${hotLabel(lead)}${esc(cat(lead))}</div>
<h1 style="margin:6px 0 8px;${headlineFont}font-size:27px;line-height:1.35;font-weight:700"><a href="${esc(link(lead))}" style="color:${ink};text-decoration:none">${esc(lead.title)}</a></h1>
<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:${muted}">${esc(lead.dek)}</p>
${photo?`<img src="${esc(photo.src)}" width="580" alt="${esc(L(photo.ko,photo.en))}" style="display:block;width:100%;height:auto;max-width:580px"><p style="margin:6px 0 12px;font-size:12px;color:${muted}">${esc(L(photo.ko,photo.en))} · <a style="color:${accent}" href="${esc(photo.creditUrl??photo.source)}">${esc(photo.credit)}</a> · <a style="color:${accent}" href="${esc(photo.licenseUrl??photo.source)}">${esc(photo.license)}</a>${photo.creditUrl?` · <a style="color:${accent}" href="${esc(photo.source)}">${L('사진 원본','Original photo')}</a>`:''}</p>`:''}
${excerpt&&excerpt!==lead.dek?`<p style="margin:0 0 12px;${headlineFont}font-size:15px;line-height:1.7">${esc(excerpt)}</p>`:''}
<a href="${esc(link(lead))}" style="font-size:13px;font-weight:700;color:${accent};text-decoration:underline">${L('전문 읽기 →','Read the full story →')}</a></td></tr>
${rest.length?`<tr><td style="padding:12px 22px 14px"><h2 style="margin:0 0 8px;${headlineFont}font-size:18px;color:${ink}">${L('함께 읽을 이야기','More to read')}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rest.map(storyRow).join('')}</table></td></tr>`:''}
${sourceLinks.length?`<tr><td style="padding:10px 22px 14px"><div style="border-top:1px solid ${rule};padding-top:12px;color:${ink}"><strong style="font-size:13px;color:${accent}">${L('근거 출처','Sources')}</strong><ol style="margin:7px 0 0;padding-left:22px;font-size:13px;line-height:1.7">${sourceLinks.join('')}</ol></div></td></tr>`:''}
<tr><td style="padding:6px 22px 22px"><div style="border-top:1px solid ${rule};padding-top:12px;color:${ink}">
<h2 style="margin:0 0 8px;${headlineFont}font-size:18px">${L('생각거리','Think it over')}</h2><ol style="margin:0;padding-left:18px;font-size:14px;line-height:1.7">${lead.questions.slice(0,3).map(q=>`<li>${esc(q)}</li>`).join('')}</ol>${widenHtml}${talkHtml}${wordsHtml}</div></td></tr>
<tr><td style="padding:12px 22px 24px;color:${muted};font-size:12px;line-height:1.65"><div style="border-top:1px solid ${rule};padding-top:12px">
${en?`${esc(readerName)}, you get this ${esc(scheduleLabel(selection))} because you signed up at loop.`:`${esc(readerName)}님이 신청하신 뉴스레터를 ${esc(scheduleLabel(selection))}에 보내드립니다.`}<br>
<a href="${esc(archiveUrl)}" style="color:${accent}">${L('앱 메일함에서 다시 보기','View in your mailbox')}</a> · <a href="${esc(unsubscribeUrl)}" style="color:${accent}">${L('수신 거부','Unsubscribe')}</a> · <a href="${esc(origin+'/privacy')}" style="color:${accent}">${L('개인정보 처리방침','Privacy policy')}</a> · <a href="${esc(origin+'/feedback?from=mail')}" style="color:${accent}">${L('의견 보내기','Send feedback')}</a><br>${esc(operatorLine(operator(),loc))}
</div></td></tr></table></td></tr></table></body></html>`;
  const text=[`${selection.name} · ${dateLabel}`,'',...articles.map((a,i)=>`${i+1}. ${a.title}\n   ${a.dek}\n   ${link(a)}`),'',L('생각해 볼 질문','Questions to consider'),...lead.questions.slice(0,3).map(q=>`- ${q}`),'',L('생각 넓히기','Think wider'),...widen.map(q=>`- ${q}`),'',L('함께 이야기해 볼 주제','Talk it over'),...talks.map(t=>en?`- “${t.motion}” (For: ${t.pro} / Against: ${t.con})`:`- “${t.motion}” (찬성: ${t.pro} / 반대: ${t.con})`),'',...(words.length?[L('이번 호의 낱말','Words in this issue'),...words.map(w=>`- ${w.term}: ${w.meaning}`),'']:[]),`${L('지난 호','Past issues')}: ${archiveUrl}`,`${L('수신 거부','Unsubscribe')}: ${unsubscribeUrl}`,`${L('의견 보내기','Send feedback')}: ${origin}/feedback?from=mail`,`${L('개인정보 처리방침','Privacy policy')}: ${origin}/privacy`,operatorLine(operator(),loc)].join('\n');
  return {subject:`[${selection.name}] ${lead.title}`.slice(0,140),html,text};
}
export function renderConfirmEmail({name,confirmUrl,promise,lang='ko'}:{name:string;confirmUrl:string;promise:string;lang?:Locale}){
  const sender=esc(operatorLine(operator(),lang));
  if(lang==='en'){
    const html=`<!doctype html><html lang="en"><body style="margin:0;background:#e9e5dd"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:6px"><tr><td bgcolor="#1c1b19" style="background:#1c1b19;padding:26px;${serif}font-size:28px;color:#fff">loop.</td></tr><tr><td style="padding:26px;${font}font-size:15px;line-height:1.7;color:#1c1b19">Hi ${esc(name)}, to get your newsletter at this address, please press the button below.<br>Once you confirm, we will send you <b>${esc(promise)}</b>. If you made an edition before confirming, a copy goes out right away.<br><br><a href="${confirmUrl}" style="display:inline-block;background:#ee6f3c;color:#fff;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:4px">Confirm my email</a><br><br><span style="font-size:12px;color:#6e6a63">If you did not sign up, ignore this message. Nothing will be sent unless you confirm.<br>From: ${sender}</span></td></tr></table></td></tr></table></body></html>`;
    return {subject:'[loop.] Please confirm your newsletter email',html,text:`Hi ${name}, open the link below and we will send you ${promise} by email.\n${confirmUrl}\nIf you did not sign up, ignore this message.\nFrom: ${operatorLine(operator(),'en')}`};
  }
  const html=`<!doctype html><html lang="ko"><body style="margin:0;background:#e9e5dd"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:6px"><tr><td bgcolor="#1c1b19" style="background:#1c1b19;padding:26px;${serif}font-size:28px;color:#fff">loop.</td></tr><tr><td style="padding:26px;${font}font-size:15px;line-height:1.7;color:#1c1b19">${esc(name)}님, 뉴스레터를 이 주소로 받으려면 아래 버튼을 눌러 주세요.<br>확인하면 <b>${esc(promise)}</b> 메일로 보내드립니다. 확인 전에 만든 호가 있으면 바로 한 부 보내드려요.<br><br><a href="${confirmUrl}" style="display:inline-block;background:#ee6f3c;color:#fff;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:4px">메일 받기 확인</a><br><br><span style="font-size:12px;color:#6e6a63">직접 신청하지 않았다면 이 메일을 무시하세요. 확인하지 않으면 아무 메일도 보내지 않습니다.<br>보내는 곳: ${sender}</span></td></tr></table></td></tr></table></body></html>`;
  return {subject:'[loop.] 뉴스레터 메일 수신을 확인해 주세요',html,text:`${name}님, 아래 주소를 열면 ${promise} 뉴스레터를 메일로 보내드립니다.\n${confirmUrl}\n직접 신청하지 않았다면 무시하세요.\n보내는 곳: ${operatorLine()}`};
}
