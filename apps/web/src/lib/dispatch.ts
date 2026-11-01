import 'server-only';
import {admin,createIssue,dueReaders,type Reader} from './beta-store';
import {articleById,hotFor,type Article} from './articles';
import {appOrigin} from './env';
import {kstNow} from './kst';
import {sendMail} from './mailer';
import {renderIssueEmail} from './issue-email';
import {billingConfigured,subscriptionActive,type Subscription} from './billing';

const MAX_ATTEMPTS=3;
export function unsubscribeUrl(r:Pick<Reader,'id'|'unsubscribe_token'>){return `${appOrigin()}/api/beta/unsubscribe?r=${r.id}&t=${r.unsubscribe_token}`;}

// At-least-once delivery with a cap: an issue is claimed by bumping `attempts` with a compare-and-set,
// so overlapping runs cannot both send it, and a failed send is retried by later runs the same day.
export async function dispatchDue(now=new Date()){
  const {hour,weekday}=kstNow(now);
  const summary={due:0,sent:0,skipped:0,failed:0};
  let readers=await dueReaders(hour);
  // With paid billing on, only a paid subscription earns scheduled mail; plans switched on for free during the beta do not.
  if(billingConfigured()&&readers.length){
    const {data}=await admin().from('billing_subscriptions').select('*').in('reader_id',readers.map(r=>r.id));
    const paid=new Set(((data||[]) as Subscription[]).filter(s=>subscriptionActive(s,now)).map(s=>s.reader_id));
    readers=readers.filter(r=>paid.has(r.id));
  }
  for(const reader of readers){
    if(reader.cadence==='weekly'&&reader.send_weekday!==weekday)continue;
    summary.due++;
    try{
      const {issue}=await createIssue(reader,'scheduled','pending',now);
      if(!issue||issue.delivery==='sent'||issue.attempts>=MAX_ATTEMPTS){summary.skipped++;continue;}
      const claim=await admin().from('beta_issues').update({delivery:'pending',attempts:issue.attempts+1}).eq('id',issue.id).eq('attempts',issue.attempts).neq('delivery','sent').select('id');
      if(!claim.data?.length){summary.skipped++;continue;}
      const articles=issue.article_ids.map(articleById).filter((a):a is Article=>Boolean(a));
      if(!articles.length||!reader.email)throw new Error('no-articles-or-email');
      const origin=appOrigin(),unsub=unsubscribeUrl(reader);
      const hotIds=hotFor(issue.selectionParsed,issue.article_ids).map(h=>h.id);
      const mail=renderIssueEmail({selection:issue.selectionParsed,articles,hotIds,origin,readerName:reader.name,unsubscribeUrl:unsub,archiveUrl:`${origin}/my/inbox/s-${issue.issue_date.replaceAll('-','')}`,
        dateLabel:new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now)});
      await sendMail({to:reader.email,...mail,headers:{'List-Unsubscribe':`<${unsub}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}});
      await admin().from('beta_issues').update({delivery:'sent',sent_at:new Date().toISOString(),last_error:null}).eq('id',issue.id);
      summary.sent++;
    }catch(e){
      summary.failed++;
      const message=(e instanceof Error?e.message:String(e)).slice(0,300);
      await admin().from('beta_issues').update({delivery:'failed',last_error:message}).eq('reader_id',reader.id).eq('kind','scheduled').eq('issue_date',kstNow(now).date).neq('delivery','sent');
    }
  }
  return summary;
}
