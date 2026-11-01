// Who runs the service, shown in the privacy policy and every mail footer.
// Set these in the hosting environment before taking real subscribers; the defaults only say that they are missing.
export type Operator={name:string;contact:string;address:string;bizNo:string;officer:string;effective:string;complete:boolean};
export function operator():Operator{
  const v=(k:string)=>(process.env[k]||'').trim();
  const name=v('OPERATOR_NAME'),contact=v('OPERATOR_CONTACT');
  return {name:name||'loop. 운영자',contact,address:v('OPERATOR_ADDRESS'),bizNo:v('OPERATOR_BIZ_NO'),officer:v('PRIVACY_OFFICER')||name||'운영자',
    effective:v('PRIVACY_EFFECTIVE_DATE')||'2026-11-01',complete:Boolean(name&&contact)};
}
// One line for mail footers: sender name, contact and, when registered, business number and address.
export function operatorLine(o=operator()){
  return [o.name,o.contact&&`문의 ${o.contact}`,o.bizNo&&`사업자등록번호 ${o.bizNo}`,o.address].filter(Boolean).join(' · ');
}
