/**
 * AcademEase Website — Main JavaScript
 * Handles: sticky header, mobile menu, tech tabs/accordion,
 * scroll reveal animations, smooth scroll, form validation & success states
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. STICKY HEADER — add shadow class on scroll
     ============================================================ */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  /* ============================================================
     2. MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking a mobile nav link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ============================================================
     3. ACTIVE NAV LINK on scroll (home page anchors)
     ============================================================ */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && navLinks.length) {
    const observerOptions = {
      rootMargin: '-40% 0px -55% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ============================================================
     4. TECHNOLOGY SECTION — TABBED DISPLAY (desktop)
     ============================================================ */
  const techTabBtns = document.querySelectorAll('.tech-tab-btn');
  const techPanels  = document.querySelectorAll('.tech-panel');

  if (techTabBtns.length && techPanels.length) {
    techTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Update buttons
        techTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Update panels
        techPanels.forEach(panel => {
          panel.classList.remove('active');
          panel.setAttribute('aria-hidden', 'true');
        });
        const activePanel = document.querySelector(`.tech-panel[data-panel="${target}"]`);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  /* ============================================================
     5. TECHNOLOGY SECTION — ACCORDION (mobile)
     ============================================================ */
  const accordionHeaders = document.querySelectorAll('.tech-accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.classList.contains('open');
      const body   = header.nextElementSibling;

      // Close all
      accordionHeaders.forEach(h => {
        h.classList.remove('open');
        h.setAttribute('aria-expanded', 'false');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      // Toggle clicked (open if was closed)
      if (!isOpen) {
        header.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        if (body) body.classList.add('open');
      }
    });
  });

  // Open first accordion item by default
  const firstAccordion = document.querySelector('.tech-accordion-header');
  if (firstAccordion) {
    firstAccordion.click();
  }

  /* ============================================================
     6. SCROLL REVEAL ANIMATIONS
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ============================================================
     7. SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* ============================================================
     8. CONTACT FORM — Validation & Submission (Home page)
     ============================================================ */
  const mainForm = document.getElementById('main-contact-form');
  if (mainForm) {
    mainForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(mainForm)) return;

      const submitBtn = mainForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const data = new FormData(mainForm);
        const response = await fetch(mainForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showFormSuccess(mainForm);
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          showFormError(mainForm, 'There was an issue submitting your message. Please try again or contact us directly.');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        showFormError(mainForm, 'Network error. Please check your connection and try again.');
      }
    });
  }

  /* ============================================================
     9. FAMILY CONTACT FORM — Validation & Submission
     ============================================================ */
  const familyForm = document.getElementById('family-contact-form');
  if (familyForm) {
    familyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(familyForm)) return;

      const submitBtn = familyForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const data = new FormData(familyForm);
        const response = await fetch(familyForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showFormSuccess(familyForm);
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          showFormError(familyForm, 'There was an issue submitting your message. Please try again.');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        showFormError(familyForm, 'Network error. Please check your connection and try again.');
      }
    });
  }

  /* ============================================================
     FORM HELPERS
     ============================================================ */

  /**
   * Validates all required fields in a form.
   * Adds error styling to invalid fields.
   * Returns true if valid, false otherwise.
   */
  function validateForm(form) {
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      const value = field.value.trim();
      let error = null;

      if (!value) {
        error = 'This field is required.';
      } else if (field.type === 'email' && !isValidEmail(value)) {
        error = 'Please enter a valid email address.';
      } else if (field.type === 'tel' && value.length > 0 && !isValidPhone(value)) {
        error = 'Please enter a valid phone number.';
      }

      if (error) {
        valid = false;
        field.classList.add('input-error');
        const msg = document.createElement('span');
        msg.className = 'field-error';
        msg.textContent = error;
        msg.style.cssText = 'display:block;font-size:0.8rem;color:#E53E3E;margin-top:4px;';
        field.parentNode.appendChild(msg);
      }
    });

    return valid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return phone.replace(/\D/g, '').length === 10;
  }

  function showFormSuccess(form) {
    const successEl = form.closest('.contact-form-wrap, .family-contact-wrap')
      ?.querySelector('.form-success');
    if (successEl) {
      form.style.display = 'none';
      successEl.classList.add('visible');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function showFormError(form, message) {
    let errorBanner = form.querySelector('.form-error-banner');
    if (!errorBanner) {
      errorBanner = document.createElement('div');
      errorBanner.className = 'form-error-banner';
      errorBanner.style.cssText = 'background:#FFF5F5;border:1.5px solid #FC8181;border-radius:8px;padding:14px 18px;margin-bottom:16px;font-size:0.9rem;color:#C53030;';
      form.prepend(errorBanner);
    }
    errorBanner.textContent = message;
  }

  /* ============================================================
     10. ADD CSS FOR INPUT ERROR STYLING (injected dynamically)
     ============================================================ */
  const errorStyle = document.createElement('style');
  errorStyle.textContent = `
    .input-error {
      border-color: #FC8181 !important;
      box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.2) !important;
    }
  `;
  document.head.appendChild(errorStyle);

  /* ============================================================
     11. PHONE NUMBER FORMATTING — US (xxx) xxx-xxxx, 10 digits max
     ============================================================ */
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const cursorPos = e.target.selectionStart;
      const oldVal = e.target.value;

      // Strip non-digits, cap at 10
      const digits = oldVal.replace(/\D/g, '').slice(0, 10);

      // Build formatted string
      let formatted = '';
      if (digits.length === 0) {
        formatted = '';
      } else if (digits.length <= 3) {
        formatted = `(${digits}`;
      } else if (digits.length <= 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }

      e.target.value = formatted;

      // Restore cursor: count digits before old cursor, place after same count in new string
      const digitsBeforeCursor = oldVal.slice(0, cursorPos).replace(/\D/g, '').length;
      let newCursor = 0;
      let counted = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) counted++;
        if (counted === digitsBeforeCursor) { newCursor = i + 1; break; }
      }
      if (digitsBeforeCursor === 0) newCursor = formatted.length === 0 ? 0 : 1;
      e.target.setSelectionRange(newCursor, newCursor);
    });
  });

});
