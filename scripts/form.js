const form=document.querySelector('[data-contact-form]');
if(form){
  const reason=form.querySelector('select[name="reason"]');
  const comments=form.querySelector('textarea[name="comments"]');
  const options=['Check-up and clean','CEREC crown','Root canal treatment','Sore tooth — need to be seen','Something else'];
  reason.replaceChildren(...options.map((option)=>{const item=document.createElement('option');item.textContent=option;return item}));
  if(comments)comments.setAttribute('aria-label','Anything we should know? (optional)');
}
