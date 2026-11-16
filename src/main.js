import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScene } from './scene.js';
import { ui, timeline, projects, more, worlds, links, skillNotes } from './content.js';
import { projectDetails, teamDetails, xpDetails } from './details.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) document.body.classList.add('static');

/* ---------- Language ---------- */
let stored = null;
try {
  stored = localStorage.getItem('lang');
} catch {}
const lang = stored === 'en' || stored === 'fr' ? stored : 'fr';
document.documentElement.lang = lang;
const t = (key) => ui[lang][key] ?? '';
const tr = (o) => (o && typeof o === 'object' ? o[lang] : o);

$$('[data-i18n]').forEach((el) => {
  el.textContent = t(el.dataset.i18n);
});
$('#loader-hello').textContent = t('hello');
$$('#lang-toggle [data-lang]').forEach((el) => el.classList.toggle('is-active', el.dataset.lang === lang));
$('#lang-toggle').addEventListener('click', () => {
  try {
    localStorage.setItem('lang', lang === 'fr' ? 'en' : 'fr');
  } catch {}
  window.scrollTo(0, 0);
  location.reload();
});

/* ---------- Build the page from content.js ---------- */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const pad2 = (n) => String(n).padStart(2, '0');
const worldIndex = (id) => worlds.findIndex((w) => w.id === id);

$('#path-track').innerHTML = timeline
  .map(
    (item, i) => `
    <article class="step${item.next ? ' step--next' : ''}">
      <div class="step__date">${esc(tr(item.date))}</div>
      <p class="step__kind">${pad2(i + 1)} · ${esc(tr(item.kind))}</p>
      <h3 class="step__title">${esc(tr(item.title))}</h3>
      <p class="step__place">${esc(tr(item.place))}</p>
      <p class="step__text">${esc(tr(item.text))}</p>
      ${item.world ? `<button class="step__world" type="button" data-world="${worldIndex(item.world)}">${esc(t('path.world'))} ${esc(worlds[worldIndex(item.world)].name)} →</button>` : ''}
    </article>`
  )
  .join('');

const TILTS = [-2, 1.5, -1, 2, -1.5];
$('#worlds-grid').innerHTML = worlds
  .map(
    (w, i) => `
    <button class="wcard" type="button" data-world="${i}" style="--c: ${w.color}; --r: ${TILTS[i % TILTS.length]}deg">
      <span class="wcard__top"><span>${pad2(i + 1)}</span><span class="wcard__go">→</span></span>
      <span>
        <span class="wcard__name">${esc(w.name)}</span>
        <span class="wcard__short">${esc(w.short)}</span>
        <span class="wcard__enter">${esc(t('worlds.enter'))}</span>
      </span>
    </button>`
  )
  .join('');

$('#link-email').href = `mailto:${links.email}`;
$('#link-email span').textContent = links.email;
$('#link-linkedin').href = links.linkedin;
$('#link-github').href = links.github;

// Big titles are cut into letters so each one can bounce in
function splitChars(el) {
  el.innerHTML = [...el.textContent].map((ch) => (ch === ' ' ? ' ' : `<span class="char">${esc(ch)}</span>`)).join('');
}
$$('[data-split]').forEach(splitChars);

/* ---------- 3D scene ---------- */
let scene = null;
try {
  scene = createScene($('#scene'), { reducedMotion });
} catch (err) {
  // No WebGL: the site still works, just without the 3D shapes
  console.warn('3D scene disabled:', err);
  $('#scene').remove();
}

const lenis = null;

/* ---------- Scenes: each one flies in from the right, then the left, and so on ---------- */
const scenes = $$('.scene');
const entered = new Set();
let master = null; // the scroll-driven timeline
let masterTrigger = null;

