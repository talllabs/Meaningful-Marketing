/* Password gate for the Andean Health & Development website concept.
   Unlocking once (per browser tab session) unlocks every page. */
(function () {
  var KEY = 'ahd-mockup-unlocked';
  var PW = 'mockup';
  var unlocked = false;
  try { unlocked = sessionStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (unlocked) return;

  var root = document.documentElement;
  root.classList.add('ahd-locked');
  var style = document.createElement('style');
  style.textContent =
    'html.ahd-locked body > *:not(#ahdGate){display:none !important;}' +
    '#ahdGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:linear-gradient(180deg,#d4eaf7 0%,#ffffff 70%);font-family:"Source Sans 3",system-ui,sans-serif;}' +
    '#ahdGate form{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 24px 64px rgba(28,78,116,.18);}' +
    '#ahdGate img{width:120px;height:auto;margin:0 auto 18px;display:block;}' +
    '#ahdGate h1{margin:0 0 8px;font:700 22px "Montserrat",system-ui,sans-serif;color:#1c4e74;}' +
    '#ahdGate p{margin:0 0 20px;color:#666665;font-size:16px;line-height:1.5;}' +
    '#ahdGate input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:1px solid #cfd8df;font:inherit;font-size:16px;margin-bottom:14px;}' +
    '#ahdGate input:focus{outline:2px solid #52aade;border-color:transparent;}' +
    '#ahdGate button{width:100%;padding:14px;border:0;border-radius:999px;background:#f08519;color:#fff;font:700 15px "Montserrat",system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;}' +
    '#ahdGate button:hover{background:#d9730c;}' +
    '#ahdGate .err{display:none;color:#b3261e;font-size:14px;margin:-6px 0 14px;}';
  document.head.appendChild(style);

  function mount() {
    var gate = document.createElement('div');
    gate.id = 'ahdGate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<img src="/for-ahd/images/ahd-logo.png" alt="Andean Health &amp; Development">' +
      '<h1>A new website for Andean Health</h1>' +
      '<p>A website concept prepared by Meaningful Marketing. Please enter the password to continue.</p>' +
      '<input type="password" placeholder="Password" aria-label="Password">' +
      '<p class="err">That password isn’t quite right. Please try again.</p>' +
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
        root.classList.remove('ahd-locked');
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
