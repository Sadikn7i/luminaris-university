/* ════════════════════════════════════════════
   HOME PAGE JS
   Handles: hero parallax, program cards,
            news card entrance, hero typing
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initHeroMouseParallax();
  initHeroTyping();
  initProgramCardStagger();
  initNewsCardHover();
});

/* ── Hero Mouse Parallax ── */
function initHeroMouseParallax() {
  const hero  = document.querySelector('.hero');
  const bg    = document.querySelector('.hero-bg img');
  if (!hero || !bg) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', e => {
    const { innerWidth: w, innerHeight: h } = window;
    targetX = (e.clientX / w - 0.5) * 20;
    targetY = (e.clientY / h - 0.5) * 12;
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  (function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    bg.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.06)`;
    requestAnimationFrame(animate);
  })();
}

/* ── Hero Subtitle Typing Effect ── */
function initHeroTyping() {
  const el = document.querySelector('.hero-sub');
  if (!el) return;

  const lines = [
    'A legacy of excellence. A future of possibilities.',
    'Join 32,000 students shaping the world.',
    'Discover your extraordinary path forward.'
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const current = lines[lineIndex];

    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 2800);
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }

    setTimeout(type, deleting ? 40 : 65);
  }

  // Start after a short delay
  setTimeout(type, 1200);
}

/* ── Program Cards Stagger Reveal ── */
function initProgramCardStagger() {
  const cards = document.querySelectorAll('.program-card');
  cards.forEach((card, i) => {
    card.dataset.delay = i * 100;
  });
}

/* ── News Card 3D Hover ── */
function initNewsCardHover() {
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
      card.style.boxShadow = `${-x * 2}px ${y * 2}px 40px rgba(11,22,40,0.18)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}