/* Smash Store: scroll experience */
gsap.registerPlugin(ScrollTrigger);
// phones: don't recalculate every time the address bar shows/hides
ScrollTrigger.config({ ignoreMobileResize: true });
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DM = 'https://ig.me/m/smashstore._';
document.getElementById('yr').textContent = new Date().getFullYear();

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

/* ---------- SOCK SVG ---------- */
const SOCK = 'M85 10 H215 V290 C215 315 228 330 255 342 C292 358 298 418 262 440 C238 455 190 452 140 440 C98 430 75 405 75 370 C75 335 85 315 85 290 Z';
let sockN = 0;
function sockSVG({ base = '#fff6e0', cuff = '#E8201A', heel = '#0d0d0d', layers = ['stripes'], stroke = '#0d0d0d', build = false } = {}) {
  const id = 's' + (++sockN);
  const pats = {
    stripes: `<pattern id="${id}st" width="300" height="56" patternUnits="userSpaceOnUse"><rect y="0" width="300" height="24" fill="#E8201A"/><rect y="24" width="300" height="6" fill="#0d0d0d"/></pattern>`,
    fire: `<pattern id="${id}fi" width="70" height="90" patternUnits="userSpaceOnUse"><path d="M35 82c-18 0-26-12-24-26 2-12 12-16 10-30 10 6 14 14 14 22 4-6 4-12 2-18 12 8 20 20 20 32 0 12-8 20-22 20z" fill="#FF7A00" stroke="#0d0d0d" stroke-width="3"/><path d="M35 78c-8 0-12-6-11-12 1-6 6-8 6-14 6 4 8 8 8 12 2-2 3-5 2-8 5 4 8 9 8 14 0 5-5 8-13 8z" fill="#FFE500"/></pattern>`,
    smile: `<pattern id="${id}sm" width="62" height="62" patternUnits="userSpaceOnUse"><circle cx="31" cy="31" r="21" fill="#FFC21A" stroke="#0d0d0d" stroke-width="3"/><circle cx="24" cy="26" r="3" fill="#0d0d0d"/><circle cx="38" cy="26" r="3" fill="#0d0d0d"/><path d="M21 35q10 10 20 0" fill="none" stroke="#0d0d0d" stroke-width="3" stroke-linecap="round"/></pattern>`,
  };
  const key = { stripes: 'st', fire: 'fi', smile: 'sm' };
  const layerSvg = layers.map((l, i) => {
    const clip = build ? `<clipPath id="${id}k${i}"><rect class="knit" x="0" y="0" width="300" height="0"/></clipPath>` : '';
    const cAttr = build ? `clip-path="url(#${id}k${i})"` : '';
    return `${clip}<g class="layer layer-${l}" ${cAttr}><rect width="300" height="470" fill="${l === 'fire' ? '#E8201A' : l === 'smile' ? '#fff6e0' : 'none'}"/><rect width="300" height="470" fill="url(#${id}${key[l]})"/></g>`;
  }).join('');
  return `<svg viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><clipPath id="${id}c"><path d="${SOCK}"/></clipPath>${layers.map(l => pats[l]).join('')}</defs>
  <g clip-path="url(#${id}c)">
    <rect width="300" height="470" fill="${base}" class="base"/>
    ${layerSvg}
    <g class="trim">
      <rect x="0" y="0" width="300" height="62" fill="${cuff}"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${90 + i * 11}" y="6" width="3" height="52" fill="rgba(0,0,0,.18)"/>`).join('')}
      <circle cx="92" cy="418" r="48" fill="${heel}"/>
      <circle cx="282" cy="398" r="50" fill="${heel}"/>
    </g>
  </g>
  <path d="${SOCK}" fill="none" stroke="${stroke}" stroke-width="7" stroke-linejoin="round"/>
