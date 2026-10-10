/* Design 3 "The Climb": shared top bar, full-screen menu, footer,
   altitude meter, headline swapper, sideways hospital scroll, reveals. */
(function () {
  var BASE = '/for-ahd/design-3/';
  var SUMMIT = 5897; // Cotopaxi, in meters
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Top bar + menu ----------
  document.body.insertAdjacentHTML('afterbegin',
    '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="top">' +
      '<a class="top__logo" href="' + BASE + '" aria-label="Andean Health &amp; Development home"><img src="/for-ahd/images/ahd-mark.png" alt="" width="45" height="40"><span>ANDEAN</span></a>' +
      '<div class="top__actions">' +
        '<a class="pill pill--give" href="' + BASE + 'donate.html">Give</a>' +
        '<button class="pill" id="menuOpen" aria-expanded="false" aria-controls="menu">Menu</button>' +
      '</div>' +
    '</header>' +
    '<nav class="menu" id="menu" aria-label="Main">' +
      '<button class="pill menu__close" id="menuClose">Close ✕</button>' +
      '<a href="' + BASE + '#challenge">The Challenge<small>Base camp</small></a>' +
      '<a href="' + BASE + '#hospitals">Our Hospitals<small>Camp 1</small></a>' +
      '<a href="' + BASE + '#residency">Training Doctors<small>Camp 2</small></a>' +
      '<a href="' + BASE + '#institute">Research<small>Camp 3</small></a>' +
      '<a href="' + BASE + 'campaign-cotopaxi.html">Campaign Cotopaxi<small>The summit</small></a>' +
      '<a href="' + BASE + '#people">Who We Are</a>' +
      '<a href="' + BASE + 'donate.html">Give</a>' +
    '</nav>');
  var menu = document.getElementById('menu');
  var openBtn = document.getElementById('menuOpen');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('menuClose').focus();
  }
  openBtn.addEventListener('click', function () { setMenu(true); });
  document.getElementById('menuClose').addEventListener('click', function () { setMenu(false); openBtn.focus(); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); openBtn.focus(); } });

  // ---------- Footer ----------
  document.body.insertAdjacentHTML('beforeend',
    '<footer class="foot"><div class="pad">' +
      '<div class="foot__big">Change the world,<br><span>one region at a time.</span></div>' +
      '<div class="foot__grid">' +
        '<div><img src="/for-ahd/images/ahd-logo.png" alt="Andean Health &amp; Development" style="width:120px;background:#fff;padding:10px;border-radius:6px"></div>' +
        '<div><h4>Mail a gift</h4><address>Andean Health &amp; Development<br>PO Box 7158<br>Carol Stream, IL 60197-7158</address></div>' +
        '<div><h4>Other mail</h4><address>643 Northwood Drive<br>South Bend, IN 46617</address></div>' +
        '<div><h4>Talk to us</h4><a href="tel:5742132648">(574) 213-2648</a><br><a href="mailto:info@andeanhealth.org">info@andeanhealth.org</a><br>Tax ID 39-1809174</div>' +
      '</div>' +
    '</div></footer>');

  // ---------- Altitude meter ----------
  if (document.body.getAttribute('data-page') === 'home') {
    document.body.insertAdjacentHTML('beforeend',
      '<div class="alti" aria-hidden="true"><div class="alti__num">0 M</div><div class="alti__track"><div class="alti__fill"></div><div class="alti__dot"></div></div></div>');
    var num = document.querySelector('.alti__num');
    var fill = document.querySelector('.alti__fill');
    var dot = document.querySelector('.alti__dot');
    var alti = document.querySelector('.alti');
    var onScroll = function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      num.textContent = Math.round(p * SUMMIT).toLocaleString() + ' M';
      fill.style.height = (p * 100) + '%';
      dot.style.bottom = (p * 100) + '%';
      alti.style.setProperty('--p', (p * 100) + '%');
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  // ---------- Headline word swap ----------
  var swap = document.querySelector('.swap');
  if (swap && !reduced) {
    var words = swap.getAttribute('data-words').split('|');
    var i = 0;
    setInterval(function () {
      swap.classList.add('is-out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        swap.querySelector('span').textContent = words[i];
        swap.setAttribute('data-c', String(i));
        swap.classList.remove('is-out');
      }, 350);
    }, 2600);
  }

  // ---------- Sideways scroll for the hospital cards (desktop) ----------
  var hs = document.querySelector('.hscroll');
  if (hs) {
    var track = hs.querySelector('.hscroll__track');
    var size = function () {
      if (innerWidth <= 900 || reduced) { hs.style.height = ''; track.style.transform = ''; return; }
      var extra = track.scrollWidth - innerWidth;
      hs.style.height = (innerHeight + Math.max(0, extra)) + 'px';
      move();
    };
    var move = function () {
      if (innerWidth <= 900 || reduced) return;
      var r = hs.getBoundingClientRect();
      var extra = track.scrollWidth - innerWidth;
      var p = Math.min(1, Math.max(0, -r.top / Math.max(1, hs.offsetHeight - innerHeight)));
      track.style.transform = 'translateX(' + (-p * Math.max(0, extra)) + 'px)';
    };
    addEventListener('scroll', move, { passive: true });
    addEventListener('resize', size);
    addEventListener('load', size);
    size();
  }

  // ---------- Reveal on scroll ----------
  var els = document.querySelectorAll('.rise');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
