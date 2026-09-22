/* Shared site navigation.
   One source of truth for the utility bar, header and mobile menu on every page.
   Loaded as a plain (non-module) script directly after <div data-site-nav></div>
   so the header is in place before the rest of the page paints. */
(function () {
  var HOME = 'Home.dc.html';
  var PHONE_TEXT = '03 448 8899';
  var PHONE_HREF = 'tel:+6434488899';
  var MAP_HREF = 'https://www.google.com/maps?q=56+Tarbert+Street,+Alexandra+9320,+New+Zealand';

  /* Add a service here and it appears in the desktop dropdown and the mobile
     menu on every page. Leave off `href` while the page is still being built. */
  var SERVICES = [
    { title: 'CEREC same-day crowns', href: 'Service-CEREC-Crowns.dc.html' },
    { title: 'Root canal treatment', href: 'Service-Root-Canal.dc.html' },
    { title: 'Emergency treatment &amp; ACC' },
    { title: 'General dentistry' },
    { title: 'Hygiene' },
    { title: 'Dental implants' }
  ];

  var page = decodeURIComponent(location.pathname.split('/').pop() || '');
  if (!page || page === 'index.html') page = HOME;

  var onHome = page === HOME;
  var activeService = null;
  for (var i = 0; i < SERVICES.length; i++) {
    if (SERVICES[i].href === page) activeService = SERVICES[i];
  }

  /* Anchors live on the home page, so off-home pages need the file prefix. */
  function sectionHref(id) { return (onHome ? '' : HOME) + '#' + id; }
  function isCurrent(href) { return href === page; }
  function currentAttrs(href) {
    return isCurrent(href) ? ' class="is-active" aria-current="page"' : '';
  }
  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#' + name + '"></use></svg>';
  }

  var dropdownItems = SERVICES.map(function (service) {
    if (!service.href) {
      return '<span class="service-soon">' + service.title + ' <small>Soon</small></span>';
    }
    var current = isCurrent(service.href);
    return '<a href="' + service.href + '"' +
      (current ? ' class="is-current" aria-current="page"' : '') + '>' +
      service.title + (current ? ' <small>You are here</small>' : '') + '</a>';
  }).join('');

  var mobileServices = SERVICES.map(function (service) {
    if (!service.href) {
      return '<span class="mobile-sub is-soon">' + service.title + ' <small>Soon</small></span>';
    }
    var current = isCurrent(service.href);
    return '<a class="mobile-sub' + (current ? ' is-active' : '') + '" href="' + service.href + '"' +
      (current ? ' aria-current="page"' : '') + '>' + service.title + '</a>';
  }).join('');

  var markup =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="utility-bar">' +
      '<a href="' + PHONE_HREF + '">' + icon('phone') + '<span>' + PHONE_TEXT + '</span></a>' +
      '<span>' + icon('clock') + 'Mon–Fri 8:30am–5pm</span>' +
      '<a href="' + MAP_HREF + '" target="_blank" rel="noopener">' + icon('pin') + '56 Tarbert Street, Alexandra</a>' +
    '</div>' +
    '<header class="site-header" data-header>' +
      '<div class="nav-shell">' +
        '<a class="logo-link" href="' + HOME + '" aria-label="Tarbert Street Dental home">' +
          '<img src="assets/logo-new.png" alt="Tarbert Street Dental Surgery"></a>' +
        '<nav class="desktop-nav" aria-label="Primary navigation">' +
          '<a href="' + HOME + '"' + currentAttrs(HOME) + '>Home</a>' +
          '<div class="services-menu" data-services-menu>' +
            '<button type="button" class="services-trigger' + (activeService ? ' is-active' : '') + '"' +
              ' data-services-toggle aria-expanded="false" aria-haspopup="true" aria-controls="services-dropdown"' +
              (activeService ? ' aria-current="page"' : '') + '>' +
              'Services <span class="services-chevron" aria-hidden="true">⌄</span></button>' +
            '<div class="services-dropdown" id="services-dropdown" data-services-dropdown>' +
              dropdownItems +
              '<a class="services-all" href="' + sectionHref('services') + '">All services <b aria-hidden="true">→</b></a>' +
            '</div>' +
          '</div>' +
          '<a href="About.dc.html"' + currentAttrs('About.dc.html') + '>About</a>' +
          '<a href="' + sectionHref('faq') + '">FAQ</a>' +
        '</nav>' +
        '<div class="nav-actions">' +
          '<a class="phone-button" href="' + PHONE_HREF + '">' + icon('phone') + PHONE_TEXT + '</a>' +
          '<a class="round-action" href="' + sectionHref('book') + '" aria-label="Book an appointment">' + icon('calendar') + '</a>' +
          '<button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">' + icon('menu') + '</button>' +
        '</div>' +
      '</div>' +
      '<nav class="mobile-nav" id="mobile-nav" data-mobile-nav aria-label="Mobile navigation">' +
        '<a href="' + HOME + '"' + currentAttrs(HOME) + '>Home</a>' +
        '<p class="mobile-heading">Services</p>' +
        mobileServices +
        '<a class="mobile-sub" href="' + sectionHref('services') + '">All services</a>' +
        '<a href="About.dc.html"' + currentAttrs('About.dc.html') + '>About</a>' +
        '<a href="' + sectionHref('faq') + '">FAQ</a>' +
        '<a class="mobile-call" href="' + PHONE_HREF + '">Call ' + PHONE_TEXT + '</a>' +
      '</nav>' +
    '</header>';

  var mount = document.querySelector('[data-site-nav]');
  if (!mount) return;
  mount.outerHTML = markup;

  var header = document.querySelector('[data-header]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  var servicesMenu = document.querySelector('[data-services-menu]');
  var servicesToggle = document.querySelector('[data-services-toggle]');
  var servicesDropdown = document.querySelector('[data-services-dropdown]');

  function setServices(open) {
    servicesDropdown.classList.toggle('open', open);
    servicesToggle.setAttribute('aria-expanded', String(open));
  }
  function setMobile(open) {
    mobileNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  servicesToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    setServices(!servicesDropdown.classList.contains('open'));
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-services-menu]')) setServices(false);
  });

  /* Keyboard users leaving the menu should close it too. */
  servicesMenu.addEventListener('focusout', function (event) {
    if (!servicesMenu.contains(event.relatedTarget)) setServices(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (servicesDropdown.classList.contains('open')) {
      setServices(false);
      servicesToggle.focus();
    }
    setMobile(false);
  });

  menuToggle.addEventListener('click', function () {
    setMobile(!mobileNav.classList.contains('open'));
  });

  mobileNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMobile(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1000) setMobile(false);
  });

  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
