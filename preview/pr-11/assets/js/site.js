/* Site behavior: mobile menu, hero video, publication filter. No libraries. */
(function () {
  'use strict';

  var header = document.getElementById('site-header');

  /* Mobile menu */
  if (header) {
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

  /* Hero video: show the still picture for people who prefer reduced motion, and pause off-screen */
  var video = document.querySelector('.eyepiece__video');
  if (video) {
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) {
      video.removeAttribute('autoplay');
      video.pause();
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
          else video.pause();
        });
      }).observe(video);
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
