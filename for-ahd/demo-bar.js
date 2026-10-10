/* Demo bar for the AHD concepts (not part of the mocked website):
   design switcher + "why we did this" notes toggle.
   Usage: <script src="/for-ahd/demo-bar.js" data-design="1"></script>
   Notes:  <div class="why"><b>1</b><span>Reason…</span></div>        */
(function () {
  var design = (document.currentScript && document.currentScript.getAttribute('data-design')) || '1';
  var KEY = 'ahd-notes-hidden';
  var NAMES = { 1: 'Clean & hopeful', 2: 'Classic & photo-led', 3: 'Bold & unexpected' };

  var style = document.createElement('style');
  style.textContent =
    '.ahd-demo{position:relative;z-index:100;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:9px clamp(14px,3vw,28px);background:#0C0C0C;color:#fff;font:600 13px/1.3 "Montserrat",system-ui,sans-serif;}' +
    '.ahd-demo a{color:#fff;text-decoration:none;}' +
    '.ahd-demo a:hover{color:#F1BF34;}' +
    '.ahd-demo__designs{display:flex;gap:4px;align-items:center;flex-wrap:wrap;}' +
    '.ahd-demo__designs span{color:#9aa3a8;margin-right:4px;}' +
    '.ahd-demo__designs a{padding:5px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.18);}' +
    '.ahd-demo__designs a[aria-current]{background:#F08519;border-color:#F08519;color:#fff;}' +
    '.ahd-demo button{padding:6px 13px;border:1px solid #52AADE;border-radius:999px;background:transparent;color:#fff;font:700 12px "Montserrat",system-ui,sans-serif;cursor:pointer;}' +
    '.ahd-demo button:hover{background:#52AADE;}' +
    '.why{position:relative;z-index:5;display:flex;gap:10px;align-items:flex-start;max-width:520px;margin:16px 0 0;padding:11px 14px;border-radius:10px;background:#0C0C0C;color:#fff;font:400 13.5px/1.45 "Source Sans 3",system-ui,sans-serif;text-align:left;letter-spacing:0;text-transform:none;box-shadow:0 10px 26px rgba(0,0,0,.22);}' +
    '.why b{flex-shrink:0;width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:#F1BF34;color:#0C0C0C;font:800 12px "Montserrat",system-ui,sans-serif;}' +
    '.why--center{margin-left:auto;margin-right:auto;}' +
    'body.hide-notes .why{display:none !important;}' +
    '@media (max-width:640px){.ahd-demo__label{display:none;}}';
  document.head.appendChild(style);

  var hidden = false;
  try { hidden = sessionStorage.getItem(KEY) === 'true'; } catch (e) {}

  function mount() {
    if (hidden) document.body.classList.add('hide-notes');
    var bar = document.createElement('div');
    bar.className = 'ahd-demo';
    var links = [1, 2, 3].map(function (n) {
      return '<a href="/for-ahd/design-' + n + '/"' + (String(n) === design ? ' aria-current="page"' : '') + '>Design ' + n + '</a>';
    }).join('');
    bar.innerHTML =
      '<a href="/for-ahd/">← All designs</a>' +
      '<div class="ahd-demo__designs"><span class="ahd-demo__label">Design ' + design + ': ' + NAMES[design] + '</span>' + links + '</div>' +
      '<button type="button" aria-pressed="' + (!hidden) + '">' + (hidden ? 'Show the “why” notes' : 'Hide the “why” notes') + '</button>';
    document.body.insertBefore(bar, document.body.firstChild);
    var btn = bar.querySelector('button');
    if (!document.querySelector('.why')) btn.hidden = true;
    btn.addEventListener('click', function () {
      hidden = document.body.classList.toggle('hide-notes');
      btn.textContent = hidden ? 'Show the “why” notes' : 'Hide the “why” notes';
      btn.setAttribute('aria-pressed', String(!hidden));
      try { sessionStorage.setItem(KEY, String(hidden)); } catch (e) {}
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
