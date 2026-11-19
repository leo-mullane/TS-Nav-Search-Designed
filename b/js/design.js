/* ==========================================================================
   design.js — presentational enhancements for the designed prototypes.

   Loaded after every other script. It changes no behaviour of the
   navigation or search; it only:
   1. swaps the logo placeholder for a typographic wordmark (a stand-in for
      Travers Smith's own logo file),
   2. adds the small design switcher (prototype chrome), and
   3. in Design B only, presents the Services menu's three groups as tabs,
      the approach Travers Smith liked on Hogan Lovells Cadwalader.
   ========================================================================== */

(function () {
  'use strict';

  var design = document.documentElement.getAttribute('data-design') || 'a';
  var NAMES = { a: 'A', b: 'B', c: 'C' };

  /* 1. Wordmark ----------------------------------------------------------- */
  function wordmark() {
    document.querySelectorAll('.wf-placeholder.logo').forEach(function (ph) {
      var mark = document.createElement('span');
      mark.className = 'ts-wordmark';
      mark.innerHTML = 'Travers<span>Smith</span>';
      ph.replaceWith(mark);
    });
  }

  /* 2. Design switcher ---------------------------------------------------- */
  function switcher() {
    var rootLink = document.getElementById('wf-root');
    if (!rootLink) return;
    var designIndex = new URL(rootLink.getAttribute('href'), window.location.href);
    var designRoot = new URL('./', designIndex);           /* …/a/ */
    var contents = new URL('../index.html', designRoot);   /* the contents page */
    var here = window.location.href.slice(designRoot.href.length);

    var nav = document.createElement('nav');
    nav.className = 'design-switch';
    nav.setAttribute('aria-label', 'Prototype: switch design');
    var html = '<span>Design</span>';
    Object.keys(NAMES).forEach(function (d) {
      html += '<a href="' + new URL('../' + d + '/' + here, designRoot).href + '" data-to="' + d + '"' +
        (d === design ? ' aria-current="true"' : '') + ' aria-label="Design ' + NAMES[d] + '">' + NAMES[d] + '</a>';
    });
    html += '<a href="' + contents.href + '">Contents</a>';
    nav.innerHTML = html;
    document.body.appendChild(nav);

    /* Search pages rewrite the address as filters change, so the target is
       worked out again at the moment of use: the same view, another design. */
    function refresh(e) {
      var a = e.target.closest('[data-to]');
      if (!a) return;
      var now = window.location.href.slice(designRoot.href.length);
      a.href = new URL('../' + a.getAttribute('data-to') + '/' + now, designRoot).href;
    }
    nav.addEventListener('mousedown', refresh);
    nav.addEventListener('focusin', refresh);
    nav.addEventListener('click', refresh);
  }

  /* Image placeholders say who supplies the picture. */
  function imageLabels() {
    document.querySelectorAll('.wf-placeholder.ratio-16-9').forEach(function (ph) {
      ph.textContent = 'Image uploaded by Travers Smith';
    });
  }

  /* 3. Design B: Services groups as tabs ----------------------------------- */
  function serviceTabs() {
    var browse = document.getElementById('mega-svc-browse');
    if (!browse) return;
    var cols = Array.prototype.slice.call(browse.querySelectorAll(':scope > .mega-col'));
    if (cols.length < 2) return;

    var rail = document.createElement('div');
    rail.className = 'svc-tabs';
    rail.setAttribute('role', 'tablist');
    rail.setAttribute('aria-label', 'Services menu');
    rail.setAttribute('aria-orientation', 'vertical');

    var panels = document.createElement('div');
    panels.className = 'svc-tabpanels';

    var tabs = cols.map(function (col, i) {
      var heading = col.querySelector('h5');
      var id = 'svc-tab-' + i;
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'svc-tab';
      tab.id = id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', id + '-panel');
      tab.textContent = heading ? heading.textContent : 'Group ' + (i + 1);
      rail.appendChild(tab);

      col.id = id + '-panel';
      col.setAttribute('role', 'tabpanel');
      col.setAttribute('aria-labelledby', id);
      col.classList.add('svc-tabpanel');
      panels.appendChild(col);
      return tab;
    });

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        cols[j].classList.toggle('is-active', on);
      });
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      /* Pointing at a tab previews it, as on Hogan Lovells; clicking keeps it. */
      t.addEventListener('mouseenter', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, to = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = (i + 1) % n;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to !== null) { e.preventDefault(); select(to, true); }
      });
    });

    browse.classList.add('has-svc-tabs');
    browse.appendChild(rail);
    browse.appendChild(panels);
    select(0, false);
  }

  document.addEventListener('DOMContentLoaded', function () {
    wordmark();
    imageLabels();
    switcher();
    if (design === 'b') serviceTabs();
  });
})();
