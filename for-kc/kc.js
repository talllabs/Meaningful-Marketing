/* KC Brown portfolio
   1. Fills every photo and film from media.js
   2. The opener: the reel starts full screen and shrinks into a collage
   3. The film showcase and its player
   4. Header, fade-ins */
(() => {
  const M = window.KC_MEDIA || {};
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // "tiles.3" -> M.tiles[3]
  const lookup = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), M);

  const vimeoId = (url) => (url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];
  const youtubeId = (url) => (url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/) || [])[1];

  const addImage = (box, src, alt) => {
    if (!src) return;
    const img = new Image();
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.onload = () => img.classList.add("ready");
    img.src = src;
    box.prepend(img);
    box.classList.add("has-media");
  };

  /* ---------- 1. Photos ---------- */
  document.querySelectorAll("[data-media]").forEach((box) => {
    addImage(box, lookup(box.dataset.media), box.dataset.alt);
  });

  // The opening reel: an mp4 plays directly, a Vimeo link plays as a silent background loop
  const heroBox = document.getElementById("heroMedia");
  if (heroBox) {
    const hero = M.hero || "";
    if (/\.(mp4|webm|mov)(\?|$)/i.test(hero)) {
      const v = document.createElement("video");
      Object.assign(v, { src: hero, muted: true, loop: true, autoplay: true, playsInline: true });
      if (M.poster) v.poster = M.poster;
      v.setAttribute("aria-hidden", "true");
      heroBox.prepend(v);
      heroBox.classList.add("has-media");
    } else if (vimeoId(hero)) {
      const f = document.createElement("iframe");
      f.src = `https://player.vimeo.com/video/${vimeoId(hero)}?background=1&autoplay=1&loop=1&muted=1`;
      f.allow = "autoplay; fullscreen";
      f.title = "KC Brown reel";
      f.setAttribute("aria-hidden", "true");
      f.tabIndex = -1;
      heroBox.prepend(f);
      heroBox.classList.add("has-media");
    } else {
      addImage(heroBox, M.poster, "");
    }
  }

  /* ---------- 2. The opener ---------- */
  const collage = document.getElementById("collage");
  const stage = document.getElementById("stage");
  let top = 0, range = 1, w = 0, h = 0, frameX = 0, frameTop = 0, frameBottom = 0, ticking = false;

  const measure = () => {
    if (!collage) return;
    top = collage.getBoundingClientRect().top + window.scrollY;
    w = stage.clientWidth;
    h = stage.clientHeight;
    range = Math.max(1, collage.offsetHeight - h);
    const css = getComputedStyle(stage);
    frameX = parseFloat(css.getPropertyValue("--frame-x")) || 0;
    frameTop = parseFloat(css.getPropertyValue("--frame-top")) || 0;
    frameBottom = parseFloat(css.getPropertyValue("--frame-bottom")) || 0;
  };

  const renderCollage = () => {
    const frame = document.getElementById("heroFrame");
    const title = document.getElementById("heroTitle");
    const cue = document.getElementById("scrollCue");
    // 0 at the top of the section, 1 when the stage is about to un-stick
    const p = reduceMotion.matches ? 0.8 : clamp((window.scrollY - top) / range, 0, 1);
    // the reel finishes shrinking at 70% of the way, the rest is a short hold
    const e = 1 - Math.pow(1 - clamp(p / 0.7, 0, 1), 3);
    const x = e * frameX * w;
    const t = e * frameTop * h;
    const b = e * frameBottom * h;
    frame.style.clipPath = `inset(${t}px ${x}px ${b}px ${x}px round ${e * 4}px)`;
    heroBox.style.transform = `scale(${1 - e * 0.2})`;
    title.style.transform = `translateY(${(t - b) / 2}px) scale(${1 - e * 0.5})`;
    cue.style.opacity = String(1 - clamp(p / 0.12, 0, 1));
    // each tile rises at its own speed and keeps drifting slightly while the collage holds
    stage.querySelectorAll(".tile").forEach((tile) => {
      const speed = parseFloat(tile.dataset.speed) || 1;
      tile.style.transform = `translate3d(0, ${((0.8 - p) * 0.55 * h * speed).toFixed(1)}px, 0)`;
      tile.style.opacity = String(clamp(e * 1.6, 0, 1));
    });
  };

  // The header turns solid once the opener has scrolled away
  const header = document.getElementById("siteHeader");
  const renderHeader = () => {
    const past = collage ? window.scrollY > top + collage.offsetHeight - 80 : window.scrollY > 40;
    header.classList.toggle("solid", past);
  };

  const render = () => {
    ticking = false;
    if (collage) renderCollage();
    renderHeader();
  };
  const request = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  };

  measure();
  render();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", () => { measure(); request(); });
  window.addEventListener("load", () => { measure(); request(); });
  reduceMotion.addEventListener?.("change", () => { measure(); request(); });
  // the password gate hides the page at first, so measure again once the stage has a real size
  if (collage && "ResizeObserver" in window) new ResizeObserver(() => { measure(); request(); }).observe(stage);

  /* ---------- 3. Films ---------- */
  const films = M.films || [];
  const filmCard = (film, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "film reveal" + (i === 0 ? " film-featured" : "");
    btn.setAttribute("aria-label", `Play ${film.title}, ${film.client}`);
    btn.innerHTML =
      `<div class="media"><span class="label">${film.title}</span></div>` +
      `<span class="play"><i></i><span><b>${film.title}</b><small>${film.client} · ${film.role}</small></span></span>`;
    addImage(btn.querySelector(".media"), film.still, "");
    btn.addEventListener("click", () => openPlayer(film));
    return btn;
  };
  const featured = document.getElementById("filmFeatured");
  const row = document.getElementById("filmRow");
  if (featured && films.length) {
    featured.append(filmCard(films[0], 0));
    films.slice(1).forEach((f, i) => row.append(filmCard(f, i + 1)));
  }

  const box = document.getElementById("lightbox");
  const player = box && box.querySelector(".player");
  let lastFocus = null;
  const openPlayer = (film) => {
    const url = film.watch || "";
    let html = `<div class="soon"><div><span class="kicker">${film.client}</span><h3 style="margin-top:12px">${film.title}</h3><p>Film link coming soon.</p></div></div>`;
    if (vimeoId(url)) html = `<iframe src="https://player.vimeo.com/video/${vimeoId(url)}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${film.title}"></iframe>`;
    else if (youtubeId(url)) html = `<iframe src="https://www.youtube.com/embed/${youtubeId(url)}?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen title="${film.title}"></iframe>`;
    else if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) html = `<video src="${url}" controls autoplay playsinline></video>`;
    player.innerHTML = html;
    lastFocus = document.activeElement;
    box.classList.add("open");
    box.querySelector(".close").focus();
  };
  const closePlayer = () => {
    box.classList.remove("open");
    player.innerHTML = "";
    if (lastFocus) lastFocus.focus();
  };
  if (box) {
    box.querySelector(".close").addEventListener("click", closePlayer);
    box.addEventListener("click", (e) => { if (e.target === box) closePlayer(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("open")) closePlayer(); });
  }

  /* ---------- 4. Fade sections in as they arrive ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }
})();
