/* Password gate for the Transcend demo pages. Shares the unlock with
   /for-transcend/ (same sessionStorage key), so visitors only enter it once. */
(function () {
  var KEY = 'transcend-page-unlocked';
  var PW = 'transcend';
  var unlocked = false;
  try { unlocked = sessionStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;

  var root = document.documentElement;
  root.classList.add('tc-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.tc-locked body > *:not(#tcGate){display:none !important;}' +
    '#tcGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:#0C0C0C;font-family:"Space Grotesk",system-ui,sans-serif;}' +
    '#tcGate form{width:100%;max-width:380px;text-align:center;background:#fff;border-radius:18px;padding:40px 32px;box-shadow:0 24px 64px rgba(0,0,0,.4);}' +
    '#tcGate h1{margin:0 0 8px;font-size:24px;color:#0C0C0C;}' +
    '#tcGate p{margin:0 0 20px;color:#706D68;font-size:15px;}' +
    '#tcGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:1px solid rgba(12,12,12,.15);font:inherit;margin-bottom:14px;}' +
    '#tcGate button{width:100%;padding:14px;border:0;border-radius:10px;background:#D4635A;color:#fff;font:700 15px inherit;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;}' +
    '#tcGate .err{display:none;color:#b3261e;font-size:13px;margin:-6px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'tcGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<h1>Hello, Transcend!</h1>' +
      '<p>Prepared by Meaningful Marketing House. Please enter the password to continue.</p>' +
      '<input type="password" placeholder="Password" aria-label="Password">' +
      '<p class="err">That password isn’t quite right. Please try again.</p>' +
      '<button type="submit">Enter →</button>' +
      '</form>';
    document.body.appendChild(gate);
    var form = gate.querySelector('form');
    var input = gate.querySelector('input');
    var err = gate.querySelector('.err');
    input.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ((input.value || '').trim().toLowerCase() === PW) {
        try { sessionStorage.setItem(KEY, 'true'); } catch (x) {}
        root.classList.remove('tc-locked');
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
