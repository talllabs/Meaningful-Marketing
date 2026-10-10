/* ==================================================
   LOGO WALL — the one place to edit client logos
   ==================================================

   TO ADD A LOGO:
     1. Upload the logo file into the  images/logos/  folder
        (PNG or SVG works best; transparent or white background).
     2. Add a new line to the list below, like this:
          { name: 'Client Name', file: 'client-name.png' },

   TO REMOVE A LOGO:
     Delete its line from the list below.
     (You can also delete the file from images/logos/ if you like.)

   TO REORDER:
     Move the lines up or down — logos show in this order.

   Optional: add  url: 'https://...'  to make a logo clickable.
   ================================================== */

const LOGOS = [
  { name: 'United Nations Foundation',          file: 'united-nations-foundation.png' },
  { name: 'AAA',                                file: 'aaa.png' },
  { name: 'USTOA',                              file: 'ustoa.png' },
  { name: 'Pitcairn Islands Tourism',           file: 'pitcairn-islands-tourism.png' },
  { name: 'Papua New Guinea Tourism',           file: 'papua-new-guinea-tourism.png' },
  { name: 'Galapagos Conservancy',              file: 'galapagos-conservancy.png' },
  { name: 'TOMS',                               file: 'toms.png' },
  { name: 'Lutheran World Relief',              file: 'lutheran-world-relief.png' },
  { name: 'Andean Health & Development',        file: 'andean-health.png' },
  { name: 'The Lobiko Initiative',              file: 'lobiko-initiative.png' },
  { name: 'Sigmund',                            file: 'sigmund.png' },
  { name: 'NOVO',                               file: 'novo.png' },
  { name: 'Outpatch',                           file: 'outpatch.png' },
  { name: 'World Vision',                       file: 'world-vision.png' },
];


/* --- You don't need to edit anything below this line --- */

document.querySelectorAll('[data-logowall]').forEach(function (wall) {
  LOGOS.forEach(function (logo) {
    const img = document.createElement('img');
    img.src = 'images/logos/' + logo.file;
    img.alt = logo.name;
    img.loading = 'lazy';
    img.decoding = 'async';

    const item = document.createElement(logo.url ? 'a' : 'div');
    item.className = 'logowall__item';
    if (logo.url) {
      item.href = logo.url;
      item.target = '_blank';
      item.rel = 'noopener';
    }
    item.appendChild(img);
    wall.appendChild(item);
  });
});