// What plays inside a scene the first time it arrives
const enterAnimations = {
  about() {
    const el = $('#about-text');
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="word" aria-hidden="true">${esc(w)}</span>`).join(' ');
    return gsap
      .timeline({ paused: true })
      .from('#about-text .word', { opacity: 0.12, duration: 0.5, stagger: 0.035, ease: 'none' })
      .from('.stat', { y: 90, scale: 0.5, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.7)', clearProps: 'transform' }, 0.8);
  },
  worlds() {
    return gsap
      .timeline({ paused: true })
      .from('.wcard', { y: 220, rotate: () => gsap.utils.random(-25, 25), autoAlpha: 0, duration: 1, stagger: 0.09, ease: 'back.out(1.4)', clearProps: 'transform' }, 0.15);
  },
  skills() {
    return gsap
      .timeline({ paused: true })
      .from('.snode--hub', { scale: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.8)' })
      .from('.snode:not(.snode--hub)', { scale: 0, duration: 0.6, stagger: 0.02, ease: 'back.out(2)' }, 0.3)
      .from('#smap-lines', { opacity: 0, duration: 0.8 }, 0.6);
  },
  path() {
    return gsap
      .timeline({ paused: true })
      .from('.step', { y: 160, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.5)' }, 0.15);
  },
  contact() {
    return gsap
      .timeline({ paused: true })
      .from('#contact .char', { yPercent: 120, rotate: 14, duration: 1, ease: 'back.out(1.8)', stagger: 0.03 })
      .from('.contact__links .btn', { scale: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(2)', clearProps: 'transform' }, 0.5);
  },
};

// Fallback for visitors who asked their device for reduced motion: a plain page that scrolls top to bottom. Each section animates in once when it comes into view:
// its content slides in from the right, the next section's from the left, and so on.
function buildFlow() {
  document.body.classList.add('flow');
  const pan = scene ? scene.pan : { x: 0, y: 0, dim: 0 };

  if (reducedMotion) {
    scenes.forEach((s) => {
      s.style.background = s.dataset.bg;
      s.style.color = s.dataset.ink;
    });
  } else {
    scenes.forEach((sc, i) => {
      const enter = enterAnimations[sc.id]?.();
      if (i === 0) return; // the hero has its own intro after the preloader
      const dir = i % 2 ? 1 : -1;
      gsap.set([...sc.children], { x: 140 * dir, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: sc,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to([...sc.children], { x: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' });
          enter?.play();
        },
      });
    });
  }

  // Dots on the right show which section is on screen, and let the visitor jump
  const dots = document.createElement('nav');
  dots.className = 'dots';
  dots.setAttribute('aria-label', 'Sections');
  dots.innerHTML = scenes
    .map((sc) => `<button type="button" data-goto="${sc.id}" aria-label="${esc(sc.dataset.name || sc.id)}"><span>${esc(sc.dataset.name || sc.id)}</span></button>`)
    .join('');
  document.body.appendChild(dots);
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-goto]');
    if (el) scrollToScene(el.dataset.goto);
  });

  // What follows the scroll: the page colour, the dots, the menu, and the 3D objects drifting sideways
  let active = null;
  let panX = 0;
  const update = () => {
    const mid = window.innerHeight * 0.5;
    let current = scenes[0];
    for (const sc of scenes) {
      const r = sc.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = sc;
    }
    if (current !== active) {
      active = current;
      scenes.forEach((sc) => sc.classList.toggle('is-active', sc === active));
      $$('.dots button').forEach((el) => el.classList.toggle('is-on', el.dataset.goto === active.id));
      $$('.nav__links a').forEach((el) => el.classList.toggle('is-on', el.getAttribute('href') === `#${active.id}`));
      if (!reducedMotion) {
        gsap.to(document.body, { backgroundColor: active.dataset.bg, color: active.dataset.ink, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        // The worlds section is busy: three of the background objects step aside while it is shown
        gsap.to(pan, { dim: active.id === 'worlds' ? 1 : 0, duration: 0.6, overwrite: 'auto' });
      }
    }
    if (!reducedMotion) {
      // One screen of scrolling slides the 3D world by half a screen
      panX += ((window.scrollY / window.innerHeight) * 0.5 - panX) * 0.08;
      pan.x = panX;
    }
  };
  update();
  gsap.ticker.add(update);
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- One screen at a time ---------- */
// Every screen is one stop on a single timeline. The page itself never scrolls: a scroll, a swipe
// or a key press only chooses the next or previous stop, and the timeline glides there.
let stops = []; // { id, time }: the timeline moment of each snap point
let stopIndex = 0;
let goToStop = null;

function buildStage() {
  document.body.classList.add('stepped');
  const enters = {};
  scenes.forEach((s) => {
    if (enterAnimations[s.id]) enters[s.id] = enterAnimations[s.id]();
  });
  const play = (id) => {
    if (entered.has(id)) return;
    entered.add(id);
    enters[id]?.play();
  };

  const track = $('#path-track');
  // far enough for the last card to come fully into view, with a little room after it
  const trackDistance = () => Math.max(track.offsetWidth - window.innerWidth * 0.96, 0);
  const pan = scene ? scene.pan : { x: 0, y: 0, dim: 0 };
  const away = (dir) => () => dir * window.innerWidth * 1.25;

  master = gsap.timeline({ paused: true });
  let at = 0.4;
  let panX = 0;
  master.addLabel('hero', 0);

  scenes.forEach((sc, i) => {
    if (i === 0) return;
    const prev = scenes[i - 1];
    const dir = i % 2 ? 1 : -1; // 1: the next screen comes from the right, -1: from the left
    panX += dir;

    // A wave of the next colour sweeps in from that side...
    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.style.background = sc.dataset.bg;
    $('#curtains').appendChild(curtain);

    master
      .fromTo(curtain, { xPercent: 100 * dir }, { xPercent: 0, duration: 1, ease: 'power2.inOut' }, at)
      // ...pushing the old content out, piece by piece...
      .to([...prev.children], { x: away(-dir), rotate: -5 * dir, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: 'power2.in' }, at)
      // ...while the 3D world slides sideways like a camera pan...
      .to(pan, { x: panX, duration: 1.3, ease: 'power2.inOut' }, at)
      .to(document.body, { color: sc.dataset.ink, duration: 0.2, ease: 'none' }, at + 0.5)
      // ...and the new content flies in behind it, piece by piece.
      .fromTo([...sc.children], { x: away(dir), rotate: 5 * dir, autoAlpha: 0 }, { x: 0, rotate: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, at + 0.45)
      // Cards, tiles and titles inside the screen pop in once its content has arrived, so they are seen
      .call(() => play(sc.id), null, at + 1.1);
    // The worlds screen is busy: three of the background objects step aside while it is shown
    if (sc.id === 'worlds') master.to(pan, { dim: 1, duration: 0.6, ease: 'power2.inOut' }, at + 0.2);
    if (prev.id === 'worlds') master.to(pan, { dim: 0, duration: 0.6, ease: 'power2.inOut' }, at + 0.4);
    at += 1.4;
    master.addLabel(sc.id, at);
    if (sc.id === 'path') {
      // The timeline cards travel sideways before the next screen arrives
      panX += 0.35;
      master.to(track, { x: () => -trackDistance(), duration: 2.4, ease: 'none' }, at).to(pan, { x: panX, duration: 2.4, ease: 'none' }, at);
      master.addLabel('path-end', at + 2.4);
      at += 2.4;
    }
    at += 0.1;
  });
  master.to({}, { duration: 0.05 }, at);

  // Only the screen on display can be clicked: the others are stacked invisibly on top of it.
  // The dots and the menu follow the same signal, so they change together with the screen.
  const order = scenes.map((sc) => ({ sc, time: master.labels[sc.id] ?? 0 }));
  let active = null;
  const markActive = () => {
    const now = master.time() + 0.7;
    let current = order[0].sc;
    for (const o of order) if (o.time <= now) current = o.sc;
    if (current === active) return;
    active = current;
    scenes.forEach((sc) => sc.classList.toggle('is-active', sc === active));
    $$('.dots button').forEach((el) => el.classList.toggle('is-on', el.dataset.goto === active.id));
    $$('.nav__links a').forEach((el) => el.classList.toggle('is-on', el.getAttribute('href') === `#${active.id}`));
  };

  // Dots on the right show which screen is on display, and let the visitor jump
  const dots = document.createElement('nav');
  dots.className = 'dots';
  dots.setAttribute('aria-label', 'Sections');
  dots.innerHTML = scenes
    .map((sc) => `<button type="button" data-goto="${sc.id}" aria-label="${esc(sc.dataset.name || sc.id)}"><span>${esc(sc.dataset.name || sc.id)}</span></button>`)
    .join('');
  document.body.appendChild(dots);
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-goto]');
    if (el) scrollToScene(el.dataset.goto);
  });

  // One stop per screen. The timeline screen gets a few more, so its cards advance
  // about one screenful per gesture and every card can be read.
  const buildStops = () => {
    const id = stops[stopIndex]?.id;
    stops = scenes.map((sc) => ({ id: sc.id, time: master.labels[sc.id] ?? 0 }));
    const pathAt = stops.findIndex((s) => s.id === 'path');
    if (pathAt >= 0) {
      const count = Math.max(Math.ceil(trackDistance() / (window.innerWidth * 0.62)), 1);
      const extra = [];
      for (let k = 1; k <= count; k++) extra.push({ id: 'path', time: master.labels.path + (2.4 * k) / count });
      stops.splice(pathAt + 1, 0, ...extra);
    }
    if (id) stopIndex = Math.max(stops.findIndex((s) => s.id === id), 0);
  };
  buildStops();

  // The timeline glides to the current stop at a steady pace. Input never waits for it:
  // a new gesture simply changes where it is heading.
  let first = true;
  let lastTick = performance.now();
  const follow = () => {
    const tickNow = performance.now();
    const dt = Math.min((tickNow - lastTick) / 1000, 0.05);
    lastTick = tickNow;
    const target = stops[stopIndex].time;
    const now = master.time();
    const diff = target - now;
    if (first) {
      master.time(target, false);
      first = false;
    } else if (Math.abs(diff) > 0.0005) {
      // SPEED: how much of the timeline plays per second. One screen change is 1.5, so 0.8 means
      // a change takes about 2 seconds. Raise it to go faster, lower it to go slower.
      const SPEED = 0.8;
      // Steady pace, a soft landing at the end, and it catches up if the visitor is several screens ahead
      const pace = Math.max(SPEED * Math.min(1, Math.abs(diff) / 0.25 + 0.15), Math.abs(diff) / 2.2);
      const stepSize = Math.min(Math.abs(diff), pace * dt);
      master.time(now + Math.sign(diff) * stepSize, false);
    }
    markActive();
  };
  follow();
  gsap.ticker.add(follow);

  const move = (dir) => {
    stopIndex = Math.min(Math.max(stopIndex + dir, 0), stops.length - 1);
  };
  goToStop = (index) => {
    stopIndex = Math.min(Math.max(index, 0), stops.length - 1);
  };
  const blocked = () => currentWorld !== -1 || sheetOpen || document.body.classList.contains('is-loading');

  /* --- Mouse wheel and trackpad: ONE gesture = ONE screen ---
     A gesture is a burst of wheel events. A trackpad keeps sending events after the fingers
     lift (the "glide"), and those get weaker and weaker. So:
       - the first clear push of a gesture moves one screen;
       - the rest of that same gesture, including the glide, does nothing more;
       - a new gesture is recognised by a pause, by a change of direction, or, if the visitor
         simply keeps scrolling without stopping, by the push staying strong (not fading out)
         once the previous move has had time to play. */
  const PAUSE = 130; // ms without events = the gesture is over
  const HOLD = 900; // ms before a continuous scroll may move a second screen
  let lastWheel = 0;
  let lastMove = 0;
  let armed = true;
  let usedDir = 0;
  let pushed = 0;
  let recent = []; // strength of the latest events, to tell a real push from a fading glide
  window.addEventListener(
    'wheel',
    (e) => {
      if (blocked()) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      // Some mice report lines or pages instead of pixels: convert everything to pixels
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
      const delta = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      const dir = Math.sign(delta);
      if (!dir) return;

      if (gap > PAUSE) recent = [];
      recent.push(Math.abs(delta));
      if (recent.length > 14) recent.shift();
      const avg = (list) => list.reduce((s, v) => s + v, 0) / (list.length || 1);
      // "Still pushing": the latest events are as strong as the ones before, not fading like a glide
      const stillPushing = recent.length >= 12 && avg(recent.slice(-5)) >= avg(recent.slice(0, -5)) * 0.95 && avg(recent.slice(-5)) >= 8;

      const fresh = gap > PAUSE;
      const turnedBack = dir !== usedDir && Math.abs(delta) >= 6;
      const keepsGoing = !armed && now - lastMove > HOLD && stillPushing;
      if (fresh || turnedBack || keepsGoing) {
        armed = true;
        pushed = 0;
      }
      if (!armed) return;
      // A gentle scroll sends many tiny moves: wait until they add up to a real intent
      pushed += delta;
      if (Math.abs(pushed) < 24) return;
      armed = false;
      usedDir = Math.sign(pushed);
      pushed = 0;
      recent = [];
      lastMove = now;
      move(usedDir);
    },
    { passive: false }
  );

  // Touch: one swipe = one screen (up or left for the next, down or right for the previous)
  let touch = null;
  window.addEventListener('touchstart', (e) => (touch = blocked() ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }), { passive: true });
  window.addEventListener(
    'touchend',
    (e) => {
      if (!touch || blocked()) return;
      const dx = touch.x - e.changedTouches[0].clientX;
      const dy = touch.y - e.changedTouches[0].clientY;
      touch = null;
      const d = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
      if (Math.abs(d) < 45) return;
      move(d > 0 ? 1 : -1);
    },
    { passive: true }
  );

  // Keyboard: one key press = one screen
  window.addEventListener('keydown', (e) => {
    if (blocked() || e.target.closest?.('input, textarea, select')) return;
    const next = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key);
    const prev = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key);
    if (!next && !prev && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    if (e.key === 'Home') goToStop(0);
    else if (e.key === 'End') goToStop(stops.length - 1);
    else move(next ? 1 : -1);
  });

  // Sizes changed: measure everything again and stay on the same screen
  let timer;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      master.pause(0);
      master.invalidate();
      buildStops();
      first = true;
    }, 200);
  });

  // Development only: lets a test read which stop is current
  if (import.meta.env.DEV) window.__where = () => `${stopIndex}:${stops[stopIndex].id}`;
}

