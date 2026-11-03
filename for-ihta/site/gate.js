/* Password gate for the IHTA concept pages (/for-ihta/site/). Shares the
   unlock with /for-ihta/ (same storage key and password), so visitors only
   enter it once. Pages previewed inside the (already gated) proposal page
   skip the gate. */
(function () {
  var KEY = 'ihta-page-unlocked';
  var PW = 'ihta';
  var unlocked = false;
  try { unlocked = sessionStorage.getItem(KEY) === 'true' || localStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;
  try { if (window.self !== window.top && window.top.location.host === location.host) return; } catch (e) {}

  var root = document.documentElement;
  root.classList.add('ihg-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.ihg-locked body > *:not(#ihGate){display:none !important;}' +
    '#ihGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:linear-gradient(170deg,#0b2266 0%,#1f3fa6 55%,#eef2fb 55.2%);font-family:Barlow,system-ui,sans-serif;}' +
    '#ihGate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:18px;padding:36px 30px;box-shadow:0 24px 64px rgba(8,22,70,.35);}' +
    '' +
    '#ihGate h1{margin:0 0 8px;font:700 24px Barlow,sans-serif;color:#0b2266;}' +
    '#ihGate p{margin:0 0 20px;color:#4b6067;font-size:15px;line-height:1.5;}' +
    '#ihGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:2px solid #d3dee1;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#ihGate input:focus{outline:3px solid #1f3fa6;outline-offset:2px;}' +
    '#ihGate button{width:100%;padding:14px;border:0;border-radius:999px;background:#f8cb00;color:#0b2266;font:700 16px Barlow,system-ui,sans-serif;cursor:pointer;}' +
    '#ihGate .err{display:none;color:#8a2c0e;font-size:14px;margin:-4px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'ihGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<img class="mark" src="images/ihta-logo-sm.webp" alt="Iditarod National Historic Trail logo" style="height:96px;width:auto;margin:0 auto 10px;display:block">' +
      '<h1>Website concept for IHTA</h1>' +
      '<p>Prepared by Meaningful Marketing House for the Iditarod Historic Trail Alliance. Please enter the password to continue.</p>' +
      '<label for="ihGatePw" style="position:absolute;left:-9999px">Password</label>' +
      '<input type="password" id="ihGatePw" placeholder="Password">' +
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
        root.classList.remove('ihg-locked');
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
