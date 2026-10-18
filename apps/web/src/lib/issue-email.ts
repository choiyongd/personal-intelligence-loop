import {contentLabels,countryName,industryFor,levelLabel,regionLabel,scheduleLabel,type NewsletterSelection} from './newsletter';
import type {Article} from './articles';

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const font="font-family:'Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif;";
const serif="font-family:Georgia,'Nanum Myeongjo',Batang,serif;";

// Table layout with inline styles: mail clients ignore stylesheets and most modern CSS.
export function renderIssueEmail({selection,articles,origin,dateLabel,readerName,unsubscribeUrl,archiveUrl}:{selection:NewsletterSelection;articles:Article[];origin:string;dateLabel:string;readerName:string;unsubscribeUrl:string;archiveUrl:string}){
  const link=(a:Article)=>`${origin}/article/${a.id}?level=${selection.level}`;
  const cat=(a:Article)=>`${contentLabels[a.type]} · ${industryFor(a.industry).label}${a.regions.filter(r=>r!=='GLOBAL').length?' · '+a.regions.filter(r=>r!=='GLOBAL').slice(0,3).map(countryName).join(', '):''}`;
  const [lead,...rest]=articles;
  const card=(a:Article)=>`<tr><td style="padding:0 0 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#12385f;border-radius:6px"><tr><td style="padding:18px 20px;${font}"><div style="font-size:12px;color:#a9c6e6">${esc(cat(a))}</div><a href="${link(a)}" style="display:block;margin:6px 0 8px;font-size:17px;line-height:1.45;font-weight:700;color:#ffffff;text-decoration:none">${esc(a.title)}</a><div style="font-size:14px;line-height:1.6;color:#d3e1f0">${esc(a.dek)}</div></td></tr></table></td></tr>`;
  const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(selection.name)}</title></head>
<body style="margin:0;padding:0;background:#eef2f7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:6px;overflow:hidden">
<tr><td bgcolor="#12385f" style="background:#12385f;padding:22px 28px 30px;text-align:center;${font}">
<table role="presentation" width="100%"><tr><td style="font-size:12px;color:#cfe0f3;text-align:left">${esc(dateLabel)}</td><td style="font-size:12px;color:#cfe0f3;text-align:right">${esc(levelLabel(selection.level))} 수준 해설</td></tr></table>
<div style="margin-top:22px;font-size:11px;letter-spacing:3px;color:#a9c6e6">${selection.cadence==='daily'?'DAILY':'WEEKLY'} BRIEF · ${esc(regionLabel(selection))}</div>
<div style="${serif}font-size:38px;line-height:1.15;color:#ffffff;margin:8px 0 10px">${esc(selection.name)}</div>
<div style="font-size:13px;color:#cfe0f3">${esc(readerName)}님을 위해 고른 ${articles.length}편</div></td></tr>
<tr><td style="padding:26px 28px 6px;${font}"><div style="font-size:12px;font-weight:700;color:#1d5fd1;letter-spacing:1px">이번 호 머리기사</div><div style="font-size:12px;color:#556372;margin-top:4px">${esc(cat(lead))}</div>
<a href="${link(lead)}" style="display:block;${serif}font-size:26px;line-height:1.3;font-weight:700;color:#12385f;text-decoration:none;margin:8px 0 12px">${esc(lead.title)}</a>
<div style="font-size:15px;line-height:1.75;color:#2c3a49">${esc(lead.dek)}</div>
<div style="font-size:12px;color:#556372;margin-top:10px">출처 ${lead.sources.length}개 · ${esc(lead.asOf)} 기준</div>
<a href="${link(lead)}" style="display:inline-block;margin-top:16px;background:#1d5fd1;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:11px 18px;border-radius:4px">전문 읽기 →</a></td></tr>
${rest.length?`<tr><td style="padding:26px 28px 8px;${font}"><div style="${serif}font-size:20px;font-weight:700;color:#12385f;margin-bottom:14px">함께 읽을 이야기</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rest.map(card).join('')}</table></td></tr>`:''}
<tr><td style="padding:10px 28px 26px;${font}"><table role="presentation" width="100%" style="background:#eaf1fb;border-radius:6px"><tr><td style="padding:18px 20px"><div style="${serif}font-size:18px;font-weight:700;color:#12385f;margin-bottom:8px">읽고 나서, 생각해 볼 질문</div><ol style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#15202d">${lead.questions.slice(0,3).map(q=>`<li>${esc(q)}</li>`).join('')}</ol></td></tr></table></td></tr>
<tr><td bgcolor="#0e2846" style="background:#0e2846;padding:20px 28px;${font}font-size:12px;line-height:1.7;color:#c6d6e8"><b style="font-size:20px;color:#ffffff">loop.</b><br>공개 통계·공식 문서·학술 자료를 바탕으로 다시 쓴 해설입니다. 기사마다 원문 출처가 붙어 있습니다.<br>${esc(scheduleLabel(selection))}에 보내드립니다. <a href="${archiveUrl}" style="color:#ffffff">지난 호 보기</a> · <a href="${unsubscribeUrl}" style="color:#ffffff">수신 거부</a></td></tr>
</table></td></tr></table></body></html>`;
  const text=[`${selection.name} · ${dateLabel}`,'',...articles.map((a,i)=>`${i+1}. ${a.title}\n   ${a.dek}\n   ${link(a)}`),'','생각해 볼 질문',...lead.questions.slice(0,3).map(q=>`- ${q}`),'',`지난 호: ${archiveUrl}`,`수신 거부: ${unsubscribeUrl}`].join('\n');
  return {subject:`[${selection.name}] ${lead.title}`.slice(0,140),html,text};
}
export function renderConfirmEmail({name,confirmUrl,schedule}:{name:string;confirmUrl:string;schedule:string}){
  const html=`<!doctype html><html lang="ko"><body style="margin:0;background:#eef2f7"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:6px"><tr><td bgcolor="#12385f" style="background:#12385f;padding:26px;${serif}font-size:28px;color:#fff">loop.</td></tr><tr><td style="padding:26px;${font}font-size:15px;line-height:1.7;color:#15202d">${esc(name)}님, 뉴스레터를 이 주소로 받으려면 아래 버튼을 눌러 주세요.<br>확인하면 <b>${esc(schedule)}</b>에 새 호를 보내드립니다.<br><br><a href="${confirmUrl}" style="display:inline-block;background:#1d5fd1;color:#fff;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:4px">메일 받기 확인</a><br><br><span style="font-size:12px;color:#556372">직접 신청하지 않았다면 이 메일을 무시하세요. 확인하지 않으면 아무 메일도 보내지 않습니다.</span></td></tr></table></td></tr></table></body></html>`;
  return {subject:'[loop.] 뉴스레터 메일 수신을 확인해 주세요',html,text:`${name}님, 아래 주소를 열면 ${schedule}에 뉴스레터를 보내드립니다.\n${confirmUrl}\n직접 신청하지 않았다면 무시하세요.`};
}
