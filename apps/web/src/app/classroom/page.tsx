import {redirect} from 'next/navigation';
import Link from 'next/link';
import {z} from 'zod';
import {context} from '@/lib/data';
import {configured} from '@/lib/env';
import {supabase} from '@/lib/supabase';
import {allArticles,liveArticles} from '@/lib/articles';
import {refreshLive} from '@/lib/live/registry';
import {educationLevels,educationStarterLessons,readingLevel} from '@/lib/education';
import {Shell} from '@/components/shell';
import {Classroom} from './classroom';
import {ClassroomBeta} from './classroom-beta';
import './classroom.css';

export const metadata={title:'루프 교육용 베타',description:'학생 수준에 맞춘 기사로 읽기, 토론, 근거 글쓰기 수업을 준비하세요.'};

export default async function ClassroomPage({searchParams}:{searchParams:Promise<{class?:string;lesson?:string;sample?:string;level?:string}>}){
  const params=await searchParams;
  const level=readingLevel.safeParse(params.level).data??'middle_school';
  if(params.sample==='1')return <ClassroomBeta level={level}/>;
  const auth=configured()?await (await supabase()).auth.getUser():null;
  if(!auth?.data.user){
    if(params.class||params.lesson)redirect('/login?next=classroom');
    return <ClassroomBeta level={level}/>;
  }
  const {memberships}=await context();
  const classId=z.uuid().safeParse(params.class).data;
  const lessonId=z.uuid().safeParse(params.lesson).data;
  const owners=memberships.filter(row=>row.role==='owner').map(row=>({id:row.tenant_id,name:row.tenants.name}));
  if(owners.length)await refreshLive();
  const articles=owners.length?[...liveArticles(),...allArticles].map(({id,title})=>({id,title})):[];
  return <Shell active="/classroom"><div className="education-page">
    <header className="page-heading"><div><p className="eyebrow">루프 교육용 · 베타</p><h1>내 수업</h1></div>
      <Link className="button secondary small" href="/classroom?sample=1#sample">예시 수업 보기</Link>
    </header>
    <Classroom key={`${classId??''}/${lessonId??''}`} classId={classId} lessonId={lessonId} owners={owners} levels={educationLevels} starters={owners.length?educationStarterLessons:[]} articles={articles}/>
  </div></Shell>;
}
