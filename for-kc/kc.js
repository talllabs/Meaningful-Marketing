/* KC Brown portfolio
   1. Fills every photo from media.js, and film stills from Vimeo
   2. The opener: the hero image starts full screen and shrinks into a collage
   3. The film showcase and its player
   4. Header, fade-ins */
(() => {
  const M = window.KC_MEDIA || {};
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // "tiles.3" -> M.tiles[3]
  const lookup = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), M);
  const vimeoId = (url) => ((url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];

  // Puts a photo in a frame; tries the backup if the first link fails
  const addImage = (box, src, backup) => {
    if (!src) return;
    const img = new Image();
    img.alt = box.dataset.alt || "";
    img.decoding = "async";
    if (!box.closest("#heroFrame")) img.loading = "lazy";
    img.onload = () => img.classList.add("ready");
    img.onerror = () => {
      if (backup && img.src !== backup) img.src = backup;
      else img.remove();
    };
    img.src = src;
    box.prepend(img);
  };

  /* ---------- 1. Photos and film stills ---------- */
  document.querySelectorAll("[data-media]").forEach((box) => {
    const key = box.dataset.media;
    addImage(box, lookup(key), (M.backups || {})[key]);
  });

  // Vimeo gives each film's still through its public oEmbed lookup
  const stills = {};
  const vimeoStill = (id) =>
    (stills[id] ||= fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent("https://vimeo.com/" + id)}&width=1280`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d && d.thumbnail_url) || null)
      .catch(() => null));

  const loadStill = (box) => {
    vimeoStill(box.dataset.vimeo).then((src) => addImage(box, src));
  };
  const stillWatcher = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { loadStill(entry.target); stillWatcher.unobserve(entry.target); }
        });
      }, { rootMargin: "400px" })
    : null;
  const watchStill = (box) => (stillWatcher ? stillWatcher.observe(box) : loadStill(box));
  document.querySelectorAll("[data-vimeo]").forEach(watchStill);

  /* ---------- 2. The opener ---------- */
  const collage = document.getElementById("collage");
  const stage = document.getElementById("stage");
  const heroBox = document.getElementById("heroMedia");
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
    // the hero finishes shrinking at 70% of the way, the rest is a short hold
    const e = 1 - Math.pow(1 - clamp(p / 0.7, 0, 1), 3);
    const x = e * frameX * w;
    const t = e * frameTop * h;
    const b = e * frameBottom * h;
    frame.style.clipPath = `inset(${t}px ${x}px ${b}px ${x}px round ${e * 4}px)`;
    heroBox.style.transform = `scale(${1.08 - e * 0.2})`;
    title.style.transform = `translateY(${(t - b) / 2}px) scale(${1 - e * 0.45})`;
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
    // dark text as soon as the hero starts shrinking off the light background
    header.classList.toggle("ink", !!collage && window.scrollY > top + range * 0.12);
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
  const box = document.getElementById("lightbox");
  const player = box.querySelector(".player");
  let lastFocus = null;

  const openPlayer = (url, title) => {
    const id = vimeoId(url);
    if (!id) return;
    const frame = document.createElement("iframe");
    frame.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
    frame.allow = "autoplay; fullscreen; picture-in-picture";
    frame.allowFullscreen = true;
    frame.title = title || "Film";
    player.replaceChildren(frame);
    lastFocus = document.activeElement;
    box.classList.add("open");
    box.querySelector(".close").focus();
  };
  const closePlayer = () => {
    box.classList.remove("open");
    player.replaceChildren();
    if (lastFocus) lastFocus.focus();
  };
  box.querySelector(".close").addEventListener("click", closePlayer);
  box.addEventListener("click", (e) => { if (e.target === box) closePlayer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("open")) closePlayer(); });

  // Anything with data-watch plays that film
  document.querySelectorAll("[data-watch]").forEach((el) => {
    el.addEventListener("click", () => openPlayer(el.dataset.watch || M.reel, el.dataset.title));
  });

  // The film wall: every film plays silently in its tile. Hovering a tile
  // (or tapping it) opens it in the player with sound.
  const wall = document.getElementById("filmWall");
  const films = [...(M.featured || []), ...(M.more || [])];
  let hoverTimer = 0, lastScroll = 0;
  window.addEventListener("scroll", () => { lastScroll = Date.now(); clearTimeout(hoverTimer); }, { passive: true });
  // a silent looping Vimeo film filling a frame, over its still
  const loopFilm = (box, id) => {
    const frame = document.createElement("iframe");
    frame.src = `https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`;
    frame.allow = "autoplay";
    frame.title = "";
    frame.tabIndex = -1;
    frame.setAttribute("aria-hidden", "true");
    box.classList.add("looping");
    box.append(frame);
  };
  const loop = (tile) => loopFilm(tile.querySelector(".media"), tile.dataset.id);

  // the opening collage: half its tiles are films
  document.querySelectorAll("[data-loop]").forEach((box) => {
    const id = vimeoId(lookup(box.dataset.loop));
    if (!id) return;
    box.dataset.vimeo = id;
    loadStill(box);
    if (!reduceMotion.matches) loopFilm(box, id);
  });
  const loopWatcher = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { loop(entry.target); loopWatcher.unobserve(entry.target); }
        });
      }, { rootMargin: "300px" })
    : null;
  films.forEach((film, i) => {
    const id = vimeoId(film.watch);
    if (!wall || !id) return;
    const tile = document.createElement("button");
    tile.type = "button";
    // two films take a double-wide tile so 30 films fill 8 columns by 4 rows exactly
    tile.className = "wall-tile" + (i === 0 || i === 17 ? " wide" : "");
    tile.dataset.id = id;
    tile.setAttribute("aria-label", `Play ${film.title} with sound`);
    const frame = document.createElement("div");
    frame.className = "media";
    frame.dataset.vimeo = id;
    const name = document.createElement("span");
    name.className = "wall-name";
    name.textContent = film.title;
    tile.append(frame, name);
    // a short pause before opening, so the player doesn't pop up while the mouse is just passing over,
    // and never while the page is scrolling tiles under a resting mouse
    tile.addEventListener("mouseenter", () => {
      clearTimeout(hoverTimer);
      if (Date.now() - lastScroll < 500) return;
      hoverTimer = setTimeout(() => {
        if (!box.classList.contains("open") && Date.now() - lastScroll > 500) openPlayer(film.watch, film.title);
      }, 450);
    });
    tile.addEventListener("mouseleave", () => clearTimeout(hoverTimer));
    tile.addEventListener("click", () => { clearTimeout(hoverTimer); if (!box.classList.contains("open")) openPlayer(film.watch, film.title); });
    wall.append(tile);
    watchStill(frame);
    if (!reduceMotion.matches) (loopWatcher ? loopWatcher.observe(tile) : loop(tile));
  });

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
