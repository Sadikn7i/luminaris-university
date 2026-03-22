/* ════════════════════════════════════════════
   ADMISSIONS PAGE JS
   Connected to backend API
   ════════════════════════════════════════════ */

const API = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  initTabSwitcher();
  initQuickEnquiryForm();
});

/* ── Tab Switcher ── */
function initTabSwitcher() {
  document.querySelectorAll('.req-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.req-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.req-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab)?.classList.add('active');
    });
  });
}

/* ── Quick Enquiry Form → Backend ── */
function initQuickEnquiryForm() {
  const form = document.querySelector('.quick-form');
  if (!form) return;

  const btn = form.querySelector('button');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const inputs  = form.querySelectorAll('input');
    const selects = form.querySelectorAll('select');

    const name    = inputs[0]?.value.trim();
    const email   = inputs[1]?.value.trim();
    const program = selects[0]?.value;
    const level   = selects[1]?.value;

    // Validate
    if (!name || !email) {
      showMsg(form, 'error', 'Please enter your name and email.');
      return;
    }
    if (!program || program.includes('Select')) {
      showMsg(form, 'error', 'Please select a faculty.');
      return;
    }
    if (!level || level.includes('Select')) {
      showMsg(form, 'error', 'Please select a study level.');
      return;
    }

    // Split name
    const parts     = name.split(' ');
    const firstName = parts[0];
    const lastName  = parts.slice(1).join(' ') || 'N/A';

    // Loading
    const originalText  = btn.textContent;
    btn.textContent     = 'Sending...';
    btn.disabled        = true;

    try {
      const res = await fetch(`${API}/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          department: 'Admissions',
          subject:    `Program Enquiry: ${program} (${level})`,
          message:    `I am interested in the ${program} program at ${level} level. Please send me more information.`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        btn.textContent      = '✓ Sent!';
        btn.style.background = '#4cc982';
        showMsg(form, 'success', 'Enquiry sent! We will contact you within one business day.');
        form.querySelectorAll('input').forEach(i => i.value = '');
        form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
        setTimeout(() => {
          btn.textContent      = originalText;
          btn.style.background = '';
          btn.disabled         = false;
        }, 4000);
      } else {
        showMsg(form, 'error', data.message || 'Something went wrong.');
        btn.textContent = originalText;
        btn.disabled    = false;
      }

    } catch (err) {
      showMsg(form, 'error', 'Could not connect to server. Please try again.');
      btn.textContent = originalText;
      btn.disabled    = false;
    }
  });
}

/* ── Show Message ── */
function showMsg(container, type, message) {
  container.querySelectorAll('.form-message').forEach(m => m.remove());
  const div = document.createElement('div');
  div.className = 'form-message';
  div.textContent = (type === 'success' ? '✓ ' : '⚠ ') + message;
  div.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-top: 12px;
    background: ${type === 'success' ? 'rgba(76,201,130,0.12)' : 'rgba(201,76,76,0.12)'};
    border: 1px solid ${type === 'success' ? 'rgba(76,201,130,0.4)' : 'rgba(201,76,76,0.4)'};
    color: ${type === 'success' ? '#4cc982' : '#c94c4c'};
  `;
  container.appendChild(div);
}