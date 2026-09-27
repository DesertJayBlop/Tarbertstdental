import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {serviceHref,safeImage,query} from '../scripts/content.js';
const base='http://localhost:4173';
test('CMS values cannot generate executable links',()=>{
 assert.equal(safeImage('javascript:alert(1)'),'');assert.equal(safeImage('data:text/html,test'),'');
 assert.equal(safeImage('https://cdn.sanity.io/image.jpg'),'https://cdn.sanity.io/image.jpg');
 assert.equal(serviceHref({hasPage:true,slug:'" onclick="x'}),'Service.dc.html?service=%22%20onclick%3D%22x');
 assert.match(query,/visible != false/);
});
test('public pages, mobile navigation, legacy URLs and login gate',async()=>{
 const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+'/Home.dc.html');await page.locator('[data-services] a').first().waitFor();assert.equal(await page.locator('[data-services] a').count(),10);
  await page.getByRole('link',{name:'Meet the team'}).click();await page.locator('.person-card').first().waitFor();assert.equal(await page.locator('.person-card').count(),7);
  await page.locator('.person-card button').first().click();assert.equal(await page.locator('dialog').isVisible(),true);await page.keyboard.press('Escape');
  await page.goto(base+'/Service-CEREC-Crowns.dc.html');await page.getByRole('heading',{name:'CEREC same-day crowns.'}).waitFor();assert.equal(await page.locator('.sign-card').count(),4);
  await page.goto(base+'/Service-Root-Canal.dc.html');await page.getByRole('heading',{name:'Root canal treatment.'}).waitFor();assert.equal(await page.locator('.process-card').count(),3);
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/Home.dc.html');await page.getByRole('button',{name:'Open menu'}).click();assert.equal(await page.locator('#mobile-nav').isVisible(),true);assert.equal(await page.locator('#mobile-nav a.mobile-sub').count(),11);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
  await page.goto(base+'/admin.html');await page.waitForURL('**/studio/**');await page.getByText('Choose login provider',{exact:true}).first().waitFor({timeout:30000});
  await page.screenshot({path:'test-results/studio-login.png',fullPage:true});
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});
test('new content renders safely and removed services do not fall back to old copy',async()=>{
 const browser=await chromium.launch();const page=await browser.newPage();
 const result={staff:[{_id:'new-person',name:'<img src=x onerror=alert(1)>',role:'Test',group:'support',bio:'New biography',expertise:['<script>bad</script>']}],services:[{title:'New service',slug:'new-service',hasPage:true,heading:'A new service',summary:'Created in the CMS',sections:[{title:'New section',layout:'text',paragraphs:['Fresh content']}]}],settings:null};
 try{
  await page.route('https://*.api.sanity.io/**',route=>route.fulfill({json:{result}}));
  await page.goto(base+'/Home.dc.html');await page.getByRole('link',{name:'New service',exact:true}).first().waitFor();assert.equal(await page.locator('[data-services] a').count(),1);
  await page.locator('[data-services] a').click();await page.getByRole('heading',{name:'A new service'}).waitFor();assert.equal(await page.getByText('Fresh content').count(),1);
  await page.goto(base+'/About.dc.html');await page.locator('.person-card').waitFor();assert.equal(await page.locator('.person-card img').count(),0);assert.equal(await page.locator('.person-card h3').textContent(),result.staff[0].name);
  await page.goto(base+'/Service-CEREC-Crowns.dc.html');await page.getByRole('heading',{name:'Service unavailable'}).waitFor();assert.equal(await page.getByText('Your new crown, without the waiting room.').count(),0);
 }finally{await browser.close()}
});