</svg>`;
}

/* ---------- HERO: socks on the line ---------- */

/* ---------- BIG BUILD SOCK ---------- */
{
  const big = document.getElementById('bigSock');
  const layer = (cls, svg) => `<div class="sl ${cls}">${svg}</div>`;
  const knit = svg => `<div class="sl knit"><div class="knit-in">${svg}</div></div>`;
  big.insertAdjacentHTML('afterbegin',
    layer('shadow', sockSVG({ base: '#E8201A', cuff: '#E8201A', heel: '#E8201A', layers: [], stroke: '#E8201A' })) +
    layer('plain', sockSVG({ base: '#9a9a9a', cuff: '#7d7d7d', heel: '#6b6b6b', layers: [], stroke: '#fff6e0' })) +
    knit(sockSVG({ base: '#fff6e0', cuff: '#0d0d0d', heel: '#0d0d0d', layers: ['stripes'], stroke: '#fff6e0' })) +
    knit(sockSVG({ base: '#E8201A', cuff: '#FFE500', heel: '#E8201A', layers: ['fire'], stroke: '#fff6e0' })) +
    knit(sockSVG({ base: '#fff6e0', cuff: '#E8201A', heel: '#0d0d0d', layers: ['smile'], stroke: '#fff6e0' })));
}

/* ---------- MARQUEE ---------- */
const words = ['BORING IS BANNED', '•', 'SMASH THE ORDINARY', '•', 'LOUD FEET ONLY', '•'];
document.querySelectorAll('.track').forEach(t => {
  const html = words.map(w => `<span>${w}</span>`).join('');
  t.innerHTML = html.repeat(6);
});

/* ---------- SHOP ---------- */
// the product list lives in products.js (shared with the product pages)
const { drops, bundles: BUNDLES } = window.SMASH;

const byId = Object.fromEntries(drops.map(p => [p.id, p]));
const rupees = n => '₹' + n.toLocaleString('en-IN');
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const $ = id => document.getElementById(id);
const typeLabel = { ankle: 'Ankle', full: 'Full' };

const grid = $('shopGrid');
grid.innerHTML = drops.map(p => `
  <article class="prod" data-type="${p.type}" data-id="${p.id}">
    <a class="ph" href="p/${p.slug}/"><img src="img/${p.id}.jpg" alt="${esc(p.name)} socks" loading="lazy"><span class="tag">${esc(p.tag)}</span><span class="len">${typeLabel[p.type]}</span></a>
    <div class="info"><h3><a href="p/${p.slug}/">${esc(p.name)}</a></h3>
      ${p.price ? `<p class="price">${rupees(p.price)}</p>` : `<p class="price ask">Price on DM</p>`}</div>
    <button class="add" data-id="${p.id}">Add to bag</button>
  </article>`).join('') + `<p class="shop-empty" id="shopEmpty" hidden></p>`;

/* filters */
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'ankle', label: 'Ankle Socks' },
  { key: 'full', label: 'Full Socks' },
  { key: 'bundle', label: 'Create Your Bundle' },
];
const chips = $('chips');
chips.innerHTML = FILTERS.map((f, i) => `<button class="chip${f.key === 'bundle' ? ' chip-bundle' : ''}" aria-pressed="${i === 0}" data-key="${f.key}">${f.label}</button>`).join('');
let mode = 'all';
function applyFilter(key) {
  mode = key;
  chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.key === key)));
  let shown = 0;
  grid.querySelectorAll('.prod').forEach(card => {
    const show = key === 'all' || key === 'bundle' || card.dataset.type === key;
    card.hidden = !show; if (show) shown++;
  });
  const empty = $('shopEmpty');
  empty.hidden = shown > 0;
  if (!shown) empty.innerHTML = `<img class="empty-mascot" src="img/mascot.png" alt=""><b>${key === 'ankle' ? 'Ankle socks' : 'These'} are dropping soon.</b> Check out <button class="link-btn" data-go="full">Full Socks</button> for now.`;
  document.querySelector('.shop').classList.toggle('bundling', key === 'bundle');
  renderPicker();
  ScrollTrigger.refresh();
}
chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) applyFilter(b.dataset.key); });
grid.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) applyFilter(g.dataset.go); });

/* bundle picker */
let bundleSize = BUNDLES[0].size;
let picks = [];
const bundleInfo = n => BUNDLES.find(b => b.size === n);
$('bundleSizes').innerHTML = BUNDLES.map(b => `<button class="bsize" data-size="${b.size}">${b.size} pairs${b.price ? ' · ' + rupees(b.price) : ''}</button>`).join('');
$('bundleSizes').addEventListener('click', e => {
  const b = e.target.closest('.bsize'); if (!b) return;
  bundleSize = +b.dataset.size;
  picks = picks.slice(0, bundleSize);
  renderPicker();
});
function renderPicker() {
  $('bundleSizes').querySelectorAll('.bsize').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.size === bundleSize)));
  $('bundleCount').textContent = `${picks.length}/${bundleSize} picked`;
  $('bundleFill').style.transform = `scaleX(${picks.length / bundleSize})`;
  $('bundleAdd').disabled = picks.length !== bundleSize;
  $('bundleThumbs').innerHTML = Array.from({ length: bundleSize }, (_, i) =>
    picks[i] ? `<img src="img/${picks[i]}.jpg" alt="${esc(byId[picks[i]].name)}">` : `<span></span>`).join('');
  const full = picks.length >= bundleSize;
  grid.querySelectorAll('.add').forEach(btn => {
    if (mode === 'bundle') {
      const picked = picks.includes(btn.dataset.id);
      btn.textContent = picked ? 'Picked ✓' : 'Pick';
      btn.classList.toggle('added', picked);
      btn.disabled = !picked && full;
    } else {
      btn.textContent = 'Add to bag'; btn.classList.remove('added'); btn.disabled = false;
    }
  });
}

/* bag: kept in this browser only. Keys are a product id, or "b<size>:id,id,id" for a bundle */
let bag = {};
try { bag = JSON.parse(localStorage.getItem('smashBag') || '{}') || {}; } catch (e) { bag = {}; }
const parseBundle = key => {
  const m = /^b(\d+):(.+)$/.exec(key); if (!m) return null;
  const ids = m[2].split(','); const size = +m[1];
  return ids.length === size && ids.every(id => byId[id]) && bundleInfo(size) ? { size, ids } : null;
};
for (const k in bag) if (!(bag[k] > 0) || !(byId[k] || parseBundle(k))) delete bag[k];
const save = () => { try { localStorage.setItem('smashBag', JSON.stringify(bag)); } catch (e) {} };
const toast = msg => { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3500); };

function item(key) {
  const b = parseBundle(key);
  if (b) {
    const price = bundleInfo(b.size).price;
    return { name: `Bundle of ${b.size}`, img: b.ids[0], pairs: b.size, price,
             detail: b.ids.map(id => byId[id].name).join(', '), each: price ? rupees(price) + ' per bundle' : 'Bundle price on DM' };
  }
  const p = byId[key];
  return { name: p.name, img: key, pairs: 1, price: p.price, detail: typeLabel[p.type] + ' socks', each: p.price ? rupees(p.price) + ' each' : 'Price on DM' };
}
const pairCount = () => Object.keys(bag).reduce((s, k) => s + bag[k] * item(k).pairs, 0);
const allPriced = keys => keys.length > 0 && keys.every(k => item(k).price);
const totalOf = keys => keys.reduce((s, k) => s + bag[k] * item(k).price, 0);

function renderBag() {
  const keys = Object.keys(bag);
  const pairs = pairCount();
  $('bagCount').textContent = pairs;
  $('bagPairs').textContent = pairs + (pairs === 1 ? ' pair' : ' pairs');
  $('bagTotal').textContent = allPriced(keys) ? rupees(totalOf(keys)) : (keys.length ? 'Price on DM' : '');
  $('bagOrder').disabled = !pairs;
  $('bagItems').innerHTML = keys.length ? keys.map(k => {
    const it = item(k);
    return `<div class="bag-line">
      <img src="img/${it.img}.jpg" alt="">
      <div><h4>${esc(it.name)}</h4><p class="lp">${esc(it.detail)}</p><p class="lp">${it.each}</p><button class="rm" data-rm="${k}">Remove</button></div>
      <div class="qty"><button data-dec="${k}" aria-label="One less ${esc(it.name)}">−</button><span>${bag[k]}</span><button data-inc="${k}" aria-label="One more ${esc(it.name)}">+</button></div>
    </div>`;
  }).join('') : `<p class="bag-empty"><img class="empty-mascot" src="img/mascot.png" alt=""><b>Bag’s empty.</b>Boring. Go add some loud socks.</p>`;
}
renderBag();
renderPicker();

const bump = () => { const bb = $('bagBtn'); bb.classList.remove('bump'); void bb.offsetWidth; bb.classList.add('bump'); };
grid.addEventListener('click', e => {
  const b = e.target.closest('.add'); if (!b) return;
  const id = b.dataset.id;
  if (mode === 'bundle') {
    picks = picks.includes(id) ? picks.filter(x => x !== id) : picks.length < bundleSize ? [...picks, id] : picks;
    renderPicker();
    return;
  }
  bag[id] = (bag[id] || 0) + 1;
  save(); renderBag(); bump();
  b.textContent = 'Added ✓'; b.classList.add('added');
  clearTimeout(b._h); b._h = setTimeout(() => { if (mode !== 'bundle') { b.textContent = 'Add to bag'; b.classList.remove('added'); } }, 1200);
});
$('bundleAdd').addEventListener('click', () => {
  if (picks.length !== bundleSize) return;
  const key = `b${bundleSize}:${picks.join(',')}`;
  bag[key] = (bag[key] || 0) + 1;
  save(); renderBag(); bump();
  toast(`Bundle of ${bundleSize} added to your bag`);
  picks = []; renderPicker();
});
$('bundleClear').addEventListener('click', () => { picks = []; renderPicker(); });
$('bagItems').addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const { inc, dec, rm } = t.dataset;
  if (inc) bag[inc]++;
  if (dec) { bag[dec]--; if (bag[dec] < 1) delete bag[dec]; }
  if (rm) delete bag[rm];
  save(); renderBag();
});

function setBag(open) {
  document.documentElement.classList.toggle('bag-open', open);
  $('bag').setAttribute('aria-hidden', String(!open));
  $('bagBtn').setAttribute('aria-expanded', String(open));
  if (window.lenisRef) open ? window.lenisRef.stop() : window.lenisRef.start();
}
$('bagBtn').addEventListener('click', () => setBag(true));
$('bagClose').addEventListener('click', () => setBag(false));
$('bagScrim').addEventListener('click', () => setBag(false));
addEventListener('keydown', e => { if (e.key === 'Escape') setBag(false); });

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove(); return ok;
}
$('bagOrder').addEventListener('click', () => {
  const keys = Object.keys(bag); if (!keys.length) return;
  const lines = keys.map(k => {
    const it = item(k);
    return parseBundle(k) ? `• ${it.name} x${bag[k]} (${it.detail})` : `• ${it.name} (${it.detail}) x${bag[k]}`;
  }).join('\n');
  const total = allPriced(keys) ? `\nTotal: ${rupees(totalOf(keys))}` : '';
  const msg = `SMASH\nHi Smash Store, I'd like to order:\n${lines}\nPairs: ${pairCount()}${total}`;
  // copy first (needs the click), then open the DM in a new tab
  copyText(msg).then(ok => toast(ok ? 'Order copied. Paste it in the Instagram DM' : 'Send us your order in the Instagram DM'));
  window.open(DM, '_blank', 'noopener');
});

