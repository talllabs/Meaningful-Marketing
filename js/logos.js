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
    const PER_GROUP = 4;     // logos shown at once
    const SHOW_FOR = 3000;   // milliseconds each group stays on screen

    // Split the logos into groups of 4. If the last group is short,
    // top it up with logos from the start so every group is full.
    const groups = [];
    for (let i = 0; i < logos.length; i += PER_GROUP) {
      const group = logos.slice(i, i + PER_GROUP);
      for (let j = 0; group.length < PER_GROUP && j < logos.length - PER_GROUP; j++) {
        group.push(logos[j]);
      }
      groups.push(group);
    }

    document.querySelectorAll('[data-logowall]').forEach(function (wall) {
      const groupEls = groups.map(function (group, g) {
        const groupEl = document.createElement('div');
        groupEl.className = 'logowall__group' + (g === 0 ? ' is-active' : '');

        group.forEach(function (logo) {
          const img = document.createElement('img');
          img.src = '/images/logos/' + logo.file;
          img.alt = logo.name;
          img.decoding = 'async';

          const item = document.createElement(logo.url ? 'a' : 'div');
          item.className = 'logowall__item';
          if (logo.url) {
            item.href = logo.url;
            item.target = '_blank';
            item.rel = 'noopener';
          }
          item.appendChild(img);
          groupEl.appendChild(item);
        });

        wall.appendChild(groupEl);
        return groupEl;
      });

      if (groupEls.length < 2) return;

      // Cross-fade to the next group every few seconds (pauses on hover).
      let current = 0;
      let paused = false;
      wall.addEventListener('mouseenter', function () { paused = true; });
      wall.addEventListener('mouseleave', function () { paused = false; });
      setInterval(function () {
        if (paused || document.hidden) return;
        groupEls[current].classList.remove('is-active');
        current = (current + 1) % groupEls.length;
        groupEls[current].classList.add('is-active');
      }, SHOW_FOR);
    });
  });
