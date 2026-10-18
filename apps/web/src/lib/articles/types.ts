import type {IndustryId} from '../newsletter';

// Editorial explainers written for the beta. Every factual sentence carries a [n] marker that points at sources[n-1].
export type ArticleSource={title:string;publisher:string;year:string;url:string;kind:'원문'|'공식 자료'|'학술 자료'|'통계'|'보도'};
export type ArticlePage={heading:string;easy:string;paragraphs:string[]};
export type Article={
  id:string;industry:IndustryId;topic:string;
  // 'GLOBAL' or ISO country codes (KR included) the piece is substantially about.
  regions:string[];type:'article'|'research'|'news';
  title:string;dek:string;asOf:string;
  glossary:{term:string;meaning:string}[];
  pages:ArticlePage[];
  deepDive:{heading:string;paragraphs:string[]};
  keyFacts:{label:string;value:string;source:number}[];
  questions:string[];thoughts:string[];
  sources:ArticleSource[];
};
