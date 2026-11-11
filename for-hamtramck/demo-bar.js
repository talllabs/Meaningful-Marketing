/* Demo bar for the Hamtramck Parks Conservancy concepts (not part of the mocked website).
   Usage: <script src="/for-hamtramck/demo-bar.js" data-design="1"></script> */
(function () {
  var design = (document.currentScript && document.currentScript.getAttribute('data-design')) || '1';
  var NAMES = { 1: 'Warm & cinematic', 2: 'Logo reveal', 3: 'The world in two square miles' };

  var style = document.createElement('style');
  style.textContent =
    '.hpc-demo{position:relative;z-index:1000;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:9px clamp(14px,3vw,28px);background:#0c0c0c;color:#fff;font:600 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;}' +
    '.hpc-demo a{color:#fff;text-decoration:none;}' +
    '.hpc-demo a:hover{color:#edb18d;}' +
    '.hpc-demo__designs{display:flex;gap:4px;align-items:center;flex-wrap:wrap;}' +
    '.hpc-demo__designs span{color:#b5bcb7;margin-right:4px;}' +
    '.hpc-demo__designs a{padding:5px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.22);}' +
    '.hpc-demo__designs a[aria-current]{background:#186533;border-color:#186533;color:#fff;}' +
    '@media (max-width:640px){.hpc-demo__label{display:none;}}';
  document.head.appendChild(style);

  function mount() {
    var bar = document.createElement('nav');
    bar.className = 'hpc-demo';
    bar.setAttribute('aria-label', 'Concept switcher');
    var links = [1, 2, 3].map(function (n) {
      return '<a href="/for-hamtramck/design-' + n + '/"' + (String(n) === design ? ' aria-current="page"' : '') + '>Mockup ' + n + '</a>';
    }).join('');
    bar.innerHTML =
      '<a href="/for-hamtramck/">← All mockups</a>' +
      '<div class="hpc-demo__designs"><span class="hpc-demo__label">Mockup ' + design + ': ' + NAMES[design] + '</span>' + links + '</div>';
    var skip = document.querySelector('body > .skip, body > .skip-link');
    if (skip) skip.after(bar); else document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
