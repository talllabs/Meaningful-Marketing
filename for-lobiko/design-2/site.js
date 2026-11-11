/* The Lobiko Initiative — Mockup 2 site scripts (concept by Meaningful Marketing) */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(t._h); t._h = setTimeout(function () { t.hidden = true; }, 5000);
  }

  // Mobile menu
  var mb = document.getElementById('menuBtn'), nav = document.getElementById('mainnav');
  if (mb && nav) {
    mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', String(o)); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
  }

  // Concept-only links and forms
  document.querySelectorAll('[data-demo]').forEach(function (el) {
    var ev = el.tagName === 'FORM' ? 'submit' : 'click';
    el.addEventListener(ev, function (e) { e.preventDefault(); toast(el.getAttribute('data-demo')); });
  });

  // Gift slider (Gift Catalog amounts)
  var GIFTS = [
    { amt: 50, line: 'A month of medical care for 10 children.', desc: '$50 covers a month of medical care for 10 children at the Mama Monique Foundation.' },
    { amt: 100, line: 'A month of school for 15 primary school children.', desc: '$100 covers a month of school tuition and academic fees for 15 primary school children at the Sabuli Children’s Center, or a caregiver’s monthly salary at the Mama Monique Foundation.' },
    { amt: 250, line: 'A month of tuition for 23 high school students.', desc: '$250 covers a month of school tuition and academic fees for 23 high school students at the Sabuli Children’s Center.' },
    { amt: 500, line: 'A month of meals for 22 children.', desc: '$500 covers a month of meals for 22 children at the Mama Monique Foundation.' },
    { amt: 1000, line: 'A year of school supplies for 12 children.', desc: '$1,000 covers a year of school supplies for 12 children at the Mama Monique Foundation.' },
    { amt: 2500, line: 'Six months of school for 49 students.', desc: '$2,500 covers six months of school tuition and academic fees for 49 students at the Sabuli Children’s Center.' }
  ];
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  var range = document.getElementById('giftRange');
  if (range) {
    var show = function () {
      var g = GIFTS[+range.value];
      document.getElementById('giftAmt').textContent = money(g.amt);
      document.getElementById('giftLine').textContent = g.line;
      document.getElementById('giftDesc').textContent = g.desc;
      var b = document.getElementById('giftBtn'); b.textContent = 'Give ' + money(g.amt) + ' →'; b.href = 'give.html?amount=' + g.amt;
      range.setAttribute('aria-valuetext', money(g.amt) + ': ' + g.line);
    };
    range.addEventListener('input', show); show();
  }

  // Tabs (How your gift works) with gentle auto-advance and a pause button
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  if (tabs.length) {
    var ti = 0, tPaused = reduceMotion, tBtn = document.getElementById('tabPause');
    var select = function (i, focus) {
      ti = i;
      tabs.forEach(function (t, k) {
        var on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k); setTPaused(true); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select((ti + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length, true); setTPaused(true); }
      });
    });
    var setTPaused = function (p) { tPaused = p; if (tBtn) { tBtn.setAttribute('aria-pressed', String(p)); tBtn.textContent = p ? '▶ Play' : '❚❚ Pause'; } };
    if (tBtn) tBtn.addEventListener('click', function () { setTPaused(!tPaused); });
    setTPaused(tPaused);
    setInterval(function () { if (!tPaused) select((ti + 1) % tabs.length); }, 6000);
    select(0);
  }

  // Stories carousel (manual)
  var slides = Array.prototype.slice.call(document.querySelectorAll('.carousel__slide'));
  if (slides.length) {
    var si = 0, label = document.getElementById('carCount');
    var go = function (i) { si = (i + slides.length) % slides.length; slides.forEach(function (s, k) { s.hidden = k !== si; }); label.textContent = 'Story ' + (si + 1) + ' of ' + slides.length; };
    document.getElementById('carPrev').addEventListener('click', function () { go(si - 1); });
    document.getElementById('carNext').addEventListener('click', function () { go(si + 1); });
    go(0);
  }

  // Donate box (concept)
  var donate = document.getElementById('donateForm');
  if (donate) {
    var freq = 'one-time', amount = 250;
    var q = new URLSearchParams(location.search);
    if (q.get('amount')) amount = parseInt(q.get('amount'), 10) || amount;
    if (q.get('monthly') === '1') freq = 'monthly';
    var segBtns = donate.querySelectorAll('.seg button'), amtBtns = donate.querySelectorAll('.amts button'), other = document.getElementById('otherAmt');
    var paint = function () {
      segBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.freq === freq)); });
      var match = false;
      amtBtns.forEach(function (b) { var on = +b.dataset.amt === amount; if (on) match = true; b.setAttribute('aria-pressed', String(on)); });
      if (!match && amount) other.value = amount;
      document.getElementById('donateBtn').textContent = 'Give ' + money(amount || 0) + (freq === 'monthly' ? ' monthly' : '') + ' →';
    };
    segBtns.forEach(function (b) { b.addEventListener('click', function () { freq = b.dataset.freq; paint(); }); });
    amtBtns.forEach(function (b) { b.addEventListener('click', function () { amount = +b.dataset.amt; other.value = ''; paint(); }); });
    other.addEventListener('input', function () { amount = parseInt(other.value, 10) || 0; paint(); });
    donate.addEventListener('submit', function (e) { e.preventDefault(); toast('Concept only: in the real site, this continues to Lobiko’s secure donation checkout (' + money(amount || 0) + (freq === 'monthly' ? ' a month' : '') + ').'); });
    paint();
  }
})();

