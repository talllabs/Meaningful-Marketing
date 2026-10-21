/* Shared helpers for the First 5 OC proposal demos. No dependencies. */
window.F5 = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Lowercase + strip accents so "loteria" finds "Lotería" and "con co" finds "Con Cò".
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }

  function matchesQuery(haystack, q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    var h = norm(haystack);
    return words.every(function (w) { return h.indexOf(w) !== -1; });
  }

  // Render a list of checkboxes. style: 'check' (sidebar rows) or 'chip' (pills).
  function renderChecks(el, items, name, style) {
    el.innerHTML = items.map(function (it) {
      var id = name + '-' + it.id;
      if (style === 'chip') {
        return '<label class="chip"><input type="checkbox" name="' + name + '" value="' + esc(it.id) + '" id="' + id + '"><span>' + (it.icon ? '<span aria-hidden="true">' + it.icon + '</span>' : '') + esc(it.label) + '</span></label>';
      }
      return '<label class="check" for="' + id + '"><input type="checkbox" name="' + name + '" value="' + esc(it.id) + '" id="' + id + '">' +
        (it.icon ? '<span aria-hidden="true">' + it.icon + '</span>' : '') + '<span>' + esc(it.label) + '</span><span class="count" data-count-for="' + id + '"></span></label>';
    }).join('');
  }

  function checked(form, name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
  }

  function setCount(name, id, n) {
    var el = document.querySelector('[data-count-for="' + name + '-' + id + '"]');
    if (el) el.textContent = n;
  }

  // Mobile "More filters" toggle.
  function wireFilterToggle(btn, panel) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.textContent = open ? 'Hide filters' : 'More filters';
    });
  }

  // Detail dialogs are driven by the URL hash (e.g. #activity=leaf-sort) so
  // views are linkable and the browser Back button closes them.
  function wireDialog(dialog, prefix, render) {
    var lastFocus = null;
    function sync() {
      var m = location.hash.match(new RegExp('^#' + prefix + '=(.+)$'));
      if (m) {
        var ok = render(decodeURIComponent(m[1]));
        if (!ok) return;
        if (!dialog.open) { lastFocus = document.activeElement; dialog.showModal(); }
        dialog.scrollTop = 0;
        var h = dialog.querySelector('h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
      } else if (dialog.open) {
        dialog.close();
      }
    }
    function closeViaHash() {
      if (location.hash.indexOf('#' + prefix + '=') === 0) {
        history.pushState('', document.title, location.pathname + location.search);
      }
      if (dialog.open) dialog.close();
    }
    dialog.addEventListener('close', function () {
      closeViaHash();
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.querySelector('.detail-close').addEventListener('click', function () { dialog.close(); });
    window.addEventListener('hashchange', sync);
    sync();
    return { open: function (id) { location.hash = prefix + '=' + encodeURIComponent(id); } };
  }

  return { esc: esc, norm: norm, matchesQuery: matchesQuery, renderChecks: renderChecks, checked: checked, setCount: setCount, wireFilterToggle: wireFilterToggle, wireDialog: wireDialog };
})();
