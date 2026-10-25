/* Site behavior: header colors, mobile menu, publication filter. No libraries. */
(function () {
  'use strict';

  var header = document.getElementById('site-header');

  /* Header text turns white while it sits over a dark or blue section */
  if (header) {
    var dark = Array.prototype.slice.call(document.querySelectorAll('.on-dark, .on-blue'));
    var ticking = false;

    var update = function () {
      var y = header.offsetHeight / 2;
      var over = false;
      for (var i = 0; i < dark.length; i++) {
        var r = dark[i].getBoundingClientRect();
        if (r.top <= y && r.bottom > y) { over = true; break; }
      }
      if (over) header.setAttribute('data-over', 'dark');
      else header.removeAttribute('data-over');
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    /* Mobile menu */
    var toggle = header.querySelector('.site-header__toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.getAttribute('data-open') === 'true';
        header.setAttribute('data-open', String(!open));
        toggle.setAttribute('aria-expanded', String(!open));
        toggle.textContent = open ? 'Menu' : 'Close';
      });
    }
  }

  /* Publication filter: every word typed must appear in the title, authors, journal or year */
  var input = document.getElementById('pub-filter');
  if (input) {
    var items = Array.prototype.slice.call(document.querySelectorAll('#pub-list .pub'));
    var years = Array.prototype.slice.call(document.querySelectorAll('#pub-list .pub-year'));
    var count = document.getElementById('pub-count');
    var empty = document.getElementById('pub-empty');

    var apply = function () {
      var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;

      items.forEach(function (li) {
        var hay = li.getAttribute('data-search') || '';
        var ok = words.every(function (w) { return hay.indexOf(w) !== -1; });
        li.hidden = !ok;
        if (ok) shown++;
      });

      years.forEach(function (section) {
        section.hidden = !section.querySelector('.pub:not([hidden])');
      });

      if (count) {
        count.textContent = shown === items.length
          ? items.length + ' publications'
          : shown + ' of ' + items.length + ' publications';
      }
      if (empty) empty.hidden = shown > 0;
    };

    input.addEventListener('input', apply);

    /* Links like /publications/?search=Bradshaw pre-fill the filter */
    try {
      var q = new URLSearchParams(window.location.search).get('search');
      if (q) { input.value = q; apply(); }
    } catch (e) { /* older browsers: skip */ }
  }
})();
