/* ============================================================
   MADE KNOWN PICTURES — app.js
   ============================================================ */

/* ── Video data ── */
const VIDEOS = [
  {
    id: 1,
    title: "Inspire 20th Anniversary",
    client: "Inspire",
    category: "Commercial",
    tags: ["Brand", "Anniversary"],
    blurb: "A celebratory brand film marking two decades of impact, vision, and community.",
    type: "youtube",
    videoId: "eTsmhJHWClQ"
  },
  {
    id: 2,
    title: "AHD Cotopaxi",
    client: "Cotopaxi",
    category: "Commercial",
    tags: ["Outdoor", "Brand"],
    blurb: "Adventure meets purpose in this outdoor brand story set against dramatic landscapes.",
    type: "youtube",
    videoId: "B3wrnDvipnE"
  },
  {
    id: 3,
    title: "Give Where You Go",
    client: "Outpatch",
    category: "Commercial",
    tags: ["Social Impact", "Travel"],
    blurb: "Commercial highlighting Outpatch's mission to support community impact through travel-linked giving.",
    type: "vimeo",
    videoId: "638855073"
  },
  {
    id: 4,
    title: "Step Into the Kitchen",
    client: "SideChef",
    category: "Commercial",
    tags: ["Product Demo", "Lifestyle"],
    blurb: "Brand commercial introducing SideChef's guided, step-by-step cooking experience.",
    type: "vimeo",
    videoId: "146186425"
  },
  {
    id: 5,
    title: "Coffee Farming in Kenya",
    client: "Documentary",
    category: "Documentary",
    tags: ["Social Impact", "Agriculture"],
    blurb: "Documentary-style piece showing the coffee farming process and community stories in Kenya.",
    type: "vimeo",
    videoId: "221464023"
  },
  {
    id: 6,
    title: "Coffee Is Life",
    client: "Made Known Original",
    category: "Commercial",
    tags: ["Lifestyle", "Coffee"],
    blurb: "Lifestyle commercial centered on coffee culture and the daily ritual of the perfect cup.",
    type: "vimeo",
    videoId: "221464315"
  },
  {
    id: 7,
    title: "Stone & Cloth Kickstarter",
    client: "Stone & Cloth",
    category: "Brand Launch",
    tags: ["Crowdfunding", "Fashion"],
    blurb: "Kickstarter campaign video for the Stone & Cloth apparel launch — brand storytelling and product showcase.",
    type: "vimeo",
    videoId: "137018485"
  },
  {
    id: 8,
    title: "Sigmund",
    client: "Sigmund",
    category: "Documentary",
    tags: ["Profile", "Character Study"],
    blurb: "An intimate character study exploring the life and singular vision of a compelling individual.",
    type: "vimeo",
    videoId: "561585470"
  },
  {
    id: 9,
    title: "Coffee Couple",
    client: "Documentary",
    category: "Documentary",
    tags: ["Lifestyle", "Coffee"],
    blurb: "A tender portrait of two lives intertwined through their shared passion for coffee.",
    type: "vimeo",
    videoId: "384909934"
  },
  {
    id: 10,
    title: "Andean Health — What We Do",
    client: "Andean Health",
    category: "Commercial",
    tags: ["Social Impact", "Healthcare"],
    blurb: "Brand overview film communicating Andean Health's mission and impact in underserved communities.",
    type: "vimeo",
    videoId: "822827038"
  },
  {
    id: 11,
    title: "Papua New Guinea",
    client: "Travel Documentary",
    category: "Documentary",
    tags: ["Travel", "Culture"],
    blurb: "A visual journey into the remote landscapes and vibrant culture of Papua New Guinea.",
    type: "vimeo",
    videoId: "109343274"
  },
  {
    id: 12,
    title: "Novo",
    client: "Novo",
    category: "Commercial",
    tags: ["Brand", "Innovation"],
    blurb: "Sleek brand film capturing Novo's forward-thinking identity and product vision.",
    type: "vimeo",
    videoId: "282919808"
  },
  {
    id: 13,
    title: "VR Doc — LWR",
    client: "Lutheran World Relief",
    category: "Documentary",
    tags: ["Social Impact", "VR"],
    blurb: "An immersive VR documentary experience created for Lutheran World Relief's global storytelling initiative.",
    type: "youtube",
    videoId: "FmfJgx94u7Q"
  },
  {
    id: 14,
    title: "Mini Doc — LWR Daisy Peru",
    client: "Lutheran World Relief",
    category: "Documentary",
    tags: ["Social Impact", "Latin America"],
    blurb: "Short documentary following Daisy's story in Peru, produced for Lutheran World Relief.",
    type: "vimeo",
    videoId: "77809770"
  },
  {
    id: 15,
    title: "PNG Media Lunch",
    client: "PNG",
    category: "Event",
    tags: ["Brand", "Event Coverage"],
    blurb: "Event coverage and brand storytelling from the PNG Media Lunch gathering.",
    type: "vimeo",
    videoId: "132164108"
  },
  {
    id: 16,
    title: "Galapagos",
    client: "Travel Documentary",
    category: "Documentary",
    tags: ["Travel", "Nature"],
    blurb: "Stepping into one of the world's most extraordinary ecosystems — a visual diary from the Galápagos.",
    type: "vimeo",
    videoId: "71029708"
  },
  {
    id: 17,
    title: "LWR Champa — Mini Doc India",
    client: "Lutheran World Relief",
    category: "Documentary",
    tags: ["Social Impact", "Asia"],
    blurb: "A moving mini-documentary following Champa's journey in India, in partnership with Lutheran World Relief.",
    type: "vimeo",
    videoId: "301280352"
  },
  {
    id: 18,
    title: "Live Recording",
    client: "Made Known Original",
    category: "Commercial",
    tags: ["Music", "Live Performance"],
    blurb: "A kinetic live music recording capturing raw energy and performance in real time.",
    type: "vimeo",
    videoId: "115654417"
  }
];

