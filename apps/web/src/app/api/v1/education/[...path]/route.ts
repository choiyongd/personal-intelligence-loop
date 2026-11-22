import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {ApiError,apiErrorResponse,apiSession,body,checked} from '@/lib/local-api';
import {buildLesson,educationLevels,lessonInput,readingLevel} from '@/lib/education';
import {allArticles,localizedArticle} from '@/lib/articles';
import {ensureArticles} from '@/lib/live/registry';

export const dynamic='force-dynamic';
const uuid=z.uuid();
const classFields='id,tenant_id,name,reading_level,created_at';
const lessonFields='id,class_id,title,published_at,created_at';
type RouteContext={params:Promise<{path:string[]}>};
type Session=Awaited<ReturnType<typeof apiSession>>;

function pagination(request:Request){
  const offset=z.coerce.number().int().min(0).max(10000).parse(new URL(request.url).searchParams.get('offset')??0);
  return [offset,offset+49] as const;
}

async function ownsWorkspace({client,user}:Session,tenantId:string){
  const membership=checked(await client.from('memberships').select('role')
    .eq('tenant_id',tenantId).eq('user_id',user.id).maybeSingle());
  return membership?.role==='owner';
}

async function prepareLesson(request:Request,defaultLevel:z.infer<typeof readingLevel>){
  const input=lessonInput.parse(await body(request));
  const liveIds=input.article_ids.filter(id=>id.startsWith('n-'));
  if(liveIds.length)await ensureArticles(liveIds);
  const articles=input.article_ids.map(id=>{
    const article=localizedArticle(id,'ko');
    if(!article)throw new ApiError(404,'article_not_found');
    return article;
  });
  return {title:input.title,content:buildLesson(articles,input.reading_level??defaultLevel,input)};
}

