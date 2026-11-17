/* Design notes for the ATTA mockup.
   Any element with class "mm-note" (a sticky-note callout) or "mm-note-block"
   (a whole section that exists only to explain the concept) stays hidden
   until the viewer clicks "Show design notes". The choice is remembered. */
(function () {
  var KEY = 'atta-notes-on';
  var root = document.documentElement;
  var on = false;
  try { on = localStorage.getItem(KEY) === 'true'; } catch (e) {}
  if (on) root.classList.add('mm-notes-on');

  var style = document.createElement('style');
  style.textContent =
    '.mm-note,.mm-note-block{display:none !important;}' +
    'html.mm-notes-on .mm-note{display:block !important;}' +
    'html.mm-notes-on .mm-note-block{display:block !important;outline:3px dashed #e0b400;outline-offset:-3px;position:relative;}' +
    '.mm-note{position:relative;margin:18px 0;padding:14px 18px 14px 46px;background:#fff6c7;border:1px solid #f0d36a;border-radius:10px;' +
      'box-shadow:0 6px 18px rgba(120,90,0,.12);color:#4a3b00;font:14px/1.55 Arial,Helvetica,sans-serif;max-width:760px;text-align:left;letter-spacing:0;text-transform:none;}' +
    '.mm-note::before{content:"✎";position:absolute;left:14px;top:12px;width:22px;height:22px;border-radius:50%;background:#e0b400;color:#fff;font-size:13px;line-height:22px;text-align:center;}' +
    '.mm-note b{display:block;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#8a6d00;margin-bottom:4px;}' +
    '.mm-note p,.mm-note li{margin:0 0 6px;max-width:none;font-size:14px;}' +
    '.mm-note ul{margin:6px 0 0;padding-left:18px;}' +
    '.mm-note a{color:#6b5300;}' +
    '.mm-note-block .mm-block-label{display:none;}' +
    'html.mm-notes-on .mm-note-block .mm-block-label{display:block;}' +
    '#mmNotesToggle{position:fixed;right:18px;bottom:18px;z-index:9000;display:flex;align-items:center;gap:8px;padding:12px 18px;border:0;border-radius:999px;' +
      'background:#012a38;color:#fff;font:700 13px Arial,Helvetica,sans-serif;letter-spacing:.04em;cursor:pointer;box-shadow:0 10px 28px rgba(1,42,56,.35);}' +
    '#mmNotesToggle:hover{background:#023f53;}' +
    '#mmNotesToggle .dot{width:10px;height:10px;border-radius:50%;background:#e0b400;}' +
    '#mmNotesToggle .count{background:rgba(255,255,255,.18);border-radius:999px;padding:2px 8px;font-size:12px;}' +
    '@media print{#mmNotesToggle{display:none;}}';
  document.head.appendChild(style);

  function mount() {
    var notes = document.querySelectorAll('.mm-note, .mm-note-block');
    if (!notes.length) return;
    var btn = document.createElement('button');
    btn.id = 'mmNotesToggle';
    btn.type = 'button';
    function render() {
      var isOn = root.classList.contains('mm-notes-on');
      btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
      btn.innerHTML = '<span class="dot" aria-hidden="true"></span>' +
        (isOn ? 'Hide design notes' : 'Show design notes') +
        ' <span class="count">' + notes.length + '</span>';
    }
    btn.addEventListener('click', function () {
      var isOn = root.classList.toggle('mm-notes-on');
      try { localStorage.setItem(KEY, isOn ? 'true' : 'false'); } catch (e) {}
      render();
    });
    render();
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