function buildScenes() {
  if (reducedMotion) buildFlow();
  else buildStage();
}

function scrollToScene(id) {
  const target = $(`#${id}`);
  if (!target) return;
  if (!goToStop) {
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }
  const index = stops.findIndex((s) => s.id === id);
  if (index >= 0) goToStop(index);
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  scrollToScene(a.getAttribute('href').slice(1));
});

/* ---------- Worlds: full-screen, opened from a card ---------- */
const worldEl = $('#world');
const worldContent = $('#world-content');
const wipe = $('#wipe');
let currentWorld = -1;
let lastOrigin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const moreButton = (kind, n) => `<button class="wproj__more" type="button" data-sheet="${kind}:${n}">${esc(t('sheet.open'))} →</button>`;

function projectCard(n) {
  const p = projects[n];
  return `
    <article class="wproj">
      ${p.wip ? `<span class="wproj__wip">${esc(t('wip'))}</span>` : `<div class="wproj__metric">${esc(tr(p.metric))}</div>`}
      <p class="wproj__label">${esc(tr(p.metricLabel))}</p>
      <h4 class="wproj__title">${esc(p.title)}</h4>
      <p class="wproj__text">${esc(tr(p.text))}</p>
      <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      ${moreButton('p', n)}
    </article>`;
}

