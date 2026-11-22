import {redirect} from 'next/navigation';
import {z} from 'zod';
import {context} from '@/lib/data';
import {configured} from '@/lib/env';
import {supabase} from '@/lib/supabase';
import {allArticles,liveArticles} from '@/lib/articles';
import {refreshLive} from '@/lib/live/registry';
import {educationLevels} from '@/lib/education';
import {Shell} from '@/components/shell';
import {Classroom} from './classroom';
import './classroom.css';

export const metadata={title:'루프 교육용'};

export default async function ClassroomPage({searchParams}:{searchParams:Promise<{class?:string;lesson?:string}>}){
  if(!configured())redirect('/login?message=setup&next=classroom');
  const client=await supabase();
  if(!(await client.auth.getUser()).data.user)redirect('/login?next=classroom');
  const {memberships}=await context();
  const params=await searchParams;
  const classId=z.uuid().safeParse(params.class).data;
  const lessonId=z.uuid().safeParse(params.lesson).data;
  const owners=memberships.filter(row=>row.role==='owner').map(row=>({id:row.tenant_id,name:row.tenants.name}));
  if(owners.length)await refreshLive();
  const articles=owners.length?[...liveArticles(),...allArticles].map(({id,title})=>({id,title})):[];
  return <Shell active="/classroom"><div className="education-page">
    <header className="page-heading"><div><h1>루프 교육용</h1><p>뉴스레터를 읽고, 근거를 살펴보고, 내 생각을 글로 써 보세요.</p></div></header>
    <Classroom key={`${classId??''}/${lessonId??''}`} classId={classId} lessonId={lessonId} owners={owners} levels={educationLevels} articles={articles}/>
  </div></Shell>;
}
