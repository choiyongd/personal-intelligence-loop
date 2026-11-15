import type {MetadataRoute} from 'next';

// Lets phones add loop. to the home screen and open it like an app (standalone window, own icon).
export default function manifest():MetadataRoute.Manifest{
  return {
    id:'/',
    name:'loop. 나만의 산업 뉴스레터',
    short_name:'loop.',
    description:'고른 관심사로 만드는 출처 있는 해설 뉴스레터',
    lang:'ko',
    start_url:'/my?source=app',
    scope:'/',
    display:'standalone',
    background_color:'#0d0d0e',
    theme_color:'#0d0d0e',
    categories:['news','education','business'],
    icons:[
      {src:'/icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
      {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
      {src:'/icons/maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'},
      {src:'/icons/icon.svg',sizes:'any',type:'image/svg+xml'},
    ],
    shortcuts:[
      {name:'메일함',url:'/my/inbox',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
      {name:'관심사 수정',url:'/customize',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
    ],
  };
}