function teamCard(n) {
  const m = more[n];
  return `
    <article class="wproj">
      <h4 class="wproj__title">${esc(m.title)}</h4>
      <p class="wproj__text">${esc(tr(m.text))}</p>
      <ul class="tags">${m.stack.split(' · ').map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      ${moreButton('t', n)}
    </article>`;
}

function xpCard(n) {
  const x = timeline[n];
  return `
    <article class="wproj wxp">
      <span class="wxp__date">${esc(tr(x.date))}</span>
      <h4 class="wproj__title">${esc(tr(x.title))}</h4>
      <p class="wproj__label">${esc(tr(x.place))}</p>
      <p class="wproj__text">${esc(tr(x.text))}</p>
      ${xpDetails[n] ? moreButton('x', n) : ''}
    </article>`;
}

/* ---------- Detail sheet: one project or experience, in full ---------- */
const sheetEl = $('#sheet');
let sheetOpen = false;

function renderSheet(kind, n) {
  let title, sub, chip, d, wip = false, linksHtml = '';
  if (kind === 'p') {
    const p = projects[n];
    d = projectDetails[n];
    title = p.title;
    chip = p.cat;
    sub = p.wip ? `${t('wip')} · ${tr(p.metricLabel)}` : `${tr(p.metric)} · ${tr(p.metricLabel)}`;
    wip = !!p.wip;
    if (!p.wip) linksHtml = `
      <div class="wproj__links">
        <a class="btn btn--main" href="${esc(p.demo)}" target="_blank" rel="noopener"><span>${esc(tr(p.demoLabel) || t('projects.demo'))}</span><i>↗</i></a>
        <a class="btn" href="${esc(p.code)}" target="_blank" rel="noopener"><span>${esc(t('projects.code'))}</span><i>↗</i></a>
      </div>`;
  } else if (kind === 't') {
    const m = more[n];
    d = teamDetails[n];
    title = m.title;
    chip = 'Full-Stack';
    sub = m.stack;
  } else {
    const x = timeline[n];
    d = xpDetails[n];
    title = tr(x.title);
    chip = tr(x.date);
    sub = tr(x.place);
  }
  const color = currentWorld >= 0 ? worlds[currentWorld].color : '#ffe08a';
  $('#sheet-content').innerHTML = `
    <p class="chip">${esc(chip)}</p>
    <h3 class="sheet__title">${esc(title)}</h3>
    <p class="sheet__sub">${esc(sub)}</p>
    <section>
      <p class="world__label">${esc(t(kind === 'x' ? 'sheet.whatxp' : 'sheet.what'))}</p>
      <p class="sheet__what">${esc(tr(d.what))}</p>
    </section>
    <section>
      <p class="world__label">${esc(t('sheet.how'))}</p>
      <ol class="sheet__how">${d.how.map((h) => `<li><span>${esc(tr(h))}</span></li>`).join('')}</ol>
    </section>
    ${d.tools.length ? `<section>
      <p class="world__label">${esc(t('sheet.tools'))}</p>
      <ul class="sheet__tools">${d.tools.map(([name, role]) => `<li><b>${esc(name)}</b><span>${esc(tr(role))}</span></li>`).join('')}</ul>
    </section>` : ''}
    <section class="sheet__results" style="--sc: ${color}">
      <p class="world__label">${esc(t(wip ? 'sheet.goals' : 'sheet.results'))}</p>
      <ul>${d.results.map((r) => `<li><span>${esc(tr(r))}</span></li>`).join('')}</ul>
    </section>
    ${linksHtml}`;
}

