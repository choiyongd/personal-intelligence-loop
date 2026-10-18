// Refuses to rebuild while this project's own server is still running.
// A running `next start` keeps serving HTML from the old build, but `next build`
// replaces the CSS/JS files under .next, so the page loads without any styles.
const ports = (process.env.PIL_GUARD_PORTS || '3100,3000,3001').split(',').map(Number);
if (process.env.ALLOW_BUILD_WHILE_RUNNING === '1') process.exit(0);
const running = [];
for (const port of ports) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1500) });
    if ((await res.text()).includes('<title>Personal Intelligence Loop</title>')) running.push(port);
  } catch { /* nothing listening, or another app */ }
}
if (running.length) {
  console.error(`\n[빌드 중단] 이 프로젝트 서버가 이미 실행 중입니다: ${running.map(p => `http://127.0.0.1:${p}`).join(', ')}`);
  console.error('실행 중인 서버를 두고 다시 빌드하면 기존 서버가 사라진 CSS를 가리켜 디자인이 전혀 적용되지 않은 화면이 됩니다.');
  console.error('서버 창에서 Ctrl+C로 종료하거나 scripts\\restart-preview.ps1 을 사용하세요.\n');
  process.exit(1);
}
