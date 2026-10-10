/* ==================================================
   Shared header, footer and small interactions for
   every page of the AHD website concept.
   Each page sets  <body data-page="...">  so the
   menu can highlight where you are.
   ================================================== */
(function () {
  var BASE = '/for-ahd/design-1/';
  var NAV = [
    ['about', 'About Us', 'about.html'],
    ['challenge', 'The Challenge', 'the-challenge.html'],
    ['what-we-do', 'What We Do', 'what-we-do.html'],
    ['help', 'How You Can Help', 'how-you-can-help.html'],
    ['cotopaxi', 'Campaign Cotopaxi', 'campaign-cotopaxi.html'],
    ['bike', 'Bike Ride', 'bike-ride.html'],
    ['news', 'News', 'news.html'],
  ];
  var page = document.body.getAttribute('data-page');

  // ---------- Mountains (echo the logo's triangle) ----------
  var MOUNTAINS =
    '<svg class="mountains" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">' +
    '<polygon fill="#A8D4EE" points="0,220 0,150 140,70 260,140 420,40 560,130 700,60 860,150 1000,50 1160,140 1300,80 1440,130 1440,220"/>' +
    '<polygon fill="#7DBFE6" points="0,220 0,180 180,110 330,175 520,95 690,180 880,105 1060,185 1240,115 1440,175 1440,220"/>' +
    '<polygon fill="#FFFFFF" points="0,220 0,205 240,160 480,200 760,150 1040,205 1300,165 1440,195 1440,220"/>' +
    '</svg>';
  var PHOTO_ART =
    '<svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">' +
    '<polygon fill="rgba(255,255,255,.35)" points="0,160 0,90 70,40 130,85 210,20 290,95 350,55 400,80 400,160"/>' +
    '<polygon fill="rgba(28,78,116,.35)" points="0,160 0,120 90,80 170,125 260,70 340,120 400,100 400,160"/>' +
    '</svg>';

  document.querySelectorAll('[data-mountains]').forEach(function (el) {
    el.insertAdjacentHTML('beforeend', MOUNTAINS);
  });
  document.querySelectorAll('.photo[data-label]').forEach(function (el) {
    if (el.querySelector('img')) return;
    el.insertAdjacentHTML('afterbegin', PHOTO_ART);
    var label = document.createElement('span');
    label.className = 'photo__label';
    label.textContent = el.getAttribute('data-label');
    el.appendChild(label);
  });

  // ---------- Header ----------
  var navLinks = NAV.map(function (n) {
    return '<a href="' + BASE + n[2] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
  }).join('');

  var header =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<div class="utility"><div class="container">' +
      '<span class="utility__tag">Quality, sustainable health care for Latin America’s underserved</span>' +
      '<span class="utility__links">' +
        '<a class="utility__phone" href="tel:5742132648">(574) 213-2648</a>' +
        '<a href="/for-ahd/design-1/contact.html">Contact</a>' +
      '</span>' +
    '</div></div>' +
    '<header class="header"><div class="container">' +
      '<a class="brand" href="/for-ahd/design-1/" aria-label="Andean Health &amp; Development home">' +
        '<img src="/for-ahd/images/ahd-mark.png" alt="" width="62" height="56">' +
        '<span class="brand__text"><strong>ANDEAN</strong><span>Health &amp; Development</span></span>' +
      '</a>' +
      '<button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>' +
      '<nav class="nav" id="site-nav" aria-label="Main">' + navLinks +
        '<a class="btn btn--give" href="/for-ahd/design-1/donate.html"' + (page === 'donate' ? ' aria-current="page"' : '') + '>Donate</a>' +
      '</nav>' +
    '</div></header>';
  document.body.insertAdjacentHTML('afterbegin', header);

  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // ---------- Footer ----------
  var footer =
    '<footer class="footer"><div class="container">' +
      '<div class="footer__grid">' +
        '<div>' +
          '<img class="footer__logo" src="/for-ahd/images/ahd-logo.png" alt="Andean Health &amp; Development">' +
          '<p>Quality, sustainable health care for Latin America’s underserved, since 1997.</p>' +
          '<div class="footer__social">' +
            '<a href="https://www.facebook.com/andeanhealth/" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg></a>' +
            '<a href="http://www.twitter.com/andeanhealth" aria-label="X (Twitter)"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg></a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<h4>Explore</h4>' +
          '<ul>' +
            '<li><a href="/for-ahd/design-1/about.html">About Us</a></li>' +
            '<li><a href="/for-ahd/design-1/what-we-do.html">What We Do</a></li>' +
            '<li><a href="/for-ahd/design-1/campaign-cotopaxi.html">Campaign Cotopaxi</a></li>' +
            '<li><a href="/for-ahd/design-1/news.html">News &amp; Media</a></li>' +
            '<li><a href="/for-ahd/design-1/bike-ride.html">AHCT Bike Ride</a></li>' +
            '<li><a href="/for-ahd/design-1/contact.html">Contact Us</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<h4>Mail a gift</h4>' +
          '<address>Andean Health &amp; Development<br>PO Box 7158<br>Carol Stream, IL 60197-7158</address>' +
          '<p style="font-size:14px;margin:0">Tax ID: 39-1809174</p>' +
        '</div>' +
        '<div>' +
          '<h4>Get in touch</h4>' +
          '<address>643 Northwood Drive<br>South Bend, IN 46617</address>' +
          '<p style="margin:0"><a href="tel:5742132648">(574) 213-2648</a><br><a href="mailto:info@andeanhealth.org">info@andeanhealth.org</a></p>' +
        '</div>' +
      '</div>' +
      '<div class="footer__bottom">' +
        '<span>© Andean Health &amp; Development. A 501(c)(3) nonprofit organization.</span>' +
        '<a href="/for-ahd/design-1/donate.html">Donate</a>' +
      '</div>' +
    '</div></footer>';
  document.body.insertAdjacentHTML('beforeend', footer);

  // ---------- Rotating word in the home hero ----------
  var rot = document.querySelector('.rotator');
  if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var words = rot.getAttribute('data-words').split('|');
    var i = 0;
    setInterval(function () {
      rot.classList.add('is-out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        rot.textContent = words[i];
        rot.classList.remove('is-out');
      }, 350);
    }, 3200);
  }

  // ---------- Reveal on scroll + progress bars ----------
  var targets = document.querySelectorAll('.reveal, .progress span');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.dataset.width) e.target.style.width = e.target.dataset.width;
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) {
      t.classList.add('is-in');
      if (t.dataset.width) t.style.width = t.dataset.width;
    });
  }
})();
