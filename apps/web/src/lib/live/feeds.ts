import type {IndustryId} from '../newsletter';

// Approved public sources for the daily live edition. Only official bodies whose releases may be reused
// with attribution are listed; news publishers are not, because their article text is not ours to rewrite.
// `fullText` allows reading the linked release page itself (public domain or open licence) as writing material;
// otherwise only the feed's own title and short description are used. Adding a feed means checking its licence first.
export type Feed={
  id:string;name:string;publisher:string;url:string;
  // Hosts the feed and its linked pages may live on; anything else is ignored.
  hosts:string[];
  regions:string[];fields:IndustryId[];
  license:string;licenseUrl:string;fullText:boolean;
};
const US_PD={license:'미국 연방정부 저작물(공공 영역, 17 U.S.C. §105)',licenseUrl:'https://www.usa.gov/government-copyright'};
export const feeds:Feed[]=[
  {id:'fed',name:'연방준비제도 보도자료',publisher:'미국 연방준비제도(Fed)',url:'https://www.federalreserve.gov/feeds/press_all.xml',hosts:['www.federalreserve.gov'],regions:['US'],fields:['finance'],...US_PD,fullText:true},
  {id:'bls',name:'노동통계국 주요 지표',publisher:'미국 노동통계국(BLS)',url:'https://www.bls.gov/feed/bls_latest.rss',hosts:['www.bls.gov'],regions:['US'],fields:['finance','career'],...US_PD,fullText:false},
  {id:'sec',name:'증권거래위원회 보도자료',publisher:'미국 증권거래위원회(SEC)',url:'https://www.sec.gov/news/pressreleases.rss',hosts:['www.sec.gov'],regions:['US'],fields:['finance','business'],...US_PD,fullText:true},
  {id:'fda',name:'식품의약국 보도자료',publisher:'미국 식품의약국(FDA)',url:'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml',hosts:['www.fda.gov'],regions:['US'],fields:['health','food'],...US_PD,fullText:true},
  {id:'nih',name:'국립보건원 보도자료',publisher:'미국 국립보건원(NIH)',url:'https://www.nih.gov/news-releases/feed.xml',hosts:['www.nih.gov'],regions:['US'],fields:['health','science'],...US_PD,fullText:true},
  {id:'cdc',name:'질병통제예방센터 뉴스룸',publisher:'미국 질병통제예방센터(CDC)',url:'https://tools.cdc.gov/api/v2/resources/media/132608.rss',hosts:['tools.cdc.gov','www.cdc.gov'],regions:['US'],fields:['health'],...US_PD,fullText:true},
  {id:'nasa',name:'NASA 보도자료',publisher:'미국 항공우주국(NASA)',url:'https://www.nasa.gov/news-release/feed/',hosts:['www.nasa.gov'],regions:['US'],fields:['science','mobility'],license:'NASA 미디어 이용 지침(대부분 저작권 없음)',licenseUrl:'https://www.nasa.gov/nasa-brand-center/images-and-media/',fullText:true},
  {id:'nist',name:'표준기술연구소 소식',publisher:'미국 국립표준기술연구소(NIST)',url:'https://www.nist.gov/news-events/news/rss.xml',hosts:['www.nist.gov'],regions:['US'],fields:['technology','science'],...US_PD,fullText:true},
  {id:'usda',name:'농무부 보도자료',publisher:'미국 농무부(USDA)',url:'https://www.usda.gov/rss/latest-releases.xml',hosts:['www.usda.gov'],regions:['US'],fields:['food','environment'],...US_PD,fullText:true},
  {id:'govuk',name:'영국 정부 뉴스',publisher:'영국 정부(GOV.UK)',url:'https://www.gov.uk/search/news-and-communications.atom',hosts:['www.gov.uk'],regions:['GB'],fields:['policy','business','technology','energy'],license:'Open Government Licence v3.0',licenseUrl:'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',fullText:true},
  {id:'ecb',name:'유럽중앙은행 보도자료',publisher:'유럽중앙은행(ECB)',url:'https://www.ecb.europa.eu/rss/press.html',hosts:['www.ecb.europa.eu'],regions:['DE','FR','IT','ES','NL'],fields:['finance'],license:'ECB 저작물, 출처 표기 시 복제 허용',licenseUrl:'https://www.ecb.europa.eu/services/disclaimer/html/index.en.html',fullText:false},
  {id:'esa',name:'유럽우주국 주요 소식',publisher:'유럽우주국(ESA)',url:'https://www.esa.int/rssfeed/Our_Activities/Space_News',hosts:['www.esa.int'],regions:['GLOBAL'],fields:['science'],license:'ESA 이용 약관(제목·요약만 사용)',licenseUrl:'https://www.esa.int/Services/Terms_and_conditions',fullText:false},
  {id:'arxiv-ai',name:'arXiv 인공지능 새 논문',publisher:'arXiv',url:'https://rss.arxiv.org/rss/cs.AI',hosts:['arxiv.org','rss.arxiv.org'],regions:['GLOBAL'],fields:['technology'],license:'arXiv 메타데이터 CC0',licenseUrl:'https://info.arxiv.org/help/api/tou.html',fullText:false},
  // Korea's policy briefing feeds (KOGL). Not reachable from the checking tool on 2026-11-01; the run reports per-feed status.
  {id:'korea-policy',name:'정책브리핑 정책뉴스',publisher:'대한민국 정책브리핑',url:'https://www.korea.kr/rss/policy.xml',hosts:['www.korea.kr'],regions:['KR'],fields:['policy','finance','technology'],license:'공공누리(제목·요약만 사용)',licenseUrl:'https://www.kogl.or.kr/info/license.do',fullText:false},
  {id:'korea-press',name:'정책브리핑 보도자료',publisher:'대한민국 정책브리핑',url:'https://www.korea.kr/rss/pressrelease.xml',hosts:['www.korea.kr'],regions:['KR'],fields:['policy','business','energy'],license:'공공누리(제목·요약만 사용)',licenseUrl:'https://www.kogl.or.kr/info/license.do',fullText:false},
];
export const feedById=(id:string)=>feeds.find(f=>f.id===id);
export function allowedUrl(feed:Feed,url:string){
  try{const u=new URL(url);return u.protocol==='https:'&&feed.hosts.includes(u.hostname);}catch{return false;}
}
