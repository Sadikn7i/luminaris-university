/* ════════════════════════════════════════════
   CONTACT PAGE JS
   Connected to backend API
   ════════════════════════════════════════════ */

const API = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initContactForm();
  initFormFloatLabels();
});

/* ── FAQ Accordion ── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      items.forEach(i => {
        i.querySelector('.faq-question')?.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) { a.classList.remove('open'); a.style.maxHeight = null; }
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ── Contact Form → Backend ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get all fields
    const firstName  = form.querySelector('input[placeholder="John"]')?.value.trim();
    const lastName   = form.querySelector('input[placeholder="Smith"]')?.value.trim();
    const email      = form.querySelector('input[type="email"]')?.value.trim();
    const phone      = form.querySelector('input[type="tel"]')?.value.trim();
    const department = form.querySelector('select')?.value;
    const subject    = form.querySelector('input[placeholder="How can we help you?"]')?.value.trim();
    const message    = form.querySelector('textarea')?.value.trim();
    const consent    = form.querySelector('#consent')?.checked;

    // Validate
    if (!firstName || !lastName || !email || !subject || !message) {
      showFormError(form, 'Please fill in all required fields.');
      return;
    }
    if (!consent) {
      showFormError(form, 'Please agree to the privacy policy.');
      return;
    }

    // Loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent    = 'Sending...';
    btn.disabled       = true;
    btn.style.opacity  = '0.7';

    try {
      const res = await fetch(`${API}/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName,
          email, phone,
          department, subject, message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Success state
        btn.textContent      = '✓ Message Sent!';
        btn.style.background = '#4cc982';
        btn.style.color      = '#fff';
        btn.style.opacity    = '1';

        showFormSuccess(form, 'Your message has been sent! We will get back to you within one business day.');
        form.reset();

        setTimeout(() => {
          btn.textContent      = originalText;
          btn.style.background = '';
          btn.style.color      = '';
          btn.disabled         = false;
        }, 5000);

      } else {
        showFormError(form, data.message || 'Something went wrong. Please try again.');
        btn.textContent   = originalText;
        btn.disabled      = false;
        btn.style.opacity = '1';
      }

    } catch (error) {
      console.error('Contact form error:', error);
      showFormError(form, 'Could not connect to server. Please try again later.');
      btn.textContent   = originalText;
      btn.disabled      = false;
      btn.style.opacity = '1';
    }
  });
}

/* ── Helpers ── */
function showFormSuccess(form, message) {
  removeFormMessages(form);
  const div = document.createElement('div');
  div.className = 'form-message form-success';
  div.innerHTML = `✓ ${message}`;
  div.style.cssText = `
    padding: 16px 20px;
    background: rgba(76,201,130,0.12);
    border: 1px solid rgba(76,201,130,0.4);
    border-radius: 8px;
    color: #4cc982;
    font-size: 0.9rem;
    margin-top: 12px;
    line-height: 1.5;
  `;
  form.appendChild(div);
}

function showFormError(form, message) {
  removeFormMessages(form);
  const div = document.createElement('div');
  div.className = 'form-message form-error';
  div.innerHTML = `⚠ ${message}`;
  div.style.cssText = `
    padding: 16px 20px;
    background: rgba(201,76,76,0.12);
    border: 1px solid rgba(201,76,76,0.4);
    border-radius: 8px;
    color: #c94c4c;
    font-size: 0.9rem;
    margin-top: 12px;
    line-height: 1.5;
  `;
  form.appendChild(div);
  shakeForm(form);
}

function removeFormMessages(form) {
  form.querySelectorAll('.form-message').forEach(m => m.remove());
}

function shakeForm(form) {
  form.style.transform  = 'translateX(-8px)';
  setTimeout(() => { form.style.transform = 'translateX(8px)';  }, 80);
  setTimeout(() => { form.style.transform = 'translateX(-5px)'; }, 160);
  setTimeout(() => { form.style.transform = 'translateX(0)';    }, 240);
  form.style.transition = 'transform 0.15s ease';
}

function initFormFloatLabels() {
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => field.parentElement.classList.add('focused'));
    field.addEventListener('blur',  () => { if (!field.value) field.parentElement.classList.remove('focused'); });
  });
}