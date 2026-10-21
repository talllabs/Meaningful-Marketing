(function () {
  var D = window.F5_DATA.kidBuilders, T = D.taxonomy, esc = F5.esc;
  var form = document.getElementById('kb-form');
  var grid = document.getElementById('kb-grid');
  var countEl = document.getElementById('kb-count');
  var activeEl = document.getElementById('kb-active');
  var q = document.getElementById('kb-q');
  var sort = document.getElementById('kb-sort');
  var speech = document.getElementById('kb-speech');

  var TYPE_ICON = { game: '🎲', song: '🎵', reading: '📖', outdoor: '🌳', art: '🎨', kitchen: '🥄', video: '▶️' };
  var lookup = function (list, id) { return (list.filter(function (x) { return String(x.id) === String(id); })[0] || {}).label || id; };

  F5.renderChecks(document.getElementById('kb-ages'), T.ages, 'age', 'chip');
  F5.renderChecks(document.getElementById('kb-langs'), T.languages, 'lang', 'chip');
  F5.renderChecks(document.getElementById('kb-areas'), T.areas, 'area', 'check');
  F5.renderChecks(document.getElementById('kb-seasons'), T.seasons.filter(function (s) { return s.id !== 'any'; }), 'season', 'check');
  F5.renderChecks(document.getElementById('kb-types'), T.types, 'type', 'check');
  F5.wireFilterToggle(document.getElementById('kb-filter-toggle'), document.getElementById('kb-filters'));

  function ageText(ages) {
    if (ages.length === 1) return lookup(T.ages, ages[0]);
    var lo = ages[0], hi = ages[ages.length - 1];
    return (lo === 0 ? 'Birth' : 'Age ' + lo) + '–' + hi + (hi === 1 ? ' year' : ' years');
  }

  function state() {
    return {
      q: q.value.trim(),
      age: F5.checked(form, 'age').map(Number),
      lang: F5.checked(form, 'lang'),
      area: F5.checked(form, 'area'),
      season: F5.checked(form, 'season'),
      type: F5.checked(form, 'type'),
      speech: speech.checked
    };
  }

  // `skip` lets us compute facet counts while ignoring that facet's own selection.
  function match(a, s, skip) {
    if (s.q && !F5.matchesQuery([a.title, a.subtitle, a.summary, a.why, a.cultural, a.materials.join(' '), lookup(T.types, a.type)].join(' '), s.q)) return false;
    if (skip !== 'age' && s.age.length && !s.age.some(function (x) { return a.ages.indexOf(x) !== -1; })) return false;
    if (skip !== 'lang' && s.lang.length && s.lang.indexOf(a.language) === -1) return false;
    if (skip !== 'area' && s.area.length && !s.area.some(function (x) { return a.areas.indexOf(x) !== -1; })) return false;
    if (skip !== 'season' && s.season.length && a.seasons.indexOf('any') === -1 && !s.season.some(function (x) { return a.seasons.indexOf(x) !== -1; })) return false;
    if (skip !== 'type' && s.type.length && s.type.indexOf(a.type) === -1) return false;
    if (s.speech && !a.speechVideo) return false;
    return true;
  }

  function updateCounts(s) {
    [['area', T.areas, 'areas'], ['season', T.seasons, 'seasons'], ['type', T.types, null]].forEach(function (g) {
      var pool = D.activities.filter(function (a) { return match(a, s, g[0]); });
      g[1].forEach(function (opt) {
        var n = pool.filter(function (a) {
          if (g[0] === 'type') return a.type === opt.id;
          if (g[0] === 'season') return a.seasons.indexOf(opt.id) !== -1 || a.seasons.indexOf('any') !== -1;
          return a[g[2]].indexOf(opt.id) !== -1;
        }).length;
        F5.setCount(g[0], opt.id, n);
      });
    });
  }

  function card(a) {
    var area = a.areas[0];
    return '<article class="card">' +
      '<div class="kb-thumb" data-area="' + area + '" aria-hidden="true">' + (TYPE_ICON[a.type] || '★') +
        (a.speechVideo ? '<span class="play">▶ Speech video</span>' : '') + '</div>' +
      '<div class="card-body">' +
        '<span class="kb-ages">' + esc(ageText(a.ages)) + ' · ' + a.minutes + ' min</span>' +
        '<h3><a href="#activity=' + esc(a.id) + '">' + esc(a.title) + '</a></h3>' +
        (a.subtitle ? '<span class="kb-sub" lang="en">' + esc(a.subtitle) + '</span>' : '') +
        '<p' + (a.language !== 'en' ? ' lang="' + a.language + '"' : '') + '>' + esc(a.summary) + '</p>' +
        '<div class="meta">' +
          a.areas.map(function (x) { return '<span class="badge">' + esc(lookup(T.areas, x)) + '</span>'; }).join('') +
          (a.speechVideo ? '<span class="badge badge-orange">Speech support</span>' : '') +
          (a.language !== 'en' ? '<span class="badge badge-ink">' + esc(lookup(T.languages, a.language)) + '</span>' : '') +
          (a.cultural ? '<span class="badge badge-yellow">Culturally rooted</span>' : '') +
        '</div>' +
      '</div></article>';
  }

  function chipsFor(s) {
    var out = [];
    if (s.q) out.push(['q', '', '“' + s.q + '”']);
    s.age.forEach(function (v) { out.push(['age', v, lookup(T.ages, v)]); });
    s.lang.forEach(function (v) { out.push(['lang', v, lookup(T.languages, v)]); });
    s.area.forEach(function (v) { out.push(['area', v, lookup(T.areas, v)]); });
    s.season.forEach(function (v) { out.push(['season', v, lookup(T.seasons, v)]); });
    s.type.forEach(function (v) { out.push(['type', v, lookup(T.types, v)]); });
    if (s.speech) out.push(['speech', '', 'Speech-support videos']);
    return out;
  }

  // Skip redundant renders (e.g. the "change" fired when the search box blurs)
  // so buttons aren't replaced mid-click.
  var lastKey = null;
  function render() {
    var s = state();
    var key = JSON.stringify(s) + sort.value;
    if (key === lastKey) return;
    lastKey = key;
    var list = D.activities.filter(function (a) { return match(a, s); });
    if (sort.value === 'short') list.sort(function (a, b) { return a.minutes - b.minutes; });
    if (sort.value === 'az') list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    // Best match: title hits first, otherwise keep editorial order from the data file.
    if (sort.value === 'relevance' && s.q) {
      var nq = F5.norm(s.q);
      list.sort(function (a, b) { return (F5.norm(b.title).indexOf(nq) !== -1) - (F5.norm(a.title).indexOf(nq) !== -1); });
    }

    countEl.textContent = list.length === 1 ? '1 activity' : list.length + ' activities';
    activeEl.innerHTML = chipsFor(s).map(function (c) {
      return '<button type="button" data-kind="' + c[0] + '" data-val="' + esc(c[1]) + '" aria-label="Remove filter: ' + esc(c[2]) + '">' + esc(c[2]) + '</button>';
    }).join('');
    updateCounts(s);

    if (!list.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><h3>No activities match yet</h3>' +
        '<p>Try removing a filter or searching for something broader, like “songs” or “outside”. New activities are added throughout the year.</p>' +
        '<button type="button" class="btn btn-dark" data-clear>Clear all filters</button></div>';
      return;
    }
    grid.innerHTML = list.map(card).join('');
  }

  function clearAll() {
    form.reset();
    render();
    q.focus();
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  document.getElementById('kb-clear').addEventListener('click', clearAll);
  grid.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) clearAll(); });
  activeEl.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = b.dataset.kind;
    if (k === 'q') q.value = '';
    else if (k === 'speech') speech.checked = false;
    else { var i = form.querySelector('input[name="' + k + '"][value="' + b.dataset.val + '"]'); if (i) i.checked = false; }
    render();
    (activeEl.querySelector('button') || q).focus();
  });

  // ----- Detail view -----
  var body = document.getElementById('kb-detail-body');
  F5.wireDialog(document.getElementById('kb-detail'), 'activity', function (id) {
    var a = D.activities.filter(function (x) { return x.id === id; })[0];
    if (!a) return false;
    var lang = a.language !== 'en' ? ' lang="' + a.language + '"' : '';
    var related = D.activities.filter(function (x) {
      return x.id !== a.id && (x.areas.some(function (r) { return a.areas.indexOf(r) !== -1; })) && x.ages.some(function (g) { return a.ages.indexOf(g) !== -1; });
    }).slice(0, 3);
    body.innerHTML =
      '<span class="eyebrow">' + esc(lookup(T.types, a.type)) + ' · ' + esc(ageText(a.ages)) + '</span>' +
      '<h2 id="kb-detail-title"' + lang + '>' + esc(a.title) + '</h2>' +
      (a.subtitle ? '<p class="kb-sub">' + esc(a.subtitle) + '</p>' : '') +
      '<p class="lede"' + lang + '>' + esc(a.summary) + '</p>' +
      (a.type === 'video' || a.speechVideo
        ? '<div class="kb-video" role="img" aria-label="Video placeholder"><div><button type="button" class="playbtn" aria-label="Play video (placeholder — no video in demo)">▶</button><strong>Video placeholder</strong><br><small>Captioned video would play here · ' + a.minutes + ' min</small></div></div><p style="margin:0"><span class="illustrative">Illustrative</span> Real videos would include captions and a transcript.</p>'
        : '') +
      '<div class="kb-facts">' +
        '<span class="badge">⏱ ' + a.minutes + ' minutes</span>' +
        a.areas.map(function (x) { return '<span class="badge">' + esc(lookup(T.areas, x)) + '</span>'; }).join('') +
        '<span class="badge">' + esc(a.seasons.map(function (x) { return lookup(T.seasons, x); }).join(', ')) + '</span>' +
        '<span class="badge badge-ink">' + esc(lookup(T.languages, a.language)) + '</span>' +
      '</div>' +
      '<h3>What you’ll need</h3><ul' + lang + '>' + a.materials.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      '<h3>Try it</h3><ol' + lang + '>' + a.steps.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ol>' +
      '<h3>Why it matters</h3><p' + lang + '>' + esc(a.why) + '</p>' +
      (a.cultural ? '<div class="note"><strong>Family connection:</strong> ' + esc(a.cultural) + '</div>' : '') +
      (related.length ? '<h3>You might also like</h3><div class="kb-related">' + related.map(function (r) {
        return '<button type="button" data-goto="' + esc(r.id) + '">' + esc(r.title) + '<br><small style="font-weight:600;color:var(--muted)">' + esc(ageText(r.ages)) + '</small></button>';
      }).join('') + '</div>' : '') +
      '<div class="detail-actions"><button type="button" class="btn btn-primary" onclick="window.print()">Print this activity</button>' +
      '<button type="button" class="btn btn-outline" data-close>Back to activities</button></div>';
    body.querySelectorAll('[data-goto]').forEach(function (b) { b.addEventListener('click', function () { location.hash = 'activity=' + b.dataset.goto; }); });
    body.querySelector('[data-close]').addEventListener('click', function () { document.getElementById('kb-detail').close(); });
    return true;
  });

  render();
})();
