// Runs once when a server instance starts: load the recent live articles before the first request is served.
export async function register(){
  if(process.env.NEXT_RUNTIME!=='nodejs')return;
  const {refreshLive}=await import('./lib/live/registry');
  await refreshLive(true);
}
