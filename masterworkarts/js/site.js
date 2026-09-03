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

  // A Life in the Arts carousel — prev/next, dots, autoplay, swipe.
  var carousel = document.getElementById('loitaCarousel');
  if (carousel) {
    var track = document.getElementById('loitaTrack');
    var slides = track.children;
    var dots = document.querySelectorAll('#loitaDots .loita-dot');
    var index = 0;
    var timer;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('active', di === index); });
    }
    function startAutoplay() {
      timer = setInterval(function () { goTo(index + 1); }, 6000);
    }
    function stopAutoplay() { clearInterval(timer); }

    document.getElementById('loitaPrev').addEventListener('click', function () { goTo(index - 1); stopAutoplay(); startAutoplay(); });
    document.getElementById('loitaNext').addEventListener('click', function () { goTo(index + 1); stopAutoplay(); startAutoplay(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { goTo(parseInt(d.dataset.index, 10)); stopAutoplay(); startAutoplay(); });
    });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    var touchStartX = null;
    carousel.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goTo(index + (dx < 0 ? 1 : -1)); stopAutoplay(); startAutoplay(); }
      touchStartX = null;
    });

    goTo(0);
    startAutoplay();
  }
});
