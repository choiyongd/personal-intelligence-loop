'use client';

import Link from 'next/link';
import {useEffect,useState,type FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import type {LessonContent,LessonInput} from '@/lib/education';
import {LessonReading} from './lesson-reading';

type Option={id:string;name:string};
type Level={id:string;label:string};
type Room={id:string;name:string;reading_level:string;role:'teacher'|'student'};
type Lesson={id:string;title:string;published_at:string|null;content:LessonContent};
type Writing={student_id:string;body:string;submitted_at:string|null;feedback:string|null};
type Submission=Writing&{education_students?:{display_name:string}};
type Progress={enrolled:number;submitted:number;reviewed:number};
type Starter={id:string;label:string;input:LessonInput};
const formatDate=(date:string)=>new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeZone:'Asia/Seoul'}).format(new Date(date));

async function request<T>(path:string,method='GET',data?:object,signal?:AbortSignal):Promise<T>{
  const response=await fetch('/api/v1/education'+path,{
    method,signal,headers:{'x-loop-classroom':'1',...(data?{'content-type':'application/json'}:{})},
    body:data?JSON.stringify(data):undefined,
  });
  if(!response.ok){
    const details=await response.json().catch(()=>({}));
    const messages:Record<number,string>={
      400:'입력한 항목을 확인해 주세요. 초대 코드는 발급 후 7일간 유효합니다.',
      401:'이메일 계정으로 다시 로그인해 주세요.',403:'이 작업을 할 권한이 없습니다.',
      404:'학급, 수업 또는 기사를 찾을 수 없습니다.',409:'이미 발행 또는 제출됐거나 다른 곳에서 수정됐습니다. 화면을 새로고침해 주세요.',
    };
    throw new Error(details.error==='save_draft_before_submission'?'글을 먼저 저장해 주세요.':messages[response.status]??'잠시 후 다시 시도해 주세요.');
  }
  return response.json();
}
const url=(id?:string,lesson?:string)=>'/classroom'+(id?`?class=${id}${lesson?`&lesson=${lesson}`:''}`:'');

