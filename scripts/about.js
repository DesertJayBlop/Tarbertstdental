import {getContent,safeImage,contentError} from './content.js';
import {escapeHtml as e} from './support.js';
const dialog=document.querySelector('[data-bio-dialog]');
try{
 const {staff}=await getContent();
 const card=member=>`<article class="person-card">${safeImage(member.photo)?`<img src="${e(safeImage(member.photo))}" alt="${e(member.photoAlt||member.name)}" loading="lazy">`:''}<div class="person-card-content"><p class="person-role">${e(member.role)}</p><h3>${e(member.name)}</h3><p>${e(member.teaser||'')}</p></div><button type="button" data-member="${e(member._id)}">View more details</button></article>`;
 for(const [selector,group] of [['[data-dentists]','dentists'],['[data-support-team]','hygienists'],['[data-practice-support]','support']]){
  const mount=document.querySelector(selector);const members=staff.filter(m=>m.group===group);mount.innerHTML=members.map(card).join('');mount.closest('section').hidden=!members.length;
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-member]');if(!button)return;
  const member=staff.find(m=>m._id===button.dataset.member);if(!member)return;
  const img=dialog.querySelector('[data-dialog-image]');img.hidden=!safeImage(member.photo);if(!img.hidden)img.src=safeImage(member.photo);img.alt=member.photoAlt||member.name;
  for(const [field,key] of [['role','role'],['name','name'],['bio','bio']])dialog.querySelector(`[data-dialog-${field}]`).textContent=member[key]||'';
  dialog.querySelector('[data-dialog-expertise]').innerHTML=(member.expertise||[]).map(item=>`<span>${e(item)}</span>`).join('');dialog.showModal();
 });
}catch{contentError(document.querySelector('[data-dentists]'));document.querySelector('[data-support-team]').closest('section').hidden=true;document.querySelector('[data-practice-support]').closest('section').hidden=true}
 document.querySelector('[data-dialog-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 document.querySelector('[data-year]').textContent=new Date().getFullYear();
