import {operator} from '@/lib/operator';

// Seller details that Korean e-commerce law asks every page that sells to show (전자상거래법 제10조).
export function BusinessInfo({loc='ko'}:{loc?:'ko'|'en'}){
  const o=operator();
  if(loc==='en')return <div className="business-info"><p>{[o.nameEn,o.addressEn,o.contact].filter(Boolean).map(v=><span key={v}>{v}</span>)}</p><p><a href="/terms">Terms of use</a> · <a href="/privacy">Privacy policy</a> · <a href="/feedback">Send feedback</a></p></div>;
  const items=[['상호',o.name],['대표자',o.rep],['사업자등록번호',o.bizNo],['통신판매업 신고',o.mailOrderNo],['주소',o.address],['전화',o.phone],['메일',o.contact]].filter(([,v])=>v);
  return <div className="business-info"><p>{items.map(([k,v])=><span key={k}>{k} {v}</span>)}</p><p><a href="/terms">이용약관·환불 규정</a> · <a href="/privacy">개인정보 처리방침</a> · <a href="/feedback">의견 보내기</a></p></div>;
}