async function handle(request:Request,{params}:RouteContext){
  try{
    const [resource,classId,collection,lessonId,action,studentId,...extra]=(await params).path;
    const method=request.method;
    const session=await apiSession(request);
    const {client,user}=session;
    if(extra.length)throw new ApiError(404,'route_not_found');

    if(method==='GET'&&resource==='levels'&&!classId)return Response.json(educationLevels);
    if(method==='GET'&&resource==='articles'&&!classId){
      const [start,end]=pagination(request);
      const articles=allArticles.slice(start,end+1).map(({id,title,topic,asOf})=>({id,title,topic,as_of:asOf}));
      return Response.json(articles);
    }
    if(method==='POST'&&resource==='join'&&!classId){
      const {code,display_name}=z.object({
        code:z.string().trim().regex(/^[a-f0-9]{64}$/i).transform(value=>value.toLowerCase()),
        display_name:z.string().trim().min(1).max(40),
      }).parse(await body(request));
      const id=checked(await client.rpc('join_education_class',{invite_code:code,student_name:display_name}));
      return Response.json({class_id:id});
    }
    if(resource!=='classes')throw new ApiError(404,'route_not_found');
    if(!classId){
      if(method==='GET'){
        const [start,end]=pagination(request);
        const classes=checked(await client.from('education_classes').select(classFields).order('created_at',{ascending:false}).order('id').range(start,end));
        const owners=checked(await client.from('memberships').select('tenant_id').eq('user_id',user.id).eq('role','owner'));
        const owned=new Set((owners??[]).map(row=>row.tenant_id));
        return Response.json((classes??[]).map(row=>({...row,role:owned.has(row.tenant_id)?'teacher':'student'})));
      }
      if(method==='POST'){
        const input=z.object({tenant_id:uuid,name:z.string().trim().min(1).max(80),reading_level:readingLevel}).parse(await body(request));
        if(!await ownsWorkspace(session,input.tenant_id))throw new ApiError(403,'teacher_required');
        const classroom=checked(await client.from('education_classes').insert(input).select(classFields).single());
        return Response.json(classroom,{status:201});
      }
      throw new ApiError(404,'route_not_found');
    }

    const classroom=checked(await client.from('education_classes').select(classFields).eq('id',uuid.parse(classId)).maybeSingle());
    if(!classroom)throw new ApiError(404,'class_not_found');
    const isTeacher=await ownsWorkspace(session,classroom.tenant_id);
    const requireTeacher=()=>{if(!isTeacher)throw new ApiError(403,'teacher_required');};
    if(method==='GET'&&!collection)return Response.json({...classroom,role:isTeacher?'teacher':'student'});
    if(method==='POST'&&collection==='invite'&&!lessonId){
      requireTeacher();
      return Response.json(checked(await client.rpc('rotate_education_invite',{target_class:classId})),{status:201});
    }
    if(method==='GET'&&collection==='students'&&!lessonId){
      requireTeacher();
      const [start,end]=pagination(request);
      return Response.json(checked(await client.from('education_students').select('user_id,display_name,joined_at')
        .eq('class_id',classId).order('joined_at').order('user_id').range(start,end)));
    }
    if(method==='POST'&&collection==='preview'&&!lessonId){
      requireTeacher();
      return Response.json(await prepareLesson(request,readingLevel.parse(classroom.reading_level)));
    }
    if(collection!=='lessons')throw new ApiError(404,'route_not_found');
    if(!lessonId){
      if(method==='GET'){
        const [start,end]=pagination(request);
        return Response.json(checked(await client.from('education_lessons').select(lessonFields)
          .eq('class_id',classId).order('created_at',{ascending:false}).order('id').range(start,end)));
      }
      if(method==='POST'){
        requireTeacher();
        const lesson=await prepareLesson(request,readingLevel.parse(classroom.reading_level));
        const saved=checked(await client.from('education_lessons')
          .insert({id:randomUUID(),class_id:classId,...lesson}).select(`${lessonFields},content`).single());
        return Response.json(saved,{status:201});
      }
      throw new ApiError(404,'route_not_found');
    }

    const lesson=checked(await client.from('education_lessons').select(`${lessonFields},content`)
      .eq('id',uuid.parse(lessonId)).eq('class_id',classId).maybeSingle());
    if(!lesson)throw new ApiError(404,'lesson_not_found');
    if(!action&&method==='GET')return Response.json(lesson);
    if(!action&&method==='PUT'){
      requireTeacher();
      if(lesson.published_at)throw new ApiError(409,'lesson_already_published');
      const draft=await prepareLesson(request,readingLevel.parse(classroom.reading_level));
      const revised=checked(await client.from('education_lessons').update(draft)
        .eq('id',lessonId).is('published_at',null).select(`${lessonFields},content`).maybeSingle());
      if(!revised)throw new ApiError(409,'lesson_already_published');
      return Response.json(revised);
    }
    if(method==='POST'&&action==='publish'&&!studentId){
      requireTeacher();
      if(lesson.published_at)return Response.json(lesson);
      const published=checked(await client.from('education_lessons').update({published_at:new Date().toISOString()})
        .eq('id',lessonId).is('published_at',null).select(lessonFields).maybeSingle());
      if(published)return Response.json(published);
      return Response.json(checked(await client.from('education_lessons').select(lessonFields).eq('id',lessonId).single()));
    }

    if(action==='submissions'){
      requireTeacher();
      if(method==='GET'&&!studentId){
        const [start,end]=pagination(request);
        return Response.json(checked(await client.from('education_writings')
          .select('student_id,body,submitted_at,feedback,feedback_at,education_students(display_name)')
          .eq('lesson_id',lessonId).not('submitted_at','is',null)
          .order('submitted_at',{ascending:false}).order('student_id').range(start,end)));
      }
      if(method==='PUT'&&studentId){
        const {feedback}=z.object({feedback:z.string().trim().min(1).max(2000)}).parse(await body(request));
        const saved=checked(await client.rpc('review_education_writing',{
          target_lesson:lessonId,target_student:uuid.parse(studentId),comment_text:feedback,
        }));
        if(!saved)throw new ApiError(404,'submission_not_found');
        return Response.json({saved:true});
      }
    }
    if(action==='writing'&&!studentId){
      if(isTeacher)throw new ApiError(403,'student_required');
      const current=checked(await client.from('education_writings').select('*')
        .eq('lesson_id',lessonId).eq('student_id',user.id).maybeSingle());
      if(method==='GET')return Response.json(current);
      if(method==='PUT'){
        if(current?.submitted_at)throw new ApiError(409,'writing_already_submitted');
        const {text}=z.object({text:z.string().max(6000)}).parse(await body(request));
        const saved=checked(await client.rpc('save_education_draft',{
          target_lesson:lessonId,target_class:classId,draft_body:text,
        }).maybeSingle());
        if(!saved)throw new ApiError(409,'writing_already_submitted');
        return Response.json(saved);
      }
      if(method==='POST'){
        if(!current)throw new ApiError(409,'save_draft_before_submission');
        if(current.submitted_at)return Response.json(current);
        const {text}=z.object({text:z.string().trim().min(20).max(6000)}).parse({text:current.body});
        const submitted=checked(await client.from('education_writings')
          .update({body:text,submitted_at:new Date().toISOString()})
          .eq('lesson_id',lessonId).eq('student_id',user.id).eq('body',current.body).is('submitted_at',null)
          .select('*').maybeSingle());
        if(submitted)return Response.json(submitted);
        const latest=checked(await client.from('education_writings').select('*').eq('lesson_id',lessonId).eq('student_id',user.id).maybeSingle());
        if(latest?.submitted_at)return Response.json(latest);
        throw new ApiError(409,'draft_changed_retry_submission');
      }
    }
    throw new ApiError(404,'route_not_found');
  }catch(error){return apiErrorResponse(error);}
}

export const GET=handle;
export const POST=handle;
export const PUT=handle;
