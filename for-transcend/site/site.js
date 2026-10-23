/* Transcend site demo (concept 3): shared script for every page.
   1. Builds the header, Let's Connect form, footer and demo pill, so they live in one place
   2. Cuts every still and clip from the Transcend film
   3. Scroll effects: the home collage, parallax drift and fade-ins */
(() => {
  const FILM = "https://transcendcruises.com/wp-content/uploads/2026/10/Transcend-Hero-Long-Version-web-1080p.mp4";
  const LOGO = "https://transcendcruises.com/wp-content/uploads/2026/08/Transcend-Lockup-Navy-FA-768x197.png";
  const LOGO_LARGE = "https://transcendcruises.com/wp-content/uploads/2026/08/Transcend-Lockup-Navy-FA-1024x263.png";
  const SITE = "/for-transcend/site/";
  const page = document.body.dataset.page || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  /* ---------- 1. Shared header, Let's Connect, footer ---------- */
  const navLeft = [
    ["ship", "Explore the Ship", SITE + "ship.html"],
    ["destinations", "Destinations", SITE + "destinations.html"],
    ["charter", "Your Charter", SITE + "charter.html"],
  ];
  const navRight = [
    ["crew", "Crew", SITE + "crew.html"],
    ["news", "In the News", "https://transcendcruises.com/in-the-news/"],
    ["connect", "Let’s Connect", "#connect"],
  ];
  const link = ([id, label, href]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a>`;

  const header = document.getElementById("siteHeader");
  header.innerHTML = `
    <div class="container nav">
      <nav class="nav-left" aria-label="Primary navigation">${navLeft.map(link).join("")}</nav>
      <a class="brand" href="${SITE}" aria-label="Transcend Cruises home">
        <img src="${LOGO}" alt="Transcend Cruises" data-logo />
      </a>
      <nav class="nav-right" aria-label="Secondary navigation">${navRight.map(link).join("")}</nav>
      <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">☰</button>
    </div>
    <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation" hidden>
      ${link(["home", "Home", SITE])}${navLeft.concat(navRight).map(link).join("")}
    </nav>`;

  document.getElementById("siteConnect").outerHTML = `
    <section class="connect" id="connect">
      <div class="container connect-grid">
        <div class="connect-copy reveal">
          <span class="kicker">Let’s connect</span>
          <h2>Stay connected with Transcend.</h2>
          <p>Be the first to discover new journeys, inspiring destinations and extraordinary ways to experience Europe’s most iconic rivers.</p>
          <a class="text-link" href="mailto:reservations@transcend.cruises">reservations@transcend.cruises</a>
        </div>
        <form class="connect-form reveal" id="connectForm">
          <label>First name<input name="first" autocomplete="given-name" required /></label>
          <label>Last name<input name="last" autocomplete="family-name" required /></label>
          <label class="full">Your email address<input type="email" name="email" autocomplete="email" required /></label>
          <label>Company name<input name="company" autocomplete="organization" /></label>
          <label>Phone number<input type="tel" name="phone" autocomplete="tel" /></label>
          <label class="full">Location
            <select name="location">
              <option value="">Select your location</option>
              <option>Europe</option><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Other</option>
            </select>
          </label>
          <small class="full">By clicking “Sign up,” you agree that Transcend may use the information provided to send you news, updates and relevant offers. You may unsubscribe at any time.</small>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </section>`;

  document.getElementById("siteFooter").innerHTML = `
    <div class="container">
      <div class="footer-top">
        <div>
          <div class="footer-logo"><img src="${LOGO}" alt="Transcend Cruises" data-logo /></div>
          <p class="footer-copy">The first of its kind. Fully custom, charter-only voyages along the iconic waterways of Europe.</p>
        </div>
        <div>
          <div class="footer-title">Explore</div>
          <div class="footer-links">
            <a href="${SITE}">Home</a>
            <a href="${SITE}ship.html">Explore the Ship</a>
            <a href="${SITE}destinations.html">Destinations</a>
          </div>
        </div>
        <div>
          <div class="footer-title">Transcend</div>
          <div class="footer-links">
            <a href="${SITE}charter.html">Your Charter</a>
            <a href="${SITE}crew.html">Crew</a>
            <a href="https://transcendcruises.com/in-the-news/">In the News</a>
          </div>
        </div>
        <div>
          <div class="footer-title">Let’s connect</div>
          <div class="footer-links">
            <a href="mailto:reservations@transcend.cruises">reservations@transcend.cruises</a>
            <a href="tel:+19547374709">+1 (954) 737-4709</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Transcend Cruises. All Rights Reserved.</span>
        <a href="https://transcendcruises.com/privacy-policy/">Privacy Policy</a>
      </div>
    </div>`;

  const pill = document.createElement("div");
  pill.className = "demo-pill";
  pill.setAttribute("role", "navigation");
  pill.setAttribute("aria-label", "Demo navigation");
  pill.innerHTML = `
    <a href="/for-transcend/">← Back to the proposal</a>
    <a class="pill-c" href="/for-transcend/homepage-demo.html">Concept 1</a>
    <a class="pill-c" href="/for-transcend/homepage-editorial-demo.html">Concept 2</a>
    <button type="button" id="notesToggle" aria-pressed="true">Hide the “why” notes</button>
    <span>Concept 3 · Full site</span>`;
  document.body.appendChild(pill);

  // Logo falls back to the larger file, then to a text wordmark
  document.querySelectorAll("img[data-logo]").forEach((img) => {
    const fail = () => {
      if (!img.dataset.retried) {
        img.dataset.retried = "1";
        img.src = LOGO_LARGE;
        return;
      }
      const mark = document.createElement("span");
      mark.className = "brand-wordmark";
      mark.textContent = "TRANSCEND";
      img.replaceWith(mark);
    };
    img.addEventListener("error", fail);
    if (img.complete && !img.naturalWidth) fail();
  });

  // "Why" notes toggle
  const notesToggle = document.getElementById("notesToggle");
  notesToggle.addEventListener("click", () => {
    const hidden = document.body.classList.toggle("hide-notes");
    notesToggle.setAttribute("aria-pressed", String(!hidden));
    notesToggle.textContent = hidden ? "Show the “why” notes" : "Hide the “why” notes";
  });

  // Mobile menu
  const toggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const setMenu = (open) => {
    mobileNav.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "✕" : "☰";
  };
  toggle.addEventListener("click", () => setMenu(mobileNav.hidden));
  mobileNav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Sign-up form (demo only: nothing is sent)
  const form = document.getElementById("connectForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const first = form.elements.first.value.trim();
    form.innerHTML = `<p class="connect-thanks full">Thank you${first ? ", " + first.replace(/[<>&"]/g, "") : ""}. Your next journey begins here, and we will be in touch soon.</p>`;
  });

  /* ---------- 2. Film: every still and clip is a moment from the same film ---------- */
  // data-at is the moment to use, as a share of the film's length (0.5 = halfway)
  const at = (el) => parseFloat(el.dataset.at) || 0;
  const timecode = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) heroVideo.src = FILM;

  // Moving clips load only when they are about to scroll into view, and loop a few seconds
  const clips = [...document.querySelectorAll("video.clip")];
  clips.forEach((clip) => {
    clip.muted = true;
    clip.playsInline = true;
    clip.setAttribute("aria-hidden", "true");
    let start = 0;
    const length = parseFloat(clip.dataset.len) || 6;
    clip.addEventListener("loadedmetadata", () => {
      start = at(clip) * clip.duration;
      clip.currentTime = start;
    });
    clip.addEventListener("seeked", () => clip.classList.add("ready"), { once: true });
    clip.addEventListener("timeupdate", () => {
      if (clip.currentTime > start + length || clip.currentTime < start - 0.5) clip.currentTime = start;
    });
    clip.addEventListener("ended", () => { clip.currentTime = start; clip.play().catch(() => {}); });
  });

  if ("IntersectionObserver" in window) {
    const clipWatcher = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          if (!target.src) target.src = FILM;
          target.play().catch(() => {});
        } else if (target.src) {
          target.pause();
        }
      });
    }, { rootMargin: "300px 0px" });
    clips.forEach((clip) => clipWatcher.observe(clip));
    if (heroVideo) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      }).observe(heroVideo.closest("section"));
    }
  } else {
    clips.forEach((clip) => { clip.src = FILM; clip.autoplay = true; });
  }

  // Stills: one hidden copy of the film jumps to each moment and paints it onto a canvas,
  // in page order so the first screen fills in first
  const stills = [...document.querySelectorAll("canvas.still")];
  const source = document.createElement("video");
  source.muted = true;
  source.playsInline = true;
  source.preload = "auto";
  source.hidden = true;
  source.setAttribute("aria-hidden", "true");
  document.body.appendChild(source);

  const fillTimecodes = (duration) => {
    document.querySelectorAll(".tc").forEach((tc) => {
      const media = tc.closest("figure").querySelector("[data-at]");
      if (!media) return;
      tc.textContent = `${media.tagName === "VIDEO" ? "Film" : "Still"} · ${timecode(at(media) * duration)}`;
    });
  };

  const grabStills = () => {
    let i = 0;
    let timer;
    const next = () => {
      clearTimeout(timer);
      if (i >= stills.length) { source.remove(); return; }
      // skip a moment that will not load rather than stall the rest
      timer = setTimeout(() => { i++; next(); }, 8000);
      source.currentTime = at(stills[i]) * source.duration;
    };
    source.addEventListener("seeked", () => {
      const canvas = stills[i++];
      if (canvas) {
        try {
          canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
          canvas.classList.add("ready");
        } catch (err) { /* leave the navy backdrop showing */ }
      }
      next();
    });
    next();
  };

  source.addEventListener("loadedmetadata", () => {
    const ratio = source.videoWidth && source.videoHeight ? source.videoHeight / source.videoWidth : 9 / 16;
    stills.forEach((c) => {
      c.width = parseInt(c.dataset.w, 10) || 960;
      c.height = Math.round(c.width * ratio);
    });
    fillTimecodes(source.duration);
    // some phones only fetch video data after a play() call
    source.play().then(() => { source.pause(); grabStills(); }).catch(grabStills);
  }, { once: true });
  source.src = FILM;

  /* ---------- 3. Scroll effects ---------- */
  const collage = document.getElementById("collage");
  const stage = document.getElementById("stage");
  const plx = [...document.querySelectorAll(".plx")];
  const drifts = [...document.querySelectorAll("[data-drift]")];
  let top = 0, range = 1, w = 0, h = 0, frameX = 0, frameTop = 0, frameBottom = 0;
  let ticking = false;

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

  // Home hero: the film starts full screen and is cropped and scaled into the collage
  const renderCollage = () => {
    const frame = document.getElementById("heroFrame");
    const title = document.getElementById("heroTitle");
    const cue = document.getElementById("scrollCue");
    // 0 at the top of the section, 1 when the stage is about to un-stick
    const p = reduceMotion.matches ? 0.8 : clamp((window.scrollY - top) / range, 0, 1);
    // the video finishes shrinking at 70% of the way, the rest is a short hold
    const e = 1 - Math.pow(1 - clamp(p / 0.7, 0, 1), 3);

    const x = e * frameX * w;
    const t = e * frameTop * h;
    const b = e * frameBottom * h;
    frame.style.clipPath = `inset(${t}px ${x}px ${b}px ${x}px round ${e * 4}px)`;
    heroVideo.style.transform = `scale(${1 - e * 0.22})`;
    title.style.transform = `translateY(${(t - b) / 2}px) scale(${1 - e * 0.55})`;
    cue.style.opacity = String(1 - clamp(p / 0.12, 0, 1));

    // each tile rises at its own speed and keeps drifting slightly while the collage holds
    stage.querySelectorAll(".tile").forEach((tile) => {
      const speed = parseFloat(tile.dataset.speed) || 1;
      tile.style.transform = `translate3d(0, ${((0.8 - p) * 0.55 * h * speed).toFixed(1)}px, 0)`;
      tile.style.opacity = String(clamp(e * 1.6, 0, 1));
    });
  };

  // Elsewhere: images drift inside their frames, filmstrips slide sideways
  const renderDrift = () => {
    if (reduceMotion.matches) return;
    const vh = window.innerHeight;
    plx.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const d = (r.top + r.height / 2 - vh / 2) / vh;
      const speed = parseFloat(el.dataset.plx) || 1;
      el.firstElementChild.style.transform = `translate3d(0, ${(-d * 0.07 * r.height * speed).toFixed(1)}px, 0) scale(1.16)`;
    });
    drifts.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const d = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(${(d * 0.18 * window.innerWidth - 0.08 * window.innerWidth).toFixed(1)}px, 0, 0)`;
    });
  };

  const render = () => {
    ticking = false;
    if (collage) renderCollage();
    renderDrift();
  };

  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  };

  measure();
  render();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", () => { measure(); request(); });
  window.addEventListener("load", () => { measure(); request(); });
  reduceMotion.addEventListener?.("change", () => { measure(); request(); });
  // the password gate hides the page at first, so measure again once the stage has a real size
  if (collage && "ResizeObserver" in window) new ResizeObserver(() => { measure(); request(); }).observe(stage);

  // Fade sections in as they arrive
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
