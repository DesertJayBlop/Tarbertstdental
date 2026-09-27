import {getContent} from './content.js';
const form=document.querySelector('[data-contact-form]');
if(form){
 const message=form.querySelector('[data-form-message]');
 const button=form.querySelector('button[type="submit"]');
 let sending=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending||!form.reportValidity())return;
  sending=true;button.disabled=true;form.setAttribute('aria-busy','true');
  message.textContent='Preparing your callback request…';
  try{
   const {settings}=await getContent();
   const endpoint=settings?.callbackEndpoint;
   if(!endpoint){message.textContent='Online callback requests are not available yet. Please call the practice to book. Your details have not been sent.';return}
   const url=new URL(endpoint);
   if(url.protocol!=='https:'||url.username||url.password)throw new Error('Invalid submission endpoint');
   const data=new FormData(form);
   const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:String(data.get('name')||'').trim(),phone:String(data.get('phone')||'').trim(),email:String(data.get('email')||'').trim(),reason:String(data.get('reason')||''),comments:String(data.get('comments')||'').trim()}),signal:AbortSignal.timeout(15000),credentials:'omit'});
   if(!response.ok)throw new Error('Request was not accepted');
   message.textContent='Thank you. Your callback request has been sent. The practice will contact you to arrange your visit.';
   form.reset();
  }catch{message.textContent='We could not confirm your request was sent. Please call the practice to book. Your details remain below.'}
  finally{sending=false;button.disabled=false;form.removeAttribute('aria-busy')}
 });
}
