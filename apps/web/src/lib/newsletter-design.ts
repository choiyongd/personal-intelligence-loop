import type {Theme} from './newsletter';

type ArticleImage={
  src:string;source:string;ko:string;en:string;credit:string;license:string;
  creditUrl?:string;licenseUrl?:string;
};
function commons(file:string,path:string,info:Omit<ArticleImage,'src'|'source'>):ArticleImage{
  const name=encodeURIComponent(file);
  return {
    src:`https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/${name}/960px-${name}`,
    source:`https://commons.wikimedia.org/wiki/File:${name}`,...info,
  };
}
const court=commons('Oblique_facade_2,_US_Supreme_Court.jpg','5/51',{
  ko:'미국 연방대법원 청사 자료 사진',en:'File photo of the U.S. Supreme Court building',credit:'Daderot',license:'Public domain',
});
const covers:Readonly<Record<string,ArticleImage>>={
  'ai-explainer':commons('European_Parliament_Hemicycle_-_Brussels_2024.jpg','8/8d',{
    ko:'브뤼셀 유럽의회 본회의장, 2024년 자료 사진',en:'European Parliament chamber in Brussels, 2024 file photo',
    credit:'Profpcde',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',
  }),
  'medicine-explainer':commons('Ozempic_Semaglutide_0.5mg.jpg','9/9b',{
    ko:'세마글루타이드 주사제 포장 자료 사진',en:'File photo of semaglutide injection packaging',
    credit:'Chemist4U',creditUrl:'https://www.chemist-4-u.com/',license:'CC BY-SA 2.0',
    licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',
  }),
  'international-explainer':court,
  'creative-explainer':court,
  'semiconductor-explainer':commons('Silicon_wafer.jpg','e/e2',{
    ko:'반도체 제조에 쓰이는 실리콘 웨이퍼',en:'A silicon wafer used in semiconductor manufacturing',
    credit:'Inductiveload',license:'Public domain',
  }),
  'economy-explainer':commons('IMF_building_HR.jpg','d/d3',{
    ko:'워싱턴 국제통화기금 본부 자료 사진',en:'File photo of IMF headquarters in Washington, D.C.',
    credit:'International Monetary Fund',license:'Public domain',
  }),
  'space-explainer':commons('KSLV-II_Nuri_and_the_launchpad_02.jpg','6/63',{
    ko:'나로우주센터 발사대의 누리호, 2021년 자료 사진',en:'Nuri at the Naro Space Center launch pad, 2021 file photo',
    credit:'한국항공우주연구원 (KARI)',license:'공공누리 제1유형 · KOGL Type 1',licenseUrl:'https://www.kogl.or.kr/info/licenseType1.do',
  }),
};

export function newsletterPhoto(theme:Theme,articleId:string):ArticleImage|undefined{
  return theme!=='minimal'&&Object.hasOwn(covers,articleId)?covers[articleId]:undefined;
}

export const newsletterPalettes={
  magazine:{paper:'#f6f0e6',ink:'#211d18',muted:'#595149',rule:'#b8aaa0',accent:'#a63c16',card:'#f6f0e6',cardAlt:'#f6f0e6'},
  minimal:{paper:'#fcfbf8',ink:'#191918',muted:'#545451',rule:'#b8b8b2',accent:'#242422',card:'#fcfbf8',cardAlt:'#fcfbf8'},
  bento:{paper:'#faf7f5',ink:'#251f2d',muted:'#54505c',rule:'#c9c0cd',accent:'#573c91',card:'#eee8f5',cardAlt:'#e8efe2'},
  night:{paper:'#10151d',ink:'#f2eee8',muted:'#b6c0ca',rule:'#52606d',accent:'#83e7c3',card:'#151d27',cardAlt:'#151d27'},
} satisfies Record<Theme,Record<string,string>>;
