/**
 * Cognita Virtual Agency — script.js
 * All interactive functionality for the Cognita landing page.
 *
 * NOTE (CSS reference): The nav active state `.active-nav` uses `color: #00e5ff` in CSS —
 * the class is added dynamically by this script via IntersectionObserver.
 *
 * No dependencies. Vanilla JS (ES2020+). Null-safe throughout.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Custom Cursor Follower (desktop only)
  // ─────────────────────────────────────────────────────────────────────────────
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (window.matchMedia('(hover: hover)').matches && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let hasMoved = false;

    // Start invisible until mouse enters window
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
    cursorDot.style.transition  = 'opacity 0.3s ease';
    cursorRing.style.transition = 'opacity 0.3s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        ringX = mouseX;
        ringY = mouseY;
        cursorDot.style.opacity  = '1';
        cursorRing.style.opacity = '1';
        hasMoved = true;
      }

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow with lerp
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Scale up ring on interactive elements via event delegation
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .talent-card, .bento-cell, .accordion-trigger, .radio-option, .checkbox-option, .service-item, .project-card')) {
        cursorRing.style.width       = '48px';
        cursorRing.style.height      = '48px';
        cursorRing.style.borderColor = '#00e5ff';
        cursorRing.style.boxShadow   = '0 0 15px rgba(0, 229, 255, 0.4)';
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .talent-card, .bento-cell, .accordion-trigger, .radio-option, .checkbox-option, .service-item, .project-card')) {
        cursorRing.style.width       = '28px';
        cursorRing.style.height      = '28px';
        cursorRing.style.borderColor = 'rgba(0, 229, 255, 0.5)';
        cursorRing.style.boxShadow   = 'none';
      }
    });
  }


  // ─────────────────────────────────────────────────────────────────────────────
  // 2. HUD Live Clock
  // ─────────────────────────────────────────────────────────────────────────────
  const hudTime = document.getElementById('hud-time');

  function updateHudClock() {
    if (!hudTime) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    hudTime.textContent = `${h}:${m}:${s}`;
  }
  updateHudClock();
  setInterval(updateHudClock, 1000);


  // ─────────────────────────────────────────────────────────────────────────────
  // 3. 3D Mouse Tilt (Hero Logo & News Article Preview)
  // ─────────────────────────────────────────────────────────────────────────────
  const tiltContainers = document.querySelectorAll('#hero-logo-frame, .project-card');

  tiltContainers.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;

    container.addEventListener('mousemove', e => {
      const rect    = container.getBoundingClientRect();
      const x       = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y       = (e.clientY - rect.top)   / rect.height - 0.5;
      const rotateY = x * 12;
      const rotateX = -y * 8;
      img.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      container.style.boxShadow = `${rotateY * -1.5}px ${rotateX * 1.5}px 40px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.15)`;
    });

    container.addEventListener('mouseleave', () => {
      img.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
      container.style.boxShadow = '';
    });
  });


  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Mobile Navigation
  // ─────────────────────────────────────────────────────────────────────────────
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileNav   = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }


  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Smooth Scroll-Reveal (IntersectionObserver)
  // ─────────────────────────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.reveal, .fade-in, .slide-in-left, .bounce-in, .talent-card, .bento-cell, .accordion-item, .service-item, .process-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    if (!el.classList.contains('visible')) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(30px)';
      el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${(i % 3) * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${(i % 3) * 0.08}s`;
    }
    revealObserver.observe(el);
  });


  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Talent Card Decrypt Interaction
  // ─────────────────────────────────────────────────────────────────────────────
  const decryptBtns = document.querySelectorAll('.btn-decrypt');
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?/\\[]{}';

  function glitchText(element, finalText, duration = 600) {
    return new Promise(resolve => {
      const start = Date.now();
      const interval = setInterval(() => {
        const progress = (Date.now() - start) / duration;
        if (progress >= 1) {
          element.textContent = finalText;
          clearInterval(interval);
          resolve();
          return;
        }
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === ' ') { result += ' '; continue; }
          if (Math.random() < progress) {
            result += finalText[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        element.textContent = result;
      }, 40);
    });
  }

  decryptBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const target   = btn.dataset.target;
      const locked   = document.getElementById(`locked-${target}`);
      const revealed = document.getElementById(`revealed-${target}`);

      if (btn.classList.contains('decrypted')) return;
      if (!locked || !revealed) return;

      const codenamePara = locked.querySelector('.talent-codename');
      const specPara     = locked.querySelector('.talent-spec');

      btn.textContent = 'DECRYPTING...';
      btn.disabled    = true;

      // Animate locked text with glitch effect
      if (codenamePara) await glitchText(codenamePara, 'ACCESSING...', 300);
      if (specPara)     await glitchText(specPara, 'DECRYPTING DOSSIER', 400);

      // Brief pause before reveal
      await new Promise(r => setTimeout(r, 600));

      locked.style.display        = 'none';
      revealed.style.display      = 'flex';
      revealed.style.flexDirection = 'column';
      revealed.style.alignItems   = 'center';
      revealed.style.gap          = '8px';
      revealed.style.animation    = 'glitchReveal 0.4s steps(2) forwards';

      btn.textContent = '[ DECRYPTED ]';
      btn.classList.add('decrypted');
      btn.disabled = false;

      // Trigger stat bar animation
      const statFill = revealed.querySelector('.stat-fill');
      if (statFill) {
        statFill.style.width = '0%';
        setTimeout(() => {
          statFill.style.width =
            statFill.style.getPropertyValue('--fill') ||
            statFill.style.cssText.match(/--fill:\s*([^;]+)/)?.[1] ||
            '80%';
          statFill.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)';
        }, 100);
      }
    });
  });


  // ─────────────────────────────────────────────────────────────────────────────
  // 7. Accordion
  // ─────────────────────────────────────────────────────────────────────────────
  const accTriggers = document.querySelectorAll('.accordion-trigger');

  accTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const accId  = trigger.dataset.acc;
      const body   = document.getElementById(`acc-${accId}`);
      const item   = trigger.closest('.accordion-item');
      const isOpen = item?.classList.contains('open');

      // Close all open accordion items
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const openBody = openItem.querySelector('.accordion-body');
        if (openBody) openBody.classList.remove('open');
      });

      // Open the clicked item if it was previously closed
      if (!isOpen) {
        item?.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });


  // ─────────────────────────────────────────────────────────────────────────────
  // 8. Modal Registration
  // ─────────────────────────────────────────────────────────────────────────────
  const modalOverlay    = document.getElementById('modal-overlay');
  const modalClose      = document.getElementById('modal-close');
  const modalForm       = document.getElementById('modal-form');
  const modalTransmit   = document.getElementById('modal-transmitting');
  const modalPass       = document.getElementById('modal-pass');
  const btnPassClose    = document.getElementById('btn-pass-close');

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    modalOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    // Reset to form state
    if (modalForm)    modalForm.style.display    = 'block';
    if (modalTransmit) modalTransmit.style.display = 'none';
    if (modalPass)    modalPass.style.display    = 'none';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open triggers — all elements with .open-modal class
  document.querySelectorAll('.open-modal').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  // Close button
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Click outside dialog
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Close pass card button
  if (btnPassClose) {
    btnPassClose.addEventListener('click', closeModal);
  }

  // Form submit
  if (modalForm) {
    modalForm.addEventListener('submit', async e => {
      e.preventDefault();

      // Field values
      const name    = document.getElementById('f-name')?.value.trim();
      const email   = document.getElementById('f-email')?.value.trim();
      const social  = document.getElementById('f-social')?.value.trim();
      const nda     = document.getElementById('f-nda')?.checked;
      const pathway = document.querySelector('input[name="pathway"]:checked')?.value;

      // Validation
      if (!pathway) { alert('Silakan pilih jalur pendaftaran.'); return; }
      if (!name)    { alert('Nama wajib diisi.'); return; }
      if (!email || !/\S+@\S+\.\S+/.test(email)) { alert('Email tidak valid.'); return; }
      if (!social)  { alert('Username Discord/X wajib diisi.'); return; }
      if (!nda)     { alert('Anda harus menyetujui Kontrak & NDA untuk melanjutkan.'); return; }

      // Show transmitting state
      modalForm.style.display    = 'none';
      if (modalTransmit) modalTransmit.style.display = 'block';

      // Simulate transmission (2.8 seconds)
      await new Promise(r => setTimeout(r, 2800));

      // Generate registration ID
      const regId        = `COG-GEN01-${Math.floor(1000 + Math.random() * 9000)}`;
      const pathwayLabel = pathway === 'talent' ? 'TALENT AUDITION' : 'BRAND / SPONSORSHIP';

      // Populate pass card
      const passName    = document.getElementById('pass-name');
      const passPathway = document.getElementById('pass-pathway');
      const passRegId   = document.getElementById('pass-regid');
      if (passName)    passName.textContent    = name.toUpperCase();
      if (passPathway) passPathway.textContent = pathwayLabel;
      if (passRegId)   passRegId.textContent   = regId;

      // Show pass card
      if (modalTransmit) modalTransmit.style.display = 'none';
      if (modalPass)     modalPass.style.display     = 'flex';

      // Reset form for next use
      modalForm.reset();
    });
  }


  // ─────────────────────────────────────────────────────────────────────────────
  // 9. Navbar Scroll Shrink
  // ─────────────────────────────────────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.style.padding           = '0';
      navbar.style.background        = 'rgba(10,14,20,0.97)';
      navbar.style.borderBottomColor = 'rgba(0,229,255,0.2)';
    } else {
      navbar.style.padding           = '';
      navbar.style.background        = 'rgba(10,14,20,0.88)';
      navbar.style.borderBottomColor = 'rgba(0,229,255,0.14)';
    }
  }, { passive: true });


  // ─────────────────────────────────────────────────────────────────────────────
  // 10. Active Nav Link on Scroll
  // ─────────────────────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('nav a, .mobile-nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));

}); // end DOMContentLoaded
