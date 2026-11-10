/* Housing Assistance Council concept — mobile menu, mockup notices. */
(function () {
  function toast(msg) {
    var t = document.getElementById('ctToast');
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(t._h); t._h = setTimeout(function () { t.hidden = true; }, 5000);
  }
  window.ctToast = toast;
  document.addEventListener('DOMContentLoaded', function () {
    var mb = document.getElementById('ctMenuBtn'), nav = document.getElementById('ctNav');
    if (mb && nav) {
      mb.addEventListener('click', function () { var open = nav.classList.toggle('is-open'); mb.setAttribute('aria-expanded', open ? 'true' : 'false'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
    }
    document.querySelectorAll('a[href="#demo"]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); toast('This page isn’t part of the mockup yet. In the real site, every audience’s key pages are one or two clicks from the homepage.'); });
    });
  });
})();