function openSheet(kind, n) {
  renderSheet(kind, n);
  sheetOpen = true;
  sheetEl.setAttribute('aria-hidden', 'false');
  $('#sheet-panel').scrollTop = 0;
  const instant = reducedMotion ? 0 : undefined;
  gsap.set(sheetEl, { visibility: 'visible' });
  gsap.to('.sheet__backdrop', { opacity: 1, duration: instant ?? 0.4 });
  gsap.fromTo('#sheet-panel', { xPercent: 105, x: 0 }, { xPercent: 0, duration: instant ?? 0.8, ease: 'back.out(1.1)' });
  if (!reducedMotion) {
    gsap.from('#sheet-content > *', { x: 80, autoAlpha: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.2 });
  }
  $('.sheet__close').focus({ preventScroll: true });
}

function closeSheet() {
  if (!sheetOpen) return;
  sheetOpen = false;
  sheetEl.setAttribute('aria-hidden', 'true');
  const d = reducedMotion ? 0 : 0.5;
  gsap.to('.sheet__backdrop', { opacity: 0, duration: d });
  gsap.to('#sheet-panel', { xPercent: 105, duration: d, ease: 'power3.in', onComplete: () => gsap.set(sheetEl, { visibility: 'hidden' }) });
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-sheet]');
  if (opener) {
    const [kind, n] = opener.dataset.sheet.split(':');
    openSheet(kind, Number(n));
  } else if (e.target.closest('[data-sheet-close]')) {
    closeSheet();
  }
});


function renderWorld(i) {
  const w = worlds[i];
  const next = worlds[(i + 1) % worlds.length];
  const cards = [...w.projects.map(projectCard), ...(w.team ? more.map((_, n) => teamCard(n)) : [])];
  const xp = w.xp.map(xpCard);
  worldEl.style.setProperty('--wc', w.color);
  $('#world-count').textContent = `${pad2(i + 1)} / ${pad2(worlds.length)}`;
  worldContent.innerHTML = `
    <header class="world__head">
      <p class="chip">${esc(t('world.kicker'))} ${pad2(i + 1)}</p>
      <h2 class="world__title"><span class="line"><span class="line__in" id="world-title">${esc(w.name)}</span></span></h2>
      <p class="world__tag serif">${esc(tr(w.tagline))}</p>
      <div class="world__fit"><small>${esc(t('world.fit'))}</small><p>${esc(tr(w.fit))}</p></div>
    </header>
    <div class="world__grid">
      <section class="world__box">
        <p class="world__label">${esc(t('world.can'))}</p>
        <ul class="world__can">${w.can.map((c) => `<li><span>${esc(tr(c))}</span></li>`).join('')}</ul>
      </section>
      <section class="world__box">
        <p class="world__label">${esc(t('world.stack'))}</p>
        <ul class="tags">${w.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      </section>
    </div>
    ${xp.length ? `<section class="world__section"><h3 class="h3">${esc(t('world.xp'))}</h3><div class="wprojects">${xp.join('')}</div></section>` : ''}
    ${cards.length ? `<section class="world__section"><h3 class="h3">${esc(t('world.projects'))}</h3><div class="wprojects">${cards.join('')}</div></section>` : ''}
    <footer class="world__foot">
      <button class="world__next" type="button" data-world="${(i + 1) % worlds.length}" style="--c: ${next.color}">
        <small>${esc(t('world.next'))}</small><b>${esc(next.name)} →</b>
      </button>
      <button class="btn" type="button" id="world-contact"><span>${esc(t('world.contact'))}</span><i>↗</i></button>
    </footer>`;
  splitChars($('#world-title'));
  worldEl.scrollTop = 0;
  currentWorld = i;
}

