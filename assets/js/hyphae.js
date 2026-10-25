/* Growing fungal hyphae behind the page headers.
 *
 * Each hypha is a tip that extends, wanders a little, and sometimes branches.
 * When a tip touches a hypha from another branch it fuses and stops, which is
 * what real hyphae do (anastomosis). Tips bend toward the cursor, grow around
 * the text, and are drawn in ink with the growing end in cotton blue.
 *
 * Markup it looks for:
 *   [data-hyphae="circle"|"edge"]   the section to draw in
 *   .hyphae                         empty div inside it that receives the canvases
 *   [data-hyphae-source]            (circle mode) the round image the hyphae grow from
 *   [data-hyphae-avoid]             things the hyphae must grow around
 *                                   (value "round" means a circle, otherwise text lines)
 *
 * People who prefer reduced motion get the finished drawing with no animation.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TIP_COLOR = '#2a5db0';
  var BRANCH_INKS = ['#000000', '#171b1c', '#343b3d', '#4d5557', '#646c6e'];
  var CELL = 5;          // px; size of the cells used to detect fusion
  var SPEED = 1.5;      // px per step
  var MAX_TIPS = 420;
  var CURSOR_RANGE = 300;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function wrapAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function setup(root) {
    var host = root.querySelector('.hyphae');
    if (!host) return null;

    var mode = root.getAttribute('data-hyphae');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, cols, grid, parentOf, nextId;
    var base, tipLayer, bctx, tctx;
    var tips, samples, avoid, budget, raf, running, visible = true;
    var pointer = { x: -9999, y: -9999, active: false, last: 0, spawnAt: 0 };

    function build() {
      host.innerHTML = '';
      w = host.clientWidth;
      h = host.clientHeight;
      if (!w || !h) return false;

      base = document.createElement('canvas');
      tipLayer = document.createElement('canvas');
      [base, tipLayer].forEach(function (c) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        host.appendChild(c);
      });
      bctx = base.getContext('2d');
      tctx = tipLayer.getContext('2d');
      bctx.scale(dpr, dpr);
      tctx.scale(dpr, dpr);
      bctx.lineCap = 'round';

      cols = Math.ceil(w / CELL) + 1;
      grid = new Int32Array(cols * (Math.ceil(h / CELL) + 1));
      parentOf = [0];
      nextId = 1;
      tips = [];
      lastTips = [];
      samples = [];
      budget = 90000;
      measureAvoid();
      seed();
      return true;
    }

    /* Areas the hyphae must grow around: text lines, buttons, the round image */
    function measureAvoid() {
      avoid = [];
      var hostBox = host.getBoundingClientRect();
      var nodes = root.querySelectorAll('[data-hyphae-avoid]');

      Array.prototype.forEach.call(nodes, function (el) {
        var kind = el.getAttribute('data-hyphae-avoid');
        if (kind === 'round') {
          var r = el.getBoundingClientRect();
          avoid.push({
            type: 'round',
            cx: r.left - hostBox.left + r.width / 2,
            cy: r.top - hostBox.top + r.height / 2,
            r: r.width / 2 + 3
          });
          return;
        }
        var range = document.createRange();
        range.selectNodeContents(el);
        var rects = range.getClientRects();
        for (var i = 0; i < rects.length; i++) {
          var b = rects[i];
          if (b.width < 2 || b.height < 2) continue;
          avoid.push({
            type: 'rect',
            x0: b.left - hostBox.left - 14,
            y0: b.top - hostBox.top - 10,
            x1: b.right - hostBox.left + 14,
            y1: b.bottom - hostBox.top + 10
          });
        }
      });
    }

    function blocked(x, y) {
      for (var i = 0; i < avoid.length; i++) {
        var s = avoid[i];
        if (s.type === 'rect') {
          if (x > s.x0 && x < s.x1 && y > s.y0 && y < s.y1) return true;
        } else {
          var dx = x - s.cx, dy = y - s.cy;
          if (dx * dx + dy * dy < s.r * s.r) return true;
        }
      }
      return false;
    }

    function addTip(x, y, angle, gen, parent, life) {
      if (tips.length >= MAX_TIPS) return null;
      var id = nextId++;
      parentOf[id] = parent || 0;
      var t = {
        x: x, y: y, a: angle, da: 0, gen: gen, id: id, parent: parent || 0,
        age: 0, life: life || rand(260, 620) * Math.pow(0.86, gen), miss: 0,
        width: Math.max(0.55, 1.7 * Math.pow(0.8, gen)),
        ink: BRANCH_INKS[Math.min(gen, BRANCH_INKS.length - 1)]
      };
      tips.push(t);
      return t;
    }

    function seed() {
      var i, n, a;
      if (mode === 'circle') {
        var src = root.querySelector('[data-hyphae-source]');
        if (src) {
          var hb = host.getBoundingClientRect();
          var sb = src.getBoundingClientRect();
          var cx = sb.left - hb.left + sb.width / 2;
          var cy = sb.top - hb.top + sb.height / 2;
          var r = sb.width / 2 + 6;
          n = 44;
          for (i = 0; i < n; i++) {
            a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
            addTip(cx + Math.cos(a) * r, cy + Math.sin(a) * r, a + rand(-0.35, 0.35), 0, 0);
          }
        }
        n = Math.max(3, Math.round(w / 260));
        for (i = 0; i < n; i++) {
          addTip(rand(0, w), h + 4, -Math.PI / 2 + rand(-0.7, 0.7), 1, 0);
        }
      } else {
        n = Math.max(4, Math.round(w / 120));
        for (i = 0; i < n; i++) {
          addTip((i + rand(0.1, 0.9)) * (w / n), h + 4, -Math.PI / 2 + rand(-0.6, 0.6), 0, 0);
        }
        n = Math.max(2, Math.round(h / 130));
        for (i = 0; i < n; i++) {
          addTip(w + 4, (i + rand(0.1, 0.9)) * (h / n), Math.PI + rand(-0.6, 0.6), 0, 0);
        }
      }
    }

    function related(owner, t) {
      if (owner === t.id || owner === t.parent) return true;
      if (parentOf[owner] === t.id) return true;
      if (parentOf[t.parent] === owner) return true;
      return false;
    }

    function stepTip(t) {
      /* wander */
      t.da += rand(-0.011, 0.011);
      t.da *= 0.9;
      t.a += t.da;

      /* lean toward the cursor */
      if (pointer.active) {
        var dx = pointer.x - t.x, dy = pointer.y - t.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < CURSOR_RANGE && d > 8) {
          var diff = wrapAngle(Math.atan2(dy, dx) - t.a);
          t.a += diff * 0.05 * (1 - d / CURSOR_RANGE);
        }
      }

      var nx = t.x + Math.cos(t.a) * SPEED;
      var ny = t.y + Math.sin(t.a) * SPEED;

      /* left the drawing area */
      if (nx < -12 || nx > w + 12 || ny < -12 || ny > h + 12) return false;

      /* grow around text and the round image: turn instead of crossing */
      if (blocked(nx, ny)) {
        t.miss++;
        if (t.miss > 6) return false;
        t.a += (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.9);
        return true;
      }
      t.miss = 0;

      /* touching another branch: fuse and stop (most of the time) */
      var gx = (nx / CELL) | 0, gy = (ny / CELL) | 0;
      if (gx >= 0 && gy >= 0 && gx < cols) {
        var key = gy * cols + gx;
        var owner = grid[key];
        if (owner !== 0 && t.age > 10 && !related(owner, t) && Math.random() < 0.6) {
          drawSegment(t, nx, ny);
          return false;
        }
        grid[key] = t.id;
      }

      drawSegment(t, nx, ny);
      t.x = nx; t.y = ny;
      t.age++;
      budget--;

      if (t.age % 28 === 0 && samples.length < 900) samples.push({ x: nx, y: ny });

      /* branch */
      var pb = 0.011 * (t.gen < 3 ? 1 : 0.6);
      if (Math.random() < pb && t.age > 14 && tips.length < MAX_TIPS) {
        var side = Math.random() < 0.5 ? -1 : 1;
        addTip(nx, ny, t.a + side * rand(0.38, 0.72), t.gen + 1, t.id);
        if (samples.length < 900) samples.push({ x: nx, y: ny });
      }

      /* end of life: occasionally cap with a small round tip */
      if (t.age >= t.life) {
        if (Math.random() < 0.18) {
          bctx.fillStyle = t.ink;
          bctx.beginPath();
          bctx.arc(nx, ny, 1.9, 0, Math.PI * 2);
          bctx.fill();
        }
        return false;
      }
      return true;
    }

    function drawSegment(t, nx, ny) {
      bctx.strokeStyle = t.ink;
      bctx.lineWidth = t.width;
      bctx.beginPath();
      bctx.moveTo(t.x, t.y);
      bctx.lineTo(nx, ny);
      bctx.stroke();
    }

    function advance() {
      for (var i = tips.length - 1; i >= 0; i--) {
        if (!stepTip(tips[i])) tips.splice(i, 1);
      }
    }

    var lastTips = [];

    /* Only erase and redraw the small areas around tips, not the whole canvas */
    function drawTips() {
      var i;
      for (i = 0; i < lastTips.length; i++) {
        tctx.clearRect(lastTips[i].x - 4, lastTips[i].y - 4, 8, 8);
      }
      lastTips.length = 0;
      tctx.fillStyle = TIP_COLOR;
      for (i = 0; i < tips.length; i++) {
        tctx.beginPath();
        tctx.arc(tips[i].x, tips[i].y, 2.3, 0, Math.PI * 2);
        tctx.fill();
        lastTips.push({ x: tips[i].x, y: tips[i].y });
      }
    }

    var lastTs = 0, dtSum = 0, dtN = 0;

    function frame(ts) {
      raf = 0;
      if (!running || !visible) { lastTs = 0; return; }

      /* Slow device? Skip the animation and show the finished drawing instead of stuttering. */
      if (lastTs) {
        dtSum += ts - lastTs; dtN++;
        if (dtN === 40 && dtSum / dtN > 50) {
          finishInstantly();
          running = false;
          return;
        }
      }
      lastTs = ts;

      advance();
      drawTips();
      if (tips.length > 0 && budget > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        tctx.clearRect(0, 0, w, h);
        lastTips.length = 0;
      }
    }

    function start() {
      if (running && raf) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function finishInstantly() {
      var guard = 0;
      while (tips.length > 0 && budget > 0 && guard < 2600) { advance(); guard++; }
      tctx.clearRect(0, 0, w, h);
      lastTips.length = 0;
    }

    /* Cursor: nearby tips bend toward it; once growth settles, a new branch reaches out */
    function onPointerMove(e) {
      var hb = host.getBoundingClientRect();
      var x = e.clientX - hb.left, y = e.clientY - hb.top;
      var inside = x >= 0 && y >= 0 && x <= w && y <= h;
      pointer.active = inside;
      if (!inside) return;
      pointer.x = x; pointer.y = y;

      var now = performance.now();
      if (now - pointer.spawnAt < 140 || budget <= 0) return;
      if (tips.length > 40) return;

      var best = null, bestD = 1e9;
      for (var i = 0; i < samples.length; i++) {
        var dx = samples[i].x - x, dy = samples[i].y - y;
        var d = dx * dx + dy * dy;
        if (d < bestD && d > 45 * 45) { bestD = d; best = samples[i]; }
      }
      if (best && bestD < 360 * 360 && !blocked(best.x, best.y)) {
        pointer.spawnAt = now;
        var ang = Math.atan2(y - best.y, x - best.x) + rand(-0.25, 0.25);
        if (addTip(best.x, best.y, ang, 2, 0, rand(120, 260))) start();
      }
    }

    function destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    /* Boot */
    if (!build()) return null;

    if (reduceMotion) {
      finishInstantly();
    } else {
      running = true;
      raf = requestAnimationFrame(frame);

      root.addEventListener('pointermove', onPointerMove, { passive: true });
      root.addEventListener('pointerleave', function () { pointer.active = false; });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible && tips.length > 0 && !raf) { running = true; raf = requestAnimationFrame(frame); }
        }).observe(root);
      }
    }

    /* Redraw from scratch when the width changes (rotating a phone, resizing a window) */
    var lastW = w, lastH = h, timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var nw = host.clientWidth, nh = host.clientHeight;
        if (Math.abs(nw - lastW) < 2 && Math.abs(nh - lastH) < 140) return;
        destroy();
        if (build()) {
          lastW = w; lastH = h;
          if (reduceMotion) finishInstantly();
          else { running = true; raf = requestAnimationFrame(frame); }
        }
      }, 300);
    });

    return { done: function () { return tips.length === 0; } };
  }

  function init() {
    var roots = document.querySelectorAll('[data-hyphae]');
    window.__hyphae = [];
    Array.prototype.forEach.call(roots, function (root) {
      var api = setup(root);
      if (api) window.__hyphae.push(api);
    });
  }

  /* Wait for fonts so text rectangles are measured in their final place */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();
