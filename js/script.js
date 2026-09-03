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
  const mp4     = el.dataset.mp4;
  const youtube = el.dataset.youtube;
  if (mp4) {
    videoFrame.hidden = true;
    videoNative.src = mp4;
    videoNative.hidden = false;
    videoNative.load();
    videoNative.play().then(() => {
      videoNative.muted = false;
    }).catch(() => {});
  } else if (youtube) {
    videoNative.hidden = true;
    videoFrame.hidden = false;
    videoFrame.src = `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`;
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

/* --------------------------------------------------
   VIMEO THUMBNAIL LOADER
   -------------------------------------------------- */
document.querySelectorAll('.vid-card__thumb[data-vimeo-id]').forEach(thumb => {
  const id = thumb.dataset.vimeoId;
  fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=640`)
    .then(r => r.json())
    .then(d => {
      if (d.thumbnail_url) {
        thumb.style.backgroundImage = `url('${d.thumbnail_url}')`;
      }
    })
    .catch(() => {});
});

videoClose.addEventListener('click', closeVideo);
videoOverlay.addEventListener('click', (e) => {
  if (e.target === videoOverlay) closeVideo();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoOverlay.classList.contains('is-open')) closeVideo();
});

/* --------------------------------------------------
   CONTACT MODAL (unified — form + Calendly side by side)
   -------------------------------------------------- */
const contactModal = document.getElementById('contactModal');
const modalClose   = document.getElementById('modalClose');
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

function openContactModal() {
  contactModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  contactForm.classList.remove('is-hidden');
  formSuccess.classList.add('is-hidden');
  contactForm.reset();
}

function closeContactModal() {
  contactModal.classList.remove('is-open');
  document.body.style.overflow = '';
  // Reset mobile panel state
  const modalBox = contactModal.querySelector('.modal--split');
  if (modalBox) modalBox.classList.remove('show-panel', 'show-calendly', 'show-form');
}

document.querySelectorAll('.js-open-contact, .js-open-calendly').forEach(el => {
  el.addEventListener('click', openContactModal);
});

modalClose.addEventListener('click', closeContactModal);
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('is-open')) closeContactModal();
});

// Form submission via Formspree
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
    const res = await fetch('https://formspree.io/f/xykndqdn', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm),
    });

    if (res.ok) {
      contactForm.classList.add('is-hidden');
      formSuccess.classList.remove('is-hidden');
    } else {
      alert('Something went wrong. Please try again.');
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
  const hero = document.getElementById('home');
  const heroBottom = hero ? hero.offsetHeight : window.innerHeight;
  const pastHero = window.scrollY >= heroBottom - 20;

  nav.classList.toggle('nav--visible', pastHero);
  nav.classList.toggle('scrolled', pastHero);
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

/* --------------------------------------------------
   SQUIGGLE DRAW-ON ANIMATION
   -------------------------------------------------- */
const squiggleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const line = entry.target.querySelector('polyline, path');
      if (!line) return;
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = '0';
      squiggleObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.about__squiggle, .ai__squiggle').forEach(svg => {
  const line = svg.querySelector('polyline, path');
  if (!line) return;
  const len = line.getTotalLength();
  line.style.strokeDasharray = len;
  line.style.strokeDashoffset = len;
  squiggleObserver.observe(svg);
});

/* --------------------------------------------------
   HERO CAROUSEL — auto-advance every 4 s
   -------------------------------------------------- */
(function () {
  const slides = document.querySelectorAll('.hero__slide');
  const dots   = document.querySelectorAll('.hero__dot');
  if (slides.length < 2) return;
  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('hero__slide--active');
    dots[current].classList.remove('hero__dot--active');
    current = index;
    slides[current].classList.add('hero__slide--active');
    dots[current].classList.add('hero__dot--active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });

  setInterval(() => goTo((current + 1) % slides.length), 4000);
})();

/* --------------------------------------------------
   VIDEO GRID: filter, sort, and show-more on mobile
   -------------------------------------------------- */
(function () {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.vid-card'));
  const filterBtns = document.querySelectorAll('.video-filter');
  const sortSelect = document.getElementById('videoSort');
  const countEl = document.getElementById('videoCount');
  const emptyEl = document.getElementById('videoEmpty');
  const showMoreBtn = document.getElementById('videoShowMore');

  // Preserve each card's original position for "Newest First" / "Oldest First"
  cards.forEach((card, i) => card.dataset.order = i);

  let activeFilter = 'all';
  let expanded = false;

  function applyMobileExtras() {
    const visible = cards.filter(card => !card.classList.contains('is-hidden'));
    cards.forEach(card => card.classList.remove('vid-card--extra-mobile', 'is-expanded'));
    visible.forEach((card, i) => {
      if (i >= 4) card.classList.add('vid-card--extra-mobile');
    });
    if (expanded) {
      visible.forEach(card => card.classList.add('is-expanded'));
    }
    if (showMoreBtn) {
      showMoreBtn.style.display = visible.length > 4 ? '' : 'none';
    }
  }

  function applyFilter() {
    let visibleCount = 0;
    cards.forEach(card => {
      const categories = (card.dataset.categories || '').split(',');
      const matches = activeFilter === 'all' || categories.includes(activeFilter);
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount++;
    });
    if (countEl) {
      countEl.textContent = visibleCount + (visibleCount === 1 ? ' project' : ' projects');
    }
    if (emptyEl) {
      emptyEl.hidden = visibleCount !== 0;
    }
    applyMobileExtras();
  }

  function applySort() {
    const mode = sortSelect ? sortSelect.value : 'newest';
    const sorted = cards.slice().sort((a, b) => {
      if (mode === 'newest') return Number(a.dataset.order) - Number(b.dataset.order);
      if (mode === 'oldest') return Number(b.dataset.order) - Number(a.dataset.order);
      const titleA = (a.dataset.title || '').toLowerCase();
      const titleB = (b.dataset.title || '').toLowerCase();
      if (mode === 'title-asc') return titleA.localeCompare(titleB);
      if (mode === 'title-desc') return titleB.localeCompare(titleA);
      return 0;
    });
    sorted.forEach(card => grid.appendChild(card));
    applyMobileExtras();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', applySort);
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      expanded = !expanded;
      applyMobileExtras();
      showMoreBtn.textContent = expanded ? 'Show Less ↑' : 'Show More Videos ↓';
    });
  }

  applyMobileExtras();
})();

/* --------------------------------------------------
   CONTACT MODAL: mobile chooser flow
   -------------------------------------------------- */
(function () {
  const chooseCalendlyBtn = document.getElementById('chooseCalendly');
  const chooseFormBtn     = document.getElementById('chooseForm');
  const modalBackBtn      = document.getElementById('modalBack');
  const modalBox          = document.querySelector('#contactModal .modal--split');
  if (!modalBox) return;

  chooseCalendlyBtn.addEventListener('click', () => {
    modalBox.classList.add('show-panel', 'show-calendly');
  });

  chooseFormBtn.addEventListener('click', () => {
    modalBox.classList.add('show-panel', 'show-form');
  });

  modalBackBtn.addEventListener('click', () => {
    modalBox.classList.remove('show-panel', 'show-calendly', 'show-form');
  });
})();

/* --------------------------------------------------
   HERO: rotating sub-text
   -------------------------------------------------- */
(function () {
  const el = document.querySelector('.hero__rotate');
  if (!el) return;
  const words = ['AI', 'websites', 'design', 'branding', 'video', 'research'];
  let i = 0;
  setInterval(() => {
    el.classList.add('is-changing');
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('is-changing');
    }, 350);
  }, 2400);
})();

// ============ TESTIMONIALS PARALLAX ============
(function () {
  const section = document.querySelector(".mm-testimonials");

  if (!section) return;

  const cards = section.querySelectorAll(".mm-testimonial");

  let ticking = false;

  function updateTestimonials() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress =
      (windowHeight - rect.top) /
      (windowHeight + rect.height);

    cards.forEach(function (card) {
      if (window.innerWidth <= 800) {
        card.style.transform = "";
        return;
      }

      const speed = parseFloat(card.dataset.speed || "0.1");

      const movement =
        (progress - 0.5) *
        240 *
        speed;

      card.style.transform =
        "translate3d(0," + movement + "px,0)";
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateTestimonials);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick, {
    passive: true
  });

  window.addEventListener("resize", requestTick);

  updateTestimonials();
})();