function worldIntro() {
  if (reducedMotion) return;
  gsap.from('#world-title .char', { yPercent: 120, rotate: 14, duration: 0.9, ease: 'back.out(1.8)', stagger: 0.025 });
  gsap.from('.world__head .chip, .world__tag, .world__fit, .world__box, .world__section .h3', {
    y: 50,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.07,
    ease: 'back.out(1.5)',
    delay: 0.15,
  });
  gsap.from('.world .wproj', { y: 80, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: 'back.out(1.4)', delay: 0.45, clearProps: 'transform' });
}

const circle = (r, o) => `circle(${r}% at ${o.x}px ${o.y}px)`;

function openWorld(i, origin) {
  lastOrigin = origin;
  const wasOpen = currentWorld !== -1;
  const show = () => {
    renderWorld(i);
    worldEl.setAttribute('aria-hidden', 'false');
    worldIntro();
    $('#world-back').focus({ preventScroll: true });
  };
  if (lenis) lenis.stop();
  document.body.style.overflow = 'hidden';

  if (reducedMotion) {
    gsap.set(worldEl, { visibility: 'visible', clipPath: 'none' });
    show();
    return;
  }
  if (!wasOpen) {
    // The world grows out of the place that was clicked
    show();
    gsap.fromTo(worldEl, { visibility: 'visible', clipPath: circle(0, origin) }, { clipPath: circle(150, origin), duration: 1, ease: 'expo.inOut' });
    return;
  }
  // Already inside a world: a wave of the next colour covers the screen, then the content changes
  wipe.style.background = worlds[i].color;
  gsap.fromTo(
    wipe,
    { visibility: 'visible', clipPath: circle(0, origin) },
    {
      clipPath: circle(150, origin),
      duration: 0.8,
      ease: 'expo.inOut',
      onComplete() {
        show();
        gsap.set(wipe, { visibility: 'hidden' });
      },
    }
  );
}

function closeWorld(then) {
  if (currentWorld === -1) return;
  currentWorld = -1;
  worldEl.setAttribute('aria-hidden', 'true');
  const done = () => {
    gsap.set(worldEl, { visibility: 'hidden' });
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    then?.();
  };
  if (reducedMotion) return done();
  const o = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  gsap.to(worldEl, { clipPath: circle(0, lastOrigin.y > 0 ? lastOrigin : o), duration: 0.8, ease: 'expo.inOut', onComplete: done });
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-world]');
  if (opener) {
    const r = opener.getBoundingClientRect();
    const origin = e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    openWorld(Number(opener.dataset.world), origin);
    return;
  }
  if (e.target.closest('#world-back')) closeWorld();
  if (e.target.closest('#world-contact')) closeWorld(() => scrollToScene('contact'));
});
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (sheetOpen) closeSheet();
  else closeWorld();
});

