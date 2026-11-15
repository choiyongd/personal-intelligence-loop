import 'server-only';

// Resend in production; a local Mailpit inbox for development. Anything else refuses to send.
export type Mail={to:string;subject:string;html:string;text:string;headers?:Record<string,string>};
export function mailConfigured(){return Boolean((process.env.RESEND_API_KEY&&process.env.MAIL_FROM)||process.env.MAILPIT_URL);}
// Returns Resend's message id when there is one, so delivery and opens can be matched back from its webhooks.
export async function sendMail(mail:Mail):Promise<{id:string|null}>{
  if(process.env.RESEND_API_KEY&&process.env.MAIL_FROM){
    const res=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(15000),
      headers:{authorization:`Bearer ${process.env.RESEND_API_KEY}`,'content-type':'application/json'},
      body:JSON.stringify({from:process.env.MAIL_FROM,to:[mail.to],subject:mail.subject,html:mail.html,text:mail.text,headers:mail.headers})});
    if(!res.ok)throw new Error(`resend ${res.status}: ${(await res.text()).slice(0,200)}`);
    const body=await res.json().catch(()=>null) as {id?:unknown}|null;
    return {id:typeof body?.id==='string'?body.id:null};
  }
  if(process.env.MAILPIT_URL){
    const res=await fetch(new URL('/api/v1/send',process.env.MAILPIT_URL),{method:'POST',signal:AbortSignal.timeout(15000),headers:{'content-type':'application/json'},
      body:JSON.stringify({From:{Email:'loop@localhost',Name:'loop.'},To:[{Email:mail.to}],Subject:mail.subject,HTML:mail.html,Text:mail.text,Headers:mail.headers})});
    if(!res.ok)throw new Error(`mailpit ${res.status}`);
    const body=await res.json().catch(()=>null) as {ID?:unknown}|null;
    return {id:typeof body?.ID==='string'?`mailpit:${body.ID}`:null};
  }
  throw new Error('mail-not-configured');
}
