/* Design 2: shared header, footer and small interactions.
   Each page sets <body data-page="..."> so the menu can show where you are. */
(function () {
  var BASE = '/for-ahd/design-2/';
  var NAV = [
    ['about', 'About Us', 'about.html'],
    ['challenge', 'The Challenge', 'the-challenge.html'],
    ['what', 'What We Do', 'what-we-do.html'],
    ['help', 'How You Can Help', 'how-you-can-help.html'],
    ['bike', 'AHCT Bike Ride', 'bike-ride.html'],
    ['cotopaxi', 'Campaign Cotopaxi', 'campaign-cotopaxi.html'],
  ];
  var page = document.body.getAttribute('data-page');

  var links = NAV.map(function (n) {
    return '<a href="' + BASE + n[2] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
  }).join('');

  document.body.insertAdjacentHTML('afterbegin',
    '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="head"><div class="wrap">' +
      '<a class="logo" href="' + BASE + '" aria-label="Andean Health &amp; Development home">' +
        '<img src="/for-ahd/images/ahd-mark.png" alt="" width="78" height="70">' +
        '<span>ANDEAN<small>Health &amp; Development</small></span>' +
      '</a>' +
      '<button class="menu-btn" aria-expanded="false" aria-controls="d2-nav">Menu ☰</button>' +
      '<nav class="nav" id="d2-nav" aria-label="Main">' + links +
        '<a class="btn btn--navy" href="' + BASE + 'donate.html">Donate</a>' +
      '</nav>' +
    '</div></header>');

  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('d2-nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  document.body.insertAdjacentHTML('beforeend',
    '<footer class="foot"><div class="wrap">' +
      '<div class="foot__top">' +
        '<img class="foot__logo" src="/for-ahd/images/ahd-logo.png" alt="Andean Health &amp; Development">' +
        '<div><strong>Donations may be sent to:</strong>Andean Health &amp; Development<br>PO Box 7158<br>Carol Stream, IL 60197-7158</div>' +
        '<div><strong>All other mail should be sent to:</strong>Andean Health &amp; Development<br>643 Northwood Drive<br>South Bend, IN 46617</div>' +
        '<div>Phone: <a href="tel:5742132648">(574) 213-2648</a><br>Email: <a href="mailto:info@andeanhealth.org">info@andeanhealth.org</a><br>Tax ID: 39-1809174</div>' +
      '</div>' +
      '<div class="foot__bottom">' +
        '<nav class="foot__links" aria-label="Footer">' +
          '<a href="' + BASE + 'about.html">About Us</a>' +
          '<a href="' + BASE + 'about.html#news">News &amp; Media</a>' +
          '<a href="mailto:info@andeanhealth.org">Contact Us</a>' +
          '<a href="' + BASE + 'bike-ride.html">AHCT Bike Ride</a>' +
          '<a href="' + BASE + 'donate.html">Donate</a>' +
        '</nav>' +
        '<div class="foot__social">' +
          '<a href="https://www.facebook.com/andeanhealth/" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg></a>' +
          '<a href="http://www.twitter.com/andeanhealth" aria-label="X (Twitter)"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</div></footer>');

  // About page: side tabs
  var tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });
})();
