/* Password gate for the WORTH pitch pages (password: worthit).
   Unlocking once unlocks every /for-worth page, and the browser remembers it. */
(function () {
  var KEY = 'worth-unlocked';
  var PW = 'worthit';
  var unlocked = false;
  try { unlocked = localStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;

  var root = document.documentElement;
  root.classList.add('worth-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.worth-locked body > *:not(#worthGate){display:none !important;}' +
    '#worthGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:#fbf6ef;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}' +
    '#worthGate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 24px 64px rgba(36,23,34,.16);border-top:6px solid #FA006C;}' +
    '#worthGate img{width:64px;height:auto;margin:0 auto 16px;display:block;}' +
    '#worthGate h1{margin:0 0 8px;max-width:none;line-height:1.2;font:700 24px/1.2 Georgia,serif;letter-spacing:-.02em;color:#1b1219;}' +
    '#worthGate p{margin:0 0 20px;color:#5f4f58;font-size:16px;line-height:1.5;}' +
    '#worthGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:1px solid #d9cdd2;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#worthGate input:focus{outline:2px solid #C4005A;border-color:transparent;}' +
    '#worthGate button{width:100%;padding:14px;border:0;border-radius:999px;background:#1b1219;color:#fff;font:700 15px system-ui,sans-serif;cursor:pointer;}' +
    '#worthGate button:hover{background:#C4005A;}' +
    '#worthGate .err{display:none;color:#b3261e;font-size:14px;margin:-6px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'worthGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<img src="/for-worth/assets/o.svg" alt="">' +
      '<h1>For WORTH Association</h1>' +
      '<p>Prepared by Meaningful Marketing. Please enter the password to continue.</p>' +
      '<input type="password" placeholder="Password" aria-label="Password">' +
      '<p class="err" role="alert">That password isn’t quite right. Please try again.</p>' +
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
        root.classList.remove('worth-locked');
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
