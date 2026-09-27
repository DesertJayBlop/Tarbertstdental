import {getContent,safeImage,contentError} from './content.js';
import {escapeHtml as e} from './support.js';
const main=document.querySelector('main');
const icons=new Set(['calendar','check','clock','phone','pin']);
try{
 const {services}=await getContent();
 const slug=new URLSearchParams(location.search).get('service');
 const filename=decodeURIComponent(location.pathname.split('/').pop());
 const service=services.find(s=>slug?s.slug===slug:s.legacyUrl===filename);
 if(!service?.hasPage){main.innerHTML='<section class="service-section section-shell"><h1>Service unavailable</h1><p>This service page is no longer available.</p><a href="Home.dc.html#services">View current services</a></section>';document.title='Service unavailable | Tarbert Street Dental'}
 else{
 document.title=`${service.title} | Tarbert Street Dental`;
 document.querySelector('meta[name="description"]').content=service.summary||service.title;
 const cards=(items=[],steps=false)=>items.map(card=>`<article class="${steps?'process-card':'sign-card'}">${steps?`<span class="step">${e(card.step||'')}</span>`:icons.has(card.icon)?`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${card.icon}"></use></svg>`:''}<h3>${e(card.title)}</h3><p>${e(card.text||'')}</p></article>`).join('');
 main.innerHTML=`<section class="service-hero"><div class="section-shell service-hero-grid"><div><p class="overline">${e(service.category||'Our services')}</p><h1>${e(service.heading||service.title)}</h1><p class="lede">${e(service.summary||'')}</p><div class="hero-actions"><a class="button button-blue" href="Home.dc.html#book">Book an appointment <span>→</span></a></div></div>${safeImage(service.image)?`<div class="service-hero-image"><img src="${e(safeImage(service.image))}" alt="${e(service.imageAlt||service.title)}"></div>`:''}</div></section>`+
 (service.sections||[]).map(section=>`<section class="service-section ${section.softBackground?'soft-section':''} ${section.layout==='text'?'narrow':''}"><div class="${section.layout==='text'?'':'section-shell'}"><p class="overline">${e(section.eyebrow||'')}</p><h2>${e(section.title)}</h2>${(section.paragraphs||[]).map(p=>`<p>${e(p)}</p>`).join('')}${section.cards?.length?`<div class="${section.layout==='steps'?'process-grid':'signs-grid'}">${cards(section.cards,section.layout==='steps')}</div>`:''}</div></section>`).join('')+
 `<section class="service-cta"><div class="section-shell service-cta-inner"><div><p class="overline">${e(service.callToAction?.eyebrow||'Get in touch')}</p><h2>${e(service.callToAction?.title||'Let’s talk it through.')}</h2><p>${e(service.callToAction?.text||'Contact our team to discuss your care.')}</p></div><a class="button button-navy" href="Home.dc.html#book">Request an appointment <span>→</span></a></div></section>`;
 }
}catch{main.innerHTML='<section class="service-section section-shell" data-error></section>';contentError(main.querySelector('[data-error]'))}
 document.querySelector('[data-year]').textContent=new Date().getFullYear();
