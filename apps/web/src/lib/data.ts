import 'server-only';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { supabase } from './supabase';
import { configured } from './env';

export const observationSchema = z.object({id:z.string(), source_id:z.string(), title:z.string(), published_at:z.string(), original_url:z.string(), excerpt:z.string()});
export const eventSchema = z.object({id:z.string(),title:z.string(),last_seen_at:z.string(),articles:z.array(z.object({id:z.string(),title:z.string(),published_at:z.string(),canonical_url:z.string(),observations:z.array(observationSchema)}))});
export type BriefEvent = z.infer<typeof eventSchema>;
export type SourceRow = { id:string; name:string; kind:string; enabled:boolean; license_registry:{status:string; review_due_at:string; evidence_url:string; attribution:string; max_excerpt_chars:number; allow_metadata:boolean} };
export const industryLabels: Record<string,string> = {technology:'기술 · AI',energy:'에너지',health:'헬스케어',finance:'금융'};

export async function context(tenant?: string) {
  if (!configured()) redirect('/login?message=setup');
  const client = await supabase();
  const { data:{user}, error } = await client.auth.getUser();
  if (error || !user) redirect('/login');
  const result = await client.from('memberships').select('tenant_id,role,tenants(name)').eq('user_id',user.id).order('tenant_id');
  if (result.error) throw new Error('워크스페이스 정보를 불러오지 못했습니다.');
  const memberships = (result.data || []) as unknown as {tenant_id:string;role:string;tenants:{name:string}}[];
  const selected = tenant ? memberships.find(m=>m.tenant_id===tenant) : memberships[0];
  if (tenant && !selected) redirect('/feed?message=access');
  return {client,user,memberships,selected};
}

export async function feed(tenant: string, offset=0) {
  const {client,selected} = await context(tenant);
  if (!selected) return {events:[],more:false};
  const result = await client.from('events').select('id,title,last_seen_at,articles(id,title,published_at,canonical_url,observations(id,source_id,title,published_at,original_url,excerpt))')
    .eq('tenant_id',tenant).order('last_seen_at',{ascending:false}).order('id').range(offset,offset+20);
  if (result.error) throw new Error('브리핑을 불러오지 못했습니다.');
  const parsed = z.array(eventSchema).parse(result.data || []);
  return {events:parsed.slice(0,20),more:parsed.length>20};
}

export function safeSourceUrl(raw:string) {
  try { const u=new URL(raw); return ['http:','https:'].includes(u.protocol) && !u.username && !u.password ? u.href : undefined; } catch { return undefined; }
}
export function dateLabel(raw:string) {
  return new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'short',day:'numeric',timeZone:'Asia/Seoul'}).format(new Date(raw));
}