/* ---------- Preloader, then hero intro ---------- */
function intro() {
  document.body.classList.remove('is-loading');
  if (lenis) lenis.start();
  if (scene) gsap.delayedCall(reducedMotion ? 0 : 0.5, () => scene.intro());
  if (reducedMotion) {
    $('.loader').remove();
    return;
  }
  gsap
    .timeline()
    .to('.loader > *', { y: -40, autoAlpha: 0, duration: 0.4, ease: 'power2.in', stagger: 0.05 })
    .to('.loader', { clipPath: 'circle(0% at 50% 50%)', duration: 1, ease: 'expo.inOut' }, '-=0.1')
    .set('.loader', { display: 'none' })
    .from('.hero .char', { yPercent: 120, rotate: 14, duration: 1.1, ease: 'back.out(1.8)', stagger: 0.028 }, '-=0.55')
    .from('.hero .reveal', { y: 26, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 }, '-=0.9')
    .from('.hero .sticker', { scale: 0, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.12, clearProps: 'transform' }, '-=0.7')
    .from('.badge', { scale: 0, rotate: -120, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform' }, '-=0.8')
    .from('.nav', { yPercent: -200, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform' }, '-=1.1');
}

function preload() {
  const count = $('#loader-count');
  const counter = { v: 0 };
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise((r) => setTimeout(r, 3500));
  const counting = new Promise((resolve) => {
    gsap.to(counter, {
      v: 100,
      duration: reducedMotion ? 0.2 : 1.8,
      ease: 'power2.inOut',
      onUpdate: () => (count.textContent = Math.round(counter.v)),
      onComplete: resolve,
    });
  });
  Promise.all([counting, Promise.race([fonts, timeout])]).then(intro);
}

/* ---------- Custom cursor (mouse only) ---------- */
function cursor() {
  const el = $('.cursor');
  if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    el.remove();
    return;
  }
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    el.classList.add('is-on');
    x(e.clientX);
    y(e.clientY);
  });
  document.addEventListener('pointerover', (e) => {
    el.classList.toggle('is-link', !!e.target.closest('a, button, .sticker, .stat, .wproj'));
  });
}

/* ---------- Message form: sends straight to my inbox ---------- */
// The message goes through FormSubmit (formsubmit.co), a free relay that forwards it by email.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${links.formEmail}`;

function formHtml() {
  return `
    <form class="cform" novalidate>
      <h3 class="cform__title">${esc(t('form.title'))}</h3>
      <p class="cform__intro">${esc(t('form.intro'))}</p>
      <label><span>${esc(t('form.email'))}</span><input type="email" name="email" autocomplete="email" required /></label>
      <label><span>${esc(t('form.subject'))}</span><input type="text" name="subject" maxlength="120" required /></label>
      <label><span>${esc(t('form.message'))}</span><textarea name="message" rows="4" maxlength="4000" required></textarea></label>
      <input class="cform__trap" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <div class="cform__foot">
        <button class="btn btn--main" type="submit"><span>${esc(t('form.send'))}</span><i>↗</i></button>
        <small>${esc(t('form.note'))}</small>
      </div>
      <p class="cform__status" role="status" aria-live="polite"></p>
    </form>`;
}

$('#cform-slot').innerHTML = formHtml();

document.addEventListener('submit', async (e) => {
  const form = e.target.closest('.cform');
  if (!form) return;
  e.preventDefault();
  const status = $('.cform__status', form);
  const button = $('button[type="submit"]', form);
  const data = Object.fromEntries(new FormData(form));
  status.className = 'cform__status';
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  if (data._honey) return; // filled in by a robot, not a person
  button.disabled = true;
  $('span', button).textContent = t('form.sending');
  try {
    // Give up after 20 seconds instead of leaving the visitor waiting
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 20000);
    const res = await fetch(FORM_ENDPOINT, {
      signal: abort.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email: data.email,
        _subject: `[Portfolio] ${data.subject}`,
        message: data.message,
        _template: 'box',
        _captcha: 'false',
      }),
    });
    clearTimeout(timer);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || String(json.success) !== 'true') throw new Error('send failed');
    form.reset();
    status.textContent = t('form.ok');
    status.classList.add('is-ok');
  } catch {
    // Fallback: the visitor can still write by email, with their message already filled in
    const mailto = `mailto:${links.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}`;
    status.innerHTML = `${esc(t('form.error'))} <a href="${esc(mailto)}">${esc(links.email)}</a>.`;
    status.classList.add('is-error');
  } finally {
    button.disabled = false;
    $('span', button).textContent = t('form.send');
  }
});

// On phones the form opens in the side panel
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-cform-open]')) return;
  $('#sheet-content').innerHTML = formHtml();
  sheetOpen = true;
  sheetEl.setAttribute('aria-hidden', 'false');
  $('#sheet-panel').scrollTop = 0;
  gsap.set(sheetEl, { visibility: 'visible' });
  gsap.to('.sheet__backdrop', { opacity: 1, duration: reducedMotion ? 0 : 0.4 });
  gsap.fromTo('#sheet-panel', { xPercent: 105, x: 0 }, { xPercent: 0, duration: reducedMotion ? 0 : 0.8, ease: 'back.out(1.1)' });
});

