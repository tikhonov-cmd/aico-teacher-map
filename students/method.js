/* Track the section being read without changing the URL or moving focus. */
(() => {
  const links = [...document.querySelectorAll('.a-method-index a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const desktop = matchMedia('(min-width: 761px)');
  if (!links.length || sections.some(section => !section)) return;
  let queued = false;
  function update() {
    queued = false;
    let active = -1;
    if (desktop.matches) {
      const readingLine = Math.min(120, innerHeight * .2);
      active = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= readingLine) active = index;
      });
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) active = sections.length - 1;
    }
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  desktop.addEventListener('change', schedule);
  // Expanding explanations and loading fonts can move section boundaries.
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.querySelector('.a-method-content'));
  update();
})();
