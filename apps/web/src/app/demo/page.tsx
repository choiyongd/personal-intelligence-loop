import {redirect,notFound} from 'next/navigation';
import {defaultSelection,selectionQuery} from '@/lib/newsletter';
export default function Demo(){if(process.env.ENABLE_DEMO==='false')notFound();redirect('/newsletter?'+selectionQuery(defaultSelection));}
