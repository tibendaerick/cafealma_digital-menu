/*
  splash.js - Café Alma Foods intro screen
  Shows a short logo animation while the menu loads behind it.
  It always leaves within about 3.8 seconds, even on slow mobile data.
  No images or video: only CSS and a small SVG, so it uses almost no data.
*/
(function () {
  // ---------- SETTINGS (change these if you want) ----------
  var CONFIG = {
    brandName: 'Café Alma',
    tagline: 'Foods · Coffee - Mubende Municipality',
    minMs: 2000,            // show the animation for at least this long (ms)
    maxMs: 3400,            // never longer than this (ms). Keep under 3600.
    showOncePerVisit: true, // true = once per browser session, false = every page load
    colors: {
      bgCenter: '#4a2c1a',  // coffee brown (centre of the glow)
      bgEdge: '#24140b',    // dark brown (edges)
      gold: '#d9a441',      // gold line and accents
      text: '#fff6e8'       // off-white text
    }
  };
  // ----------------------------------------------------------

  var SEEN_KEY = 'alma-splash-seen';
  var c = CONFIG.colors;

  // Skip the splash if it already played in this browser session
  if (CONFIG.showOncePerVisit) {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch (e) {}
  }

  // Phones with "reduce motion" switched on get a short, still version
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var minMs = reduceMotion ? 500 : CONFIG.minMs;

  var css = [
    '#splash{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;',
    'align-items:center;justify-content:center;padding:24px;box-sizing:border-box;',
    'background:radial-gradient(ellipse at 50% 40%,' + c.bgCenter + ' 0%,' + c.bgEdge + ' 75%);',
    'color:' + c.text + ';transition:opacity .4s ease,visibility .4s;}',
    '#splash.splash-hide{opacity:0;visibility:hidden;pointer-events:none;}',
    '#splash .splash-logo{font-family:Georgia,"Times New Roman",serif;font-size:clamp(40px,11vw,64px);',
    'font-weight:700;letter-spacing:.5px;text-align:center;opacity:0;transform:translateY(12px);',
    'animation:splashIn .8s ease .2s forwards;}',
    '#splash svg{width:min(70vw,320px);height:auto;overflow:visible;margin-top:2px;}',
    '#splash .splash-line{fill:none;stroke:' + c.gold + ';stroke-width:3;stroke-linecap:round;',
    'stroke-dasharray:1;stroke-dashoffset:1;animation:splashDraw 1s ease .4s forwards;}',
    '#splash .splash-tag{margin-top:6px;font-size:13px;letter-spacing:4px;text-transform:uppercase;',
    'color:' + c.gold + ';text-align:center;opacity:0;animation:splashIn .8s ease .7s forwards;}',
    '#splash .splash-bar{width:120px;height:3px;margin-top:36px;border-radius:3px;',
    'background:rgba(255,255,255,.15);overflow:hidden;}',
    '#splash .splash-bar span{display:block;height:100%;width:0;background:' + c.gold + ';',
    'animation:splashFill ' + minMs + 'ms linear forwards;}',
    '@keyframes splashIn{to{opacity:1;transform:none;}}',
    '@keyframes splashDraw{to{stroke-dashoffset:0;}}',
    '@keyframes splashFill{to{width:100%;}}'
  ].join('');

  if (reduceMotion) {
    css += '#splash *{animation:none!important;opacity:1!important;transform:none!important;' +
           'stroke-dashoffset:0!important;}';
  }

  var markup =
    '<div class="splash-logo">' + CONFIG.brandName + '</div>' +
    '<svg viewBox="0 0 320 60" aria-hidden="true">' +
      '<path class="splash-line" pathLength="1" d="M8 30 Q160 64 312 12"/>' +
    '</svg>' +
    '<div class="splash-tag">' + CONFIG.tagline + '</div>' +
    '<div class="splash-bar"><span></span></div>';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var splash = document.createElement('div');
  splash.id = 'splash';
  splash.setAttribute('role', 'status');
  splash.setAttribute('aria-label', 'Loading menu');
  splash.innerHTML = markup;
  document.body.appendChild(splash);

  // The menu keeps loading underneath while the splash is showing
  var pageLoaded = new Promise(function (resolve) {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve);
  });
  var minWait = new Promise(function (resolve) {
    setTimeout(resolve, minMs);
  });
  var hardStop = new Promise(function (resolve) {
    setTimeout(resolve, CONFIG.maxMs);
  });

  // Leave when the page is loaded AND the minimum time has passed,
  // or when maxMs is reached, whichever comes first
  Promise.race([Promise.all([pageLoaded, minWait]), hardStop]).then(function () {
    splash.classList.add('splash-hide');
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
    setTimeout(function () {
      splash.remove();
      style.remove();
    }, 500);
  });
})();