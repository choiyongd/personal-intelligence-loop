import Link from 'next/link';
import type {Locale} from '@/lib/i18n';
export function BetaBanner({loc='ko'}:{loc?:Locale}){
  return loc==='en'
    ?<div className="sample-banner"><span className="live-dot">BETA</span><span>These are not live news stories but explainers edited from public statistics, official documents and research. Facts are as of October 18, 2026, and every story ends with its sources.</span><Link href="/feedback">Send feedback →</Link></div>
    :<div className="sample-banner"><span className="live-dot">BETA</span><span>실시간 뉴스가 아니라 공개 통계·공식 문서·학술 자료를 바탕으로 편집한 해설 기사입니다. 사실은 2026년 10월 18일 기준이며, 모든 기사 끝에 출처를 적었습니다.</span><Link href="/feedback">의견 보내기 →</Link></div>;
}