export function Classroom({classId,lessonId,owners,levels,starters,articles}:{
  classId?:string;lessonId?:string;owners:Option[];levels:Level[];starters:Starter[];articles:{id:string;title:string}[];
}){
  const router=useRouter();
  const [rooms,setRooms]=useState<Room[]>([]);
  const [room,setRoom]=useState<Room>();
  const [lessons,setLessons]=useState<Lesson[]>([]);
  const [lesson,setLesson]=useState<Lesson>();
  const [writing,setWriting]=useState<Writing|null>(null);
  const [submissions,setSubmissions]=useState<Submission[]>([]);
  const [preview,setPreview]=useState<LessonContent>();
  const [starter,setStarter]=useState<Starter>();
  const [progress,setProgress]=useState<Progress>();
  const [submissionOffset,setSubmissionOffset]=useState(0);
  const [invite,setInvite]=useState<{code:string;expires_at:string}>();
  const [writingText,setWritingText]=useState('');
  const [status,setStatus]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const roomPath=`/classes/${classId}`;
  const lessonPath=`${roomPath}/lessons/${lessonId}`;

  useEffect(()=>{
    const controller=new AbortController();
    async function load(){
      const get=<T,>(path:string)=>request<T>(path,'GET',undefined,controller.signal);
      if(!classId){setRooms(await get<Room[]>('/classes'));return;}
      const classroom=await get<Room>(roomPath);
      setRoom(classroom);
      if(!lessonId){setLessons(await get<Lesson[]>(roomPath+'/lessons'));return;}
      const edition=await get<Lesson>(lessonPath);
      setLesson(edition);
      if(!edition.published_at)return;
      if(classroom.role==='teacher'){
        const [list,summary]=await Promise.allSettled([
          get<Submission[]>(lessonPath+'/submissions'),
          get<Progress>(lessonPath+'/progress'),
        ]);
        if(summary.status==='fulfilled')setProgress(summary.value);
        if(list.status==='rejected')throw list.reason;
        setSubmissions(list.value);setSubmissionOffset(list.value.length);
      }
      else {
        const entry=await get<Writing|null>(lessonPath+'/writing');
        setWriting(entry);setWritingText(entry?.body??'');
      }
    }
    void load().catch(cause=>{if(!controller.signal.aborted)setError(cause.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[classId,lessonId,roomPath,lessonPath]);

  function run(task:()=>Promise<void>){
    setBusy(true);setError('');setStatus('');
    void task().catch(cause=>setError(cause.message)).finally(()=>setBusy(false));
  }
  function submit(event:FormEvent<HTMLFormElement>,task:(form:FormData)=>Promise<void>){
    event.preventDefault();const data=new FormData(event.currentTarget);run(()=>task(data));
  }
  function lessonForm(event:FormEvent<HTMLFormElement>){
    const submitter=(event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement|null;
    submit(event,async form=>{
      const ids=['article_one','article_two','article_three'].map(key=>form.get(key)).filter(Boolean);
      if(new Set(ids).size!==ids.length)throw new Error('서로 다른 기사를 선택해 주세요.');
      const writingPrompt=String(form.get('writing_prompt')??'').trim();
      const data={title:form.get('title'),article_ids:ids,reading_level:form.get('reading_level'),
        teacher_note:form.get('teacher_note'),...(writingPrompt?{writing_prompt:writingPrompt}:{})};
      if(submitter?.value==='preview'){
        const result=await request<{content:LessonContent}>(roomPath+'/preview','POST',data);
        setPreview(result.content);setStatus('아래에 미리보기를 표시했습니다.');return;
      }
      const saved=await request<Lesson>(lesson?lessonPath:roomPath+'/lessons',lesson?'PUT':'POST',data);
      if(lesson){setLesson(saved);setPreview(undefined);setStatus('초안을 저장했습니다.');}
      else router.push(url(classId,saved.id));
    });
  }
  const teacher=room?.role==='teacher';
  return <>
    {classId&&<p><Link href={lessonId?url(classId):url()}>← {lessonId?'학급으로':'내 학급'}</Link></p>}
    {loading&&<p role="status">불러오는 중…</p>}
    {status&&<p className="notice" role="status">{status}</p>}
    {error&&<p className="notice" role="alert">{error}</p>}
    {!classId&&!loading&&<>
      <section className="panel"><h2>내 학급</h2>
        {rooms.length?<ul className="education-list">{rooms.map(item=><li key={item.id}><Link href={url(item.id)}>{item.name}</Link><span>{item.role==='teacher'?'교사':'학생'}</span></li>)}</ul>:<p>초대 코드를 받았다면 아래에서 학급에 참여하세요.</p>}
      </section>
      <section className="panel"><h2>초대받은 학급에 참여</h2>
        <form onSubmit={e=>submit(e,async data=>{
          const result=await request<{class_id:string}>('/join','POST',{code:data.get('code'),display_name:data.get('display_name')});
          router.push(url(result.class_id));
        })}>
          <label htmlFor="invite-code">초대 코드</label><input id="invite-code" name="code" required maxLength={64} spellCheck={false} autoComplete="off"/>
          <label htmlFor="student-name">교사에게 보일 이름 또는 별명</label><input id="student-name" name="display_name" required maxLength={40}/>
          <button disabled={busy}>학급 참여</button>
        </form>
      </section>
      <section className="panel"><h2>교사용 학급 만들기</h2>
        {owners.length?<form onSubmit={e=>submit(e,async data=>{
          const result=await request<{id:string}>('/classes','POST',Object.fromEntries(data));
          router.push(url(result.id));
        })}>
          <label htmlFor="workspace">기관 워크스페이스</label><select id="workspace" name="tenant_id">{owners.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <label htmlFor="class-name">학급 이름</label><input id="class-name" name="name" required maxLength={80}/>
          <label htmlFor="class-level">기본 읽기 수준</label><select id="class-level" name="reading_level" defaultValue="middle_school">{levels.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
          <button disabled={busy}>학급 만들기</button>
        </form>:<p><Link href="/settings">워크스페이스 만들기</Link>부터 시작하세요.</p>}
      </section>
    </>}
    {room&&!lessonId&&<>
      <section className="panel"><h2>{room.name}</h2>
        {teacher&&<button disabled={busy} onClick={()=>run(async ()=>{
          setInvite(await request<{code:string;expires_at:string}>(roomPath+'/invite','POST'));
        })}>{invite?'초대 코드 재발급':'초대 코드 발급'}</button>}
        {invite&&<><p>학생에게 코드와 교육용 페이지 주소를 전달하세요. 재발급하면 이전 코드는 만료됩니다.</p>
          <label htmlFor="issued-code">학생 초대 코드</label><input id="issued-code" readOnly value={invite.code} onFocus={e=>e.currentTarget.select()}/>
          <div className="education-actions"><button className="secondary small" onClick={()=>run(async()=>{
            try{await navigator.clipboard.writeText(invite.code);}
            catch{throw new Error('자동 복사가 지원되지 않습니다. 위 코드 칸에서 직접 복사해 주세요.');}
            setStatus('초대 코드를 복사했습니다.');
          })}>초대 코드 복사</button></div>
          <p>만료 {new Date(invite.expires_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}</p></>}
        <h3>수업 자료</h3>
        {lessons.length?<ul className="education-list">{lessons.map(item=><li key={item.id}><Link href={url(classId,item.id)}>{item.title}</Link><span>{item.published_at?formatDate(item.published_at)+' 발행':'초안'}</span></li>)}</ul>:<p>아직 수업 자료가 없습니다.</p>}
      </section>
    </>}
    {teacher&&(!lessonId||lesson&&!lesson.published_at)&&<section className="panel"><h2>{lesson?'수업 초안 편집':'새 수업 자료 만들기'}</h2>
      {!lesson&&starters.length>0&&<div className="education-starters"><h3>예시 수업으로 시작</h3>
        <ul>{starters.map(example=><li key={example.id}><button className="secondary" type="button" aria-pressed={starter?.id===example.id} onClick={()=>{setStarter(example);setPreview(undefined);}}>
          <span>{example.label} · {levels.find(level=>level.id===example.input.reading_level)?.label}</span>{example.input.title}
        </button></li>)}</ul>
        <p className="muted">예시를 고르면 아래 양식이 채워집니다. 저장하기 전에 내용을 바꿀 수 있어요.</p>
      </div>}
      <form onSubmit={lessonForm} key={starter?.id??'new'}>
        <label htmlFor="lesson-title">수업 제목</label><input id="lesson-title" name="title" defaultValue={lesson?.title??starter?.input.title} required maxLength={120}/>
        <label htmlFor="reading-level">읽기 수준</label><select id="reading-level" name="reading_level" defaultValue={lesson?.content.reading_level??starter?.input.reading_level??room?.reading_level}>{levels.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
        {['article_one','article_two','article_three'].map((name,index)=><div key={name}>
          <label htmlFor={name}>{index===0?'주제 기사':`추가 기사 ${index} (선택)`}</label>
          <select id={name} name={name} defaultValue={lesson?.content.stories[index]?.article_id??starter?.input.article_ids[index]??''} required={index===0}>
            <option value="">기사 선택</option>
            {articles.map(article=><option key={article.id} value={article.id}>{article.title}</option>)}
            {lesson?.content.stories[index]&&!articles.some(article=>article.id===lesson.content.stories[index].article_id)&&
              <option value={lesson.content.stories[index].article_id}>{lesson.content.stories[index].original_title}</option>}
          </select>
        </div>)}
        <label htmlFor="teacher-note">수업 안내 (선택)</label><textarea id="teacher-note" name="teacher_note" rows={3} maxLength={1000} defaultValue={lesson?.content.teacher_note??starter?.input.teacher_note}/>
        <label htmlFor="custom-prompt">글쓰기 주제 (선택)</label><textarea id="custom-prompt" name="writing_prompt" rows={3} maxLength={600} defaultValue={lesson?.content.writing.prompt??starter?.input.writing_prompt}/>
        <div className="education-actions"><button value="preview" className="secondary" disabled={busy}>미리보기</button><button disabled={busy}>초안 저장</button></div>
      </form>
    </section>}
    {lesson&&<section className="panel"><h2>{lesson.title}</h2>
      {teacher&&!lesson.published_at&&<button disabled={busy} onClick={()=>run(async ()=>{
        const published=await request<Lesson>(lessonPath+'/publish','POST');
        setLesson({...lesson,published_at:published.published_at});setPreview(undefined);setStatus('학생에게 발행했습니다.');
        const result=await request<Progress>(lessonPath+'/progress').catch(()=>undefined);
        if(result)setProgress(result);
      })}>저장한 초안 발행</button>}
    </section>}
    {lesson?.published_at&&teacher&&progress&&<section className="panel education-progress"><h2>수업 진행 현황</h2>
      <dl><div><dt>학급 학생</dt><dd>{progress.enrolled}명</dd></div><div><dt>글 제출</dt><dd>{progress.submitted}명</dd></div><div><dt>피드백 완료</dt><dd>{progress.reviewed}명</dd></div></dl>
      <a href="#class-submissions">학생 제출물로 이동</a>
    </section>}
    {(preview||lesson)&&<LessonReading content={preview??lesson!.content}/>}
    {lesson?.published_at&&!teacher&&<section className="panel"><h2>내 글쓰기</h2>
      {writing?.submitted_at?<><p className="education-text">{writing.body}</p><p>제출 완료 · {formatDate(writing.submitted_at)}</p>{writing.feedback?<><h3>교사 피드백</h3><p className="education-text">{writing.feedback}</p></>:<p className="muted">교사 피드백을 기다리고 있어요.</p>}</>:
        <form onSubmit={e=>submit(e,async ()=>{
          setWriting(await request<Writing>(lessonPath+'/writing','PUT',{text:writingText}));
          setStatus('초안을 저장했습니다.');
        })}>
          <label htmlFor="draft">내 글 · {writingText.length}자</label>
          <textarea id="draft" rows={8} maxLength={6000} value={writingText} onChange={e=>setWritingText(e.target.value)}/>
          <p className="muted">{writing?.body===writingText?'저장된 초안':'저장하려면 초안 저장을 눌러 주세요.'} · 제출한 글은 수정할 수 없습니다.</p>
          <div className="education-actions"><button className="secondary" disabled={busy}>초안 저장</button>
            <button type="button" disabled={busy||writingText.trim().length<20} onClick={()=>run(async ()=>{
              await request(lessonPath+'/writing','PUT',{text:writingText});
              setWriting(await request<Writing>(lessonPath+'/writing','POST'));setStatus('글을 제출했습니다.');
            })}>제출하기</button></div>
        </form>}
    </section>}
    {lesson?.published_at&&teacher&&<section id="class-submissions" className="panel"><h2>학생 제출물</h2>
      {!submissions.length&&<p>제출된 글이 없습니다.</p>}
      {submissions.map(item=><article key={item.student_id}>
        <h3>{item.education_students?.display_name??'학생'}</h3>
        <p className="muted">{item.feedback?'피드백 완료':'피드백 대기'}{item.submitted_at&&` · ${formatDate(item.submitted_at)} 제출`}</p>
        <p className="education-text">{item.body}</p>
        <form onSubmit={e=>submit(e,async form=>{
          const feedback=String(form.get('feedback')??'').trim();
          await request(lessonPath+'/submissions/'+item.student_id,'PUT',{feedback});
          setSubmissions(previous=>previous.map(entry=>entry.student_id===item.student_id?{...entry,feedback}:entry));
          setStatus('피드백을 저장했습니다.');
          const result=await request<Progress>(lessonPath+'/progress').catch(()=>undefined);
          if(result)setProgress(result);
        })}>
          <label htmlFor={`feedback-${item.student_id}`}>피드백</label>
          <textarea id={`feedback-${item.student_id}`} name="feedback" rows={4} required maxLength={2000} defaultValue={item.feedback??''}/>
          <button disabled={busy}>피드백 저장</button>
        </form>
      </article>)}
      {progress&&submissionOffset<progress.submitted&&<button className="secondary" disabled={busy} onClick={()=>run(async()=>{
        const next=await request<Submission[]>(lessonPath+`/submissions?offset=${submissionOffset}`);
        setSubmissions(current=>[...current,...next.filter(item=>!current.some(entry=>entry.student_id===item.student_id))]);
        setSubmissionOffset(offset=>offset+next.length);
        if(!next.length)setProgress(await request<Progress>(lessonPath+'/progress'));
      })}>제출물 더 보기</button>}
    </section>}
  </>;
}
