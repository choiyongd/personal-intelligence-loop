import {redirect} from 'next/navigation';
// The archive became the mailbox; keep old links working.
export default function Archive(){redirect('/my/inbox');}
