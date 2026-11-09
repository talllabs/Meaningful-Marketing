/* Password gate for the Westside Regional Center concept pages (/for-westside/site/).
   Shares the unlock with /for-westside/ (same storage key and password), so
   visitors only enter it once. Pages previewed inside the (already gated)
   proposal page skip the gate. */
(function () {
  var KEY = 'westside-page-unlocked';
  var PW = 'westside';
  var unlocked = false;
  try { unlocked = sessionStorage.getItem(KEY) === 'true' || localStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;
  try { if (window.self !== window.top && window.top.location.host === location.host) return; } catch (e) {}

  var root = document.documentElement;
  root.classList.add('wrg-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.wrg-locked body > *:not(#wrGate){display:none !important;}' +
    '#wrGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:linear-gradient(170deg,#fff4d9 0%,#e6f4fb 100%);font-family:"Atkinson Hyperlegible",system-ui,sans-serif;}' +
    '#wrGate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:18px;padding:36px 30px;box-shadow:0 24px 64px rgba(11,47,102,.2);}' +
    '#wrGate h1{margin:0 0 8px;font-size:24px;color:#0b2f66;}' +
    '#wrGate p{margin:0 0 20px;color:#4a5568;font-size:16px;line-height:1.5;}' +
    '#wrGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:2px solid #d5dbe5;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#wrGate input:focus{outline:3px solid #1450a3;outline-offset:2px;}' +
    '#wrGate button{width:100%;min-height:48px;padding:14px;border:0;border-radius:999px;background:#1450a3;color:#fff;font:700 16px inherit;font-family:inherit;cursor:pointer;}' +
    '#wrGate .err{display:none;color:#a4161a;font-size:15px;margin:-4px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'wrGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<h1>Website concept for Westside Regional Center</h1>' +
      '<p>Prepared by Meaningful Marketing House. Please enter the password to continue.</p>' +
      '<label for="wrGatePw" class="sr-only" style="position:absolute;left:-9999px">Password</label>' +
      '<input type="password" id="wrGatePw" placeholder="Password">' +
      '<p class="err" role="alert">That password isn’t quite right. Please try again.</p>' +
      '<button type="submit">View the concept →</button>' +
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
        root.classList.remove('wrg-locked');
        gate.remove();
        window.dispatchEvent(new Event('resize'));
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