/* Home page: logo cutout reveal (Mockup 2 hero) */
(function () {
  var reveal = document.querySelector('.reveal');
  if (!reveal) return;
  var stage = document.getElementById('stage'), svg = document.getElementById('maskSvg'), logo = document.getElementById('maskLogo');
  var shade = document.getElementById('shade'), copy = document.getElementById('copy'), hint = document.getElementById('hint');
  var pauseBtn = document.getElementById('pauseBtn'), video = document.getElementById('heroVideo');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, paused = false;
  // Cycling phrase
  var words = Array.prototype.slice.call(document.querySelectorAll('.cycle span')), wi = 0;
  setInterval(function () { if (paused || reduce) return; words[wi].classList.remove('on'); wi = (wi + 1) % words.length; words[wi].classList.add('on'); }, 2600);

  // Pause motion: hero video + cycling phrase
  // Hero video: Lobiko's Squarespace-hosted clip (HLS). Use hls.js wherever the
  // browser supports it (Chrome, Edge, Firefox, Safari, newer iPhones); fall back to
  // native HLS only where hls.js can't run. Some Chrome versions report native HLS
  // support but fail on this stream, so native is never tried first.
  var SRC = 'https://video.squarespace-cdn.com/content/v1/5f4b1e6a594e4e310816b164/f3e14bca-09e2-461f-a8db-8af59f3ab437/playlist.m3u8';
  function playVideo() { if (!paused) { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); } }
  function nativeVideo() { if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = SRC; playVideo(); } }
  function startVideo() {
    video.muted = true;
    var sc = document.createElement('script');
    sc.src = '/for-lobiko/vendor/hls-1.5.20.min.js';
    sc.onerror = nativeVideo;
    sc.onload = function () {
      if (!window.Hls || !window.Hls.isSupported()) { nativeVideo(); return; }
      var hls = new window.Hls({ capLevelToPlayerSize: true });
      hls.loadSource(SRC); hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
    };
    document.head.appendChild(sc);
  }
  function setPaused(p) {
    paused = p;
    if (p) video.pause(); else playVideo();
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.innerHTML = p ? '▶ <span>Play motion</span>' : '❚❚ <span>Pause motion</span>';
  }
  pauseBtn.addEventListener('click', function () { setPaused(!paused); });

  if (reduce) { reveal.classList.add('is-static'); video.remove(); pauseBtn.hidden = true; return; }
  startVideo();

  // Cutout geometry
  function layout() {
    var w = stage.clientWidth, h = stage.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var logoW = Math.min(w * (w < 700 ? 0.86 : 0.6), 900);
    var s = logoW / 1200, logoH = 450 * s;
    var x = (w - logoW) / 2, y = (h - logoH) / 2 - h * 0.03;
    logo.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + s + ')');
    svg.style.transformOrigin = (x + 58 * s) + 'px ' + (y + 134 * s) + 'px';   // zoom into the widest arc
    update();
  }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var ticking = false;
  function update() {
    ticking = false;
    var total = reveal.offsetHeight - stage.offsetHeight;
    var p = clamp(-reveal.getBoundingClientRect().top / total);
    svg.style.transform = 'scale(' + (1 + 7 * ease(clamp(p / 0.55))) + ')';     // up to 8x
    svg.style.opacity = String(1 - clamp((p - 0.42) / 0.22));                   // overlay fades away
    hint.style.opacity = String(1 - clamp(p / 0.08));
    var t = ease(clamp((p - 0.64) / 0.2));
    copy.style.opacity = String(t);                                              // copy fades in
    copy.style.transform = 'translateY(' + (32 * (1 - t)) + 'px)';                // and slides up 32px
    shade.style.opacity = String(t);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', layout);
  copy.addEventListener('focusin', function () { window.scrollTo(0, reveal.offsetTop + (reveal.offsetHeight - stage.offsetHeight) * 0.9); });
  layout();

})();
