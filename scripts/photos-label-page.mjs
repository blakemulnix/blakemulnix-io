#!/usr/bin/env node
/**
 * Emits a local page for labelling photo locations. Shows each thumbnail beside
 * an input, and builds the updated manifest JSON for copying back into
 * photos/manifest.json. Generated so it cannot drift from the manifest.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('photos/manifest.json', 'utf8'))
const OUT = 'explorations/photo-labels.html'

const cards = manifest.photos
  .map(
    (p, i) => `
    <div class="card">
      <img src="../public/photos/${p.slug}-400.webp" alt="${p.slug}" loading="lazy" />
      <div class="meta">
        <div class="slug">${p.slug}</div>
        <div class="file">${p.file} &middot; ${p.width}&times;${p.height}</div>
        <input data-i="${i}" value="${(p.location ?? '').replace(/"/g, '&quot;')}"
               placeholder="Location, e.g. Maroon Bells, Colorado" />
      </div>
    </div>`,
  )
  .join('')

writeFileSync(
  OUT,
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Label photo locations</title>
    <style>
      :root { --pine:#141d17; --sand:#e7dcc4; --moss:#93b06e; --ochre:#d9a05b; }
      * { box-sizing:border-box; }
      body { margin:0; padding:24px 20px 40px; background:#0d100e; color:var(--sand);
             font:14px/1.55 ui-sans-serif,system-ui,sans-serif; }
      h1 { font-size:22px; margin:0 0 4px; }
      p.note { color:#a49b86; max-width:70ch; margin:0 0 20px; }
      .bar { position:sticky; top:0; z-index:5; background:#0d100ef2; backdrop-filter:blur(8px);
             padding:10px 0 12px; margin-bottom:12px; border-bottom:1px solid #ffffff1f; }
      button { background:var(--moss); color:#0d100e; border:0; border-radius:8px;
               padding:9px 14px; font-weight:600; cursor:pointer; }
      button.ghost { background:#ffffff14; color:var(--sand); }
      #count { color:var(--ochre); margin-left:12px; font-variant-numeric:tabular-nums; }
      .grid { display:grid; gap:12px; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); }
      .card { border:1px solid #ffffff1f; border-radius:10px; overflow:hidden; background:#141917; }
      .card img { display:block; width:100%; height:180px; object-fit:cover; background:#1b211d; }
      .meta { padding:10px 12px 12px; }
      .slug { font:12px ui-monospace,monospace; color:var(--moss); }
      .file { font-size:11px; color:#8d8474; margin:2px 0 8px; }
      input { width:100%; padding:8px 10px; border-radius:6px; border:1px solid #ffffff2b;
              background:#0d100e; color:var(--sand); font-size:13px; }
      input:focus { outline:2px solid var(--ochre); outline-offset:1px; }
      textarea { width:100%; height:220px; margin-top:14px; border-radius:8px; padding:12px;
                 background:#0d100e; color:#a49b86; border:1px solid #ffffff1f;
                 font:12px/1.5 ui-monospace,monospace; }
    </style>
  </head>
  <body>
    <h1>Label photo locations</h1>
    <p class="note">
      Type a location for each photo, then copy the JSON and paste it over
      <code>photos/manifest.json</code>. Re-running <code>npm run photos</code> keeps
      whatever you have typed, matched by filename.
    </p>
    <div class="bar">
      <button id="copy">Copy manifest JSON</button>
      <button class="ghost" id="toggle">Show JSON</button>
      <span id="count"></span>
    </div>
    <div class="grid">${cards}</div>
    <textarea id="json" hidden readonly></textarea>

    <script>
      const manifest = ${JSON.stringify(manifest)};
      const inputs = [...document.querySelectorAll('input[data-i]')];
      const json = document.getElementById('json');
      const count = document.getElementById('count');

      const sync = () => {
        inputs.forEach(i => { manifest.photos[+i.dataset.i].location = i.value.trim(); });
        json.value = JSON.stringify(manifest, null, 2) + '\\n';
        const done = manifest.photos.filter(p => p.location).length;
        count.textContent = done + ' of ' + manifest.photos.length + ' labelled';
      };

      inputs.forEach(i => i.addEventListener('input', sync));
      document.getElementById('copy').addEventListener('click', async () => {
        sync();
        try {
          await navigator.clipboard.writeText(json.value);
          const b = document.getElementById('copy');
          b.textContent = 'Copied';
          setTimeout(() => (b.textContent = 'Copy manifest JSON'), 1400);
        } catch {
          json.hidden = false;
          json.select();
        }
      });
      document.getElementById('toggle').addEventListener('click', () => { json.hidden = !json.hidden; });
      sync();
    </script>
  </body>
</html>
`,
)
console.log(`wrote ${OUT} (${manifest.photos.length} photos)`)
