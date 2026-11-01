// Local stand-in for the Toss Payments API, for trying billing end to end without real keys.
// Run: node scripts/fake-toss.mjs, then start the app with TOSS_API_BASE=http://127.0.0.1:4999 TOSS_SECRET_KEY=test_sk_fake.
// GET /fail/on and /fail/off switch card refusals; GET /calls lists what the app sent.
import http from 'node:http';
let fail=false;const calls=[];
http.createServer(async(req,res)=>{
  let body='';for await(const c of req)body+=c;
  const json=body?JSON.parse(body):{};calls.push({url:req.url,auth:req.headers.authorization,idem:req.headers['idempotency-key'],body:json});
  const send=(s,o)=>{res.writeHead(s,{'content-type':'application/json'});res.end(JSON.stringify(o));};
  if(req.url==='/fail/on'){fail=true;return send(200,{});}
  if(req.url==='/fail/off'){fail=false;return send(200,{});}
  if(req.url==='/calls')return send(200,calls);
  if(req.headers.authorization!=='Basic '+Buffer.from('test_sk_fake:').toString('base64'))return send(401,{code:'UNAUTHORIZED_KEY',message:'bad key'});
  if(req.url==='/v1/billing/authorizations/issue'){
    if(json.authKey==='bad')return send(400,{code:'INVALID_AUTH_KEY',message:'bad auth'});
    return send(200,{billingKey:'bk_'+json.authKey,customerKey:json.customerKey,card:{number:'43301234****123*',cardType:'신용'}});
  }
  if(req.url.startsWith('/v1/billing/')){
    if(fail)return send(400,{code:'REJECT_CARD_COMPANY',message:'한도 초과'});
    return send(200,{paymentKey:'pk_'+json.orderId,orderId:json.orderId,status:'DONE',approvedAt:new Date().toISOString(),receipt:{url:'https://receipt.example/'+json.orderId}});
  }
  send(404,{});
}).listen(4999,'127.0.0.1');
