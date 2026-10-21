(function () {
  var D = window.F5_DATA.kidBuilders, esc = F5.esc;
  var out = document.getElementById('kb-out');
  var q = document.getElementById('kb-q');
  var newBtn = document.getElementById('kb-new');
  var pauseBtn = document.getElementById('kb-pause');
  var st = { ages: [], builders: [], isNew: false };
  var byId = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };
  var ageOf = function (id) { return byId(D.ages, id); };
  var builderOf = function (id) { return byId(D.builders, id); };

  // ----- Animated GIFs: pause on request, and by default for reduced-motion users -----
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = reduceMotion;
  // Swap a loaded GIF for a canvas holding its current (first) frame.
  function freeze(img) {
    if (!paused || !img.complete || !img.naturalWidth || img.dataset.frozen) return;
    var c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', img.alt);
    c.dataset.src = img.src;
    img.dataset.frozen = '1';
    img.replaceWith(c);
  }
  function thaw(root) {
    root.querySelectorAll('canvas[data-src]').forEach(function (c) {
      var img = document.createElement('img');
      img.src = c.dataset.src; img.alt = c.getAttribute('aria-label');
      c.replaceWith(img);
    });
  }
  document.addEventListener('load', function (e) { if (e.target.tagName === 'IMG' && e.target.dataset.anim) freeze(e.target); }, true);
  // If artwork can't load, show a builder-colored tile with the title rather than a broken image.
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG' || img.dataset.failed) return;
    img.dataset.failed = '1';
    if (img.dataset.fallback) {
      var d = document.createElement('div');
      d.className = 'fallback'; d.textContent = img.dataset.fallback;
      d.setAttribute('role', 'img'); d.setAttribute('aria-label', img.alt);
      img.replaceWith(d);
    } else { img.style.visibility = 'hidden'; }
  }, true);
  function setPaused(p) {
    paused = p;
    pauseBtn.setAttribute('aria-pressed', p);
    pauseBtn.textContent = p ? 'Play animations' : 'Pause animations';
    if (p) document.querySelectorAll('img[data-anim]').forEach(freeze); else thaw(document);
  }
  pauseBtn.addEventListener('click', function () { setPaused(!paused); });

  function art(a, cls) {
    var alt = 'Illustration for ' + a.title;
    if (!a.imageUrl) return '<div class="fallback ' + (cls || '') + '" role="img" aria-label="' + esc(a.title) + ' (no illustration yet)">' + esc(a.title) + '</div>';
    return '<img src="' + esc(a.imageUrl) + '" alt="' + esc(alt) + '" loading="lazy" data-anim="1" data-fallback="' + esc(a.title) + '">';
  }

  // ----- Static pieces -----
  var logo = document.getElementById('kb-logo'); logo.src = D.logo;
  var sImg = document.getElementById('kb-speech-img'); sImg.src = D.speechImage;
  document.getElementById('kb-speech-links').innerHTML = D.speechStrategies.map(function (s) {
    return '<a class="lang" lang="' + s.lang + '" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '<span class="sr-only"> (opens first5oc.org)</span></a>';
  }).join(' · ');

  var count = function (fn) { return D.activities.filter(fn).length; };
  document.getElementById('kb-ages').innerHTML = D.ages.map(function (g) {
    return '<button type="button" class="age" data-age="' + g.id + '" aria-pressed="false">' +
      '<span class="art"><img src="' + esc(g.hero) + '" alt="" loading="lazy"></span>' +
      '<strong>' + esc(g.label) + '</strong><small>' + count(function (a) { return a.age === g.id; }) + ' activities</small></button>';
  }).join('');
  document.getElementById('kb-builders').innerHTML = D.builders.map(function (b) {
    return '<button type="button" class="builder" data-b="' + b.id + '" aria-pressed="false"><strong>' + esc(b.short) + '</strong><small>' + esc(b.purpose) + '</small></button>';
  }).join('');

  // ----- Filtering -----
  function match(a) {
    if (st.ages.length && st.ages.indexOf(a.age) === -1) return false;
    if (st.builders.length && st.builders.indexOf(a.builder) === -1) return false;
    if (st.isNew && !a.isNew) return false;
    var s = q.value.trim();
    if (s && !F5.matchesQuery([a.title, a.description, builderOf(a.builder).label, ageOf(a.age).label].join(' '), s)) return false;
    return true;
  }

  function card(a) {
    var b = builderOf(a.builder);
    return '<article class="card act" data-b="' + a.builder + '">' +
      '<div class="pic">' + art(a) + '</div>' +
      '<div class="card-body">' +
        '<div class="tags"><span class="btag">' + esc(b.label) + '</span>' + (a.isNew ? '<span class="newtag">New</span>' : '') + '</div>' +
        '<h3><a href="#activity=' + esc(a.id) + '">' + esc(a.title) + '</a></h3>' +
        '<span style="font-weight:800;font-size:.82rem;color:var(--dark)">' + esc(ageOf(a.age).label) + (a.ageRange ? ' · ' + esc(a.ageRange) : '') + '</span>' +
        '<p>' + esc(a.description) + '</p>' +
      '</div></article>';
  }

  function chips() {
    var o = [];
    if (q.value.trim()) o.push(['q', '', '“' + q.value.trim() + '”']);
    st.ages.forEach(function (v) { o.push(['age', v, ageOf(v).label]); });
    st.builders.forEach(function (v) { o.push(['builder', v, builderOf(v).label]); });
    if (st.isNew) o.push(['new', '', 'New activities']);
    return o;
  }

  var lastKey = null;
  function render(force) {
    var key = JSON.stringify(st) + q.value;
    if (key === lastKey && !force) return;
    lastKey = key;
    document.querySelectorAll('.age').forEach(function (b) { b.setAttribute('aria-pressed', st.ages.indexOf(b.dataset.age) !== -1); });
    document.querySelectorAll('.builder').forEach(function (b) { b.setAttribute('aria-pressed', st.builders.indexOf(b.dataset.b) !== -1); });
    newBtn.setAttribute('aria-pressed', st.isNew);

    var list = D.activities.filter(match);
    document.getElementById('kb-count').textContent = list.length === 1 ? '1 activity' : list.length + ' activities';
    document.getElementById('kb-active').innerHTML = chips().map(function (c) {
      return '<button type="button" data-kind="' + c[0] + '" data-val="' + esc(c[1]) + '" aria-label="Remove filter: ' + esc(c[2]) + '">' + esc(c[2]) + '</button>';
    }).join('');
    if (!list.length) {
      out.innerHTML = '<div class="empty"><h3>No activities match yet</h3><p>Try a different word, or turn off a filter. Every age has activities in all six Kid Builders areas.</p><button type="button" class="btn btn-dark" data-clear>Clear all filters</button></div>';
      return;
    }
    // Group by age so families with several children can scan each child's section.
    out.innerHTML = D.ages.map(function (g) {
      var items = list.filter(function (a) { return a.age === g.id; });
      if (!items.length) return '';
      return '<section class="group" aria-labelledby="g-' + g.id + '"><div class="group-head"><img src="' + esc(g.hero) + '" alt="" loading="lazy"><div><h3 id="g-' + g.id + '">' + esc(g.label) + '</h3><span>' + items.length + ' activities</span></div></div>' +
        '<div class="grid">' + items.map(card).join('') + '</div></section>';
    }).join('');
  }

  function toggle(arr, v) { var i = arr.indexOf(v); if (i === -1) arr.push(v); else arr.splice(i, 1); }
  function clearAll() { st = { ages: [], builders: [], isNew: false }; q.value = ''; render(); q.focus(); }

  document.getElementById('kb-ages').addEventListener('click', function (e) { var b = e.target.closest('.age'); if (b) { toggle(st.ages, b.dataset.age); render(); } });
  document.getElementById('kb-builders').addEventListener('click', function (e) { var b = e.target.closest('.builder'); if (b) { toggle(st.builders, b.dataset.b); render(); } });
  newBtn.addEventListener('click', function () { st.isNew = !st.isNew; render(); });
  q.addEventListener('input', function () { render(); });
  document.getElementById('kb-speech-btn').addEventListener('click', function () {
    st.builders = ['word']; render();
    document.getElementById('results').focus();
  });
  out.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) clearAll(); });
  document.getElementById('kb-active').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = b.dataset.kind, v = b.dataset.val;
    if (k === 'q') q.value = '';
    if (k === 'age') toggle(st.ages, v);
    if (k === 'builder') toggle(st.builders, v);
    if (k === 'new') st.isNew = false;
    render();
    (document.querySelector('#kb-active button') || q).focus();
  });

  // ----- Detail view -----
  var body = document.getElementById('kb-detail-body');
  var dialog = document.getElementById('kb-detail');
  F5.wireDialog(dialog, 'activity', function (id) {
    var a = byId(D.activities, id);
    if (!a) return false;
    var b = builderOf(a.builder), g = ageOf(a.age);
    var more = D.activities.filter(function (x) { return x.age === a.age && x.builder === a.builder && x.id !== a.id; });
    dialog.dataset.b = a.builder;
    body.innerHTML =
      '<span class="eyebrow" style="color:var(--b)">' + esc(b.label) + ' · ' + esc(g.label) + '</span>' +
      '<h2 id="kb-detail-title">' + esc(a.title) + '</h2>' +
      '<div class="tags" style="display:flex;gap:6px;flex-wrap:wrap">' + (a.isNew ? '<span class="newtag">New</span>' : '') +
        (a.ageRange ? '<span class="btag">Best for ' + esc(a.ageRange) + '</span>' : '') + '</div>' +
      '<div class="kb-detail-art">' + art(a) + '</div>' +
      '<p class="lede">' + esc(a.description) + '</p>' +
      '<h3>Why it matters</h3><p style="margin:0">' + esc(b.label) + ' ' + esc(b.purpose.charAt(0).toLowerCase() + b.purpose.slice(1)) + '</p>' +
      (a.builder === 'word' ? '<div class="note" style="margin-top:14px"><strong>Speech &amp; language:</strong> watch short videos of speech therapists sharing strategies you can use at home, in ' +
        D.speechStrategies.map(function (s) { return '<a lang="' + s.lang + '" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>'; }).join(', ') + '.</div>' : '') +
      '<h3>Printable activities</h3>' +
      '<p style="margin:0 0 10px">Download the ' + esc(g.label) + ' ' + esc(b.label) + ' activity sheet:</p>' +
      '<div class="dl">' + [['English', 'en'], ['Español', 'es'], ['Tiếng Việt', 'vi']].map(function (l) {
        return '<a class="btn btn-outline btn-small" lang="' + l[1] + '" href="' + esc(a.sourcePage) + '" target="_blank" rel="noopener">Download: ' + l[0] + '</a>';
      }).join('') + '</div>' +
      '<p class="source-note"><span class="illustrative">Demo</span> Buttons open the current First 5 OC page where each language’s PDF lives. In production they would link straight to each file.</p>' +
      (more.length ? '<h3>More ' + esc(b.label) + ' for ' + esc(g.label) + '</h3><div class="related">' + more.map(function (r) {
        return '<button type="button" data-goto="' + esc(r.id) + '">' + esc(r.title) + (r.isNew ? ' <span class="newtag">New</span>' : '') + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="detail-actions"><a class="btn btn-primary" href="' + esc(a.sourcePage) + '" target="_blank" rel="noopener">View on first5oc.org</a>' +
      '<button type="button" class="btn btn-outline" data-close>Back to activities</button></div>';
    body.querySelectorAll('[data-goto]').forEach(function (x) { x.addEventListener('click', function () { location.hash = 'activity=' + x.dataset.goto; }); });
    body.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
    return true;
  });

  // Other pages can link here pre-filtered, e.g. kid-builders.html?b=body,health&age=3
  var params = new URLSearchParams(location.search);
  (params.get('b') || '').split(',').forEach(function (b) { if (builderOf(b) && st.builders.indexOf(b) === -1) st.builders.push(b); });
  (params.get('age') || '').split(',').forEach(function (g) { if (ageOf(g) && st.ages.indexOf(g) === -1) st.ages.push(g); });

  setPaused(paused);
  render(true);
})();
