document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.querySelector('.messages');
  if (messageBox) window.setTimeout(() => messageBox.classList.add('messages-hidden'), 4500);

  const menuToggle = document.querySelector('#menu-toggle');
  const siteMenu = document.querySelector('#site-menu');
  const closeMenu = () => {
    if (!menuToggle || !siteMenu) return;
    siteMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      siteMenu.hidden = isOpen;
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    });
    siteMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!siteMenu.hidden && !siteMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const sectionLinks = [...document.querySelectorAll('.side-item')];
  if ('IntersectionObserver' in window && sectionLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          link.classList.toggle('active', link.hash === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    document.querySelectorAll('.lab-section').forEach((section) => sectionObserver.observe(section));
  }
});

