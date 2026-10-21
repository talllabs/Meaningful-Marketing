(function () {
  var D = window.F5_DATA.edi, esc = F5.esc;
  var RAMP = ['var(--s0)', 'var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'];
  var st = { domain: 'anyOne', wave: D.waves[D.waves.length - 1].id, region: '', area: null, sortKey: 'name', sortDir: 1 };

  var byId = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };
  var fmt = function (v) { return v.toFixed(1) + '%'; };

  // ----- Layer 1: domain cards -----
  document.getElementById('domain-grid').innerHTML = D.domains.filter(function (d) { return d.id !== 'anyOne'; }).map(function (d) {
    return '<div class="domain"><div class="ic" aria-hidden="true">' + d.icon + '</div><h3>' + esc(d.label) + '</h3><p>' + esc(d.plain) + '</p></div>';
  }).join('');

  // ----- Controls -----
  var domSel = document.getElementById('ex-domain');
  domSel.innerHTML = D.domains.map(function (d) { return '<option value="' + d.id + '">' + esc(d.label) + '</option>'; }).join('');
  document.getElementById('ex-waves').innerHTML = D.waves.map(function (w) {
    return '<label><input type="radio" name="wave" value="' + w.id + '"' + (w.id === st.wave ? ' checked' : '') + '><span>' + esc(w.label) + '</span></label>';
  }).join('');
  var regSel = document.getElementById('ex-region');
  regSel.innerHTML += D.regions.map(function (r) { return '<option value="' + r.id + '">' + esc(r.label) + '</option>'; }).join('');

  // Weighted average across a set of areas (weighted by children assessed).
  function avg(areas, domain, wave) {
    var n = 0, s = 0;
    areas.forEach(function (a) { var v = a.values[wave]; s += v[domain] * v.assessed; n += v.assessed; });
    return n ? s / n : 0;
  }
  function inRegion(a) { return !st.region || a.region === st.region; }

  // Fixed bins per domain across ALL waves so colors stay comparable when switching waves.
  function bins(domain) {
    var vals = [];
    D.areas.forEach(function (a) { D.waves.forEach(function (w) { vals.push(a.values[w.id][domain]); }); });
    var lo = Math.floor(Math.min.apply(null, vals)), hi = Math.ceil(Math.max.apply(null, vals));
    var step = (hi - lo) / 5;
    return [0, 1, 2, 3, 4, 5].map(function (i) { return lo + step * i; });
  }
  function binOf(v, b) { for (var i = 4; i >= 0; i--) if (v >= b[i]) return i; return 0; }

  var hoverRead = document.getElementById('hover-read');

  function renderMap() {
    var dom = byId(D.domains, st.domain), wave = byId(D.waves, st.wave), b = bins(st.domain);
    document.getElementById('map-title').textContent = dom.short + ' · ' + wave.label;
    var maxRow = Math.max.apply(null, D.areas.map(function (a) { return a.row; }));
    var map = document.getElementById('tilemap');
    map.style.gridTemplateRows = 'repeat(' + (maxRow + 1) + ', auto)';
    map.innerHTML = D.areas.map(function (a) {
      var v = a.values[st.wave][st.domain], k = binOf(v, b);
      return '<button type="button" class="tile ' + (k >= 3 ? 'darkt' : 'light') + (inRegion(a) ? '' : ' dim') + '" ' +
        'style="grid-column:' + (a.col + 1) + ';grid-row:' + (a.row + 1) + ';background:' + RAMP[k] + '" ' +
        'data-id="' + a.id + '" aria-pressed="' + (st.area === a.id) + '" ' +
        'aria-label="' + esc(a.name) + ': ' + fmt(v) + ' vulnerable' + (inRegion(a) ? '' : ' (outside selected geography)') + '">' +
        '<small aria-hidden="true"><span class="full">' + esc(a.name.replace(' Area ', ' ')) + '</span><span class="code">' + esc(a.id.toUpperCase()) + '</span></small><strong>' + v.toFixed(1) + '</strong></button>';
    }).join('');
    document.getElementById('legend').innerHTML = '<span>Lower % (better)</span><span class="legend-bar">' +
      RAMP.map(function (c, i) { return '<span style="background:' + c + '" title="' + b[i].toFixed(1) + '–' + b[i + 1].toFixed(1) + '%"></span>'; }).join('') +
      '</span><span>Higher %</span><span>· ' + b[0].toFixed(0) + '–' + b[5].toFixed(0) + '% range</span>';
  }

  function trendSvg(area, scope) {
    var W = 320, H = 130, P = { l: 34, r: 14, t: 14, b: 26 };
    var a = D.waves.map(function (w) { return area ? area.values[w.id][st.domain] : avg(scope, st.domain, w.id); });
    var c = D.waves.map(function (w) { return avg(D.areas, st.domain, w.id); });
    var all = a.concat(c), lo = Math.floor(Math.min.apply(null, all) - 1), hi = Math.ceil(Math.max.apply(null, all) + 1);
    var x = function (i) { return P.l + i * (W - P.l - P.r) / (D.waves.length - 1); };
    var y = function (v) { return P.t + (hi - v) / (hi - lo) * (H - P.t - P.b); };
    var path = function (arr) { return arr.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '); };
    var grid = [lo, (lo + hi) / 2, hi].map(function (g) {
      return '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="#dbe8eb" stroke-width="1"/>' +
        '<text x="' + (P.l - 6) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="10" fill="#4d6670">' + g.toFixed(0) + '%</text>';
    }).join('');
    var xl = D.waves.map(function (w, i) { return '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? 'start' : i === D.waves.length - 1 ? 'end' : 'middle') + '" font-size="11" fill="#4d6670">' + esc(w.label) + '</text>'; }).join('');
    var dots = a.map(function (v, i) {
      return '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="' + (D.waves[i].id === st.wave ? 6 : 4.5) + '" fill="#16708a" stroke="#fff" stroke-width="2"><title>' + esc(D.waves[i].label) + ': ' + fmt(v) + '</title></circle>';
    }).join('');
    var label = area ? area.name : (st.region ? 'Selected geography' : 'County');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Trend for ' + esc(label) + ': ' + a.map(function (v, i) { return D.waves[i].label + ' ' + fmt(v); }).join(', ') + '">' +
      grid + xl +
      (area || st.region ? '<path d="' + path(c) + '" fill="none" stroke="#12313d" stroke-width="2" stroke-dasharray="4 4"/>' : '') +
      '<path d="' + path(a) + '" fill="none" stroke="#16708a" stroke-width="2.5"/>' + dots + '</svg>' +
      '<div class="key"><span><i></i>' + esc(label) + '</span>' + (area || st.region ? '<span><i class="avg" style="background:none;border-left:2px dashed #12313d"></i>County average</span>' : '') + '</div>';
  }

  function renderSide() {
    var scope = D.areas.filter(inRegion);
    var area = st.area ? byId(D.areas, st.area) : null;
    var dom = byId(D.domains, st.domain), wave = byId(D.waves, st.wave);
    var wi = D.waves.indexOf(wave);
    var val = area ? area.values[st.wave][st.domain] : avg(scope, st.domain, st.wave);
    var county = avg(D.areas, st.domain, st.wave);
    var prev = wi > 0 ? (area ? area.values[D.waves[wi - 1].id][st.domain] : avg(scope, st.domain, D.waves[wi - 1].id)) : null;
    var title = area ? area.name : (st.region ? byId(D.regions, st.region).label : 'Orange County overall');
    var assessed = area ? area.values[st.wave].assessed : scope.reduce(function (s, a) { return s + a.values[st.wave].assessed; }, 0);

    var change = '';
    if (prev != null) {
      var d = val - prev;
      change = Math.abs(d) < 0.3 ? 'About the same as ' + D.waves[wi - 1].label
        : (d < 0 ? '▼ Down ' : '▲ Up ') + Math.abs(d).toFixed(1) + ' pts since ' + D.waves[wi - 1].label + (d < 0 ? ' (improving)' : ' (more children need support)');
    }
    var compare = (area || st.region)
      ? 'County average: <strong>' + fmt(county) + '</strong>' + (val < county ? ' · below average (better)' : ' · above average')
      : 'Across all ' + D.areas.length + ' illustrative areas';

    document.getElementById('ex-side').innerHTML =
      '<div class="ex-title"><h3>' + esc(title) + '</h3>' + (area ? '<button type="button" class="btn-link" id="clear-area">Back to ' + (st.region ? 'geography' : 'county') + '</button>' : '') + '</div>' +
      '<p style="margin:0;color:var(--muted);font-size:.9rem">' + esc(dom.label) + ' · ' + esc(wave.label) + ' · ' + esc(wave.years) + '</p>' +
      '<div class="stat"><span class="big">' + fmt(val) + '</span><span class="vs">of kindergartners vulnerable<br>' + compare + '</span></div>' +
      (change ? '<p style="margin:-6px 0 0;font-weight:700;font-size:.92rem">' + change + '</p>' : '') +
      '<p style="margin:6px 0 0;font-size:.82rem;color:var(--muted)">≈ ' + assessed.toLocaleString() + ' children assessed (illustrative)</p>' +
      '<h4>Change across waves</h4><div class="trend">' + trendSvg(area, scope) + '</div>' +
      '<h4>All five areas · ' + esc(wave.label) + '</h4><div class="bars">' + D.domains.map(function (d) {
        var v = area ? area.values[st.wave][d.id] : avg(scope, d.id, st.wave), c = avg(D.areas, d.id, st.wave);
        var max = 40;
        return '<div class="bar-row' + (d.id === st.domain ? ' on' : '') + '"><button type="button" data-domain="' + d.id + '" aria-label="Show ' + esc(d.label) + ' on map">' + esc(d.short) + '</button>' +
          '<div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:' + Math.min(100, v / max * 100) + '%"></div>' +
          ((area || st.region) ? '<div class="bar-avg" style="left:' + Math.min(100, c / max * 100) + '%" title="County ' + fmt(c) + '"></div>' : '') + '</div>' +
          '<span class="v">' + fmt(v) + '</span></div>';
      }).join('') + '</div>' +
      ((area || st.region) ? '<div class="key"><span><i></i>' + esc(area ? area.name : 'Selected geography') + '</span><span><i class="avg"></i>County average</span></div>' : '');

    var back = document.getElementById('clear-area');
    if (back) back.addEventListener('click', function () { var id = st.area; st.area = null; render(); var t = document.querySelector('.tile[data-id="' + id + '"]'); if (t) t.focus(); });
  }

  function renderTable() {
    var wrap = document.getElementById('table-wrap');
    if (wrap.hidden) return;
    var rows = D.areas.filter(inRegion).map(function (a) { var r = { id: a.id, name: a.name }; D.domains.forEach(function (d) { r[d.id] = a.values[st.wave][d.id]; }); r.assessed = a.values[st.wave].assessed; return r; });
    rows.sort(function (x, y) { var k = st.sortKey; return (typeof x[k] === 'string' ? x[k].localeCompare(y[k]) : x[k] - y[k]) * st.sortDir; });
    var cols = [{ id: 'name', label: 'Area' }].concat(D.domains.map(function (d) { return { id: d.id, label: d.short }; })).concat([{ id: 'assessed', label: 'Assessed' }]);
    var sortAttr = function (c) { return c.id === st.sortKey ? (st.sortDir > 0 ? 'ascending' : 'descending') : 'none'; };
    wrap.innerHTML = '<table><caption class="sr-only">% of kindergartners vulnerable by area, ' + esc(byId(D.waves, st.wave).label) + ' (illustrative data)</caption><thead><tr>' +
      cols.map(function (c) { return '<th scope="col" aria-sort="' + sortAttr(c) + '"><button type="button" data-sort="' + c.id + '">' + esc(c.label) + (c.id === st.sortKey ? (st.sortDir > 0 ? ' ▲' : ' ▼') : '') + '</button></th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row" style="text-align:left;font-weight:700">' + esc(r.name) + '</th>' + D.domains.map(function (d) { return '<td>' + fmt(r[d.id]) + '</td>'; }).join('') + '<td>' + r.assessed.toLocaleString() + '</td></tr>';
      }).join('') + '</tbody><tfoot><tr><td>County average</td>' + D.domains.map(function (d) { return '<td>' + fmt(avg(D.areas, d.id, st.wave)) + '</td>'; }).join('') +
      '<td>' + D.areas.reduce(function (s, a) { return s + a.values[st.wave].assessed; }, 0).toLocaleString() + '</td></tr></tfoot></table>';
  }

  function render() { renderMap(); renderSide(); renderTable(); }

  // ----- Events -----
  domSel.addEventListener('change', function () { st.domain = domSel.value; render(); });
  document.getElementById('ex-waves').addEventListener('change', function (e) { st.wave = e.target.value; render(); });
  regSel.addEventListener('change', function () {
    st.region = regSel.value;
    if (st.area && !inRegion(byId(D.areas, st.area))) st.area = null;
    render();
  });
  var map = document.getElementById('tilemap');
  map.addEventListener('click', function (e) {
    var t = e.target.closest('.tile'); if (!t) return;
    st.area = st.area === t.dataset.id ? null : t.dataset.id;
    var id = t.dataset.id; render();
    var again = map.querySelector('.tile[data-id="' + id + '"]'); if (again) again.focus();
  });
  function readout(e) {
    var t = e.target.closest('.tile'); if (!t) return;
    var a = byId(D.areas, t.dataset.id), v = a.values[st.wave][st.domain], c = avg(D.areas, st.domain, st.wave);
    hoverRead.textContent = a.name + ': ' + fmt(v) + ' (county ' + fmt(c) + ') — select to compare';
  }
  map.addEventListener('mouseover', readout);
  map.addEventListener('focusin', readout);
  map.addEventListener('mouseleave', function () { hoverRead.textContent = ''; });
  document.getElementById('ex-side').addEventListener('click', function (e) {
    var b = e.target.closest('[data-domain]'); if (!b) return;
    st.domain = domSel.value = b.dataset.domain; render();
    var again = document.querySelector('[data-domain="' + st.domain + '"]'); if (again) again.focus();
  });
  var tbtn = document.getElementById('table-toggle'), twrap = document.getElementById('table-wrap');
  tbtn.addEventListener('click', function () {
    twrap.hidden = !twrap.hidden;
    tbtn.setAttribute('aria-expanded', !twrap.hidden);
    tbtn.textContent = twrap.hidden ? 'Show as a table' : 'Hide table';
    renderTable();
  });
  twrap.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sort]'); if (!b) return;
    st.sortDir = st.sortKey === b.dataset.sort ? -st.sortDir : 1; st.sortKey = b.dataset.sort;
    renderTable(); twrap.querySelector('[data-sort="' + st.sortKey + '"]').focus();
  });

  render();
})();
