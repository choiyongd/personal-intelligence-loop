import {redirect,notFound} from 'next/navigation';
import {defaultsFor,selectionQuery} from '@/lib/newsletter';
import {getLocale} from '@/lib/locale';
export default async function Demo(){if(process.env.ENABLE_DEMO==='false')notFound();redirect('/newsletter?'+selectionQuery(defaultsFor(await getLocale())));}
