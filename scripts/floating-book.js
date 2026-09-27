// Navigation loads asynchronously; resolve its height at each visibility check.
const floatingCall=document.querySelector('[data-floating-book]');
if(floatingCall){
 const updateVisibility=()=>{
  const header=document.querySelector('.site-header');
  const visible=window.scrollY>(header?.offsetHeight??80)+24;
  floatingCall.classList.toggle('is-visible',visible);
  floatingCall.tabIndex=visible?0:-1;
  floatingCall.setAttribute('aria-hidden',String(!visible));
 };
 window.addEventListener('scroll',updateVisibility,{passive:true});
 window.addEventListener('resize',updateVisibility);
 window.addEventListener('pageshow',updateVisibility);
 document.addEventListener('site-nav-ready',updateVisibility);
 updateVisibility();
}
