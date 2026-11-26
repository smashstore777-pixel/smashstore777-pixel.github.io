// Writes one static page per pair at p/<slug>/index.html from products.js.
// Run from the repo root after adding or renaming a pair:
//   node tools/build-product-pages.mjs
// The pages are plain HTML (readable without JavaScript, with their own link
// previews); product.js adds the bag, the parallax and the colour flood.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { drops } = require(path.join(ROOT, 'products.js'));
const SITE = 'https://smashstore777-pixel.github.io';
const V = '20261126g';
const DM = 'https://ig.me/m/smashstore._';

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const typeLabel = { ankle: 'Ankle', full: 'Full-length' };
const arrow = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const shareIco = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
const linkIco = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></svg>';
const waIco = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2L9 9.5z"/></svg>';
const bagIco = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';

function more(p) {
  const same = drops.filter(d => d.tag === p.tag && d.id !== p.id);
  const i = drops.indexOf(p);
  const rest = [...drops.slice(i + 1), ...drops.slice(0, i)].filter(d => !same.includes(d));
  const list = [...same, ...rest].slice(0, 4);
  const title = list.every(d => d.tag === p.tag) ? `More ${esc(p.tag.toLowerCase())}` : 'More drops';
  return { title, list };
}

function page(p, i) {
  const next = drops[(i + 1) % drops.length];
  const { title, list } = more(p);
  const name = esc(p.name);
  const url = `${SITE}/p/${p.slug}/`;
  const desc = `${p.name}: ${typeLabel[p.type].toLowerCase()} printed socks from Smash Store. Order by DM on Instagram @smashstore._`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name} socks · Smash Store</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="${p.color}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="Smash Store">
<meta property="og:title" content="${name} socks">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/${p.id}.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../product.css?v=${V}">
</head>
<body class="pp" data-impeccable-ignore="hard-offset-shadow" data-id="${p.id}" style="--c:${p.color};--on-c:${p.ink}">

<header class="pnav">
  <a class="pnav-logo" href="../../"><img src="../../img/logo.png" alt="Smash Store home" width="56" height="56"></a>
  <nav class="pnav-links" aria-label="Main">
    <a href="../../#drops">All drops</a>
    <a href="../../#order">How to order</a>
  </nav>
  <a class="pbag" href="../../?bag=1" aria-label="Open bag">${bagIco}<span>Bag</span><b id="bagCount">0</b></a>
</header>

<main>
  <section class="phero">
    <p class="phero-word" aria-hidden="true" data-impeccable-ignore="low-contrast">${name}</p>
    <div class="phero-visual">
      <figure class="pshot" data-depth="1"><img src="../../img/${p.id}.jpg" alt="${name} socks" width="347" height="463" fetchpriority="high"></figure>
      <img class="pmascot" data-depth="2" src="../../img/mascot.png" alt="" width="600" height="432">
    </div>
    <div class="pbuy">
      <h1>${name}</h1>
      <p class="pmeta">${typeLabel[p.type]} socks · ${esc(p.tag)}</p>
      <p class="pprice">${p.price ? '₹' + p.price.toLocaleString('en-IN') : 'Price on DM'}</p>
      <div class="pactions">
        <button class="pbtn" id="addBtn" type="button" data-id="${p.id}">Add to bag</button>
        <a class="plink" href="../../?bundle=${p.id}#drops">Start a bundle of 3 or 5 with this pair ${arrow}</a>
      </div>
      <div class="pshare">
        <button class="pshare-btn" id="shareBtn" type="button" aria-expanded="false" aria-controls="shareMenu">${shareIco}<span>Share this pair</span></button>
        <div class="pshare-menu" id="shareMenu" hidden>
          <button type="button" id="copyLink">${linkIco}<span>Copy link</span></button>
          <a id="waLink" href="https://wa.me/?text=${encodeURIComponent(`${p.name} socks from Smash Store ${url}`)}" target="_blank" rel="noopener">${waIco}<span>WhatsApp</span></a>
        </div>
      </div>
      <p class="pstatus" id="status" role="status" aria-live="polite"></p>
      <p class="pnote">Your bag copies the order for you. Paste it in a DM to <a href="${DM}" target="_blank" rel="noopener">@smashstore._</a> and we confirm the price and delivery there.</p>
    </div>
  </section>

  <section class="pmore" aria-labelledby="moreTitle">
    <h2 id="moreTitle">${title}</h2>
    <ul class="prail">
${list.map(d => `      <li><a class="pcard" href="../${d.slug}/" style="--c:${d.color}"><img src="../../img/${d.id}.jpg" alt="" width="347" height="463" loading="lazy"><span>${esc(d.name)}</span></a></li>`).join('\n')}
    </ul>
  </section>

  <section class="pnext" data-impeccable-ignore="cramped-padding" style="--next:${next.color};--on-next:${next.ink}">
    <a class="pnext-in" href="../${next.slug}/">
      <span class="pnext-layer"><img class="pnext-shot" src="../../img/${next.id}.jpg" alt="" width="347" height="463" loading="lazy"><span class="pnext-copy"><span class="pnext-label">Next pair</span><span class="pnext-name">${esc(next.name)} ${arrow}</span></span></span>
      <span class="pnext-layer pnext-flood" aria-hidden="true"><img class="pnext-shot" src="../../img/${next.id}.jpg" alt="" width="347" height="463" loading="lazy"><span class="pnext-copy"><span class="pnext-label">Next pair</span><span class="pnext-name">${esc(next.name)} ${arrow}</span></span></span>
    </a>
  </section>
</main>

<footer class="pfoot">
  <img src="../../img/logo.png" alt="" width="48" height="48">
  <p>© <span id="yr">2026</span> Smash Store · Smash the ordinary.</p>
  <a href="https://instagram.com/smashstore._" target="_blank" rel="noopener">@smashstore._</a>
</footer>

<script src="../../products.js?v=${V}"></script>
<script src="../../product.js?v=${V}"></script>
</body>
</html>
`;
}

const out = path.join(ROOT, 'p');
const keep = new Set(drops.map(d => d.slug));
if (fs.existsSync(out)) {
  for (const dir of fs.readdirSync(out)) if (!keep.has(dir)) fs.rmSync(path.join(out, dir), { recursive: true });
}
drops.forEach((p, i) => {
  const dir = path.join(out, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(p, i));
});
console.log(`wrote ${drops.length} product pages to p/`);