/* links from a product page: ?bag=1 opens the bag, ?bundle=<id> starts a bundle with that pair */
const arrival = new URLSearchParams(location.search);
function handleArrival() {
  const pick = arrival.get('bundle');
  if (pick && byId[pick]) {
    applyFilter('bundle');
    picks = [pick]; renderPicker();
    const shop = document.querySelector('.shop');
    if (window.lenisRef) window.lenisRef.scrollTo(shop, { immediate: true }); else shop.scrollIntoView();
  }
  if (arrival.get('bag') === '1') setBag(true);
  if (pick || arrival.has('bag')) history.replaceState(null, '', location.pathname + location.hash);
}

/* floating photos on the front page link to their pair in the shop */
document.querySelectorAll('.sticker[data-product]').forEach(s => {
  const p = byId[s.dataset.product]; if (!p) return;
  s.setAttribute('aria-label', `Shop ${p.name} socks`);
  s.querySelector('.stk-tag').innerHTML = `${esc(p.name)} <b>→</b>`;
  s.addEventListener('click', e => {
    e.preventDefault(); e.stopImmediatePropagation();
    applyFilter('all');
    const card = grid.querySelector(`.prod[data-id="${p.id}"]`);
    const spot = () => { card.classList.remove('spot'); void card.offsetWidth; card.classList.add('spot'); };
    if (window.lenisRef) window.lenisRef.scrollTo(card, { offset: -130, duration: 1.6, onComplete: spot });
    else { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(spot, 700); }
  });
});

