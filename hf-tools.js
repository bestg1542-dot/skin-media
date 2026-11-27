// run on a sample mall admin page: await __hfInstall({no, key, label, video, marks, color?})
window.__hfInstall = async (o) => {
  const open = (f) => fetch('/exec/admin/editor/fileOpen?skin_no=' + o.no + '&file=' + encodeURIComponent(f), { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({ bComplete: false }));
  const put = async (f, content) => {
    const base = await open(f); const p = new URLSearchParams();
    Object.keys(base).forEach(k => { if (['content', 'bComplete'].includes(k)) return; const v = base[k]; p.append(k, v === null ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v))); });
    p.set('file', f); if (base.bComplete === false) { p.set('new_file', '1'); p.set('original', ''); p.set('first_cont', ''); p.delete('hash'); }
    p.set('content', content); p.set('editing', 'true');
    const r = await fetch('/exec/admin/editor/fileSave?skin_no=' + o.no, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' }, body: p.toString() });
    return (await r.json()).bComplete;
  };
  const res = {};
  let color = o.color;
  if (!color) { const c = await open('/layout/basic/js/' + o.key + '-config.js'); const m = decodeURIComponent(c.content || '').match(/"accent"\s*:\s*"(#[0-9a-fA-F]{3,8})"/); color = m ? m[1] : '#222222'; }
  res.color = color;
  const j = await fetch('https://api.github.com/repos/bestg1542-dot/skin-media/contents/hf-tour.js?ref=main').then(r => r.json());
  const js = new TextDecoder().decode(Uint8Array.from(atob(j.content.replace(/\n/g, '')), c => c.charCodeAt(0)));
  res.js = await put('/layout/basic/js/hf-tour.js', js);
  const G = 'https://cdn.jsdelivr.net/gh/bestg1542-dot/skin-media@main/';
  const tag = '<script src="/layout/basic/js/hf-tour.js?v=' + j.sha.slice(0, 7) + '" data-name="' + o.label + '" data-color="' + color + '" data-video="' + G + o.video + '" data-poster="' + G + 'poster_' + o.key + '.jpg" data-guide="/' + o.key + '-guide.html" data-marks="' + o.marks + '"></script>';
  for (const f of ['/layout/basic/layout.html', '/layout/basic/main.html']) {
    const b = await open(f); if (!b.bComplete) { res[f] = 'none'; continue; }
    let L = decodeURIComponent(b.content);
    if (L.includes('hf-tour.js')) L = L.replace(/<script src="\/layout\/basic\/js\/hf-tour\.js[^"]*"[^>]*><\/script>/, tag);
    else { const i = L.lastIndexOf('</body>'); if (i < 0) { res[f] = 'nobody'; continue; } L = L.slice(0, i) + tag + '\n' + L.slice(i); }
    res[f] = await put(f, L);
  }
  const h = await fetch('/?' + Date.now()).then(r => r.text());
  res.live = (h.match(/hf-tour\.js[^>]*data-video="([^"]+)"/) || [])[1] || 'missing';
  return res;
};

window.__hfOpen = (no, f) => fetch('/exec/admin/editor/fileOpen?skin_no=' + no + '&file=' + encodeURIComponent(f), { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({ bComplete: false }));
window.__hfSave = async (no, f, base, content) => {
  const p = new URLSearchParams();
  Object.keys(base).forEach(k => { if (['content', 'bComplete'].includes(k)) return; const v = base[k]; p.append(k, v === null ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v))); });
  p.set('content', content); p.set('editing', 'true');
  return (await fetch('/exec/admin/editor/fileSave?skin_no=' + no, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' }, body: p.toString() }).then(r => r.json())).bComplete;
};
// editor popup inputs overflow fix
window.__fixPop = async (no, key) => {
  const f = '/layout/basic/js/' + key + '-editor.js'; const base = await __hfOpen(no, f); if (!base.bComplete) return 'no ' + f;
  let c = decodeURIComponent(base.content); const n0 = c.length;
  c = c.split('#pwe-pop input[type=text]{width:100%;').join('#pwe-pop input[type=text]{box-sizing:border-box;width:100%;').split('#pwe-pop .tb input[type=number]{width:100%;').join('#pwe-pop .tb input[type=number]{box-sizing:border-box;width:100%;');
  if (c.length === n0) return 'already';
  return await __hfSave(no, f, base, c);
};
// guide footer: inquiry line
window.__fixGuide = async (no, key) => {
  const f = '/' + key + '-guide.html'; const base = await __hfOpen(no, f); if (!base.bComplete) return 'no ' + f;
  let c = decodeURIComponent(base.content); if (c.includes('문의글을 남겨')) return 'already';
  const old = '대신해 드려요.</p>'; if (!c.includes(old)) return 'anchor missing';
  c = c.split(old).join(old + '\n  <p>모르는 부분이 있으면 디자인센터 상품 문의에 문의글을 남겨 주세요.</p>');
  return await __hfSave(no, f, base, c);
};