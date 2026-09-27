/* Scroll-reveal animations and the hero scroll cue.
   Loaded as a plain script in <head> so the .js-reveal flag is set before the
   first paint and nothing flashes in before the observer takes over. Content
   added later by the page scripts is picked up automatically, so a section
   only needs data-reveal="up|down|left|right|zoom|flip|fade" in its markup.

   Optional attributes:
     data-reveal-delay="200"    milliseconds before this element animates
     data-reveal-stagger="110"  on a PARENT: delay each revealing child in turn
     data-count-up              count a whole number up from zero on reveal */
(() => {
  const root = document.documentElement;
  const supported = 'IntersectionObserver' in window;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The cue is only shown when this script can also take it away again.
  root.classList.add('js-cue');
  // Hidden start states apply only when something is there to reveal them.
  if (supported && !reduced) root.classList.add('js-reveal');

  // High enough for the ten-item service list to stagger fully.
  const MAX_DELAY = 1800;

  const countUp = element => {
    const target = Number(element.textContent.trim());
    if (!Number.isInteger(target) || target < 2 || target > 10000) return;
    const duration = 1400;
    const started = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = String(target);
    };
    requestAnimationFrame(step);
  };

  const setUpReveals = () => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-count-up')) countUp(entry.target);
      }
    }, {rootMargin: '0px 0px -8% 0px'});

    const register = element => {
      if (element.dataset.revealReady) return;
      element.dataset.revealReady = '1';
      let delay = Number(element.dataset.revealDelay);
      if (!Number.isFinite(delay)) {
        const parent = element.parentElement;
        const step = Number(parent?.dataset.revealStagger);
        delay = Number.isFinite(step) && step > 0
          ? [...parent.children].filter(child => child.hasAttribute('data-reveal')).indexOf(element) * step
          : 0;
      }
      if (delay > 0) element.style.setProperty('--reveal-delay', `${Math.min(delay, MAX_DELAY)}ms`);
      observer.observe(element);
    };

    const scan = node => {
      if (node.nodeType !== 1) return;
      if (node.matches('[data-reveal]')) register(node);
      node.querySelectorAll('[data-reveal]').forEach(register);
    };

    scan(document.body);
    // Services, staff and service-page sections are rendered after this runs.
    new MutationObserver(records => {
      for (const record of records) record.addedNodes.forEach(scan);
    }).observe(document.body, {childList: true, subtree: true});
  };

  const setUpCue = () => {
    const cue = document.querySelector('.scroll-cue');
    if (!cue) return;
    const update = () => cue.classList.toggle('is-gone', scrollY > 140);
    addEventListener('scroll', update, {passive: true});
    update();
  };

  const start = () => {
    if (root.classList.contains('js-reveal')) setUpReveals();
    setUpCue();
  };

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
})();
