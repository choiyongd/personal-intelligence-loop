import 'server-only';
import {admin} from './beta-store';

// Numbers for the owner's operations dashboard. Beta volumes are small (hundreds of readers), so rows
// are read and counted here rather than through database views; the limits keep a page load bounded.
import {DAY,kstDay,lastDays,mailSummary,perDay,feedbackSummary,type Feedback,type IssueMail} from './ops-metrics';
export {kstDay};

async function count(q:PromiseLike<{count:number|null;error:unknown}>){const {count,error}=await q;if(error)throw new Error('ops-count');return count??0;}
export async function loadOps(fb:'open'|'all',now=new Date()){
  const db=admin(),since30=new Date(now.getTime()-30*DAY).toISOString(),since7=new Date(now.getTime()-7*DAY).toISOString();
  const readers=()=>db.from('beta_readers').select('id',{count:'exact',head:true});
  const [total,confirmed,receiving,subscribers,newRows,mailRows,failed7,fbAll,fbList,paid,recent]=await Promise.all([
    count(readers()),
    count(readers().not('email_confirmed_at','is',null)),
    count(readers().eq('delivery_enabled',true)),
    count(readers().eq('delivery_enabled',true).eq('plan','subscriber')),
    db.from('beta_readers').select('created_at').gte('created_at',since30).limit(10000),
    db.from('beta_issues').select('sent_at,delivery,mail_id,delivered_at,opened_at,clicked_at,bounced_at,complained_at').gte('sent_at',since30).limit(20000),
    count(db.from('beta_issues').select('id',{count:'exact',head:true}).eq('delivery','failed').gte('created_at',since7)),
    db.from('beta_feedback').select('rating,handled_at').limit(10000),
    (fb==='open'?db.from('beta_feedback').select('id,rating,message,source,contact,created_at,handled_at').is('handled_at',null):db.from('beta_feedback').select('id,rating,message,source,contact,created_at,handled_at'))
      .order('created_at',{ascending:false}).limit(100),
    // Paid subscriptions exist only once billing is set up; a missing table just shows "—".
    db.from('billing_subscriptions').select('status,current_period_end').in('status',['active','past_due','canceled']).limit(10000),
    db.from('beta_issues').select('issue_date,title,delivery,sent_at,opened_at,clicked_at,bounced_at,last_error').eq('kind','scheduled').order('created_at',{ascending:false}).limit(15),
  ]);
  if(newRows.error||mailRows.error||fbAll.error||fbList.error||recent.error)throw new Error('운영 지표를 불러오지 못했습니다. Supabase에 운영 대시보드 SQL을 실행했는지 확인해 주세요.');
  const days30=lastDays(30,now),days14=lastDays(14,now);
  const mail=(mailRows.data||[]) as IssueMail[];
  return {
    readers:{total,confirmed,receiving,subscribers,
      paid:paid.error?null:(paid.data||[]).filter(s=>s.status==='past_due'||new Date(s.current_period_end)>now).length,
      new30:(newRows.data||[]).length,
      daily:perDay(newRows.data||[],r=>kstDay(r.created_at),days30).map(d=>({day:d.day,value:d.rows.length}))},
    mail:{...mailSummary(mail),failed7,
      daily:perDay(mail,r=>r.sent_at&&kstDay(r.sent_at),days14).map(d=>{const s=mailSummary(d.rows);return {day:d.day,sent:s.sent,opened:s.opened,rate:s.openRate};}),
      recent:recent.data||[]},
    feedback:{...feedbackSummary((fbAll.data||[]) as Feedback[]),list:(fbList.data||[]) as Feedback[]},
  };
}
