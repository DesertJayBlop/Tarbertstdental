import {renderHeritage} from './heritage.js';
import {getContent,safeImage} from './content.js';
import {escapeHtml as e} from './support.js';
if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
try{
 const {settings:s}=await getContent();if(s){
  document.querySelectorAll('.site-footer img,.logo-link img').forEach(img=>img.alt=s.practiceName);
  document.querySelectorAll('.logo-link').forEach(a=>a.setAttribute('aria-label',s.practiceName+' home'));
  document.querySelectorAll('.footer-bottom > span:first-child').forEach(el=>el.textContent=`© ${new Date().getFullYear()} ${s.practiceName}`);
  if(document.querySelector('.hero-copy'))document.title=s.practiceName+' | '+s.heroHeading;
  document.querySelectorAll('a[href^="tel:"]').forEach(a=>{if(/^\+?[0-9 ()-]+$/.test(s.phoneLink||''))a.href=`tel:${s.phoneLink.replace(/[ ()-]/g,'')}`;if(a.textContent.includes('03 448 8899')){const svg=a.querySelector('svg')?.cloneNode(true);a.replaceChildren();if(svg)a.append(svg);a.append(document.createTextNode(s.phone))}});
  document.querySelectorAll('.footer-contact > span').forEach(el=>el.textContent=s.address);
  // Only override the address written into the page; an empty Sanity field
  // leaves the footer's own email in place rather than removing it.
  if(/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(s.email||''))document.querySelectorAll('[data-practice-email]').forEach(a=>{a.href='mailto:'+s.email;a.textContent=s.email});
  const locationCopy=document.querySelector('.location-copy');if(locationCopy)locationCopy.querySelector('p:not(.overline)').textContent=s.address;
  const map=`https://www.google.com/maps?q=${encodeURIComponent(s.address)}`;
  document.querySelectorAll('a[href*="google.com/maps"]').forEach(a=>{a.href=map;if(a.closest('.utility-bar')){const svg=a.querySelector('svg')?.cloneNode(true);a.replaceChildren();if(svg)a.append(svg);a.append(document.createTextNode(s.address))}});
  const iframe=document.querySelector('.map-card iframe');if(iframe)iframe.src=map+'&output=embed';
  const hours=document.querySelector('.utility-bar > span');if(hours){const svg=hours.querySelector('svg')?.cloneNode(true);hours.replaceChildren();if(svg)hours.append(svg);hours.append(document.createTextNode(s.hours))}
  const footerHours=document.querySelector('.footer-hours');if(footerHours){footerHours.innerHTML='<h3>Opening hours</h3>';footerHours.append(...s.hours.split(';').map(line=>{const row=document.createElement('span');row.textContent=line.trim();return row}))}
  renderHeritage(s);
  document.querySelectorAll('[data-instagram]').forEach(a=>{const handle=s.instagramHandle;a.hidden=!/^[A-Za-z0-9._]{1,30}$/.test(handle||'');if(!a.hidden){a.href=`https://www.instagram.com/${encodeURIComponent(handle)}/`;a.querySelector('[data-instagram-label]').textContent='@'+handle}});
  const heading=document.querySelector('.hero-copy h1');if(heading)heading.textContent=s.heroHeading;
  const lede=document.querySelector('.hero-lede');if(lede)lede.textContent=s.heroText;
  for(const [selector,key] of [['.hero-image img','heroImage'],['.team-photo img','practiceImage']]){const img=document.querySelector(selector);if(img&&safeImage(s[key])){img.src=safeImage(s[key]);img.alt=s[key+'Alt']||s.practiceName}}
  const faqs=document.querySelector('.faq-list');if(faqs&&Array.isArray(s.faqs))faqs.innerHTML=s.faqs.map(f=>`<details data-reveal="flip"><summary>${e(f.question)} <span>+</span></summary><p>${e(f.answer)}</p></details>`).join('');
 }
}catch{/* Static contact details remain available if the content service is unreachable. */}
