/* =====================================================
   MEANINGFUL MARKETING — INTERACTIONS
   ===================================================== */

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
