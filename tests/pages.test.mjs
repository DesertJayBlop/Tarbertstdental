import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';
test('project-subdirectory hosting loads CMS configuration and keeps links inside the project',async()=>{
 const prefix='/Tarbertstdental/';const root=path.resolve('dist');const requests=[];
 const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');requests.push(url.pathname);
  try{
   if(!url.pathname.startsWith(prefix))throw new Error('Outside Pages project');
   const relative=url.pathname.slice(prefix.length)||'index.html';
   const file=path.resolve(root,relative.endsWith('/')?relative+'index.html':relative);
   if(!file.startsWith(root+path.sep))throw new Error('Invalid path');
   const mime={'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml'};
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Not found')}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}${prefix}`;
 const browser=await chromium.launch();const page=await browser.newPage();
 try{
  const fixture=JSON.parse(await readFile('migration/existing-content.json','utf8'));
  const result={settings:null,staff:fixture.staff.map(p=>({...p,_id:p.id})),services:fixture.services.map(s=>({...s,slug:s.id,hasPage:s.hasExistingPage,...s.page}))};
  await page.route('https://*.sanity.io/**/data/query/**',r=>r.fulfill({json:{result}}));
  await page.goto(base+'Home.dc.html');await page.locator('[data-services] a').first().waitFor();
  assert.equal(await page.locator('[data-services] a').count(),10);
  assert.ok(requests.includes(prefix+'data/sanity-config.json'));
  assert.ok(!requests.includes('/data/sanity-config.json'));
  await page.locator('[data-services] a').first().click();await page.getByRole('heading',{name:'CEREC same-day crowns.'}).waitFor();assert.ok(page.url().startsWith(base));
  await page.goto(base+'About.dc.html');await page.locator('.person-card').first().waitFor();assert.equal(await page.locator('.person-card').count(),7);
  await page.goto(base+'admin.html');await page.waitForURL(base+'studio/');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
});