/* ---------- CTA rain ---------- */
const rain = document.getElementById('rain');
drops.forEach(({ id }, i) => {
  const im = document.createElement('img');
  im.src = `img/${id}.jpg`; im.alt = '';
  im.style.left = (i * 10 + Math.random() * 4) + '%';
  im.style.top = '-30%';
  rain.appendChild(im);
});

/* ---------- CURSOR ---------- */
const cursor = document.getElementById('cursor');
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  document.documentElement.classList.add('sock-cursor');
  const sock = document.getElementById('cursorSock');
  sock.innerHTML = sockSVG({ base: '#fff6e0', cuff: '#E8201A', heel: '#E8201A', layers: ['stripes'] });
  // position follows the pointer exactly; only the swing lags, so clicks stay precise
  gsap.set(cursor, { x: -100, y: -100 });
  const swing = gsap.quickTo(sock, 'rotate', { duration: .6, ease: 'elastic.out(1.2,.35)' });
  let lastX = 0;
  addEventListener('mousemove', e => {
    gsap.set(cursor, { x: e.clientX, y: e.clientY });
    cursor.classList.add('on');
    swing(gsap.utils.clamp(-50, 50, (lastX - e.clientX) * 2.2));
    lastX = e.clientX;
    clearTimeout(cursor._t);
    cursor._t = setTimeout(() => swing(0), 60);
  });
  document.addEventListener('mouseleave', () => cursor.classList.remove('on'));
  addEventListener('mousedown', () => cursor.classList.add('down'));
  addEventListener('mouseup', () => cursor.classList.remove('down'));
  document.addEventListener('mouseover', e => {
    cursor.classList.toggle('big', !!e.target.closest('a, button, .chip'));
  });
}

