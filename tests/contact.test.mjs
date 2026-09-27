import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base='http://localhost:4173';
test('floating call button works before asynchronous navigation arrives',async()=>{
 const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}});
 try{
  // Hold content indefinitely to reproduce the missing-header initialization race.
  await page.route('https://*.sanity.io/**',()=>{});
  await page.goto(base+'/Home.dc.html');
  const button=page.locator('[data-floating-book]');
  assert.equal(await button.getAttribute('tabindex'),'-1');
  await page.evaluate(()=>window.scrollTo(0,900));
  await button.waitFor({state:'visible'});
  assert.equal(await button.getAttribute('href'),'tel:+6434488899');
  assert.equal(await button.innerText(),'Call us');
  assert.equal(await button.getAttribute('aria-hidden'),'false');
  const bounds=await button.boundingBox();assert.ok(bounds.x+bounds.width<=390);assert.ok(bounds.y+bounds.height<=844);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await button.waitFor({state:'hidden'});
 }finally{await browser.close()}
});
test('restored form retains input on unavailable delivery and only succeeds after acceptance',async()=>{
 const browser=await chromium.launch();const page=await browser.newPage();
 let endpoint='';let status=503;let submitted;
 try{
  await page.route('https://*.sanity.io/**',r=>r.fulfill({json:{result:{staff:[],services:[],settings:{callbackEndpoint:endpoint}}}}));
  await page.route('https://forms.example.test/callback',async r=>{submitted=r.request().postDataJSON();await r.fulfill({status,json:{ok:status===200}})});
  async function fill(){await page.goto(base+'/Home.dc.html#book');await page.reload();await page.getByLabel('Your name').fill('Website test');await page.getByLabel('Phone number').fill('020 000 0000');await page.getByLabel('Email address').fill('website.test@example.test');await page.getByLabel('Anything we should know?').fill('Test only');}
  await fill();await page.getByRole('button',{name:'Request a callback'}).click();await page.getByText('Your details have not been sent.',{exact:false}).waitFor();assert.equal(submitted,undefined);assert.equal(await page.getByLabel('Your name').inputValue(),'Website test');
  endpoint='https://forms.example.test/callback';await fill();await page.getByRole('button',{name:'Request a callback'}).click();await page.getByText('We could not confirm your request was sent.',{exact:false}).waitFor();assert.equal(await page.getByLabel('Your name').inputValue(),'Website test');
  status=200;await page.getByRole('button',{name:'Request a callback'}).click();await page.getByText('Your callback request has been sent.',{exact:false}).waitFor();assert.equal(submitted.phone,'020 000 0000');assert.equal(submitted.email,'website.test@example.test');assert.equal(await page.getByLabel('Your name').inputValue(),'');
 }finally{await browser.close()}
});
