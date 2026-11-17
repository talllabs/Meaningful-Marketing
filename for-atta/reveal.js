/* Homepage hero: ATTA compass-globe cutout reveal.
   A white layer covers the hero photo with the ATTA mark cut out of it.
   Scrolling zooms into the mark (through the Atlantic) until the photo
   fills the screen, then the headline and buttons fade in. */
(function () {
  var reveal = document.querySelector('.reveal');
  if (!reveal) return;
  var stage = document.getElementById('stage'), svg = document.getElementById('maskSvg'), logo = document.getElementById('maskLogo');
  var shade = document.getElementById('shade'), copy = document.getElementById('copy'), hint = document.getElementById('hint');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reveal.classList.add('is-static'); return; }

  var MARK = 221;                 // the mark's own size (221 x 221 units)
  var ZOOM_X = 110, ZOOM_Y = 165; // open Atlantic between South America and Africa
  var lastW = 0, lastH = 0;

  function layout() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;          // still hidden behind the password screen
    lastW = w; lastH = h;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    // Centre the mark in the space visible below the header when the page first opens,
    // and sit the "Scroll to explore" hint just underneath it.
    var header = document.querySelector('header');
    var avail = h - (header ? header.offsetHeight : 0);
    var size = Math.min(w * (w < 700 ? 0.72 : 0.42), avail * 0.6, 560);
    var s = size / MARK;
    var x = (w - size) / 2, y = Math.max(16, (avail - size) / 2 - 20);
    logo.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + s + ')');
    hint.style.top = (y + size + 26) + 'px';
    hint.style.bottom = 'auto';
    svg.style.transformOrigin = (x + ZOOM_X * s) + 'px ' + (y + ZOOM_Y * s) + 'px';
    update();
  }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  var ticking = false;
  function update() {
    ticking = false;
    if (stage.clientWidth !== lastW || stage.clientHeight !== lastH) { layout(); return; }
    var total = reveal.offsetHeight - stage.offsetHeight;
    var p = total > 0 ? clamp(-reveal.getBoundingClientRect().top / total) : 1;
    svg.style.transform = 'scale(' + (1 + 17 * ease(clamp(p / 0.55))) + ')';   // zoom up to 18x
    svg.style.opacity = String(1 - clamp((p - 0.38) / 0.2));                   // white layer fades away
    hint.style.opacity = String(1 - clamp(p / 0.08));
    var t = ease(clamp((p - 0.6) / 0.22));
    copy.style.opacity = String(t);                                             // copy fades in
    copy.style.transform = 'translateY(' + (32 * (1 - t)) + 'px)';
    copy.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
    shade.style.opacity = String(t);
  }

  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', layout);
  // Keyboard users tabbing into the buttons jump straight to the finished state.
  copy.addEventListener('focusin', function () { window.scrollTo(0, reveal.offsetTop + (reveal.offsetHeight - stage.offsetHeight) * 0.92); });
  // Re-measure once the password screen goes away.
  new MutationObserver(layout).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  layout();
})();
