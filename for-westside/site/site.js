/* Westside Regional Center concept — accessibility toolbar + menu.
   Settings are remembered per visitor (text size, contrast). */
(function () {
  var root = document.documentElement;
  function save(k, v) { try { localStorage.setItem('wrc-' + k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem('wrc-' + k); } catch (e) { return null; } }

  /* Text size */
  var sizes = { md: '', lg: 'wrc-text-lg', xl: 'wrc-text-xl' };
  function setSize(s) {
    root.classList.remove('wrc-text-lg', 'wrc-text-xl');
    if (sizes[s]) root.classList.add(sizes[s]);
    document.querySelectorAll('[data-text-size]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-text-size') === s ? 'true' : 'false');
    });
    save('size', s);
  }

  /* High contrast */
  function setContrast(on) {
    root.classList.toggle('wrc-contrast', on);
    document.querySelectorAll('[data-contrast]').forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    save('contrast', on ? '1' : '0');
  }

  function toast(msg) {
    var t = document.getElementById('wrcToast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.hidden = true; }, 5000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setSize(load('size') || 'md');
    setContrast(load('contrast') === '1');

    document.querySelectorAll('[data-text-size]').forEach(function (b) {
      b.addEventListener('click', function () { setSize(b.getAttribute('data-text-size')); });
    });
    document.querySelectorAll('[data-contrast]').forEach(function (b) {
      b.addEventListener('click', function () { setContrast(b.getAttribute('aria-pressed') !== 'true'); });
    });

    /* Language (demo only) */
    var lang = document.getElementById('wrcLang');
    if (lang) {
      lang.addEventListener('change', function () {
        var opt = lang.options[lang.selectedIndex];
        if (lang.value === 'en') return;
        toast(opt.getAttribute('data-msg') + ' (Mockup: in the real site, this page would switch to ' + opt.textContent.trim() + ', reviewed by a human translator.)');
      });
    }

    /* Listen (reads the main content aloud with the browser's built-in voice) */
    var listen = document.querySelectorAll('[data-listen]');
    listen.forEach(function (btn) {
      if (!('speechSynthesis' in window)) { btn.hidden = true; return; }
      btn.addEventListener('click', function () {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
          btn.setAttribute('aria-pressed', 'false');
          btn.querySelector('span').textContent = 'Listen to this page';
          return;
        }
        var main = document.getElementById('main');
        var u = new SpeechSynthesisUtterance((main ? main.innerText : document.body.innerText).slice(0, 4000));
        u.rate = 0.95;
        u.onend = function () { btn.setAttribute('aria-pressed', 'false'); btn.querySelector('span').textContent = 'Listen to this page'; };
        speechSynthesis.speak(u);
        btn.setAttribute('aria-pressed', 'true');
        btn.querySelector('span').textContent = 'Stop reading';
      });
    });

    /* Mobile menu */
    var mb = document.getElementById('wrcMenuBtn');
    var nav = document.getElementById('wrcNav');
    if (mb && nav) {
      mb.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        mb.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          mb.setAttribute('aria-expanded', 'false');
          mb.focus();
        }
      });
    }

    /* Demo links that aren't built yet */
    document.querySelectorAll('a[href="#demo"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast('This page isn’t part of the mockup yet. In the real site, every key page is no more than two clicks from the homepage.');
      });
    });
  });
})();
