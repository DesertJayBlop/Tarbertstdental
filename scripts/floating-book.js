const floatingBook=document.querySelector('[data-floating-book]');
const header=document.querySelector('.site-header');
if(floatingBook&&header){
  const updateVisibility=()=>floatingBook.classList.toggle('is-visible',window.scrollY>header.offsetHeight+24);
  window.addEventListener('scroll',updateVisibility,{passive:true});
  updateVisibility();
}
