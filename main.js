/* ============================================
   BIZIWICK MVULA — PORTFOLIO SCRIPTS
   ============================================ */

/* ── CUSTOM CURSOR (desktop only) ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  // Hide cursor on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '6px';
      cursor.style.height = '6px';
      ring.style.width    = '50px';
      ring.style.height   = '50px';
      ring.style.borderColor = 'rgba(0,240,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      ring.style.width    = '36px';
      ring.style.height   = '36px';
      ring.style.borderColor = 'rgba(0,240,255,0.5)';
    });
  });
})();


/* ── HAMBURGER MENU ── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop   = document.getElementById('menuBackdrop');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  if (!hamburger || !mobileMenu || !backdrop) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Close when any mobile link is tapped
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();


/* ── PARTICLES ── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = [
    'hsl(180,100%,70%)',  // cyan
    'hsl(0,100%,70%)',    // pink
    'hsl(270,100%,70%)'   // purple
  ];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --drift: ${(Math.random() - 0.5) * 200}px;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * 3)]};
      animation-duration: ${6 + Math.random() * 12}s;
      animation-delay: ${-Math.random() * 15}s;
    `;
    container.appendChild(p);
  }
})();


/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.skill-card, .project-card, .stat-box, .contact-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
    observer.observe(el);
  });
})();


/* ── COUNTER ANIMATION ── */
(function initCounters() {
  function animateCounter(el, target, suffix) {
    let current = 0;
    const step  = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.stat-num').forEach(numEl => {
        const raw    = numEl.textContent.trim();
        if (raw === '∞') return;
        const num    = parseFloat(raw);
        const suffix = raw.replace(String(num), '');
        numEl.textContent = '0' + suffix;
        animateCounter(numEl, num, suffix);
      });
      statsObserver.unobserve(e.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stats-grid').forEach(g => statsObserver.observe(g));
})();


/* ── ACTIVE NAV LINK ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  function setActive(id) {
    desktopLinks.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + id ? 'var(--accent)' : '';
    });
    mobileLinks.forEach(l => {
      if (l.getAttribute('href') === '#' + id) {
        l.classList.add('active-mobile');
      } else {
        l.classList.remove('active-mobile');
      }
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setActive(e.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
