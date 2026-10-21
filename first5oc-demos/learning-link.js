(function () {
  var D = window.F5_DATA.learningLink, esc = F5.esc;
  var form = document.getElementById('ll-form');
  var out = document.getElementById('ll-out');
  var q = document.getElementById('ll-q');
  var districtSel = document.getElementById('ll-district');
  var free = document.getElementById('ll-free');
  var main = document.getElementById('ll-main');
  var DAYS = [['Mon', 'monday'], ['Tue', 'tuesday'], ['Wed', 'wednesday'], ['Thu', 'thursday'], ['Fri', 'friday']];
  var DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };

  // ----- Hero -----
  var photo = document.getElementById('ll-photo');
  photo.src = D.photo.url; photo.alt = D.photo.alt;
  photo.addEventListener('error', function () { photo.closest('figure').style.display = 'none'; });
  document.getElementById('ll-story').href = D.photo.story;
  document.getElementById('ll-facts').innerHTML =
    '<span class="fact"><strong>' + D.locations.length + '</strong> current program sites</span>' +
    '<span class="fact">Orange County · ' + esc(D.fiscalYear) + '</span>' +
    '<span class="fact">Updated ' + esc(D.updated) + '</span>';

  // ----- Controls -----
  districtSel.innerHTML += D.districts.map(function (d) {
    return '<option value="' + esc(d.name) + '">' + esc(d.name) + (d.status === 'coming_soon' ? ' (coming soon)' : '') + '</option>';
  }).join('');
  F5.renderChecks(document.getElementById('ll-days'), DAYS.map(function (d) { return { id: d[0], label: d[0] }; }), 'day', 'chip');
  F5.renderChecks(document.getElementById('ll-times'), [{ id: 'morning', label: 'Morning' }, { id: 'afternoon', label: 'Afternoon' }], 'time', 'chip');

  // ----- Read days/times from the published text (the text itself is shown unchanged) -----
  function daysOf(s) {
    var t = s.toLowerCase(), idx = DAYS.map(function (d) { return t.indexOf(d[1]); });
    var range = t.match(/(monday|tuesday|wednesday|thursday|friday)s? through (monday|tuesday|wednesday|thursday|friday)/);
    if (range) {
      var a = DAYS.findIndex(function (d) { return d[1] === range[1]; }), b = DAYS.findIndex(function (d) { return d[1] === range[2]; });
      return DAYS.slice(a, b + 1).map(function (d) { return d[0]; });
    }
    return DAYS.filter(function (d, i) { return idx[i] !== -1; }).map(function (d) { return d[0]; });
  }
  // Start time of each listed session -> morning (before noon) or afternoon.
  function timesOf(s) {
    var set = {};
    s.split(/[;,]/).forEach(function (seg) {
      var m = seg.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)/i);
      if (!m) return;
      var h = (+m[1] % 12) + (m[2].toLowerCase() === 'pm' ? 12 : 0);
      set[h < 12 ? 'morning' : 'afternoon'] = 1;
    });
    return Object.keys(set);
  }
  D.locations.forEach(function (l) { l._days = daysOf(l.days); l._times = timesOf(l.times); });
  // Sites in the same city share one approximate point; fan them out in a small
  // ring (a few hundred meters) so each pin can be seen and clicked.
  var perCity = {};
  D.locations.forEach(function (l) { (perCity[l.city] = perCity[l.city] || []).push(l); });
  Object.keys(perCity).forEach(function (c) {
    var group = perCity[c];
    group.forEach(function (l, i) {
      var r = group.length > 1 ? 0.004 + 0.0015 * Math.floor(i / 8) : 0, a = (i % 8) / 8 * 2 * Math.PI + Math.floor(i / 8) * 0.4;
      l._lat = l.approxLat + r * Math.sin(a); l._lng = l.approxLng + r * Math.cos(a);
    });
  });

  function telLinks(phone) {
    return phone.split('/').map(function (p) {
      p = p.trim();
      var m = p.match(/^([\d-]+)(?:\s*ext\.?\s*(\d+))?/i);
      if (!m) return esc(p);
      var digits = m[1].replace(/\D/g, '');
      return '<a href="tel:+1' + digits + (m[2] ? ';ext=' + m[2] : '') + '">' + esc(p) + '</a>';
    }).join(' / ');
  }
  function directions(addr) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr); }

  function state() {
    return { q: q.value.trim(), district: districtSel.value, day: F5.checked(form, 'day'), time: F5.checked(form, 'time'), free: free.checked };
  }
  function match(l, s) {
    if (s.district && l.district !== s.district) return false;
    if (s.q && !F5.matchesQuery([l.name, l.district, l.city, l.address].join(' '), s.q)) return false;
    if (s.day.length && !s.day.some(function (d) { return l._days.indexOf(d) !== -1; })) return false;
    if (s.time.length && !s.time.some(function (t) { return l._times.indexOf(t) !== -1; })) return false;
    if (s.free && l.fee !== 'No fee') return false;
    return true;
  }

  function card(l) {
    var soon = l.status !== 'open';
    var tbd = /^tbd$/i.test(l.days.trim());
    return '<article class="loc" id="loc-' + l.id + '" aria-labelledby="h-' + l.id + '">' +
      '<span class="district">' + esc(l.district) + '</span>' +
      '<h3 id="h-' + l.id + '">' + esc(l.name) +
        (soon ? '<span class="status soon">Opening Winter 2027</span>' : tbd ? '<span class="status soon">Schedule TBD</span>' : '') +
        (l.fee === 'No fee' ? '<span class="status fee">No fee</span>' : '') + '</h3>' +
      '<dl>' +
        '<dt>Where</dt><dd><address>' + esc(l.address) + '</address></dd>' +
        '<dt>Days</dt><dd>' + esc(l.days) + '</dd>' +
        (l.times ? '<dt>Times</dt><dd>' + esc(l.times) + '</dd>' : '') +
        '<dt>Fee</dt><dd>' + esc(l.fee) + '</dd>' +
        '<dt>Phone</dt><dd>' + telLinks(l.phone) + '</dd>' +
      '</dl>' +
      (l.qa_note ? '<div class="qa"><strong>To confirm with First 5 OC:</strong> ' + esc(l.qa_note) + '</div>' : '') +
      '<div class="actions">' +
        (l.url && !soon ? '<a class="btn btn-primary btn-small" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">More info / register<span class="sr-only"> for ' + esc(l.name) + ' (opens in a new tab)</span></a>'
                        : '<span style="align-self:center;font-size:.88rem;color:var(--muted)">' + (soon ? 'Registration not open yet. Call for details.' : 'Call the site to register.') + '</span>') +
        '<a class="btn btn-outline btn-small" href="' + directions(l.address) + '" target="_blank" rel="noopener noreferrer">Directions<span class="sr-only"> to ' + esc(l.name) + ' (opens Google Maps)</span></a>' +
        '<button type="button" class="btn btn-outline btn-small" data-show="' + l.id + '">Show on map<span class="sr-only">: ' + esc(l.name) + '</span></button>' +
      '</div></article>';
  }

  // ----- Map (progressive enhancement: the list works without it) -----
  var map = null, cluster = null, markers = {};
  try {
    if (!window.L || !L.markerClusterGroup) throw new Error('Leaflet not loaded');
    map = L.map('ll-map', { scrollWheelZoom: false }).setView([33.72, -117.83], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    cluster = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 45 });
    map.addLayer(cluster);
    D.locations.forEach(function (l) {
      var m = L.marker([l._lat, l._lng], {
        icon: L.divIcon({ className: 'pin', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] }),
        title: l.name, alt: l.name, keyboard: true
      });
      m.bindPopup('<strong>' + esc(l.name) + '</strong><br>' + esc(l.district) + '<br>' + esc(l.address) + '<br>' + esc(l.days) +
        (l.times ? '<br>' + esc(l.times) : '') + '<br><a href="#loc-' + l.id + '" data-jump="' + l.id + '">See full details</a>');
      m.on('click', function () { highlight(l.id, false); });
      markers[l.id] = m;
    });
  } catch (e) {
    document.getElementById('ll-map').innerHTML = '<div class="map-fail"><p><strong>The map couldn’t load.</strong><br>Every location is listed with its address, schedule and phone number.</p></div>';
    map = null;
  }

  function highlight(id, scroll) {
    out.querySelectorAll('.loc.hl').forEach(function (c) { c.classList.remove('hl'); });
    document.querySelectorAll('.pin.active').forEach(function (p) { p.classList.remove('active'); });
    var c = document.getElementById('loc-' + id);
    if (c) { c.classList.add('hl'); if (scroll) c.scrollIntoView({ block: 'nearest' }); }
    var m = markers[id];
    if (m && m.getElement()) m.getElement().classList.add('active');
  }

  function showOnMap(id) {
    if (!map) return;
    if (window.matchMedia('(max-width: 900px)').matches) {
      setView('map', true);
      document.getElementById('ll-map').scrollIntoView({ block: 'start' });
    }
    map.stop();
    map.invalidateSize();
    // Jump straight to the pin and open a standalone popup at its position.
    // (markercluster's zoomToShowLayer and marker.openPopup both fail now and
    // then while the cluster is still regrouping, so neither is relied on.)
    var m = markers[id];
    map.setView(m.getLatLng(), 15, { animate: false });
    L.popup({ offset: [0, -28] }).setLatLng(m.getLatLng()).setContent(m.getPopup().getContent()).openOn(map);
    highlight(id, false);
  }

  function chips(s) {
    var o = [];
    if (s.q) o.push(['q', '', '“' + s.q + '”']);
    if (s.district) o.push(['district', '', s.district]);
    s.day.forEach(function (v) { o.push(['day', v, DAY_FULL[v]]); });
    s.time.forEach(function (v) { o.push(['time', v, v === 'morning' ? 'Morning' : 'Afternoon']); });
    if (s.free) o.push(['free', '', 'No fee only']);
    return o;
  }

  var lastKey = null;
  function render() {
    var s = state(), key = JSON.stringify(s);
    if (key === lastKey) return;
    lastKey = key;
    var list = D.locations.filter(function (l) { return match(l, s); });
    var dist = D.districts.filter(function (d) { return d.name === s.district; })[0];
    document.getElementById('ll-count').textContent = list.length === 1 ? '1 location' : list.length + ' locations';
    document.getElementById('ll-active').innerHTML = chips(s).map(function (c) {
      return '<button type="button" data-kind="' + c[0] + '" data-val="' + esc(c[1]) + '" aria-label="Remove filter: ' + esc(c[2]) + '">' + esc(c[2]) + '</button>';
    }).join('');

    if (dist && dist.status === 'coming_soon') {
      out.innerHTML = '<div class="coming"><h3 style="font-size:1.3rem;margin-bottom:6px">' + esc(dist.name) + '</h3><p style="margin:0">' + esc(dist.note) + '.</p></div>';
    } else if (!list.length) {
      out.innerHTML = '<div class="empty"><h3>No locations match</h3><p>Try another day or time, or search a nearby city. Sites and schedules are updated each fiscal year.</p><button type="button" class="btn btn-dark" data-clear>Clear all filters</button></div>';
    } else {
      out.innerHTML = '<div class="loc-list">' + list.map(card).join('') + '</div>';
    }

    if (map) {
      cluster.clearLayers();
      cluster.addLayers(list.map(function (l) { return markers[l.id]; }));
      shown = list;
      fitMap();
    }
  }

  var shown = [];
  // If the map started hidden (zero size, e.g. behind the password gate or on
  // the mobile list view), re-fit it the first time it becomes visible.
  var mapEl = document.getElementById('ll-map'), wasZero = !mapEl.offsetWidth;
  window.addEventListener('resize', function () {
    if (!map) return;
    var zero = !mapEl.offsetWidth;
    if (wasZero && !zero) { map.invalidateSize(); fitMap(); }
    wasZero = zero;
  });
  function fitMap() {
    if (shown.length > 1) map.fitBounds(L.latLngBounds(shown.map(function (l) { return [l._lat, l._lng]; })), { padding: [40, 40], maxZoom: 13, animate: false });
    else if (shown.length === 1) map.setView([shown[0]._lat, shown[0]._lng], 13, { animate: false });
    else map.setView([33.72, -117.83], 10);
  }

  function setView(v, keepPosition) {
    main.dataset.view = v;
    document.querySelectorAll('.viewtoggle button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.view === v); });
    // The map was hidden (zero size) on small screens, so re-measure and re-fit it.
    if (v === 'map' && map && !keepPosition) setTimeout(function () { map.invalidateSize(); fitMap(); }, 0);
  }
  document.querySelectorAll('.viewtoggle button').forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.view); }); });

  function clearAll() { form.reset(); render(); q.focus(); }
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  document.getElementById('ll-clear').addEventListener('click', clearAll);
  out.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear]')) return clearAll();
    var b = e.target.closest('[data-show]'); if (b) showOnMap(b.dataset.show);
  });
  document.getElementById('ll-map').addEventListener('click', function (e) {
    var a = e.target.closest('[data-jump]'); if (!a) return;
    e.preventDefault();
    if (window.matchMedia('(max-width: 900px)').matches) setView('list');
    highlight(a.dataset.jump, true);
    var h = document.getElementById('h-' + a.dataset.jump);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  });
  document.getElementById('ll-active').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = b.dataset.kind;
    if (k === 'q') q.value = '';
    else if (k === 'district') districtSel.value = '';
    else if (k === 'free') free.checked = false;
    else { var i = form.querySelector('input[name="' + k + '"][value="' + b.dataset.val + '"]'); if (i) i.checked = false; }
    render();
    (document.querySelector('#ll-active button') || q).focus();
  });

  render();
})();
