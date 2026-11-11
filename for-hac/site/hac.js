/* Housing Assistance Council concept: menu, filter pills, concept notices. */
(function () {
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.hidden = true; }, 5000);
  }
  window.hacToast = toast;

  document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu
    var btn = document.getElementById('menuToggle'), nav = document.getElementById('mainnav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
          nav.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });
    }

    // Filter pills: <div class="filters" data-target="#list"> <button class="filter" data-value="x">
    document.querySelectorAll('.filters[data-target]').forEach(function (group) {
      var list = document.querySelector(group.dataset.target);
      var count = group.dataset.count ? document.querySelector(group.dataset.count) : null;
      var noun = group.dataset.noun || 'items';
      var buttons = group.querySelectorAll('.filter');
      function apply(value) {
        var items = list.querySelectorAll('[data-type]'), shown = 0;
        items.forEach(function (el) {
          var ok = value === 'all' || el.dataset.type.split(' ').indexOf(value) !== -1;
          el.hidden = !ok;
          if (ok) shown++;
        });
        if (count) count.textContent = 'Showing ' + shown + ' of ' + items.length + ' ' + noun;
        document.dispatchEvent(new CustomEvent('hac:filter', { detail: { target: group.dataset.target, value: value } }));
      }
      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          apply(b.dataset.value);
        });
      });
      apply('all');
    });

    // Concept-only links and forms
    document.querySelectorAll('a[href="#demo"], button[data-demo]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast(a.dataset.demo || 'This page isn’t part of the concept yet. In the real site, it would be one or two clicks from here.');
      });
    });
    document.querySelectorAll('form[data-demo]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        toast(f.dataset.demo);
      });
    });
  });
})();