/* ── Thumbnails ── */
function thumb(v) {
  if (v.type === 'youtube') return `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`;
  return `https://vumbnail.com/${v.videoId}.jpg`;
}

/* ── State ── */
const filters = { category: new Set(), tags: new Set(), client: new Set() };
let query = '';

/* ── DOM refs ── */
const grid          = document.getElementById('videoGrid');
const countEl       = document.getElementById('portfolioCount');
const chipsEl       = document.getElementById('activeFilters');
const emptyEl       = document.getElementById('emptyState');
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const catFiltersEl  = document.getElementById('categoryFilters');
const tagFiltersEl  = document.getElementById('tagFilters');
const cliFiltersEl  = document.getElementById('clientFilters');
const resetBtn      = document.getElementById('resetFilters');
const modal         = document.getElementById('videoModal');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalPlayer   = document.getElementById('modalPlayer');

/* ── Nav scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile menu ── */
document.getElementById('burger').addEventListener('click', () =>
  document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click', () =>
  document.getElementById('mobileMenu').classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open')));

/* ── Mobile sidebar toggle ── */
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
sidebarToggle.addEventListener('click', () => {
  const open = sidebar.classList.toggle('mobile-open');
  sidebarToggle.querySelector('svg + *') && (sidebarToggle.lastChild.textContent = open ? ' Hide Filters' : ' Filters');
});

/* ── Build filters ── */
function buildFilters() {
  const cats    = [...new Set(VIDEOS.map(v => v.category))].sort();
  const tags    = [...new Set(VIDEOS.flatMap(v => v.tags))].sort();
  const clients = [...new Set(VIDEOS.map(v => v.client))].sort();

  renderOpts(catFiltersEl, cats, 'category');
  renderOpts(tagFiltersEl, tags, 'tags');
  renderOpts(cliFiltersEl, clients, 'client');

  // group clear buttons
  document.querySelectorAll('.filter-group__clear').forEach(btn => {
    btn.addEventListener('click', () => {
      filters[btn.dataset.group].clear();
      syncUI(); render();
    });
  });
}

function renderOpts(container, values, group) {
  container.innerHTML = values.map(val => {
    const n = VIDEOS.filter(v => group === 'tags' ? v.tags.includes(val) : v[group] === val).length;
    return `<div class="filter-opt" data-group="${group}" data-value="${val}">
      <div class="filter-opt__box"></div>
      <span>${val}</span>
      <span class="filter-opt__count">${n}</span>
    </div>`;
  }).join('');

  container.querySelectorAll('.filter-opt').forEach(el =>
    el.addEventListener('click', () => {
      const { group, value } = el.dataset;
      filters[group].has(value) ? filters[group].delete(value) : filters[group].add(value);
      syncUI(); render();
    })
  );
}

function syncUI() {
  // checkboxes
  document.querySelectorAll('.filter-opt').forEach(el => {
    const active = filters[el.dataset.group].has(el.dataset.value);
    el.classList.toggle('active', active);
    el.querySelector('.filter-opt__box').textContent = active ? '✓' : '';
  });

  // active chips
  chipsEl.innerHTML = '';
  ['category', 'tags', 'client'].forEach(g => {
    filters[g].forEach(val => {
      const chip = document.createElement('div');
      chip.className = 'active-chip';
      chip.innerHTML = `${val}<button data-g="${g}" data-v="${val}" aria-label="Remove">✕</button>`;
      chip.querySelector('button').addEventListener('click', e => {
        e.stopPropagation();
        filters[e.currentTarget.dataset.g].delete(e.currentTarget.dataset.v);
        syncUI(); render();
      });
      chipsEl.appendChild(chip);
    });
  });
}

/* ── Filtering ── */
function getFiltered() {
  return VIDEOS.filter(v => {
    if (query) {
      const q = query.toLowerCase();
      if (![v.title, v.client, v.category, v.blurb, ...v.tags]
          .some(s => s.toLowerCase().includes(q))) return false;
    }
    if (filters.category.size && !filters.category.has(v.category)) return false;
    if (filters.tags.size && !v.tags.some(t => filters.tags.has(t))) return false;
    if (filters.client.size && !filters.client.has(v.client)) return false;
    return true;
  });
}

/* ── Render grid ── */
function render() {
  const list = getFiltered();
  countEl.textContent = `${list.length} project${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  grid.innerHTML = list.map((v, i) => `
    <div class="video-card" data-id="${v.id}" style="animation-delay:${i * 0.04}s">
      <div class="video-card__thumb">
        <img src="${thumb(v)}" alt="${v.title}" loading="lazy"
          onerror="this.src='';this.alt='${v.title}';this.style.display='none'">
        <div class="video-card__overlay">
          <div class="video-card__play">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        <span class="video-card__platform video-card__platform--${v.type === 'youtube' ? 'yt' : 'vimeo'}">
          ${v.type === 'youtube' ? 'YT' : 'VIMEO'}
        </span>
      </div>
      <div class="video-card__body">
        <div class="video-card__tags">
          <span class="tag tag--cat">${v.category}</span>
          ${v.tags.map(t => `<span class="tag tag--label">${t}</span>`).join('')}
        </div>
        <h3 class="video-card__title">${v.title}</h3>
        <p class="video-card__client">${v.client}</p>
        <p class="video-card__blurb">${v.blurb}</p>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.video-card').forEach(card =>
    card.addEventListener('click', () => openModal(+card.dataset.id))
  );
}

