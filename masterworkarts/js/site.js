document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Top announcement banner — dismissible, remembered per browser.
  var banner = document.getElementById('topBanner');
  if (banner) {
    try {
      if (localStorage.getItem('mw-banner-dismissed') === '1') {
        banner.hidden = true;
      }
    } catch (e) {}
    var closeBanner = banner.querySelector('.close-banner');
    if (closeBanner) {
      closeBanner.addEventListener('click', function () {
        banner.hidden = true;
        try { localStorage.setItem('mw-banner-dismissed', '1'); } catch (e) {}
      });
    }
  }

  // Lightbox pop-up — shown once per browser per launch.
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('mw-lightbox-seen') === '1'; } catch (e) {}
    if (!alreadySeen) {
      setTimeout(function () {
        lightbox.classList.add('open');
        try { sessionStorage.setItem('mw-lightbox-seen', '1'); } catch (e) {}
      }, 1200);
    }
    function closeLightbox() { lightbox.classList.remove('open'); }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Board access portal — placeholder client-side gate for the demo build.
  var gateForm = document.getElementById('boardGate');
  if (gateForm) {
    gateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pass = document.getElementById('boardPassword').value.trim().toLowerCase();
      var error = document.getElementById('gateError');
      if (pass === 'masterwork2026') {
        document.getElementById('boardContent').classList.add('show');
        gateForm.style.display = 'none';
      } else {
        error.classList.add('show');
      }
    });
  }

  // Newsletter signup — placeholder submit handler; wire to Mailchimp's
  // hosted form action once the client account is created.
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = newsletterForm.querySelector('button');
      btn.textContent = 'Subscribed';
      btn.disabled = true;
    });
  }
});
