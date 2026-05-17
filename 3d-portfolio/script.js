/* Premium portfolio interactions: mobile nav, smooth reveal, modal project details, skill bar animation, contact UX */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navbar toggle
  const toggleBtn = $('.nav-toggle');
  const navMenu = $('#navMenu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    $$('.nav-link', navMenu).forEach((a) => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!navMenu.classList.contains('is-open')) return;
      if (navMenu.contains(target) || toggleBtn.contains(target)) return;
      navMenu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const hasReveal = revealEls.length > 0;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18 }
  );

  if (hasReveal) {
    revealEls.forEach((el) => io.observe(el));
  }

  // If no elements have .reveal (current markup), we still add reveal class to safe selectors.
  // This keeps the CSS/JS cohesive without changing HTML too much.
  const candidateSelectors = [
    '.glass.card',
    '.project-card',
    '.service-card',
    '.contact-grid > *',
    '.stat',
    '.skill'
  ];

  const candidates = candidateSelectors.flatMap((s) => $$(s));
  candidates.forEach((el) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    if (!el.classList.contains('is-visible')) io.observe(el);
  });

  // Skill bars animate
  const bars = $$('.bar-fill');
  const animateBars = () => {
    bars.forEach((bar) => {
      const val = Number(bar.dataset.val || '0');
      if (!Number.isFinite(val)) return;
      bar.style.width = val + '%';
    });
  };

  const barWrap = $('#skills');
  if (barWrap && 'IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animateBars();
          barObserver.disconnect();
        }
      },
      { threshold: 0.22 }
    );
    barObserver.observe(barWrap);
  } else {
    animateBars();
  }

  // Project modal
  const modal = $('#projectModal');
  const modalBody = $('#modalBody');
  const modalClose = $$('[data-close="true"]', document);

  const projectCopy = {
    hrms: {
      title: 'Human Resource Management System (HRMS)',
      body:
        '<p><strong>Tech:</strong> PHP • MySQL • Responsive UI</p>' +
        '<ul style="margin:10px 0 0;padding-left:18px;">' +
        '<li>Employee record management</li>' +
        '<li>Attendance tracking</li>' +
        '<li>Payroll workflows</li>' +
        '<li>Admin panel integration</li>' +
        '</ul>'
    },
    hospital: {
      title: 'Hospital Management System',
      body:
        '<p><strong>Tech:</strong> PHP • MySQL • Clean UX</p>' +
        '<ul style="margin:10px 0 0;padding-left:18px;">' +
        '<li>Patient record management</li>' +
        '<li>Appointment scheduling</li>' +
        '<li>Billing &amp; record updates</li>' +
        '</ul>'
    },
    cotton: {
      title: 'AI Cotton Disease Detection System',
      body:
        '<p><strong>Tech:</strong> Image processing • ML basics</p>' +
        '<ul style="margin:10px 0 0;padding-left:18px;">' +
        '<li>Image-based disease detection</li>' +
        '<li>Basic ML concepts &amp; preprocessing</li>' +
        '<li>Focused on practical accuracy improvements</li>' +
        '</ul>'
    },
    elearning: {
      title: 'E-Learning Course Management System',
      body:
        '<p><strong>Tech:</strong> PHP • MySQL</p>' +
        '<ul style="margin:10px 0 0;padding-left:18px;">' +
        '<li>Course and content management</li>' +
        '<li>User workflows</li>' +
        '<li>Database-driven platform</li>' +
        '</ul>'
    },
    afacere: {
      title: 'Afacere Solutions Project',
      body:
        '<p><strong>Tech:</strong> PHP • JavaScript</p>' +
        '<ul style="margin:10px 0 0;padding-left:18px;">' +
        '<li>UI improvements</li>' +
        '<li>Form validation enhancements</li>' +
        '<li>Bug fixes and feature maintenance</li>' +
        '</ul>'
    },
    ourdigital: {
      title: 'OurDigital Project',
      body:
        '<p><strong>Tech:</strong> HTML • CSS • JavaScript</p>' +
        '<ul style="margin:10px 0 0;padding-left:18px;">' +
        '<li>Responsive website design</li>' +
        '<li>Optimized UI &amp; functionality</li>' +
        '<li>Interactive frontend improvements</li>' +
        '</ul>'
    }
  };

  function openModal(key) {
    if (!modal || !modalBody) return;
    const p = projectCopy[key] || { title: 'Project', body: '<p>No details available.</p>' };
    modalBody.innerHTML =
      '<p style="margin:0 0 8px; color:rgba(255,255,255,.92); font-weight:900; font-family:\"Space Grotesk\";">' +
      p.title +
      '</p>' +
      p.body;

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = $('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Detail buttons
  $$('button[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });

  // Close handlers
  modalClose.forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (modal) {
    const backdrop = $('.modal-backdrop', modal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

  // Contact form UX (client-side validation + message note)
  const form = $('#contactForm');
  const note = $('#formNote');

  function setNote(msg, kind) {
    if (!note) return;
    note.textContent = msg;
    note.style.color = kind === 'ok' ? 'rgba(34,197,94,.95)' : kind === 'bad' ? 'rgba(239,68,68,.95)' : 'rgba(255,255,255,.72)';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.elements['name']?.value?.trim();
      const email = form.elements['email']?.value?.trim();
      const message = form.elements['message']?.value?.trim();

      if (!name || !email || !message) {
        setNote('Please fill all fields.', 'bad');
        return;
      }

      // Simple email pattern
      const emailOk = /^\S+@\S+\.\S+$/.test(email);
      if (!emailOk) {
        setNote('Please enter a valid email address.', 'bad');
        return;
      }

      setNote('Message queued locally (demo). Connect form backend to send messages.', 'ok');
      form.reset();
    });
  }
})();

