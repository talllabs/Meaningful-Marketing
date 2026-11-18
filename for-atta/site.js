/* ATTA one-page concept: scroll effects and interactions. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var safeGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var safeSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  /* ---------- Menu ---------- */
  var menu = $('.top__menu'), nav = $('#nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  menu.addEventListener('click', function () {
    var open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Active section in the menu ---------- */
  var links = $$('#nav a[href^="#"]:not(.btn)');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Reveal on scroll + photo wipes + count-ups ---------- */
  function countUp(el) {
    var end = +el.dataset.count, t0 = null;
    if (reduce) { el.textContent = end; return; }
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  // Photo wipes start fully clipped, which IntersectionObserver treats as invisible,
  // so they are opened when the card around them ([data-reveal]) comes into view.
  var revealEls = $$('[data-reveal], [data-count]');
  if (!('IntersectionObserver' in window) || reduce) {
    $$('[data-wipe]').forEach(function (el) { el.classList.add('is-in'); });
    revealEls.forEach(function (el) { el.classList.add('is-in'); if (el.dataset.count) el.textContent = el.dataset.count; });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        $$('[data-wipe]', en.target).forEach(function (w) { w.classList.add('is-in'); });
        if (en.target.dataset.count) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll-driven: progress bar, parallax, pinned events rail ---------- */
  var bar = $('#progress');
  var parallax = reduce ? [] : $$('[data-parallax]');
  var events = $('#events'), rail = $('#rail'), pinned = false, railMax = 0;

  function setupRail() {
    var wide = window.innerWidth >= 900 && !reduce;
    pinned = wide;
    events.classList.toggle('is-pinned', wide);
    if (!wide) { events.style.height = ''; rail.style.transform = ''; return; }
    rail.style.transform = '';
    railMax = Math.max(0, rail.scrollWidth - window.innerWidth);
    events.style.height = (window.innerHeight + railMax) + 'px';
  }

  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = 'scaleX(' + (docH > 0 ? y / docH : 0) + ')';

    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.dataset.parallax) || 0;
      var offset = (r.top + r.height / 2 - vh / 2) * speed * -1;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });

    if (pinned) {
      var top = events.getBoundingClientRect().top;
      var total = events.offsetHeight - vh;
      var p = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 0;
      rail.style.transform = 'translate3d(' + (-railMax * p).toFixed(1) + 'px,0,0)';
    }
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', function () { setupRail(); requestTick(); });
  window.addEventListener('load', function () { setupRail(); requestTick(); });
  // Images load lazily inside the rail, so re-measure once the password screen is gone.
  new MutationObserver(function () { setupRail(); requestTick(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  setupRail(); onScroll();

  /* ---------- Audience tabs ---------- */
  var tabs = $$('.tabs [role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length]; selectTab(n); n.focus();
    });
  });

  /* ---------- HUB: first steps by role ---------- */
  var tasks = {
    'Tour operator': ['Complete your business directory profile', 'Find a potential trade partner', 'Choose a business development course'],
    'Destination': ['Introduce your destination in the directory', 'Find tour operator partners who fit', 'Explore destination research'],
    'Industry partner': ['Describe your services in your profile', 'Find members you can support', 'Choose an industry learning resource']
  };
  var role = $('#role');
  function progress() {
    var n = $$('[data-task]').filter(function (x) { return x.checked; }).length;
    $('#barFill').style.width = (n / 3 * 100) + '%';
    $('#barLabel').textContent = n === 3 ? 'All 3 steps done. Nice work!' : n + ' of 3 steps done';
  }
  function loadRole() {
    safeSet('atta-role', role.value);
    tasks[role.value].forEach(function (t, i) {
      $('[data-task-title="' + i + '"]').textContent = t;
      $('[data-task="' + i + '"]').checked = safeGet('atta-task-' + role.value + i) === 'true';
    });
    progress();
  }
  if (role) {
    role.value = safeGet('atta-role') || 'Tour operator';
    role.addEventListener('change', loadRole);
    $$('[data-task]').forEach(function (x) { x.addEventListener('change', function () { safeSet('atta-task-' + role.value + x.dataset.task, x.checked); progress(); }); });
    loadRole();
  }

  /* ---------- HUB: directory search ---------- */
  var search = $('#search');
  if (search) search.addEventListener('input', function () {
    var q = search.value.toLowerCase();
    $$('.person').forEach(function (c) { c.hidden = q && c.textContent.toLowerCase().indexOf(q) === -1; });
  });
  $$('[data-message]').forEach(function (b) { b.addEventListener('click', function () { b.parentElement.querySelector('.status').textContent = b.dataset.message; }); });

  /* ---------- Early Access countdown ---------- */
  var cd = $('#countdown');
  if (cd) {
    var end = new Date(2026, 11, 31, 23, 59, 59).getTime();
    var tick = function () {
      var ms = Math.max(0, end - Date.now());
      var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
      $('[data-cd="d"]', cd).textContent = d;
      $('[data-cd="h"]', cd).textContent = String(h).padStart(2, '0');
      $('[data-cd="m"]', cd).textContent = String(m).padStart(2, '0');
      cd.setAttribute('aria-label', ms ? d + ' days, ' + h + ' hours and ' + m + ' minutes left of Early Access' : 'Early Access has ended');
    };
    tick(); setInterval(tick, 30000);
  }

  /* ---------- Join form: buttons anywhere pre-fill it ---------- */
  var mode = $('#mode'), category = $('#category'), joinBtn = $('#joinBtn');
  // The button always says what will happen next.
  var labels = { join: 'Join ATTA', create: 'Create free account', renew: 'Renew membership' };
  function labelButton() { if (joinBtn) joinBtn.textContent = labels[mode.value]; }
  if (mode) { mode.addEventListener('change', labelButton); labelButton(); }
  if (category) category.value = safeGet('atta-category') || 'tour-operator';
  $$('a[href="#join"][data-mode], a[href="#join"][data-category]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.dataset.mode) { mode.value = a.dataset.mode; labelButton(); }
      if (a.dataset.category) { category.value = a.dataset.category; safeSet('atta-category', a.dataset.category); }
    });
  });
  if (category) category.addEventListener('change', function () { safeSet('atta-category', category.value); });
  var form = $('#joinForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var who = category.options[category.selectedIndex].text.toLowerCase();
    var msg = {
      join: 'Welcome aboard! Check your inbox to set up your free account, then finish joining as a ' + who + '.',
      create: 'You’re in! Check your inbox to finish setting up your free ATTA account.',
      renew: 'Welcome back! Check your inbox for a secure sign-in link to your HUB and renewal summary.'
    }[mode.value];
    $('#joinStatus').textContent = msg;
  });

  /* ---------- Other demo forms ---------- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); f.querySelector('.status').textContent = f.dataset.demo; });
  });
})();
