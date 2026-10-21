/* Password gate for the First 5 OC concept pages (/first5oc-demos/ and
   /first5oc-concept-a/). Shares the unlock with /for-first-5.html (same
   sessionStorage key and password), so visitors only enter it once per tab. */
(function () {
  var KEY = 'f5-page-unlocked';
  var PW = 'first5';
  var unlocked = false;
  try { unlocked = sessionStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;
  // Pages embedded as previews inside a page on this same site (the proposal
  // page is gated itself) don't need a second gate.
  try { if (window.self !== window.top && window.top.location.host === location.host) return; } catch (e) {}

  var root = document.documentElement;
  root.classList.add('f5g-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.f5g-locked body > *:not(#f5Gate){display:none !important;}' +
    '#f5Gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:linear-gradient(160deg,#dff7fb 0%,#fff9ed 70%);font-family:Manrope,system-ui,sans-serif;}' +
    '#f5Gate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:22px;padding:38px 30px;box-shadow:0 24px 64px rgba(10,78,98,.18);}' +
    '#f5Gate .logo{display:inline-flex;background:#08799a;border-radius:14px;padding:10px 16px;margin-bottom:18px;color:#fff;font-weight:800;}' +
    '#f5Gate .logo img{height:44px;width:auto;display:block;}' +
    '#f5Gate h1{margin:0 0 8px;font:800 24px "Bricolage Grotesque",Manrope,system-ui,sans-serif;color:#12313d;letter-spacing:-.02em;}' +
    '#f5Gate p{margin:0 0 20px;color:#4d6670;font-size:16px;line-height:1.5;}' +
    '#f5Gate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:12px;border:2px solid #cbe5e9;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#f5Gate input:focus{outline:3px solid #1d4ed8;outline-offset:2px;}' +
    '#f5Gate button{width:100%;padding:14px;border:0;border-radius:999px;background:#b8400f;color:#fff;font:800 16px Manrope,system-ui,sans-serif;cursor:pointer;}' +
    '#f5Gate button:hover{background:#9a350c;}' +
    '#f5Gate button:focus-visible{outline:3px solid #1d4ed8;outline-offset:3px;}' +
    '#f5Gate .err{display:none;color:#b3261e;font-size:14px;margin:-6px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'f5Gate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<span class="logo"><img src="https://first5oc.wpengine.com/wp-content/uploads/2022/10/First5-OC-Logo-2022.png" alt="First 5 Orange County"></span>' +
      '<h1>Website concepts for First&nbsp;5&nbsp;OC</h1>' +
      '<p>Prepared by Meaningful Marketing House. Please enter the password to continue.</p>' +
      '<label for="f5GatePw" style="position:absolute;left:-9999px">Password</label>' +
      '<input type="password" id="f5GatePw" placeholder="Password">' +
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
        try { sessionStorage.setItem(KEY, 'true'); } catch (x) {}
        root.classList.remove('f5g-locked');
        gate.remove();
        // Pages that measure themselves on load (e.g. maps, charts) were hidden; let them re-measure.
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
