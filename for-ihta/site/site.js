/* IHTA concept site — shared header, footer, scene art and toast */
(function () {
  var page = document.body.getAttribute('data-page') || '';

  // Illustrated Alaska scene (aurora, peaks, trail) used in hero + banners
  window.IH_SCENE = function (h) {
    h = h || 600;
    return '<svg class="scene" viewBox="0 0 1440 ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1f27"/><stop offset=".55" stop-color="#173f4b"/><stop offset="1" stop-color="#3d6f7a"/></linearGradient>' +
      '<linearGradient id="aur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5fd0a8" stop-opacity="0"/><stop offset=".35" stop-color="#5fd0a8" stop-opacity=".55"/><stop offset=".7" stop-color="#8be0c4" stop-opacity=".35"/><stop offset="1" stop-color="#5fd0a8" stop-opacity="0"/></linearGradient>' +
      '</defs>' +
      '<rect width="1440" height="' + h + '" fill="url(#sky)"/>' +
      '<path d="M0 150 C 260 60 520 210 780 120 S 1220 40 1440 140" stroke="url(#aur)" stroke-width="70" fill="none" opacity=".7"/>' +
      '<path d="M0 220 C 300 140 560 260 860 180 S 1260 120 1440 200" stroke="url(#aur)" stroke-width="34" fill="none" opacity=".45"/>' +
      '<g fill="#fff" opacity=".7"><circle cx="120" cy="60" r="1.6"/><circle cx="340" cy="40" r="1.2"/><circle cx="610" cy="70" r="1.4"/><circle cx="910" cy="36" r="1.2"/><circle cx="1180" cy="80" r="1.6"/><circle cx="1350" cy="44" r="1.1"/><circle cx="760" cy="28" r="1"/></g>' +
      '<path d="M0 ' + (h * .62) + ' L 180 ' + (h * .42) + ' L 300 ' + (h * .55) + ' L 470 ' + (h * .33) + ' L 640 ' + (h * .56) + ' L 820 ' + (h * .38) + ' L 1010 ' + (h * .58) + ' L 1180 ' + (h * .36) + ' L 1440 ' + (h * .6) + ' L 1440 ' + h + ' L 0 ' + h + 'Z" fill="#2c5c67"/>' +
      '<path d="M470 ' + (h * .33) + ' L 520 ' + (h * .4) + ' L 495 ' + (h * .39) + ' L 470 ' + (h * .43) + ' L 445 ' + (h * .39) + ' L 425 ' + (h * .4) + 'Z M1180 ' + (h * .36) + ' L 1230 ' + (h * .43) + ' L 1200 ' + (h * .42) + ' L 1175 ' + (h * .46) + ' L 1150 ' + (h * .41) + ' L 1130 ' + (h * .42) + 'Z" fill="#e9f3f5"/>' +
      '<path d="M0 ' + (h * .74) + ' L 220 ' + (h * .58) + ' L 420 ' + (h * .7) + ' L 640 ' + (h * .56) + ' L 900 ' + (h * .72) + ' L 1120 ' + (h * .6) + ' L 1440 ' + (h * .72) + ' L 1440 ' + h + ' L 0 ' + h + 'Z" fill="#1d4b57"/>' +
      '<path d="M0 ' + (h * .86) + ' C 300 ' + (h * .78) + ' 700 ' + (h * .9) + ' 1000 ' + (h * .82) + ' S 1300 ' + (h * .8) + ' 1440 ' + (h * .84) + ' L 1440 ' + h + ' L 0 ' + h + 'Z" fill="#e8eef0"/>' +
      '<path d="M60 ' + (h * .97) + ' C 400 ' + (h * .86) + ' 760 ' + (h * .95) + ' 1380 ' + (h * .85) + '" stroke="#c8562a" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round" fill="none"/>' +
      '</svg>';
  };

  var mark = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 25 L12 11 L17 18 L21 13 L29 25Z" fill="#9cc9d6"/><path d="M12 11 L14.5 15 L12 14 L9.6 15Z" fill="#fff"/><path d="M4 28 C 12 24 20 29 28 26" stroke="#f3c26b" stroke-width="2" stroke-dasharray="1 3" stroke-linecap="round" fill="none"/></svg>';

  function link(href, label, key) {
    return '<a href="' + href + '"' + (page === key ? ' class="on" aria-current="page"' : '') + '>' + label + '</a>';
  }

  var header =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<div class="concept-ribbon">Concept mockup by Meaningful Marketing House · placeholder content for illustration only</div>' +
    '<div class="topbar"><div class="wrap"><span>Seward to Nome · Iditarod National Historic Trail</span><div class="toplinks"><a href="library.html">Document Library</a><a href="support.html#join">Become a Member</a><a href="admin.html">Staff Login</a></div></div></div>' +
    '<header class="site"><div class="wrap nav">' +
      '<a class="logo" href="index.html"><span class="logo-mark">' + mark + '</span><span class="logo-text">Iditarod Historic<br>Trail Alliance<small>Connecting people to the Trail</small></span></a>' +
      '<nav class="menu-links" id="menuLinks" aria-label="Main">' +
        link('plan.html', 'Plan a Trip', 'plan') +
        link('index.html#learn', 'Learn', 'learn') +
        link('support.html#involved', 'Get Involved', 'involved') +
        link('index.html#about', 'About', 'about') +
        link('support.html#store', 'Store', 'store') +
      '</nav>' +
      '<a class="btn btn-ember" href="support.html#donate">Donate</a>' +
      '<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false">☰</button>' +
    '</div></header>';

  var footer =
    '<section class="signup" aria-label="Email signup"><div class="wrap"><div><span class="eyebrow">Trail Notes</span><h2>Get Trail news, projects and events in your inbox.</h2></div>' +
    '<form class="js-signup"><label for="nl-email" style="position:absolute;left:-9999px">Email</label><input id="nl-email" type="email" placeholder="Your email address" required><button class="btn btn-ember" type="submit">Sign Up</button></form></div></section>' +
    '<footer class="site"><div class="wrap"><div class="foot-grid">' +
      '<div><span class="logo-text" style="color:#fff">Iditarod Historic Trail Alliance</span><p style="margin:12px 0 0;max-width:300px">A nonprofit partner helping people find, use and care for the Iditarod National Historic Trail.</p></div>' +
      '<div><h4>Plan a Trip</h4><a href="plan.html">Trail Sections</a><a href="plan.html">Access Points</a><a href="plan.html">Passport Program</a></div>' +
      '<div><h4>Learn</h4><a href="index.html#history">History</a><a href="index.html#communities">Communities</a><a href="library.html">Document Library</a></div>' +
      '<div><h4>Get Involved</h4><a href="support.html#join">Join or Renew</a><a href="support.html#donate">Donate</a><a href="support.html#involved">Volunteer</a></div>' +
      '<div><h4>About</h4><a href="index.html#about">Our Mission</a><a href="index.html#news">Projects &amp; News</a><a href="admin.html">Staff Login</a></div>' +
    '</div><div class="foot-bottom"><span>© Iditarod Historic Trail Alliance · concept mockup</span><span>Accessible to WCAG 2.2 AA · Secure payments</span></div></div></footer>' +
    '<div class="toast" role="status" aria-live="polite"></div>';

  var h = document.getElementById('site-header');
  var f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  document.querySelectorAll('[data-scene]').forEach(function (el) {
    el.insertAdjacentHTML('afterbegin', window.IH_SCENE(parseInt(el.getAttribute('data-scene'), 10) || 600));
  });

  var toastEl = document.querySelector('.toast'), t;
  window.ihToast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(t);
    t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  };

  var burger = document.getElementById('burger'), links = document.getElementById('menuLinks');
  if (burger && links) burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.querySelectorAll('.js-signup').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.reset();
      window.ihToast('Thanks! You\'re signed up for Trail Notes. (Demo — nothing was sent.)');
    });
  });
})();