/* ---------- Skills map: every skill is linked to the worlds where it is used ---------- */
function buildSkillMap() {
  const map = $('#smap');
  const svg = $('#smap-lines');
  const info = $('#smap-info');
  const hint = t('skills.hint');
  info.textContent = hint;

  // skill name → the worlds that use it
  const skills = [];
  worlds.forEach((w, k) =>
    w.stack.forEach((name) => {
      let sk = skills.find((x) => x.name === name);
      if (!sk) skills.push((sk = { name, hubs: [] }));
      sk.hubs.push(k);
    })
  );
  const same = (a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a.length <= 2 || b.length <= 2) return a === b;
    return a.includes(b) || b.includes(a);
  };
  const usedIn = (name) => {
    const out = [];
    projects.forEach((p) => p.stack.some((x) => same(x, name)) && out.push(p.title));
    more.forEach((m) => m.stack.split(' · ').some((x) => same(x, name)) && out.push(m.title));
    Object.entries(xpDetails).forEach(([n, d]) => d.tools.some(([tool]) => same(tool, name)) && out.push(tr(timeline[n].title)));
    return [...new Set(out)];
  };

  const hubEls = worlds.map((w, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'snode snode--hub';
    b.dataset.world = k; // a click opens the world
    b.style.setProperty('--c', w.color);
    b.textContent = w.name;
    map.appendChild(b);
    return b;
  });
  const NS = 'http://www.w3.org/2000/svg';
  skills.forEach((sk, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'snode';
    b.textContent = sk.name;
    map.appendChild(b);
    sk.el = b;
    sk.lines = sk.hubs.map((k) => {
      const line = document.createElementNS(NS, 'line');
      line.dataset.h = k;
      svg.appendChild(line);
      return line;
    });
    sk.i = i;
  });

  // Highlighting
  let pinned = null;
  const clear = () => {
    map.classList.remove('is-focus');
    $$('.is-on', map).forEach((el) => el.classList.remove('is-on'));
    info.textContent = hint;
  };
  const showSkill = (sk) => {
    clear();
    map.classList.add('is-focus');
    sk.el.classList.add('is-on');
    sk.hubs.forEach((k) => hubEls[k].classList.add('is-on'));
    sk.lines.forEach((l) => l.classList.add('is-on'));
    const used = usedIn(sk.name);
    info.innerHTML =
      `<b>${esc(sk.name)}</b> · ${esc(sk.hubs.map((k) => worlds[k].name).join(' · '))}` +
      (used.length ? ` — ${esc(t('skills.used'))} : ${esc(used.join(', '))}` : skillNotes[sk.name] ? ` — ${esc(tr(skillNotes[sk.name]))}` : '');
  };
  const showHub = (k) => {
    clear();
    map.classList.add('is-focus');
    hubEls[k].classList.add('is-on');
    skills.filter((sk) => sk.hubs.includes(k)).forEach((sk) => {
      sk.el.classList.add('is-on');
      sk.lines.filter((l) => Number(l.dataset.h) === k).forEach((l) => l.classList.add('is-on'));
    });
    info.innerHTML = `<b>${esc(worlds[k].name)}</b> — ${esc(tr(worlds[k].tagline))}`;
  };
  const restore = () => (pinned ? showSkill(pinned) : clear());
  skills.forEach((sk) => {
    sk.el.addEventListener('pointerenter', () => showSkill(sk));
    sk.el.addEventListener('focus', () => showSkill(sk));
    sk.el.addEventListener('pointerleave', restore);
    sk.el.addEventListener('blur', restore);
    sk.el.addEventListener('click', () => {
      pinned = pinned === sk ? null : sk;
      restore();
    });
  });
  hubEls.forEach((el, k) => {
    el.addEventListener('pointerenter', () => showHub(k));
    el.addEventListener('focus', () => showHub(k));
    el.addEventListener('pointerleave', restore);
    el.addEventListener('blur', restore);
  });

  // Placement: the worlds sit on a ring, each skill settles near the worlds it belongs to
  function layout() {
    const all = [...hubEls, ...skills.map((sk) => sk.el)];
    if (window.innerWidth <= 800) {
      gsap.set(all, { clearProps: 'transform' });
      return;
    }
    const W = map.clientWidth;
    const H = map.clientHeight;
    if (!W || !H) return;
    const cx = W / 2;
    const cy = H / 2;
    const hubs = hubEls.map((el, k) => {
      const a = ((-90 + (360 / hubEls.length) * k) * Math.PI) / 180;
      return { el, x: cx + Math.cos(a) * W * 0.25, y: cy + Math.sin(a) * H * 0.27, w: el.offsetWidth, h: el.offsetHeight, fixed: true };
    });
    const nodes = skills.map((sk, i) => {
      let tx = 0;
      let ty = 0;
      sk.hubs.forEach((k) => {
        tx += hubs[k].x;
        ty += hubs[k].y;
      });
      tx /= sk.hubs.length;
      ty /= sk.hubs.length;
      if (sk.hubs.length === 1) {
        // Skills of a single world fan out behind it, away from the centre
        const dx = tx - cx;
        const dy = ty - cy;
        const d = Math.hypot(dx, dy) || 1;
        tx += (dx / d) * W * 0.13;
        ty += (dy / d) * H * 0.15;
      }
      const j = i * 2.4; // a fixed spread so the map looks the same on every visit
      return { el: sk.el, sk, tx, ty, x: tx + Math.cos(j) * 60, y: ty + Math.sin(j) * 40, w: sk.el.offsetWidth, h: sk.el.offsetHeight };
    });
    const bodies = [...hubs, ...nodes];
    const GAP = 10;
    for (let step = 0; step < 320; step++) {
      for (const n of nodes) {
        n.x += (n.tx - n.x) * 0.03;
        n.y += (n.ty - n.y) * 0.03;
      }
      for (let a = 0; a < bodies.length; a++) {
        for (let b = a + 1; b < bodies.length; b++) {
          const A = bodies[a];
          const B = bodies[b];
          const ox = (A.w + B.w) / 2 + GAP - Math.abs(A.x - B.x);
          const oy = (A.h + B.h) / 2 + GAP - Math.abs(A.y - B.y);
          if (ox <= 0 || oy <= 0) continue;
          const shareA = A.fixed ? 0 : B.fixed ? 1 : 0.5;
          const shareB = B.fixed ? 0 : A.fixed ? 1 : 0.5;
          if (ox < oy * 2.2) {
            const sign = A.x < B.x ? -1 : 1;
            A.x += sign * ox * shareA;
            B.x -= sign * ox * shareB;
          } else {
            const sign = A.y < B.y ? -1 : 1;
            A.y += sign * oy * shareA;
            B.y -= sign * oy * shareB;
          }
        }
      }
      for (const n of nodes) {
        n.x = Math.min(Math.max(n.x, n.w / 2), W - n.w / 2);
        n.y = Math.min(Math.max(n.y, n.h / 2), H - n.h / 2);
      }
    }
    bodies.forEach((n) => gsap.set(n.el, { x: n.x - n.w / 2, y: n.y - n.h / 2 }));
    nodes.forEach((n) =>
      n.sk.lines.forEach((line) => {
        const hub = hubs[Number(line.dataset.h)];
        line.setAttribute('x1', n.x);
        line.setAttribute('y1', n.y);
        line.setAttribute('x2', hub.x);
        line.setAttribute('y2', hub.y);
      })
    );
  }
  layout();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(layout);
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(layout, 150);
  });
}

buildSkillMap();
buildScenes();
cursor();
preload();
