/* ==================================================
   LOGO CAROUSEL
   ==================================================
   Logos are managed at  /admin  (drag & drop).
   The admin page saves the list to  data/logos.json
   and the images to  images/logos/ .
   ================================================== */

fetch('/data/logos.json', { cache: 'no-cache' })
  .then(function (res) { return res.json(); })
  .then(function (logos) {
    document.querySelectorAll('[data-logowall]').forEach(function (wall) {
      const track = document.createElement('div');
      track.className = 'logowall__track';

      // The list is added twice so the carousel can loop with no gap.
      // The second copy is hidden from screen readers.
      [false, true].forEach(function (isCopy) {
        logos.forEach(function (logo) {
          const img = document.createElement('img');
          img.src = '/images/logos/' + logo.file;
          img.alt = isCopy ? '' : logo.name;
          img.decoding = 'async';

          const item = document.createElement(logo.url ? 'a' : 'div');
          item.className = 'logowall__item';
          if (isCopy) item.setAttribute('aria-hidden', 'true');
          if (logo.url) {
            item.href = logo.url;
            item.target = '_blank';
            item.rel = 'noopener';
            if (isCopy) item.tabIndex = -1;
          }
          item.appendChild(img);
          track.appendChild(item);
        });
      });

      wall.appendChild(track);
    });
  });
