import Link from 'next/link';
import {context} from '@/lib/data';
import {newsletterProfile,personalizedStories} from '@/lib/personal-newsletter';
import {Shell} from '@/components/shell';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {industryLabel,regionLabel} from '@/lib/newsletter';
export default async function Publish({searchParams}:{searchParams:Promise<{tenant?:string}>}){
  const c=await context((await searchParams).tenant),t=c.selected?.tenant_id;
  if(!t)return <Shell active="/publish"><h1>당신의 첫 뉴스레터를 준비하세요.</h1><Link className="button primary" href="/settings">워크스페이스 만들기 ↗</Link></Shell>;
  const selection=await newsletterProfile(t),result=await personalizedStories(t,selection);
  return <Shell tenant={t} workspace={c.selected?.tenants.name} active="/publish"><header className="page-heading"><div><p className="eyebrow">YOUR PERSONAL EDITION</p><h1>나의 뉴스레터</h1><p>{industryLabel(selection)} · {regionLabel(selection)} · 나의 선택으로 엮은 읽을거리</p></div><Link className="button secondary" href={'/settings?tenant='+t+'#newsletter-profile'}>관심사 수정 ↗</Link></header><div className="sample-banner"><span>최근 사건 100개 안의 자료에서 제목·등록 지역·유형으로 선택합니다. 지역이 확인되지 않은 자료는 특정 국가 지면에서 제외합니다. 이메일 자동 전송은 연결되지 않았습니다.</span></div><NewsletterPaper selection={selection} stories={result.stories}/></Shell>;
}
