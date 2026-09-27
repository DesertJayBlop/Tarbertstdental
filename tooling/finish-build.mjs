import {readFile,writeFile} from 'node:fs/promises';
// GitHub Pages has no SPA rewrites. Preserve Studio deep links via its 404 page.
const studioPath=(process.env.SANITY_STUDIO_BASEPATH||'/studio').replace(/\/$/,'')+'/';
if(!/^\/(?:[A-Za-z0-9_-]+\/)*studio\/$/.test(studioPath))throw new Error('Invalid Studio base path');
const homePath=studioPath.slice(0,-'studio/'.length)+'Home.dc.html';
const restore=`<script>(()=>{const route=new URLSearchParams(location.search).get('__studio_route');if(route&&route.startsWith(${JSON.stringify(studioPath)})&&!route.startsWith('//')){const target=new URL(route,location.origin);if(target.origin===location.origin)history.replaceState(null,'',target.pathname+target.search+target.hash)}})();</script>`;
const html=await readFile('dist/studio/index.html','utf8');
await writeFile('dist/studio/index.html',html.replaceAll('href="/static/',`href="${studioPath}static/`).replace('<head>','<head>'+restore));
await writeFile('dist/404.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Tarbert Street Dental</title><script>if(location.pathname.startsWith(${JSON.stringify(studioPath)})){location.replace(${JSON.stringify(studioPath)}+'?__studio_route='+encodeURIComponent(location.pathname+location.search+location.hash))}</script></head><body><h1>Page not found</h1><p><a href="${homePath}">Return to Tarbert Street Dental</a></p></body></html>`);
await writeFile('dist/.nojekyll','');
console.log(`Static hosting routes prepared for ${studioPath}`);
