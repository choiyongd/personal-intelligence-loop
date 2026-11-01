import type {Article} from '../types';
// An English edition of one explainer. Facts, numbers, citation markers [n] and sources match the Korean original;
// sourceTitles (1-based, like the citations) replaces source titles that are in Korean.
export type ArticleText=Pick<Article,'title'|'dek'|'glossary'|'pages'|'deepDive'|'keyFacts'|'questions'|'thoughts'>&{sourceTitles?:Record<number,string>};