/* ── Modal ── */
function openModal(id) {
  const v = VIDEOS.find(x => x.id === id);
  if (!v) return;

  document.getElementById('modalTitle').textContent  = v.title;
  document.getElementById('modalClient').textContent = `Client: ${v.client}`;
  document.getElementById('modalBlurb').textContent  = v.blurb;
  document.getElementById('modalTags').innerHTML =
    `<span class="tag tag--cat">${v.category}</span>` +
    v.tags.map(t => `<span class="tag tag--label">${t}</span>`).join('');

  const src = v.type === 'youtube'
    ? `https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${v.videoId}?autoplay=1`;

  modalPlayer.innerHTML =
    `<iframe src="${src}" title="${v.title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;

  modal.classList.add('open');
  modal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { modalPlayer.innerHTML = ''; }, 300);
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Search ── */
searchInput.addEventListener('input', e => {
  query = e.target.value.trim();
  searchClear.classList.toggle('vis', query.length > 0);
  render();
});
searchClear.addEventListener('click', () => {
  searchInput.value = ''; query = '';
  searchClear.classList.remove('vis');
  render();
});

/* ── Reset ── */
function resetAll() {
  filters.category.clear(); filters.tags.clear(); filters.client.clear();
  query = ''; searchInput.value = ''; searchClear.classList.remove('vis');
  syncUI(); render();
}
resetBtn.addEventListener('click', resetAll);
document.getElementById('emptyReset').addEventListener('click', resetAll);

/* ── Contact form (Formspree) ── */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type=submit]');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      btn.textContent = '✓ Message received!';
      btn.style.cssText = 'background:#2d6a2d;color:#fff';
      form.reset();
      setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; btn.disabled = false; }, 4000);
    } else {
      throw new Error();
    }
  } catch {
    btn.textContent = 'Error — try again';
    btn.style.cssText = 'background:#6a2d2d;color:#fff';
    setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; btn.disabled = false; }, 3000);
  }
});

/* ── Init ── */
buildFilters();
render();
