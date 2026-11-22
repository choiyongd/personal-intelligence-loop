import {z} from 'zod';
import {topicLabel,type Article} from './articles';

export const readingLevel=z.enum(['upper_elementary','middle_school','high_school']);
export type ReadingLevel=z.infer<typeof readingLevel>;

const levels={
  upper_elementary:{
    label:'초등 고학년',pageCount:2,terms:2,facts:0,characters:[100,250],
    heading:['어떤 일이 있었나요?','왜 알아 두면 좋을까요?'],
    question:'이 이야기와 비슷한 일을 학교나 집에서 본 적이 있나요?',
    writing:'이 이야기에서 새로 알게 된 점 한 가지를 소개하고, 내 생활에서는 어떤 의미가 있는지 써 보세요.',
    outline:['새로 알게 된 사실 한 가지','그 사실을 보여 주는 예','내가 생각한 점'],
    scaffold:['새로 알게 된 것은 …입니다.','기사에서 … 부분이 그 사실을 보여 줍니다.','내 생활에서는 …할 수 있습니다.'],
    checklist:['기사에서 본 사실을 하나 넣었나요?','내 생각에 이유를 붙였나요?'],
  },
  middle_school:{
    label:'중학생',pageCount:3,terms:4,facts:2,characters:[250,500],
    heading:[],
    question:'이 변화는 누구에게 어떤 영향을 주나요? 서로 다른 두 사람의 입장에서 생각해 보세요.',
    writing:'기사에 나온 변화에 대한 내 의견을 쓰고, 출처가 있는 근거 한 가지와 다른 사람의 입장을 함께 설명하세요.',
    outline:['문제와 내 주장','기사에서 찾은 근거','다른 입장과 나의 답변','결론'],
    scaffold:['이 변화에 대해 나는 …라고 생각합니다.','출처 [ ]에 따르면 …입니다.','다른 입장에서는 …라고 볼 수 있습니다.'],
    checklist:['주장과 근거가 연결되나요?','출처 번호를 표시했나요?','다른 입장을 공정하게 소개했나요?'],
  },
  high_school:{
    label:'고등학생',pageCount:3,terms:6,facts:4,characters:[500,900],
    heading:[],
    question:'기사의 출처는 어떤 주장을 뒷받침하나요? 판단을 바꾸게 할 새로운 자료가 있다면 무엇인가요?',
    writing:'기사의 쟁점에 대한 논증문을 쓰세요. 서로 다른 출처의 근거를 비교하고, 반론과 아직 확인할 수 없는 점을 다루세요.',
    outline:['쟁점과 논지','두 출처의 근거 비교','반론과 재반박','근거의 한계와 결론'],
    scaffold:['내 논지는 …입니다.','출처 [ ]와 출처 [ ]는 …에서 차이가 납니다.','이 결론은 … 조건에서 달라질 수 있습니다.'],
    checklist:['서로 다른 출처를 근거로 사용했나요?','가장 설득력 있는 반론에 답했나요?','자료의 한계나 불확실성을 밝혔나요?'],
  },
} satisfies Record<ReadingLevel,{label:string;pageCount:number;terms:number;facts:number;characters:[number,number];heading:string[];question:string;writing:string;outline:string[];scaffold:string[];checklist:string[]}>;

export const educationLevels=Object.entries(levels).map(([id,level])=>({id,label:level.label}));
export const lessonInput=z.object({
  title:z.string().trim().min(1).max(120),
  article_ids:z.array(z.string().regex(/^[a-z0-9][a-z0-9-]{0,100}$/)).min(1).max(3)
    .refine(ids=>new Set(ids).size===ids.length,'기사 ID가 중복되었습니다.'),
  reading_level:readingLevel.optional(),
  teacher_note:z.string().trim().max(1000).optional(),
  writing_prompt:z.string().trim().min(1).max(600).optional(),
});
type LessonInput=z.infer<typeof lessonInput>;

export function buildLesson(articles:Article[],level:ReadingLevel,input:LessonInput){
  const rubric=levels[level];
  const stories=articles.map(article=>{
    const short=level==='upper_elementary';
    const advanced=level==='high_school';
    const sections=article.pages.slice(0,rubric.pageCount).map((page,index)=>({
      heading:rubric.heading[index]??page.heading,
      paragraphs:short&&page.easy?[page.easy]:page.paragraphs.slice(0,advanced?2:1),
    }));
    if(advanced&&article.deepDive.paragraphs.length){
      sections.push({heading:article.deepDive.heading,paragraphs:article.deepDive.paragraphs.slice(0,1)});
    }
    return {
      article_id:article.id,title:short?topicLabel(article.topic):article.title,original_title:article.title,
      as_of:article.asOf,article_url:`/article/${article.id}?level=${short?'intro':advanced?'expert':'practitioner'}`,
      sections,
      vocabulary:article.glossary.slice(0,rubric.terms),
      facts:article.keyFacts.slice(0,rubric.facts),
      sources:article.sources.map((source,index)=>({number:index+1,...source})),
      questions:{
        comprehension:short?['글을 읽고 어떤 일이 있었는지 한 문장으로 말해 보세요.']:article.questions.slice(0,2),
        discussion:advanced?[rubric.question,...article.thoughts.slice(0,1)]:[rubric.question],
      },
    };
  });
  return {
    reading_level:level,reading_label:rubric.label,teacher_note:input.teacher_note??'',stories,
    writing:{
      prompt:input.writing_prompt??rubric.writing,primary_article_id:stories[0].article_id,
      suggested_min_chars:rubric.characters[0],suggested_max_chars:rubric.characters[1],
      outline:rubric.outline,sentence_starters:rubric.scaffold,checklist:rubric.checklist,
    },
  };
}