/* ---------- SMOOTH SCROLL ---------- */
let heroST = null;
const scrollTarget = href => href === '#build' ? (heroST ? heroST.start + (heroST.end - heroST.start) * 0.32 : '#hero') : href;
let lenis;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09 });
  window.lenisRef = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('.nav a[href^="#"], main a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); lenis.scrollTo(scrollTarget(a.getAttribute('href')), { duration: 1.4 });
  }));
}

/* ---------- MOBILE MENU ---------- */
const burger = document.getElementById('burger');
const menu = document.getElementById('mobileMenu');
const setMenu = open => {
  document.documentElement.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.setAttribute('aria-hidden', !open);
  if (lenis) open ? lenis.stop() : lenis.start();
};
burger.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
menu.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  setMenu(false);
  const target = a.getAttribute('href');
  if (lenis) lenis.scrollTo(scrollTarget(target), { duration: 1.4 });
  else document.querySelector(target === '#build' ? '#hero' : target).scrollIntoView({ behavior: 'smooth' });
}));

/* ---------- INTRO: one short fade and rise, then the scroll scenes ---------- */
const intro = gsap.timeline({ onComplete: () => { initScenes(); ScrollTrigger.refresh(); handleArrival(); } });
intro.from('.hero-badge, .hero-logo, .sticker', { opacity: 0, y: 16, duration: reduce ? .01 : .5, stagger: reduce ? 0 : .05, ease: 'power2.out' });

