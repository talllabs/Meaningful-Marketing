/* Password gate for the ATTA membership mockup pages (password: atta).
   Unlocking once unlocks every page, and the browser remembers it. */
(function () {
  var KEY = 'atta-unlocked';
  var PW = 'atta';
  var unlocked = false;
  try { unlocked = localStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;

  var root = document.documentElement;
  root.classList.add('atta-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.atta-locked body > *:not(#attaGate){display:none !important;}' +
    '#attaGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:linear-gradient(180deg,#e6f4f8 0%,#ffffff 70%);font-family:Arial,Helvetica,sans-serif;}' +
    '#attaGate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 24px 64px rgba(1,42,56,.18);}' +
    '#attaGate img{width:200px;height:auto;margin:0 auto 18px;display:block;}' +
    '#attaGate h1{margin:0 0 8px;font:700 22px Arial,Helvetica,sans-serif;color:#012a38;}' +
    '#attaGate p{margin:0 0 20px;color:#666665;font-size:16px;line-height:1.5;}' +
    '#attaGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:1px solid #cfd8df;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#attaGate input:focus{outline:2px solid #048cb9;border-color:transparent;}' +
    '#attaGate button{width:100%;padding:14px;border:0;border-radius:999px;background:#ea5540;color:#fff;font:700 15px Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;}' +
    '#attaGate button:hover{background:#c9412e;}' +
    '#attaGate .err{display:none;color:#b3261e;font-size:14px;margin:-6px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'attaGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<img src="/for-atta/assets/logo.svg" alt="Adventure Travel Trade Association">' +
      '<h1>For ATTA</h1>' +
      '<p>Prepared by Meaningful Marketing. Please enter the password to continue.</p>' +
      '<input type="password" placeholder="Password" aria-label="Password">' +
      '<p class="err">That password isn’t quite right. Please try again.</p>' +
      '<button type="submit">Continue →</button>' +
      '</form>';
    document.body.appendChild(gate);
    var form = gate.querySelector('form');
    var input = gate.querySelector('input');
    var err = gate.querySelector('.err');
    input.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ((input.value || '').trim().toLowerCase() === PW) {
        try { localStorage.setItem(KEY, 'true'); } catch (x) {}
        root.classList.remove('atta-locked');
        gate.remove();
      } else {
        err.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
