import {renderHeritage} from './heritage.js';
import {getContent,serviceHref,contentError} from './content.js';
import {escapeHtml,qs} from './support.js';
renderHeritage();
const services=qs('[data-services]');
try{
 const content=await getContent();
 services.innerHTML=content.services.map(service=>`<div class="service-item"><a href="${escapeHtml(serviceHref(service))}">${escapeHtml(service.title)}</a><span aria-hidden="true">→</span></div>`).join('');
 if(!content.services.length)services.textContent='Please contact us to discuss your dental care.';
}catch{contentError(services)}
qs('[data-year]').textContent=new Date().getFullYear();
