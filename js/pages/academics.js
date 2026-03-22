/* ════════════════════════════════════════════
   ACADEMICS PAGE JS
   Handles: program search filter
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initProgramSearch();
  initFacultyHover();
});

/* ── Program Search ── */
function initProgramSearch() {
  const input  = document.getElementById('programSearch');
  const select = document.getElementById('levelFilter');
  const cards  = document.querySelectorAll('.faculty-card');

  if (!input || !cards.length) return;

  const keywords = {
    undergraduate: ['computer science','civil','physics','chemistry','mba','finance','marketing',
                    'philosophy','fine arts','medicine','nursing','law','psychology','data science'],
    postgraduate:  ['mba','finance','international law','public health','data science',
                    'artificial intelligence','climate policy','education policy'],
    phd:           ['research','quantum','biomedical','climate','ai','machine learning','physics']
  };

  function filterCards() {
    const query = input.value.toLowerCase().trim();
    const level = select.value;

    cards.forEach(card => {
      const text    = card.innerText.toLowerCase();
      const matchQ  = !query || text.includes(query);
      const matchL  = !level || (keywords[level] || []).some(k => text.includes(k));
      const visible = matchQ && matchL;

      card.style.transition = 'opacity 0.4s, transform 0.4s';
      if (visible) {
        card.style.opacity   = '1';
        card.style.transform = 'scale(1)';
        card.style.display   = '';
      } else {
        card.style.opacity   = '0.25';
        card.style.transform = 'scale(0.97)';
      }
    });
  }

  input.addEventListener('input', filterCards);
  select.addEventListener('change', filterCards);
}

/* ── Faculty Card Hover Depth ── */
function initFacultyHover() {
  document.querySelectorAll('.faculty-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}