/* ════════════════════════════════════════════
   LUMINARIS UNIVERSITY — ANIMATIONS JS
   Handles: scroll reveal, counters,
            parallax, cursor re-init,
            progress bars, image lazy load
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initParallax();
  initCursorHoverTargets();
  initProgressBars();
  initSmoothAnchorLinks();
  initActiveNavLink();
});

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const selectors = [
    '.reveal',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale',
    '.overlay-reveal'
  ];

  const targets = document.querySelectorAll(selectors.join(', '));
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay) || 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  // Auto-stagger direct siblings
  targets.forEach((el, i) => {
    if (!el.dataset.delay) {
      const parent   = el.parentElement;
      const siblings = [...parent.children].filter(c =>
        selectors.some(s => c.matches(s.trim()))
      );
      const idx = siblings.indexOf(el);
      if (idx > 0) el.dataset.delay = String(idx * 110);
    }
    observer.observe(el);
  });
}

/* ── Animated Number Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el      = entry.target;
      const target  = parseInt(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const dur     = 2200;
      const start   = performance.now();

      function tick(now) {
        const elapsed  = Math.min(now - start, dur);
        const progress = elapsed / dur;
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

/* ── Parallax Scroll ── */
function initParallax() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    layers.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const rect   = el.closest('section')?.getBoundingClientRect();
      if (!rect) return;
      const offset = (scrollY - (scrollY + rect.top - window.innerHeight / 2)) * speed;
      el.style.transform = `translateY(${offset * 0.4}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ── Cursor Hover Targets ── */
function initCursorHoverTargets() {
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  document.querySelectorAll('a, button, input, select, textarea, .hover-target, .hover-lift, .card-glow').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('grow');
      ring.classList.add('grow');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('grow');
      ring.classList.remove('grow');
    });
  });
}

/* ── Progress Bars (for any page that uses them) ── */
function initProgressBars() {
  const bars = document.querySelectorAll('[data-progress]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar   = entry.target;
      const value = bar.dataset.progress || '0';
      setTimeout(() => {
        bar.style.width = value + '%';
      }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(bar);
  });
}

/* ── Smooth Anchor Scroll ── */
function initSmoothAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Active Nav Link Highlight ── */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    });
  }, {
    rootMargin: '-40% 0px -40% 0px'
  });

  sections.forEach(section => observer.observe(section));
}