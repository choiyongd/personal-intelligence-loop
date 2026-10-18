import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { appOrigin } from '@/lib/env';
export async function GET(request:Request) {
  const code=new URL(request.url).searchParams.get('code');
  if(code) { const client=await supabase(); const {error}=await client.auth.exchangeCodeForSession(code);
    if(!error) return NextResponse.redirect(new URL('/feed',appOrigin())); }
  return NextResponse.redirect(new URL('/login?message=auth',appOrigin()));
}
