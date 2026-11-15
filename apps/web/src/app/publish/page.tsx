import Link from 'next/link';
import {context} from '@/lib/data';
import {newsletterProfile,personalizedStories} from '@/lib/personal-newsletter';
import {Shell} from '@/components/shell';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {personalEditorialStories} from '@/lib/articles';
import {industryLabel,regionLabel} from '@/lib/newsletter';
export default async function Publish({searchParams}:{searchParams:Promise<{tenant?:string}>}){
  const c=await context((await searchParams).tenant),t=c.selected?.tenant_id;
  if(!t)return <Shell active="/publish"><h1>당신의 첫 뉴스레터를 준비하세요.</h1><Link className="button primary" href="/settings">워크스페이스 만들기 ↗</Link></Shell>;
  const selection=await newsletterProfile(t);
  const {stories:collected}=await personalizedStories(t,selection);
  const editorial=collected.length===0;
  const stories=editorial?personalEditorialStories(selection):collected;
  const sourceNote=editorial
    ? stories.length
      ? `조건에 맞는 수집 자료가 아직 없어, 공개 원문을 바탕으로 작성한 편집 해설 ${stories.length}편을 담았습니다.`
      : '조건에 맞는 수집 자료나 편집 해설이 아직 없습니다.'
    : '워크스페이스에 수집된 최근 사건 100개 중 선택 조건에 맞는 자료를 담았습니다.';

  return <Shell tenant={t} workspace={c.selected?.tenants.name} active="/publish">
    <header className="page-heading">
      <div><p className="eyebrow">YOUR PERSONAL EDITION</p><h1>나의 뉴스레터</h1><p>{industryLabel(selection)} · {regionLabel(selection)} · 나의 선택으로 엮은 읽을거리</p></div>
      <Link className="button secondary" href={'/settings?tenant='+t+'#newsletter-profile'}>관심사 수정 ↗</Link>
    </header>
    <div className="sample-banner"><span>{sourceNote} 이메일 자동 전송은 연결되지 않았습니다.</span></div>
    <NewsletterPaper selection={selection} stories={stories} editorial={editorial}/>
  </Shell>;
}
