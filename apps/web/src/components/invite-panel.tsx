import {ShareBar} from '@/components/share-bar';
import {createInviteLink} from '@/app/beta-actions';
import type {Referral} from '@/lib/referral';
import {kakaoKey,shareText} from '@/lib/share';
import {lx,type Locale} from '@/lib/i18n';

// "Invite a friend" on the reader's page: their own link, share buttons and how many friends joined through it.
export function InvitePanel({referral,canCreate,origin,loc='ko'}:{referral:Referral|null;canCreate:boolean;origin:string;loc?:Locale}){
  const L=lx(loc),en=loc==='en';
  if(!referral&&!canCreate)return null;
  return <section className="invite-panel" id="invite" aria-labelledby="invite-title"><div className="invite-copy"><p className="eyebrow">INVITE A FRIEND</p><h2 id="invite-title">{L('친구와 함께 읽어요','Read along with a friend')}</h2>
    <p className="muted">{L('나만의 초대 링크를 보내면, 친구는 가입 없이 바로 베타를 시작할 수 있어요. 친구가 메일로 받기를 켜면 아래 숫자에 더해집니다.','Send your own invite link and your friend can start the beta without signing up. When they turn on mail delivery, it adds to the count below.')}</p>
    {referral&&<dl className="invite-stats"><div><dt>{L('나의 초대로 함께한 친구','Friends who joined')}</dt><dd>{en?referral.joined:`${referral.joined}명`}</dd></div><div><dt>{L('그중 메일 확인까지 마친 친구','Confirmed their email')}</dt><dd>{en?referral.confirmed:`${referral.confirmed}명`}</dd></div></dl>}</div>
    <div className="invite-actions">{referral
      ?<><p className="invite-link"><code>{referral.url}</code></p><ShareBar url={referral.url} title={L('loop. 같이 읽어요','Read loop. with me')} text={L('관심사를 고르면 출처 붙은 해설이 내 수준에 맞춰 뉴스레터로 와요. 베타 기간 무료!','Pick your interests and get sourced explainers written at your level. Free during the beta!')} image={`${origin}/og/site${en?'?lang=en':''}`} kakaoKey={kakaoKey()} t={{...shareText(en),button:L('초대 받기','Accept invite')}}/></>
      :<form action={createInviteLink}><button className="primary">{L('내 초대 링크 만들기','Make my invite link')} →</button></form>}</div></section>;
}
