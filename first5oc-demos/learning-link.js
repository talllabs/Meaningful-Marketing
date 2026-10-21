(function () {
  var D = window.F5_DATA.learningLink, T = D.taxonomy, esc = F5.esc;
  var form = document.getElementById('ll-form');
  var out = document.getElementById('ll-out');
  var q = document.getElementById('ll-q');
  var region = document.getElementById('ll-region');
  var dropIn = document.getElementById('ll-dropin');
  var view = 'list', selected = null;
  var DAY_ORDER = T.days.map(function (d) { return d.id; });
  var DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };

  var lookup = function (list, id) { return (list.filter(function (x) { return x.id === id; })[0] || {}).label || id; };

  region.innerHTML += T.regions.map(function (r) { return '<option value="' + r.id + '">' + esc(r.label) + '</option>'; }).join('');
  document.getElementById('ll-terms').innerHTML = D.terms.map(function (t) {
    return '<label><input type="radio" name="term" value="' + t.id + '"' + (t.id === D.currentTerm ? ' checked' : '') + '><span>' + esc(t.label) + '</span></label>';
  }).join('');
  F5.renderChecks(document.getElementById('ll-days'), T.days, 'day', 'chip');
  F5.renderChecks(document.getElementById('ll-times'), T.times, 'time', 'check');
  F5.renderChecks(document.getElementById('ll-langs'), T.languages, 'lang', 'check');
  F5.renderChecks(document.getElementById('ll-services'), T.services, 'service', 'check');
  F5.renderChecks(document.getElementById('ll-settings'), T.settings, 'setting', 'check');
  F5.wireFilterToggle(document.getElementById('ll-filter-toggle'), document.getElementById('ll-filters'));

  function timeOf(s) { var h = +s.start.slice(0, 2); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; }
  function t12(hm) { var h = +hm.slice(0, 2), m = hm.slice(3); return ((h + 11) % 12 + 1) + (m === '00' ? '' : ':' + m) + (h < 12 ? ' am' : ' pm'); }
  function sessionsFor(loc, term) {
    return (loc.schedules[term] || []).slice().sort(function (a, b) { return DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.start.localeCompare(b.start); });
  }

  function state() {
    return {
      q: q.value.trim(), region: region.value, term: (form.querySelector('input[name="term"]:checked') || {}).value || D.currentTerm,
      day: F5.checked(form, 'day'), time: F5.checked(form, 'time'), lang: F5.checked(form, 'lang'),
      service: F5.checked(form, 'service'), setting: F5.checked(form, 'setting'), dropIn: dropIn.checked
    };
  }

  // Day / time / language filter at the session level: a location matches if
  // at least one of its sessions this term satisfies all three.
  function matchingSessions(loc, s) {
    return sessionsFor(loc, s.term).filter(function (x) {
      return (!s.day.length || s.day.indexOf(x.day) !== -1) && (!s.time.length || s.time.indexOf(timeOf(x)) !== -1) && (!s.lang.length || s.lang.indexOf(x.lang) !== -1);
    });
  }
  function match(loc, s) {
    if (s.q) {
      var hay = [loc.name, loc.city, loc.address, lookup(T.settings, loc.setting)].concat(loc.services.map(function (x) { return lookup(T.services, x); }))
        .concat(sessionsFor(loc, s.term).map(function (x) { return x.name; })).join(' ');
      if (!F5.matchesQuery(hay, s.q)) return false;
    }
    if (s.region && loc.region !== s.region) return false;
    if (s.service.length && !s.service.every(function (x) { return loc.services.indexOf(x) !== -1; })) return false;
    if (s.setting.length && s.setting.indexOf(loc.setting) === -1) return false;
    if (s.dropIn && !loc.dropIn) return false;
    if ((s.day.length || s.time.length || s.lang.length) && !matchingSessions(loc, s).length) return false;
    return true;
  }

  function nextLine(loc, s) {
    var list = (s.day.length || s.time.length || s.lang.length) ? matchingSessions(loc, s) : sessionsFor(loc, s.term);
    if (!list.length) return '<div class="next soon"><strong>Schedule coming soon</strong>No sessions posted for ' + esc(lookup(D.terms, s.term)) + ' yet.</div>';
    var x = list[0];
    return '<div class="next"><strong>' + (list.length > 1 ? list.length + ' sessions · e.g.' : '1 session') + '</strong>' + esc(DAY_FULL[x.day]) + ' ' + t12(x.start) + '–' + t12(x.end) + ' · ' + esc(x.name) + '</div>';
  }

  function card(loc, s, i) {
    return '<article class="card loc' + (selected === loc.id ? ' hl' : '') + '"><div class="card-body">' +
      '<span class="city">' + esc(loc.city) + ' · ' + esc(lookup(T.settings, loc.setting)) + '</span>' +
      '<h3><a href="#location=' + esc(loc.id) + '">' + esc(loc.name) + '</a></h3>' +
      '<span class="addr">' + esc(loc.address) + ' <span class="illustrative">Illustrative</span></span>' +
      nextLine(loc, s) +
      '<div class="meta">' + loc.languages.map(function (l) { return '<span class="badge badge-ink">' + esc(lookup(T.languages, l)) + '</span>'; }).join('') +
        (loc.dropIn ? '<span class="badge badge-lime">Drop-in</span>' : '<span class="badge badge-orange">Register first</span>') + '</div>' +
      '</div></article>';
  }

  function mapView(list, s) {
    var pins = list.map(function (loc, i) {
      var soon = !sessionsFor(loc, s.term).length;
      return '<button type="button" class="pin' + (soon ? ' soon' : '') + '" style="left:' + loc.x + '%;top:' + loc.y + '%" data-id="' + loc.id + '" aria-pressed="' + (selected === loc.id) + '" aria-label="' + (i + 1) + '. ' + esc(loc.name) + ', ' + esc(loc.city) + '">' +
        '<svg viewBox="0 0 34 42" aria-hidden="true"><path d="M17 41C17 41 2 25 2 16a15 15 0 0 1 30 0c0 9-15 25-15 25z" fill="#07516e" stroke="#fff" stroke-width="2"/></svg><span class="n" aria-hidden="true">' + (i + 1) + '</span></button>';
    }).join('');
    var sel = list.filter(function (l) { return l.id === selected; })[0];
    var popup = sel ? '<div class="popup' + (sel.y < 40 ? ' below' : '') + '" style="left:' + Math.min(Math.max(sel.x, 22), 78) + '%;top:' + sel.y + '%" role="status"><strong>' + esc(sel.name) + '</strong>' + esc(sel.city) + '<br><a href="#location=' + esc(sel.id) + '">View schedule & details →</a></div>' : '';
    return '<div class="map-view"><div class="map" role="group" aria-label="Illustrative map of locations (not to scale)">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="6,8 38,2 58,12 68,26 78,42 88,62 97,84 92,99 82,99 62,86 42,74 18,67 9,55 10,38 4,22" fill="#fff9ed" stroke="#7cc3d6" stroke-width=".6"/></svg>' +
      '<span class="ocean" aria-hidden="true">Pacific Ocean</span><span class="map-note illustrative">Simplified map · not to scale</span>' + pins + popup + '</div>' +
      '<div class="map-side">' + list.map(function (loc, i) {
        return '<button type="button" class="mini" data-id="' + loc.id + '" aria-pressed="' + (selected === loc.id) + '"><span class="num" aria-hidden="true">' + (i + 1) + '</span><span><strong>' + esc(loc.name) + '</strong><small>' + esc(loc.city) + ' · ' + sessionsFor(loc, s.term).length + ' sessions</small></span></button>';
      }).join('') + '</div></div>';
  }

  function chipsFor(s) {
    var o = [];
    if (s.q) o.push(['q', '', '“' + s.q + '”']);
    if (s.region) o.push(['region', '', lookup(T.regions, s.region)]);
    s.day.forEach(function (v) { o.push(['day', v, DAY_FULL[v]]); });
    s.time.forEach(function (v) { o.push(['time', v, lookup(T.times, v).split(' (')[0]]); });
    s.lang.forEach(function (v) { o.push(['lang', v, lookup(T.languages, v)]); });
    s.service.forEach(function (v) { o.push(['service', v, lookup(T.services, v)]); });
    s.setting.forEach(function (v) { o.push(['setting', v, lookup(T.settings, v)]); });
    if (s.dropIn) o.push(['dropin', '', 'Drop-in welcome']);
    return o;
  }

  // Skip redundant renders (e.g. the "change" fired when the search box blurs)
  // so buttons aren't replaced mid-click.
  var lastKey = null;
  function render() {
    var s = state();
    var key = JSON.stringify(s) + view + selected;
    if (key === lastKey) return;
    lastKey = key;
    var term = D.terms.filter(function (t) { return t.id === s.term; })[0];
    document.getElementById('ll-updated').textContent = term.range + ' · Updated ' + term.updated;
    var list = D.locations.filter(function (l) { return match(l, s); });
    if (selected && !list.some(function (l) { return l.id === selected; })) selected = null;
    document.getElementById('ll-count').textContent = (list.length === 1 ? '1 location' : list.length + ' locations') + (s.region ? ' in ' + lookup(T.regions, s.region) : ' county-wide');
    document.getElementById('ll-active').innerHTML = chipsFor(s).map(function (c) {
      return '<button type="button" data-kind="' + c[0] + '" data-val="' + esc(c[1]) + '" aria-label="Remove filter: ' + esc(c[2]) + '">' + esc(c[2]) + '</button>';
    }).join('');
    if (!list.length) {
      out.innerHTML = '<div class="empty"><h3>No locations match those filters</h3><p>Try a different day or time, or widen your search to all of Orange County. Schedules change each Fall and Spring, so check back soon.</p><button type="button" class="btn btn-dark" data-clear>Clear all filters</button></div>';
      return;
    }
    out.innerHTML = view === 'map' ? mapView(list, s) : '<div class="loc-list">' + list.map(function (l, i) { return card(l, s, i); }).join('') + '</div>';
  }

  function clearAll() { var term = state().term; form.reset(); form.querySelector('input[name="term"][value="' + term + '"]').checked = true; selected = null; render(); q.focus(); }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  document.getElementById('ll-clear').addEventListener('click', clearAll);
  document.querySelectorAll('.viewtoggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      view = b.dataset.view;
      document.querySelectorAll('.viewtoggle button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      render();
    });
  });
  out.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear]')) return clearAll();
    var p = e.target.closest('.pin, .mini'); if (!p) return;
    selected = selected === p.dataset.id ? null : p.dataset.id;
    var cls = p.classList.contains('pin') ? '.pin' : '.mini', id = p.dataset.id;
    render();
    var again = out.querySelector(cls + '[data-id="' + id + '"]'); if (again) again.focus();
  });
  document.getElementById('ll-active').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = b.dataset.kind;
    if (k === 'q') q.value = '';
    else if (k === 'region') region.value = '';
    else if (k === 'dropin') dropIn.checked = false;
    else { var i = form.querySelector('input[name="' + k + '"][value="' + b.dataset.val + '"]'); if (i) i.checked = false; }
    render();
    (document.querySelector('#ll-active button') || q).focus();
  });

  // ----- Detail view -----
  var body = document.getElementById('ll-detail-body');
  F5.wireDialog(document.getElementById('ll-detail'), 'location', function (id) {
    var loc = D.locations.filter(function (l) { return l.id === id; })[0];
    if (!loc) return false;
    var s = state(), term = D.terms.filter(function (t) { return t.id === s.term; })[0];
    var sess = sessionsFor(loc, s.term);
    body.innerHTML =
      '<span class="eyebrow">' + esc(loc.city) + ' · ' + esc(lookup(T.settings, loc.setting)) + '</span>' +
      '<h2 id="ll-detail-title">' + esc(loc.name) + '</h2>' +
      '<p style="margin:0"><span class="illustrative">Illustrative location</span></p>' +
      '<div class="detail-grid">' +
        '<div><strong>Address</strong>' + esc(loc.address) + '<br><a href="#" onclick="return false" aria-disabled="true">Get directions (demo)</a></div>' +
        '<div><strong>Contact</strong>' + esc(loc.phone) + '<br>' + (loc.dropIn ? 'Drop-in welcome' : 'Please register before your first visit') + '</div>' +
        '<div><strong>Languages</strong>' + loc.languages.map(function (l) { return esc(lookup(T.languages, l)); }).join(', ') + '</div>' +
        '<div><strong>Accessibility</strong>' + esc(loc.access) + '</div>' +
      '</div>' +
      '<h3>' + esc(term.label) + ' schedule <small style="font:600 .85rem Manrope;color:var(--muted)">' + esc(term.range) + '</small></h3>' +
      (sess.length
        ? '<table class="sched"><caption class="sr-only">' + esc(term.label) + ' sessions at ' + esc(loc.name) + '</caption><thead><tr><th scope="col">Day</th><th scope="col">Time</th><th scope="col">Program</th><th scope="col">Language</th></tr></thead><tbody>' +
          sess.map(function (x) { return '<tr><td>' + esc(DAY_FULL[x.day]) + '</td><td>' + t12(x.start) + '–' + t12(x.end) + '</td><td' + (x.lang !== 'en' ? ' lang="' + x.lang + '"' : '') + '>' + esc(x.name) + '</td><td>' + esc(lookup(T.languages, x.lang)) + '</td></tr>'; }).join('') +
          '</tbody></table>'
        : '<div class="note">No sessions posted for ' + esc(term.label) + ' yet. Schedules are updated each Fall and Spring.</div>') +
      '<p style="font-size:.85rem;color:var(--muted);margin:10px 0 0">Schedule last updated: ' + esc(term.updated) + '. Programs are free; times may change on holidays.</p>' +
      '<h3>What’s offered here</h3><div class="chips">' + loc.services.map(function (x) { return '<span class="badge">' + esc(lookup(T.services, x)) + '</span>'; }).join('') + '</div>' +
      '<div class="detail-actions"><button type="button" class="btn btn-primary" onclick="window.print()">Print schedule</button>' +
      '<button type="button" class="btn btn-outline" data-close>Back to locations</button>' +
      '<a class="btn-link" style="align-self:center" href="#" onclick="return false">Report a schedule change (demo)</a></div>';
    body.querySelector('[data-close]').addEventListener('click', function () { document.getElementById('ll-detail').close(); });
    return true;
  });

  render();
})();
