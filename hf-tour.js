/* homefine edit-tool tour: shows only inside the Cafe24 Design Center preview frame */
(function () {
  var s = document.currentScript; if (!s) return;
  if (!/^ecudemo\d+\.cafe24\.com$/.test(location.hostname) && location.protocol !== 'file:') return;
  var q = location.search;
  if (/[?&]pawlo=|[?&]lr=/.test(q)) return;
  var inDC = false;
  try { inDC = window.top !== window.self && (/d\.cafe24\.com/.test(document.referrer) || (location.ancestorOrigins && /d\.cafe24\.com/.test(location.ancestorOrigins[0] || ''))); } catch (e) {}
  if (!inDC && !/[?&]hftour=1/.test(q)) return;
  try { if (sessionStorage.getItem('hf_tour_seen') && !/[?&]hftour=1/.test(q)) return; } catch (e) {}

  var cfg = {
    name: s.getAttribute('data-name') || '',
    video: s.getAttribute('data-video') || '',
    color: s.getAttribute('data-color') || '#222',
    demo: s.getAttribute('data-demo') || '/?pawlo=demo',
    guide: s.getAttribute('data-guide') || '',
    poster: s.getAttribute('data-poster') || '',
    marks: (s.getAttribute('data-marks') || '0,10,19,28,34').split(',').map(Number)
  };
  var steps = ['글자는 눌러서 바로 고쳐요', '사진은 눌러서 바꿔요', '색과 글꼴을 한 번에 바꿔요', '메인 영역 순서를 바꿔요', '휴대폰 화면도 바로 봐요'];
  var short = ['글자 고치기', '사진 바꾸기', '색·글꼴 바꾸기', '영역 순서 바꾸기', '휴대폰 화면 보기'];

  var css = '' +
    '#hft{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(18,18,20,.66);font-family:Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;word-break:keep-all;opacity:0;transition:opacity .3s}' +
    '#hft.on{opacity:1}' +
    '#hft .b{position:relative;display:flex;flex-direction:column;width:min(100%,1320px,calc((100vh - 170px) * 1.625));background:#fff;border-radius:6px;overflow:hidden}' +
    '#hft .v{background:#efedeb;line-height:0}#hft video{width:100%;height:auto;display:block;aspect-ratio:1024/630}' +
    '#hft .r{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:28px;align-items:center;padding:16px 22px;border-top:1px solid #ececec}' +
    '#hft .k{margin:0;font-size:12px;color:#777}#hft .k b{color:#111;font-weight:700}' +
    '#hft h2{margin:3px 0 0;font-size:17px;line-height:1.35;font-weight:800;letter-spacing:-.03em;color:#111;white-space:nowrap}' +
    '#hft ol{list-style:none;margin:0;padding:0;display:flex;gap:14px}' +
    '#hft li{position:relative;flex:1;padding:6px 0 10px;font-size:13px;line-height:1.35;color:#9a9a9a;cursor:pointer;border-bottom:2px solid #eee;transition:color .2s}' +
    '#hft li i{display:block;font-style:normal;font-size:12px;font-weight:700;color:#c4c4c4;margin-bottom:2px}' +
    '#hft li u{position:absolute;left:0;bottom:-2px;height:2px;width:0;background:var(--hfc);text-decoration:none}' +
    '#hft li.on{color:#111;font-weight:600}#hft li.on i{color:var(--hfc)}#hft li .l{display:none}#hft li .s{white-space:nowrap}' +
    '#hft .a{display:flex;align-items:center;gap:14px}' +
    '#hft .a a{display:block;border-radius:4px;text-align:center;font-size:14px;font-weight:700;text-decoration:none;white-space:nowrap}' +
    '#hft .a .p{background:var(--hfc);color:#fff;padding:12px 18px}#hft .a .g{color:#555;font-weight:500;font-size:13px}#hft .a [data-close]{display:none}' +
    '#hft .x{position:absolute;top:10px;right:10px;width:34px;height:34px;border:0;border-radius:50%;background:rgba(20,20,20,.72);color:#fff;font-size:20px;line-height:34px;cursor:pointer}' +
    '#hft .x:focus-visible,#hft a:focus-visible,#hft li:focus-visible{outline:2px solid var(--hfc);outline-offset:2px}' +
    '@media (max-width:1100px){#hft .r{grid-template-columns:minmax(0,1fr) auto}#hft ol{grid-column:1/-1;grid-row:2}}' +
    '@media (max-width:820px){#hft{padding:12px}#hft .b{width:100%;max-height:calc(100vh - 24px);overflow:auto}#hft .r{display:block;padding:18px}#hft h2{white-space:normal;font-size:19px}#hft ol{display:block;margin-top:12px}#hft li{padding:9px 0 9px 24px;font-size:14px;border-bottom:1px solid #f0f0f0}#hft li i{position:absolute;left:0;top:10px}#hft li .l{display:inline}#hft li .s{display:none}#hft .a{flex-direction:column;align-items:stretch;gap:6px;margin-top:16px}#hft .a .p{padding:14px 0}#hft .a .g{padding:6px 0}#hft .a [data-close]{display:block}}' +
    '@media (max-width:820px) and (max-height:700px){#hft ol{display:none}}' +
    '@media (prefers-reduced-motion:reduce){#hft{transition:none}}';

  function build() {
    if (document.getElementById('hft')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var w = document.createElement('div'); w.id = 'hft'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', cfg.name + ' 편집툴 안내');
    w.style.setProperty('--hfc', cfg.color);
    var li = ''; for (var i = 0; i < steps.length; i++) li += '<li tabindex="0" data-i="' + i + '"><i>' + (i + 1) + '</i><span class="s">' + short[i] + '</span><span class="l">' + steps[i] + '</span><u></u></li>';
    w.innerHTML = '<div class="b"><button type="button" class="x" aria-label="닫기">×</button>' +
      '<div class="v"><video muted playsinline autoplay loop preload="auto"' + (cfg.poster ? ' poster="' + cfg.poster + '"' : '') + ' src="' + cfg.video + '"></video></div>' +
      '<div class="r"><div class="h"><p class="k"><b>' + cfg.name + '</b> 편집툴 포함</p><h2>코딩 없이, 화면을 눌러서 직접 고쳐요</h2></div><ol>' + li + '</ol>' +
      '<div class="a"><a class="p" href="' + cfg.demo + '">편집툴 직접 써 보기</a>' + (cfg.guide ? '<a class="g" href="' + cfg.guide + '">사용설명서 보기</a>' : '') + '<a class="g" href="#" data-close>스킨 화면 먼저 볼게요</a></div></div></div>';
    document.body.appendChild(w);
    var v = w.querySelector('video'), items = w.querySelectorAll('li');
    function close(e) { if (e) e.preventDefault(); try { sessionStorage.setItem('hf_tour_seen', '1'); } catch (x) {} v.pause(); w.classList.remove('on'); setTimeout(function () { w.remove(); }, 350); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); }
    w.querySelector('.x').onclick = close; w.querySelector('[data-close]').onclick = close;
    w.addEventListener('click', function (e) { if (e.target === w) close(); });
    document.addEventListener('keydown', key);
    for (var k = 0; k < items.length; k++) {
      (function (el, n) {
        function go() { v.currentTime = cfg.marks[n] + 0.05; v.play(); }
        el.onclick = go; el.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
      })(items[k], k);
    }
    function tick() {
      var t = v.currentTime, n = 0;
      for (var i = 0; i < cfg.marks.length; i++) if (t >= cfg.marks[i]) n = i;
      var end = n + 1 < cfg.marks.length ? cfg.marks[n + 1] : (v.duration || t + 1);
      for (var j = 0; j < items.length; j++) {
        items[j].classList.toggle('on', j === n);
        items[j].lastChild.style.width = j === n ? Math.min(100, (t - cfg.marks[n]) / (end - cfg.marks[n]) * 100) + '%' : '0';
      }
      if (document.getElementById('hft')) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    requestAnimationFrame(function () { w.classList.add('on'); w.tabIndex = -1; w.style.outline = 'none'; w.focus({ preventScroll: true }); });
  }
  function start() { setTimeout(build, 300); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();