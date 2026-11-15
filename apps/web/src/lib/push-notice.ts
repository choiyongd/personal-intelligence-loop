// Pure helpers for push notices (no server imports), so tests can load them.
export type PushMessage={title:string;body:string;url:string;tag:string;lang?:string};

// Builds one reader's notice from the day's stories in their fields; null when none match.
export function noticeFor(stories:{id:string;industry:string;title:string}[],industries:string[],date:string):PushMessage|null{
  const mine=industries.length?stories.filter(s=>industries.includes(s.industry)):stories;
  if(!mine.length)return null;
  const [first]=mine;
  return {title:`오늘의 새 소식 ${mine.length}편`,body:mine.length>1?`${first.title} 외 ${mine.length-1}편`:first.title,url:`/article/${first.id}`,tag:`live-${date}`,lang:'ko'};
}
