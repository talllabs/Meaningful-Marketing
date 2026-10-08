/* =====================================================
   STANDALONE CONTACT MODAL (Calendly + message form)
   For pages that don't load css/style.css + js/script.js
   (lets-talk-websites.html and the platform-alternative pages).
   Injects its own markup and styles, then opens on any
   ".js-open-contact" element or link to "#contact".
   ===================================================== */
(function () {
  var CALENDLY_URL = 'https://calendly.com/ally-labriola';
  var FORM_ENDPOINT = 'https://formspree.io/f/xykndqdn';
  var CONTACT_HREF = /^(https:\/\/www\.meaningfulmarketinghouse\.com)?\/?(index\.html)?#contact$/;

  var css = [
    '.mmc-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(23,23,23,.72);}',
    '.mmc-overlay.is-open{display:flex;}',
    '.mmc-modal{position:relative;width:100%;max-width:900px;max-height:92vh;overflow-y:auto;display:grid;grid-template-columns:.9fr 1.1fr;border:2px solid #171717;border-radius:28px;background:#f4f0e8;color:#171717;box-shadow:12px 12px 0 #171717;font-family:Arial,Helvetica,sans-serif;}',
    '.mmc-close{position:absolute;top:14px;right:16px;z-index:2;width:40px;height:40px;border:0;border-radius:50%;background:#171717;color:#fff;font-size:18px;cursor:pointer;}',
    '.mmc-panel{padding:44px 36px;}',
    '.mmc-panel--cal{background:#d8ff46;border-radius:26px 0 0 26px;display:flex;flex-direction:column;justify-content:center;}',
    '.mmc-eyebrow{margin:0 0 12px;font-size:.75rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;}',
    '.mmc-modal h2{margin:0 0 12px;font-size:2rem;line-height:1;letter-spacing:-.05em;text-transform:uppercase;}',
    '.mmc-modal p.mmc-sub{margin:0 0 22px;font-size:1rem;line-height:1.5;color:#3d3b37;}',
    '.mmc-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 24px;border:2px solid #171717;border-radius:999px;background:#171717;color:#fff;font:800 1rem Arial,Helvetica,sans-serif;text-decoration:none;cursor:pointer;}',
    '.mmc-btn:hover,.mmc-btn:focus-visible{transform:translateY(-2px);}',
    '.mmc-form{display:grid;gap:14px;}',
    '.mmc-field label{display:block;margin-bottom:5px;font-size:.85rem;font-weight:800;}',
    '.mmc-field input,.mmc-field textarea{width:100%;box-sizing:border-box;padding:12px 14px;border:2px solid #171717;border-radius:14px;background:#fff;font:1rem Arial,Helvetica,sans-serif;color:#171717;}',
    '.mmc-field .is-error{border-color:#c62828;}',
    '.mmc-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}',
    '.mmc-success{text-align:center;padding:30px 0;}',
    '.mmc-success strong{display:block;margin-bottom:8px;font-size:1.6rem;letter-spacing:-.04em;}',
    '.mmc-hidden{display:none !important;}',
    '@media (max-width:760px){.mmc-modal{grid-template-columns:1fr;box-shadow:6px 6px 0 #171717;}.mmc-panel{padding:34px 22px;}.mmc-panel--cal{border-radius:26px 26px 0 0;}.mmc-row{grid-template-columns:1fr;}.mmc-modal h2{font-size:1.6rem;}}'
  ].join('');

  var html =
    '<div class="mmc-modal" role="dialog" aria-modal="true" aria-labelledby="mmcTitle">' +
      '<button type="button" class="mmc-close" aria-label="Close">✕</button>' +
      '<div class="mmc-panel mmc-panel--cal">' +
        '<p class="mmc-eyebrow">Book a time</p>' +
        '<h2>Schedule an intro call</h2>' +
        '<p class="mmc-sub">Pick a time that works for you. No pressure, just a friendly conversation about your website and goals.</p>' +
        '<a class="mmc-btn" href="' + CALENDLY_URL + '" target="_blank" rel="noopener">Open Calendly to Book →</a>' +
      '</div>' +
      '<div class="mmc-panel">' +
        '<p class="mmc-eyebrow">Or send a message</p>' +
        '<h2 id="mmcTitle">Let’s talk about your website</h2>' +
        '<form class="mmc-form" novalidate>' +
          '<div class="mmc-row">' +
            '<div class="mmc-field"><label for="mmc-name">Name *</label><input id="mmc-name" name="name" required autocomplete="name"></div>' +
            '<div class="mmc-field"><label for="mmc-email">Email *</label><input id="mmc-email" name="email" type="email" required autocomplete="email"></div>' +
          '</div>' +
          '<div class="mmc-field"><label for="mmc-org">Organization</label><input id="mmc-org" name="organization" autocomplete="organization"></div>' +
          '<div class="mmc-field"><label for="mmc-message">Message *</label><textarea id="mmc-message" name="message" rows="4" required placeholder="What platform are you on today, and what would you like your website to do better?"></textarea></div>' +
          '<input type="hidden" name="page" value="">' +
          '<button type="submit" class="mmc-btn">Send Message →</button>' +
        '</form>' +
        '<div class="mmc-success mmc-hidden"><strong>Message sent!</strong>Thanks for reaching out. We’ll be in touch within one business day.</div>' +
      '</div>' +
    '</div>';

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'mmc-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    var form = overlay.querySelector('form');
    var success = overlay.querySelector('.mmc-success');
    var closeBtn = overlay.querySelector('.mmc-close');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      form.reset();
      form.classList.remove('mmc-hidden');
      success.classList.add('mmc-hidden');
      form.querySelector('[name="page"]').value = window.location.pathname;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.js-open-contact, a[href]');
      if (!trigger || overlay.contains(trigger)) return;
      var isContactLink = trigger.tagName === 'A' && CONTACT_HREF.test(trigger.getAttribute('href'));
      if (!trigger.classList.contains('js-open-contact') && !isContactLink) return;
      e.preventDefault();
      open();
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        field.classList.remove('is-error');
        if (!field.value.trim()) { field.classList.add('is-error'); valid = false; }
      });
      if (!valid) return;

      var btn = form.querySelector('[type="submit"]');
      var label = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (res) {
          if (!res.ok) throw new Error('bad response');
          form.classList.add('mmc-hidden');
          success.classList.remove('mmc-hidden');
        })
        .catch(function () {
          alert('Something went wrong. Please try again, or email ally@meaningfulmarketinghouse.com.');
        })
        .then(function () {
          btn.textContent = label;
          btn.disabled = false;
        });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
