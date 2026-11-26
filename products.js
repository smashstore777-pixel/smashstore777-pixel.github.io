/* Smash Store product list. The shop (main.js), the product pages (product.js)
   and the page generator (tools/build-product-pages.mjs) all read this file.
   Adding a pair: add a line here, put its photo in img/<id>.jpg, then run
   `node tools/build-product-pages.mjs` to create its page at p/<slug>/.

   type:  'ankle' or 'full'
   price: rupees (e.g. 299) to show it; null shows "Price on DM"
   color: the pair's own colour, used as that pair's page background
   ink:   text colour that reads on `color` ('#0d0d0d' or '#FFF6E0') */
(function (root) {
  const drops = [
    { id: 'pringles', slug: 'crunch-time',       name: 'Crunch Time',       tag: 'Food fit', type: 'full', price: null, color: '#E8201A', ink: '#FFF6E0' },
    { id: 'flame',    slug: 'classic-fire',      name: 'Classic Fire',      tag: 'Heat',     type: 'full', price: null, color: '#F2661B', ink: '#0d0d0d' },
    { id: 'fine',     slug: 'everythings-fine',  name: "Everything's Fine", tag: 'Mood',     type: 'full', price: null, color: '#2E7B3C', ink: '#FFF6E0' },
    { id: 'smiley',   slug: 'emoji-overload',    name: 'Emoji Overload',    tag: 'Chaos',    type: 'full', price: null, color: '#F5B41F', ink: '#0d0d0d' },
    { id: 'turtles',  slug: 'pizza-power',       name: 'Pizza Power',       tag: 'Cartoon',  type: 'full', price: null, color: '#5AA02C', ink: '#0d0d0d' },
    { id: 'garfield', slug: 'lazy-cat-club',     name: 'Lazy Cat Club',     tag: 'Cartoon',  type: 'full', price: null, color: '#F08A1C', ink: '#0d0d0d' },
    { id: 'shrimp',   slug: 'shrimp-above-rest', name: 'Shrimp Above Rest', tag: 'Food fit', type: 'full', price: null, color: '#5CC6C0', ink: '#0d0d0d' },
    { id: 'cat',      slug: 'i-love-my-cat',     name: 'I ♥ My Cat',        tag: 'Pets',     type: 'full', price: null, color: '#8EC3EA', ink: '#0d0d0d' },
    { id: 'subway',   slug: 'sub-socks',         name: 'Sub Socks',         tag: 'Food fit', type: 'full', price: null, color: '#1F6B35', ink: '#FFF6E0' },
    { id: 'dad',      slug: 'bye-buddy',         name: 'Bye Buddy',         tag: 'Meme',     type: 'full', price: null, color: '#2A63BC', ink: '#FFF6E0' },
  ];
  // bundle sizes customers can pick; price: null shows "Bundle price on DM"
  const bundles = [{ size: 3, price: null }, { size: 5, price: null }];
  const data = { drops, bundles };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.SMASH = data;
})(typeof window !== 'undefined' ? window : globalThis);
