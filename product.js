/* Product pages: add to bag (same bag as the shop), hero depth, colour flood. */
(() => {
  const { drops } = window.SMASH;
  const id = document.body.dataset.id;
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- BAG: same storage key and format as main.js ---------- */
  const valid = new Set(drops.map(d => d.id));
  const read = () => { try { return JSON.parse(localStorage.getItem('smashBag') || '{}') || {}; } catch (e) { return {}; } };
  const pairs = bag => Object.keys(bag).reduce((n, k) => {
    const m = /^b(\d+):/.exec(k);
    return n + (bag[k] > 0 ? bag[k] * (m ? +m[1] : valid.has(k) ? 1 : 0) : 0);
  }, 0);
  const count = $('#bagCount');
  const showCount = () => { count.textContent = pairs(read()); };
  showCount();
  addEventListener('storage', e => { if (e.key === 'smashBag') showCount(); });

  const btn = $('#addBtn');
  const status = $('#status');
  let reset;
  btn.addEventListener('click', () => {
    const bag = read();
    bag[id] = (bag[id] || 0) + 1;
    let saved = true;
    try { localStorage.setItem('smashBag', JSON.stringify(bag)); } catch (e) { saved = false; }
    if (!saved) {
      status.innerHTML = 'Your browser blocked the bag. <a href="https://ig.me/m/smashstore._" target="_blank" rel="noopener">DM us the pair name</a> instead.';
      return;
    }
    showCount();
    const pill = $('.pbag'); pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
    const n = bag[id];
    status.innerHTML = `${n === 1 ? 'In your bag' : n + ' of these in your bag'}. <a href="../../?bag=1">Open bag</a>`;
    btn.textContent = 'Added'; btn.classList.add('added');
    clearTimeout(reset);
    reset = setTimeout(() => { btn.textContent = 'Add another'; btn.classList.remove('added'); }, 1400);
  });
  if (read()[id] > 0) status.innerHTML = `Already in your bag. <a href="../../?bag=1">Open bag</a>`;

  if (reduce) return;

  /* ---------- HERO DEPTH: three planes, three rates ---------- */
  const hero = $('.phero');
  const word = $('.phero-word'), shot = $('.pshot'), mascot = $('.pmascot');

  /* ---------- NEXT PAIR FLOOD ---------- */
  const next = $('.pnext'), nextIn = $('.pnext-in'), nextShot = $('.pnext-shot');
  const aim = () => {
    // the flood grows from the centre of the next pair's photo
    const a = nextIn.getBoundingClientRect(), b = nextShot.getBoundingClientRect();
    nextIn.style.setProperty('--fx', ((b.left + b.width / 2 - a.left) / a.width * 100).toFixed(1) + '%');
    nextIn.style.setProperty('--fy', ((b.top + b.height / 2 - a.top) / a.height * 100).toFixed(1) + '%');
  };

  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    const h = hero.getBoundingClientRect();
    if (h.bottom > 0) {
      const p = Math.min(1, Math.max(0, -h.top / h.height));      // 0 at rest, 1 when the hero has left
      word.style.transform = `translate3d(0,${(p * 18).toFixed(1)}vh,0)`;   // back plane lags behind
      shot.style.transform = `translate3d(0,${(p * -6).toFixed(1)}vh,0)`;   // middle plane leads a little
      mascot.style.transform = `translate3d(${(p * 4).toFixed(1)}vw,${(p * -22).toFixed(1)}vh,0) rotate(${(p * 14).toFixed(1)}deg)`; // front plane leads most
    }
    const n = next.getBoundingClientRect();
    if (n.top < vh && n.bottom > 0) {
      // flood runs from when the section is 40% in view until it has pinned for half a screen
      const f = Math.min(1, Math.max(0, (vh * .6 - n.top) / (vh * 1.1)));
      nextIn.style.setProperty('--flood', f.toFixed(3));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { aim(); onScroll(); });
  aim(); frame();
})();
