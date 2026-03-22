/* ════════════════════════════════════════════
   LUMINARIS UNIVERSITY — MAIN JS
   Handles: cursor, navbar, page transitions,
            mobile menu, footer
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initPageTransitions();
  injectFooter();
  injectNavbar();
});

/* ── Custom Cursor ── */
function initCursor() {
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth ring follow
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Grow on hover
  document.querySelectorAll('a, button, .hover-target').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('grow'); ring.classList.add('grow'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); ring.classList.remove('grow'); });
  });
}

/* ── Navbar ── */
function injectNavbar() {
  const pages = {
    'index.html':       'home',
    'about.html':       'about',
    'academics.html':   'academics',
    'admissions.html':  'admissions',
    'campus-life.html': 'campus-life',
    'research.html':    'research',
    'contact.html':     'contact',
  };
  const current = window.location.pathname.split('/').pop() || 'index.html';

  const nav = document.createElement('nav');
  nav.className = 'navbar transparent';
  nav.innerHTML = `
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-icon">L</div>
      Luminar<span>is</span>
    </a>
    <div class="nav-links">
      <a href="index.html"       ${current==='index.html'       ? 'class="active"':''}>Home</a>
      <a href="about.html"       ${current==='about.html'       ? 'class="active"':''}>About</a>
      <a href="academics.html"   ${current==='academics.html'   ? 'class="active"':''}>Academics</a>
      <a href="admissions.html"  ${current==='admissions.html'  ? 'class="active"':''}>Admissions</a>
      <a href="campus-life.html" ${current==='campus-life.html' ? 'class="active"':''}>Campus Life</a>
      <a href="research.html"    ${current==='research.html'    ? 'class="active"':''}>Research</a>
      <a href="contact.html"     ${current==='contact.html'     ? 'class="active"':''}>Contact</a>
      <a href="admissions.html" class="nav-cta">Apply Now</a>
    </div>
    <button class="nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  `;
  document.body.prepend(nav);

  // Mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav-mobile';
  mobileMenu.innerHTML = `
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="academics.html">Academics</a>
    <a href="admissions.html">Admissions</a>
    <a href="campus-life.html">Campus Life</a>
    <a href="research.html">Research</a>
    <a href="contact.html">Contact</a>
    <a href="admissions.html" class="mobile-cta">Apply Now</a>
  `;
  document.body.prepend(mobileMenu);
}

function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
    nav.classList.toggle('transparent', window.scrollY <= 60);
  });
}

function initMobileMenu() {
  document.addEventListener('click', e => {
    const btn  = e.target.closest('.nav-hamburger');
    const menu = document.querySelector('.nav-mobile');
    if (!btn || !menu) return;
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
}

/* ── Page Transitions ── */
function initPageTransitions() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // Intercept link clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;

    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 600);
  });

  // Exit animation on load
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('active');
    overlay.classList.add('exit');
    setTimeout(() => overlay.classList.remove('exit'), 700);
  });
}

/* ── Inject Footer ── */
function injectFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">Luminaris</div>
          <p>Shaping the minds of tomorrow through excellence in education, groundbreaking research, and a vibrant campus community since 1892.</p>
        </div>
        <div class="footer-col">
          <h5>Explore</h5>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="academics.html">Academics</a></li>
            <li><a href="research.html">Research</a></li>
            <li><a href="campus-life.html">Campus Life</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Admissions</h5>
          <ul>
            <li><a href="admissions.html">How to Apply</a></li>
            <li><a href="admissions.html">Requirements</a></li>
            <li><a href="admissions.html">Scholarships</a></li>
            <li><a href="admissions.html">Deadlines</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href="contact.html">Get in Touch</a></li>
            <li><a href="contact.html">Campus Map</a></li>
            <li><a href="#">Student Portal</a></li>
            <li><a href="#">Faculty Login</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Luminaris University. All rights reserved.</p>
        <div class="footer-socials">
          <a href="#">f</a>
          <a href="#">in</a>
          <a href="#">tw</a>
          <a href="#">yt</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}