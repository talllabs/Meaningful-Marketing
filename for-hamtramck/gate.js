/* Password gate for the Hamtramck Parks Conservancy homepage concepts.
   Unlocking once unlocks every page, and the browser remembers it. */
(function () {
  var KEY = 'hpc-mockup-unlocked';
  var PW = 'hamtramck';
  var unlocked = false;
  try { unlocked = localStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;

  var root = document.documentElement;
  root.classList.add('hpc-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.hpc-locked body > *:not(#hpcGate){display:none !important;}' +
    '#hpcGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:linear-gradient(180deg,#e6ede4 0%,#f8f7f1 70%);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}' +
    '#hpcGate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 24px 64px rgba(16,46,39,.18);}' +
    '#hpcGate img{width:150px;height:auto;margin:0 auto 18px;display:block;}' +
    '#hpcGate h1{margin:0 0 8px;font:700 22px system-ui,sans-serif;color:#173e34;}' +
    '#hpcGate p{margin:0 0 20px;color:#56655d;font-size:16px;line-height:1.5;}' +
    '#hpcGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:1px solid #b9c8bb;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#hpcGate input:focus{outline:3px solid #2c934e;outline-offset:1px;}' +
    '#hpcGate button{width:100%;padding:14px;border:0;border-radius:999px;background:#173e34;color:#fff;font:700 15px system-ui,sans-serif;cursor:pointer;}' +
    '#hpcGate button:hover{background:#102e27;}' +
    '#hpcGate .err{display:none;color:#b3261e;font-size:14px;margin:-6px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'hpcGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<img src="/for-hamtramck/images/hpc-logo.svg" alt="Hamtramck Parks Conservancy">' +
      '<h1>Homepage concepts for the Conservancy</h1>' +
      '<p>Prepared by Meaningful Marketing. Please enter the password to continue.</p>' +
      '<input type="password" placeholder="Password" aria-label="Password">' +
      '<p class="err" role="alert">That password isn’t quite right. Please try again.</p>' +
      '<button type="submit">View the concepts →</button>' +
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
        root.classList.remove('hpc-locked');
        gate.remove();
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
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
