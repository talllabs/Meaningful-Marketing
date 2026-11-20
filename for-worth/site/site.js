/* WORTH homepage mockup: menu, resource hub filters, scroll reveals, counters */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var menuBtn = document.querySelector('.top__menu');
  var nav = document.getElementById('nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && nav.classList.contains('is-open')) menuBtn.click();
  });

  /* Header border once the page scrolls */
  var top = document.querySelector('.top');
  function onScroll() { top.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Resource hub */
  var RES = [
    { t: 'Creating Accessible and Inclusive Events', topic: 'Advocacy', d: 'Practical ways to consider sensory needs, mobility and belonging when planning events.', u: 'https://www.worthassociation.com/resources/tips-for-creating-accessible-and-inclusive-events' },
    { t: 'Leadership Insights from the Women Behind FIFA World Cup 2026™', topic: 'Career', d: 'Lessons from women leading behind the scenes in major sport and tourism events.', u: 'https://www.worthassociation.com/resources/leadership-insights-from-the-women-behind-fifa-world-cup-2026' },
    { t: 'From Seat At The Table To Taking The Stage: Our Research In Action', topic: 'Advocacy', d: 'Explore WORTH’s research on women’s leadership and how the findings inform its work.', u: 'https://www.worthassociation.com/resources/from-seat-at-the-table-to-taking-the-stage-our-research-in-action' },
    { t: 'Your Career, This Year', topic: 'Career', d: 'Ideas for setting career goals and taking the next step in your professional development.', u: 'https://www.worthassociation.com/resources/your-career-this-year' },
    { t: 'The Leadership Working Mothers Carry Before the Workday Begins', topic: 'Career', d: 'A look at the skills working mothers bring from caregiving into the workplace.', u: 'https://www.worthassociation.com/resources/the-leadership-working-mothers-carry-before-the-workday-begins' },
    { t: 'NetWORTH: Lessons From Women in Finance', topic: 'Health & Wellbeing', d: 'Career and money lessons from WORTH’s conversation with women in finance.', u: 'https://www.worthassociation.com/resources/networth-lessons-from-women-in-finance' }
  ];
  var CLASS = { 'Advocacy': 't-advocacy', 'Career': 't-career', 'Health & Wellbeing': 't-health' };
  var cards = document.getElementById('hubCards');
  var search = document.getElementById('hubSearch');
  var select = document.getElementById('hubSelect');
  var chips = document.querySelectorAll('#hubTopics .topic');
  var count = document.getElementById('hubCount');
  var state = { q: '', topic: '' };

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function render() {
    var q = state.q.toLowerCase();
    var list = RES.filter(function (r) {
      return (!state.topic || r.topic === state.topic) &&
        (!q || (r.t + ' ' + r.d + ' ' + r.topic).toLowerCase().indexOf(q) > -1);
    });
    cards.innerHTML = list.length ? list.map(function (r) {
      return '<a class="card ' + (CLASS[r.topic] || 't-leadership') + '" href="' + r.u + '">' +
        '<div class="card__art" aria-hidden="true"></div>' +
        '<div class="card__body"><span class="tag">' + esc(r.topic) + '</span>' +
        '<h3>' + esc(r.t) + '</h3><p>' + esc(r.d) + '</p><span class="arrow">Read more</span></div></a>';
    }).join('') : '<div class="empty">No featured resources match that yet. Try another topic, or search the full library of 182 resources.</div>';
    count.textContent = (state.q || state.topic)
      ? 'Showing ' + list.length + ' of 6 featured resources · 182 in the full library'
      : 'Showing 6 featured resources · 182 in the full library';
  }
  function setTopic(topic) {
    state.topic = topic;
    select.value = topic;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-topic') === topic); });
    render();
  }
  search.addEventListener('input', function () { state.q = search.value.trim(); render(); });
  select.addEventListener('change', function () { setTopic(select.value); });
  chips.forEach(function (c) { c.addEventListener('click', function () { setTopic(c.getAttribute('data-topic')); }); });
  render();

  /* Newsletter (mockup only: shows a thank-you instead of sending) */
  var form = document.getElementById('newsForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelector('.ok').style.display = 'block';
    form.querySelector('.note').style.display = 'none';
  });

  /* Count up the impact numbers */
  function countUp(el) {
    var end = +el.getAttribute('data-count'), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString('en-CA') + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Scroll reveals */
  var els = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
