// Public, published content only. Never put a write token in this module.
export const query = `{
 "staff": *[_type == "staff" && visible != false] | order(order asc, name asc) {...,"photo":photo.asset->url,"photoAlt":photo.alt},
 "services": *[_type == "service" && visible != false] | order(order asc, title asc) {...,"slug":slug.current,"image":image.asset->url,"imageAlt":image.alt},
 "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{...,"heroImage":heroImage.asset->url,"heroImageAlt":heroImage.alt,"practiceImage":practiceImage.asset->url,"practiceImageAlt":practiceImage.alt}
}`;
let pending;
export function getContent() {
 return pending ??= (async()=>{
  const configResponse=await fetch(new URL('../data/sanity-config.json',import.meta.url));
  if(!configResponse.ok) throw new Error('Website content configuration is unavailable.');
  const config=await configResponse.json();
  if(!/^[a-z0-9]+$/.test(config.projectId)||!/^[a-z0-9_-]+$/.test(config.dataset)) throw new Error('Website content is not configured.');
  // apicdn is Sanity's cached endpoint for published content: a larger request
  // quota than api.sanity.io and faster pages. Edits appear within a minute.
  const url=new URL(`https://${config.projectId}.apicdn.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`);
  url.searchParams.set('query',query);url.searchParams.set('perspective','published');
  const response=await fetch(url,{signal:AbortSignal.timeout(10000)});
  if(!response.ok) throw new Error('Website content is temporarily unavailable.');
  const {result}=await response.json();
  if(!Array.isArray(result?.staff)||!Array.isArray(result?.services)) throw new Error('Website content could not be loaded.');
  return result;
 })();
}
export function serviceHref(service){return service.hasPage?`Service.dc.html?service=${encodeURIComponent(service.slug)}`:'Home.dc.html#book'}
export function safeImage(value){
 if(typeof value!=='string')return '';
 try {const url=new URL(value,globalThis.location?.origin||'https://example.invalid');return url.protocol==='https:'||value.startsWith('assets/')?value:''}catch{return ''}
}
export function contentError(container){container.replaceChildren();const p=document.createElement('p');p.textContent='This information is temporarily unavailable. Please refresh the page or call the practice.';p.setAttribute('role','status');container.append(p)}