/* ---------- SCROLL SCENES ---------- */
function initScenes() {
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {

  /* ONE SCENE: the hero clears away, then a sock drops in and gets knitted.
     Only transform and opacity are animated, so it stays smooth on phones. */
  const steps = gsap.utils.toArray('.step');
  const stepNum = document.getElementById('stepNum');
  let curStep = -1;
  const setStep = i => {
    if (i === curStep) return;
    curStep = i;
    steps.forEach((s, k) => s.classList.toggle('active', k === i));
    stepNum.textContent = String(i + 1).padStart(2, '0');
  };
  const knits = gsap.utils.toArray('#bigSock .knit');
  const knitIns = gsap.utils.toArray('#bigSock .knit-in');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: '+=380%', scrub: .8, pin: true,
    },
    onUpdate: () => { const t = tl.time(); setStep(t < 4 ? 0 : t < 5.6 ? 1 : t < 7.2 ? 2 : 3); }
  });
  heroST = tl.scrollTrigger;
  const nr = { immediateRender: false };
  tl
    // 1. the front page clears away
    .fromTo('.hero-logo', { y: 0, scale: 1, opacity: 1 }, { ...nr, y: () => -innerHeight * .35, scale: 1.15, opacity: 0, duration: 1.6, ease: 'power2.in' }, 0)
    .fromTo('.hero-badge', { y: 0, rotate: 0, opacity: 1 }, { ...nr, y: () => -innerHeight * .45, rotate: 180, opacity: 0, duration: 1.4, ease: 'power2.in' }, 0)
    .fromTo('.sticker', { y: 0, rotate: 0 }, { ...nr, y: i => -innerHeight * (0.7 + i * .15), rotate: i => (i % 2 ? 40 : -40), duration: 1.6, ease: 'power2.in' }, 0)
    .fromTo('.hero-dark', { y: 0, yPercent: 100 }, { ...nr, y: 0, yPercent: 0, duration: 1.1, ease: 'power2.inOut' }, .9)
    // 2. a plain sock drops in, the steps appear
    .fromTo('#bigSock', { y: () => -innerHeight * 1.3, rotate: -30 }, { y: 0, rotate: -6, duration: 1.2, ease: 'back.out(1.3)' }, 1.8)
    .fromTo('.build-text', { y: 30, opacity: 0 }, { ...nr, y: 0, opacity: 1, duration: .6 }, 2.6)
    .fromTo('#buildBar', { scaleX: 0 }, { ...nr, scaleX: 1, duration: 5.4 }, 2.6)
    .to('#bigSock', { rotate: 6, duration: 5.6 }, 3)
    // 3. knit stripes, fire, smileys (each layer slides in like a wipe)
    .fromTo(knits[0], { y: 0, yPercent: -101 }, { ...nr, y: 0, yPercent: 0, duration: 1.2 }, 3.2)
    .fromTo(knitIns[0], { y: 0, yPercent: 101 }, { ...nr, y: 0, yPercent: 0, duration: 1.2 }, 3.2)
    .fromTo(knits[1], { y: 0, yPercent: -101 }, { ...nr, y: 0, yPercent: 0, duration: 1.2 }, 4.8)
    .fromTo(knitIns[1], { y: 0, yPercent: 101 }, { ...nr, y: 0, yPercent: 0, duration: 1.2 }, 4.8)
    .fromTo(knits[2], { y: 0, yPercent: -101 }, { ...nr, y: 0, yPercent: 0, duration: 1.2 }, 6.4)
    .fromTo(knitIns[2], { y: 0, yPercent: 101 }, { ...nr, y: 0, yPercent: 0, duration: 1.2 }, 6.4)
    // 4. stamp, then a short hold before the page moves on
    .fromTo('#stamp', { scale: 0, opacity: 0 }, { ...nr, scale: 1, opacity: 1, duration: .5, ease: 'back.out(3)' }, 8)
    .to({}, { duration: 1 }, 8.5);

  /* MARQUEE: scroll-linked + velocity skew */
  gsap.utils.toArray('.track').forEach(t => {
    const dir = +t.dataset.dir;
    gsap.fromTo(t, { xPercent: dir > 0 ? 0 : -40 }, {
      xPercent: dir > 0 ? -40 : 0, ease: 'none',
      scrollTrigger: { trigger: '.marquees', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  const skewTo = gsap.quickTo('.track', 'skewX', { duration: .4, ease: 'power3' });
  ScrollTrigger.create({ trigger: '.marquees', start: 'top bottom', end: 'bottom top',
    onUpdate: self => skewTo(gsap.utils.clamp(-18, 18, self.getVelocity() / -150)) });

  /* CTA: sock rain */
  gsap.utils.toArray('.rain img').forEach((im, i) => {
    gsap.fromTo(im, { y: 0, rotate: gsap.utils.random(-40, 40) }, {
      y: () => innerHeight * gsap.utils.random(1.3, 1.9), rotate: gsap.utils.random(-200, 200), ease: 'none',
      scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: .5 + (i % 3) * .4 }
    });
  });
});
}

