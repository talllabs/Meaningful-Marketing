(function () {
  var D = window.F5_DATA.edi, esc = F5.esc;
  var pct = function (v) { return v.toFixed(1) + '%'; };
  var ext = function (url, label) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + label + '</a>'; };

  // ----- Headline -----
  var h = D.headline, diff = h.ready - h.compareReady;
  document.getElementById('headline').innerHTML =
    '<span class="eyebrow" id="hl-label">Kindergarten readiness, ' + h.year + '</span>' +
    '<div class="big">' + pct(h.ready) + '</div>' +
    '<p>of Orange County kindergartners were ready for kindergarten in ' + h.year + '.</p>' +
    '<div class="yrbars" role="img" aria-label="Ready for kindergarten: ' + h.compareYear + ' ' + pct(h.compareReady) + ', ' + h.year + ' ' + pct(h.ready) + '">' +
      [[h.compareYear, h.compareReady, 'var(--c15)'], [h.year, h.ready, 'var(--c25)']].map(function (r) {
        return '<div class="yr" aria-hidden="true"><span>' + r[0] + '</span><span class="track"><span class="fill" style="display:block;width:' + r[1] + '%;background:' + r[2] + '"></span></span><span>' + pct(r[1]) + '</span></div>';
      }).join('') + '</div>' +
    '<div class="change">▲ +' + diff.toFixed(1) + ' percentage points since ' + h.compareYear + '</div>' +
    '<div class="src">Source: ' + ext(h.sourceUrl, esc(h.source)) + '</div>';

  // ----- Live map slot: embed the ArcGIS app once its URL is configured -----
  var slot = document.getElementById('map-slot');
  if (D.mapUrl) {
    slot.innerHTML = '<iframe src="' + esc(D.mapUrl) + '" title="Orange County Early Development Index interactive map" width="100%" height="720" loading="lazy" allow="fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  } else {
    slot.innerHTML = '<div class="map-placeholder"><div class="inner">' +
      '<span class="illustrative">Live map goes here</span>' +
      '<h3>First 5 OC’s live ArcGIS EDI map</h3>' +
      '<p>The real map stays connected to First 5 OC’s ArcGIS application, so neighborhood results, filters and future data updates keep working without a website change. In the new site it embeds here, full width.</p>' +
      '<a class="btn btn-primary" href="' + esc(D.pageUrl) + '" target="_blank" rel="noopener">Open the current live map<span class="sr-only"> on first5oc.org (opens in a new tab)</span></a>' +
      '<p class="src" style="margin-top:14px">For the build team: paste the iframe <code>src</code> from the current EDI page into <code>mapUrl</code> in <code>data/edi.js</code>.</p>' +
      '</div></div>';
  }
  document.getElementById('map-steps').innerHTML = D.mapSteps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');

  // ----- Domain cards -----
  function delta(d) {
    var x = d.y2025 - d.y2015;
    return (x >= 0 ? '▲ +' : '▼ ') + x.toFixed(1) + ' pts';
  }
  document.getElementById('domains').innerHTML = D.domains.map(function (d) {
    return '<article class="domain"><span class="ic" aria-hidden="true">' + d.icon + '</span><h3>' + esc(d.title) + '</h3><p>' + esc(d.text) + '</p>' +
      '<div class="num"><strong>' + pct(d.y2025) + '</strong> on track in 2025<br><span style="color:var(--muted)">' + delta(d) + ' since 2015 (' + pct(d.y2015) + ')</span></div></article>';
  }).join('');

  // ----- Dumbbell chart: 2015 -> 2025 per domain -----
  // Drawn at the container's real pixel width so text stays full size; on
  // narrow screens each label sits above its row instead of to the left.
  var chartEl = document.getElementById('dumbbell');
  function drawChart() {
    var W = Math.max(300, chartEl.clientWidth || 720), narrow = W < 560;
    var rowH = narrow ? 58 : 46, P = narrow ? { l: 12, r: 52, t: 10, b: 30 } : { l: 210, r: 70, t: 26, b: 30 };
    var H = P.t + P.b + rowH * D.domains.length, lo = 60, hi = 90;
    var x = function (v) { return P.l + 40 + (v - lo) / (hi - lo) * (W - P.l - P.r - 40); };
    var grid = [60, 70, 80, 90].map(function (g) {
      return '<line x1="' + x(g) + '" x2="' + x(g) + '" y1="' + (P.t - 4) + '" y2="' + (H - P.b) + '" stroke="#dbe8eb"/>' +
        '<text x="' + x(g) + '" y="' + (H - P.b + 18) + '" text-anchor="middle" font-size="12" fill="#4d6670">' + g + '%</text>';
    }).join('');
    var rows = D.domains.map(function (d, i) {
      var top = P.t + i * rowH, y = narrow ? top + 38 : top + rowH / 2, up = d.y2025 >= d.y2015;
      var a = x(d.y2015), b = x(d.y2025);
      // Each value label sits on the outside of its dot so the pair never collides.
      var l15 = up ? [a - 10, 'end'] : [a + 10, 'start'], l25 = up ? [b + 10, 'start'] : [b - 10, 'end'];
      return '<g class="row" tabindex="0" role="img" aria-label="' + esc(d.title) + ': ' + pct(d.y2015) + ' in 2015, ' + pct(d.y2025) + ' in 2025, ' + delta(d) + '">' +
        '<title>' + esc(d.title) + ': ' + pct(d.y2015) + ' → ' + pct(d.y2025) + ' (' + delta(d) + ')</title>' +
        '<rect x="0" y="' + top + '" width="' + W + '" height="' + rowH + '" fill="transparent"/>' +
        '<text class="lbl" x="' + (narrow ? P.l : 0) + '" y="' + (narrow ? top + 16 : y + 4) + '" font-size="13" font-weight="700" fill="#12313d">' + esc(d.short) + '</text>' +
        '<line x1="' + a + '" x2="' + b + '" y1="' + y + '" y2="' + y + '" stroke="#7a9aa4" stroke-width="2"/>' +
        '<circle cx="' + a + '" cy="' + y + '" r="7" fill="var(--c15)" stroke="#fff" stroke-width="2"/>' +
        '<circle cx="' + b + '" cy="' + y + '" r="8" fill="var(--c25)" stroke="#fff" stroke-width="2"/>' +
        '<text x="' + l15[0] + '" y="' + (y + 4) + '" text-anchor="' + l15[1] + '" font-size="12" fill="#4d6670">' + pct(d.y2015) + '</text>' +
        '<text x="' + l25[0] + '" y="' + (y + 4) + '" text-anchor="' + l25[1] + '" font-size="12.5" font-weight="800" fill="#12313d">' + pct(d.y2025) + '</text>' +
        '</g>';
    }).join('');
    chartEl.innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-labelledby="chart-h">' + grid + rows + '</svg>';
  }
  drawChart();
  var lastW = chartEl.clientWidth;
  window.addEventListener('resize', function () { if (chartEl.clientWidth !== lastW) { lastW = chartEl.clientWidth; drawChart(); } });
  document.getElementById('domain-src').innerHTML = 'Source: ' + ext(D.domainSource.url, esc(D.domainSource.label));

  var tbtn = document.getElementById('table-toggle'), twrap = document.getElementById('domain-table');
  twrap.innerHTML = '<table><caption class="sr-only">Share of Orange County kindergartners on track by EDI domain, 2015 and 2025</caption><thead><tr><th scope="col">Domain</th><th scope="col">2015</th><th scope="col">2025</th><th scope="col">Change</th></tr></thead><tbody>' +
    D.domains.map(function (d) { return '<tr><th scope="row" style="text-align:left;font-weight:700">' + esc(d.title) + '</th><td>' + pct(d.y2015) + '</td><td>' + pct(d.y2025) + '</td><td>' + delta(d) + '</td></tr>'; }).join('') +
    '<tr><th scope="row" style="text-align:left">Ready for kindergarten (all five)</th><td>' + pct(h.compareReady) + '</td><td>' + pct(h.ready) + '</td><td>▲ +' + diff.toFixed(1) + ' pts</td></tr></tbody></table>';
  tbtn.addEventListener('click', function () {
    twrap.hidden = !twrap.hidden;
    tbtn.setAttribute('aria-expanded', !twrap.hidden);
    tbtn.textContent = twrap.hidden ? 'Show as a table' : 'Hide table';
  });

  // ----- Lists -----
  document.getElementById('milestones').innerHTML = D.milestones.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('');
  document.getElementById('uses').innerHTML = D.uses.map(function (u) { return '<span>' + esc(u) + '</span>'; }).join('');
  document.getElementById('facts').innerHTML = D.facts.map(function (f) { return '<div class="fact"><strong>' + esc(f.big) + '</strong><p>' + esc(f.text) + '</p></div>'; }).join('');
  document.getElementById('resources').innerHTML = D.resources.map(function (r) {
    return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + '<span aria-hidden="true">Open →</span><span class="sr-only"> (opens in a new tab)</span></a>';
  }).join('');
  document.getElementById('requests').innerHTML = D.requestOptions.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
  var c = D.contact;
  document.getElementById('contact').innerHTML = '<h3 style="font-size:1.3rem;margin-bottom:8px">Questions about the EDI?</h3>' +
    '<p style="margin:0 0 10px"><strong>' + esc(c.name) + '</strong><br><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></p>' +
    '<p style="margin:0 0 14px">First 5 Orange County<br><a href="mailto:' + esc(c.general) + '">' + esc(c.general) + '</a> · <a href="tel:+17148345310">' + esc(c.phone) + '</a></p>' +
    '<a class="btn btn-primary" href="https://first5oc.org/resources/edi/request-form/" target="_blank" rel="noopener">Request EDI data or help<span class="sr-only"> (opens in a new tab)</span></a>';
})();
