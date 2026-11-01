import Link from 'next/link';
import {getLocale} from '@/lib/locale';
export default async function NotFound(){const en=await getLocale()==='en';return <main id="main" className="auth-page"><h1>{en?'We could not find that page.':'자료를 찾을 수 없습니다.'}</h1><Link href="/">{en?'Back to home →':'홈으로 돌아가기 →'}</Link></main>;}
