import {getContent} from './content.js';
import {escapeHtml,qs} from './support.js';

const content=getContent();
const serviceLinks=[
	{title:'CEREC same-day crowns',href:'Service-CEREC-Crowns.dc.html',status:'Page'},
	{title:'Root canal treatment',href:'Service-Root-Canal.dc.html',status:'Page'},
	{title:'Emergency treatment & ACC',href:'#book',status:'Page in progress'},
	{title:'General dentistry',href:'#book',status:'Page in progress'},
	{title:'Hygiene',href:'#book',status:'Page in progress'},
	{title:'Dental implants',href:'#book',status:'Page in progress'},
	{title:'IV sedation',href:'#book',status:'Page in progress'},
	{title:'Anti-wrinkle / botulinum toxin',href:'#book',status:'Page in progress'},
	{title:'Clear aligners',href:'#book',status:'Page in progress'},
	{title:'Home care tips',href:'#book',status:'Page in progress'}
];
const services=qs('[data-services]');
services.innerHTML=serviceLinks.map((service)=>service.status==='Page'?`<div class="service-item"><a href="${service.href}">${escapeHtml(service.title)}</a><span aria-hidden="true">→</span></div>`:`<div class="service-item"><a href="${service.href}">${escapeHtml(service.title)}</a><em>${service.status}</em></div>`).join('');

qs('[data-year]').textContent=new Date().getFullYear();
qs('[data-contact-form]').addEventListener('submit',(event)=>{event.preventDefault();qs('[data-form-message]').textContent='Thank you. We will be in touch shortly to arrange your visit.';event.target.reset()});