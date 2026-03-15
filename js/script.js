/* =====================================================
   MEANINGFUL MARKETING — INTERACTIONS
   ===================================================== */

/* --------------------------------------------------
   VIDEO LIGHTBOX
   -------------------------------------------------- */
const videoOverlay = document.getElementById('videoOverlay');
const videoClose   = document.getElementById('videoClose');
const videoFrame   = document.getElementById('videoFrame');

const videoNative = document.getElementById('videoNative');

function openVideo(el) {
  const mp4 = el.dataset.mp4;
  if (mp4) {
    videoFrame.hidden = true;
    videoNative.src = mp4;
    videoNative.hidden = false;
    videoNative.play();
  } else {
    videoNative.hidden = true;
    videoFrame.hidden = false;
    videoFrame.src = `https://player.vimeo.com/video/${el.dataset.vimeo}?autoplay=1&title=0&byline=0&portrait=0`;
  }
  videoOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  videoOverlay.classList.remove('is-open');
  videoFrame.src = '';
  videoNative.pause();
  videoNative.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.js-open-video').forEach(el => {
  el.addEventListener('click', () => openVideo(el));
});

videoClose.addEventListener('click', closeVideo);
videoOverlay.addEventListener('click', (e) => {
  if (e.target === videoOverlay) closeVideo();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoOverlay.classList.contains('is-open')) closeVideo();
});

/* --------------------------------------------------
   CONTACT MODAL
   -------------------------------------------------- */
const contactModal = document.getElementById('contactModal');
const modalClose   = document.getElementById('modalClose');
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

function openContactModal() {
  contactModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  // Reset to form view if previously submitted
  contactForm.hidden = false;
  formSuccess.hidden = true;
  contactForm.reset();
}

function closeContactModal() {
  contactModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

// All "open contact" triggers
document.querySelectorAll('.js-open-contact').forEach(el => {
  el.addEventListener('click', openContactModal);
});

// Close button
modalClose.addEventListener('click', closeContactModal);

// Close on backdrop click
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('is-open')) closeContactModal();
});

// Form submission via Formspree
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // ← replace with your ID from formspree.io

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate required fields
  let valid = true;
  contactForm.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('is-error');
    if (!field.value.trim()) {
      field.classList.add('is-error');
      valid = false;
    }
  });
  if (!valid) return;

  const submitBtn = contactForm.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm),
    });

    if (res.ok) {
      contactForm.hidden = true;
      formSuccess.hidden = false;
    } else {
      const data = await res.json();
      const msg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
      alert(msg);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  } catch {
    alert('Network error — please check your connection and try again.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

/* --------------------------------------------------
   NAV: scroll state
   -------------------------------------------------- */
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* --------------------------------------------------
   MOBILE MENU
   -------------------------------------------------- */
const burger      = document.getElementById('burger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on backdrop click
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMobileMenu();
});

/* --------------------------------------------------
   SCROLL REVEAL
   -------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal-up').forEach(el => {
  revealObserver.observe(el);
});

/* --------------------------------------------------
   SMOOTH SCROLL for anchor links
   -------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* --------------------------------------------------
   TICKER: pause on hover
   -------------------------------------------------- */
const tickerInner = document.querySelector('.ticker-inner');
if (tickerInner) {
  tickerInner.addEventListener('mouseenter', () => {
    tickerInner.style.animationPlayState = 'paused';
  });
  tickerInner.addEventListener('mouseleave', () => {
    tickerInner.style.animationPlayState = 'running';
  });
}

/* --------------------------------------------------
   SERVICE CARDS: stagger on reveal + click-to-open on touch
   -------------------------------------------------- */
document.querySelectorAll('.svc-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.07}s`);
});

// On touch devices hover doesn't fire, so toggle via click
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('click', () => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) return;
    const isOpen = card.classList.contains('is-open');
    // Close any other open card
    document.querySelectorAll('.svc-card.is-open').forEach(c => c.classList.remove('is-open'));
    if (!isOpen) card.classList.add('is-open');
  });
});
