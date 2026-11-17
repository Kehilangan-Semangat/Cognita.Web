/**
 * Cognita Virtual Agency — script.js
 * Hardware-Optimized Animations via GSAP 3.12.2 + ScrollTrigger & Vanilla-Tilt.js
 *
 * Core Modules:
 * 1. Hero Animation (GSAP Timeline)
 * 2. Scroll Reveal (GSAP ScrollTrigger — play once, hardware optimized)
 * 3. 3D Hover Effect (Vanilla-Tilt.js)
 * 4. Accordion Logic (.requirement-item toggle .active via CSS Grid)
 * 5. Talent Vault Decryption (Cyber Glitch & Stat Fill)
 * 6. Initiate Dialogue Modal & Digital Candidate Pass Card
 * 7. Live Broadcast HUD Clock & Sticky Navbar
 * 8. Custom Smooth Cursor Follower (Desktop only)
 * 9. Mobile Navigation Drawer
 */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP ScrollTrigger plugin
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================================================
     1. Hero Section Animation (gsap.timeline)
     ========================================================================== */
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({
      delay: 0.8, // Smooth entrance starting as loading screen fades
      defaults: { ease: 'power3.out' }
    });

    heroTl
      .from('.hero-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        clearProps: 'all'
      })
      .from('.image-frame', {
        scale: 0.88,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.4)',
        clearProps: 'opacity' // keep VanillaTilt compatibility
      }, '-=0.7');
  }


  /* ==========================================================================
     2. Hardware-Optimized Scroll Reveal (GSAP ScrollTrigger)
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    // Card containers: animate child items staggered as container enters viewport
    const containerMappings = [
      { container: '.services-editorial-grid', items: '.service-item' },
      { container: '.projects-editorial-list', items: '.project-card' },
      { container: '.process-editorial-grid', items: '.process-card' },
      { container: '.talents-grid', items: '.talent-card' },
      { container: '.accordion', items: '.requirement-item' },
      { container: '.bento-grid', items: '.bento-cell' }
    ];

    containerMappings.forEach(({ container, items }) => {
      const parentEl = document.querySelector(container);
      if (parentEl) {
        const itemEls = parentEl.querySelectorAll(items);
        if (itemEls.length > 0) {
          gsap.from(itemEls, {
            scrollTrigger: {
              trigger: parentEl,
              start: 'top 92%',
              once: true // Play once and disconnect to conserve CPU/memory
            },
            y: 35,
            opacity: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'all' // Clean inline styles completely so hover/tilt works cleanly
          });
        }
      }
    });

    // Section headers & editorial lead text
    gsap.utils.toArray('section:not(.hero)').forEach(section => {
      const headers = section.querySelectorAll('.editorial-header, .hybrid-statement');
      if (headers.length > 0) {
        gsap.from(headers, {
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            once: true
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }

      const introTexts = section.querySelectorAll('.talents-intro, .about-lead, .about-text, .cta-inner > *');
      if (introTexts.length > 0) {
        gsap.from(introTexts, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true
          },
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    });

    // Ensure all coordinate measurements refresh once images and fonts are loaded
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }


  /* ==========================================================================
     3. 3D Hover Effect (Vanilla-Tilt.js — Desktop Only via Media Query)
     ========================================================================== */
  if (typeof VanillaTilt !== 'undefined') {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      VanillaTilt.init(document.querySelectorAll(".image-frame, .talent-card, .project-card"), {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02
      });
    }
  }


  /* ==========================================================================
     4. Accordion Logic (.requirement-item toggle .active via CSS Grid)
     ========================================================================== */
  const requirementItems = document.querySelectorAll('.requirement-item');

  requirementItems.forEach(item => {
    const trigger = item.querySelector('.requirement-header') || item.querySelector('.accordion-trigger') || item;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = item.classList.contains('active');

      // Close all other items (ensure only one tab is open at a time)
      requirementItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.classList.remove('open');
          const btn = otherItem.querySelector('button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current tab
      if (isActive) {
        item.classList.remove('active');
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ==========================================================================
     5. Talent Vault Decryption (Cyber Glitch & Stat Animation)
     ========================================================================== */
  const decryptBtns = document.querySelectorAll('.btn-decrypt');
  const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?/\\[]{}<>';

  function glitchText(element, finalText, duration = 500) {
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
          result += Math.random() < progress
            ? finalText[i]
            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        element.textContent = result;
      }, 35);
    });
  }

  decryptBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('decrypted') || btn.disabled) return;

      const target   = btn.dataset.target;
      const locked   = document.getElementById(`locked-${target}`);
      const revealed = document.getElementById(`revealed-${target}`);
      if (!locked || !revealed) return;

      btn.textContent = 'DECRYPTING...';
      btn.disabled    = true;

      const codeEl = locked.querySelector('.talent-codename');
      const specEl = locked.querySelector('.talent-spec');

      if (codeEl) await glitchText(codeEl, 'ACCESSING...', 300);
      if (specEl) await glitchText(specEl, 'DECODING DOSSIER...', 400);

      await new Promise(r => setTimeout(r, 400));

      locked.style.display        = 'none';
      revealed.style.display      = 'flex';
      revealed.style.flexDirection = 'column';
      revealed.style.alignItems   = 'center';
      revealed.style.gap          = '8px';
      revealed.style.animation    = 'glitchReveal 0.4s steps(2) forwards';

      btn.textContent = '[ DECRYPTED ]';
      btn.classList.add('decrypted');
      btn.disabled = false;

      // Dynamic stat bar fill animation
      const statFill = revealed.querySelector('.stat-fill');
      if (statFill) {
        const targetWidth = getComputedStyle(statFill).getPropertyValue('--fill').trim() ||
                            statFill.style.getPropertyValue('--fill') ||
                            statFill.style.cssText.match(/--fill:\s*([^;]+)/)?.[1] ||
                            '85%';
        statFill.style.width = '0%';
        statFill.style.transition = 'none';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            statFill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
            statFill.style.width      = targetWidth;
          });
        });
      }
    });
  });


  /* ==========================================================================
     6. Modal Pendaftaran & Digital Candidate Pass Card
     ========================================================================== */
  const modalOverlay  = document.getElementById('modal-overlay');
  const modalClose    = document.getElementById('modal-close');
  const modalForm     = document.getElementById('modal-form');
  const modalTransmit = document.getElementById('modal-transmitting');
  const modalPass     = document.getElementById('modal-pass');
  const btnPassClose  = document.getElementById('btn-pass-close');

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    modalOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    // Reset modal view states
    if (modalForm)     modalForm.style.display     = 'block';
    if (modalTransmit) modalTransmit.style.display = 'none';
    if (modalPass)     modalPass.style.display     = 'none';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all triggers with .open-modal
  document.querySelectorAll('.open-modal').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (btnPassClose) btnPassClose.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Modal Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', async e => {
      e.preventDefault();

      const name    = document.getElementById('f-name')?.value.trim();
      const email   = document.getElementById('f-email')?.value.trim();
      const social  = document.getElementById('f-social')?.value.trim();
      const nda     = document.getElementById('f-nda')?.checked;
      const pathway = document.querySelector('input[name="pathway"]:checked')?.value;

      if (!pathway) { alert('Silakan pilih jalur pendaftaran.'); return; }
      if (!name)    { alert('Nama wajib diisi.'); return; }
      if (!email || !/\S+@\S+\.\S+/.test(email)) { alert('Format email tidak valid.'); return; }
      if (!social)  { alert('Username Discord / X wajib diisi.'); return; }
      if (!nda)     { alert('Anda harus menyetujui Kontrak & NDA untuk melanjutkan.'); return; }

      // Show transmitting state
      modalForm.style.display = 'none';
      if (modalTransmit) modalTransmit.style.display = 'block';

      // Simulated network handshake (2.5 seconds)
      await new Promise(r => setTimeout(r, 2500));

      // Generate registration identification
      const regId        = `COG-GEN01-${Math.floor(1000 + Math.random() * 9000)}`;
      const pathwayLabel = pathway === 'talent' ? 'TALENT AUDITION' : 'BRAND / SPONSORSHIP';

      const passName    = document.getElementById('pass-name');
      const passPathway = document.getElementById('pass-pathway');
      const passRegId   = document.getElementById('pass-regid');

      if (passName)    passName.textContent    = name.toUpperCase();
      if (passPathway) passPathway.textContent = pathwayLabel;
      if (passRegId)   passRegId.textContent   = regId;

      if (modalTransmit) modalTransmit.style.display = 'none';
      if (modalPass)     modalPass.style.display     = 'flex';

      modalForm.reset();
    });
  }


  /* ==========================================================================
     7. Live Broadcast HUD Clock & Sticky Navbar
     ========================================================================== */
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

  // Sticky Navbar background blur & shadow on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.style.background        = 'rgba(10, 14, 20, 0.97)';
      navbar.style.borderBottomColor = 'rgba(0, 229, 255, 0.22)';
      navbar.style.boxShadow         = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background        = 'rgba(10, 14, 20, 0.88)';
      navbar.style.borderBottomColor = 'rgba(0, 229, 255, 0.14)';
      navbar.style.boxShadow         = 'none';
    }
  }, { passive: true });


  /* ==========================================================================
     8. Custom Smooth Cursor Follower (Desktop Only)
     ========================================================================== */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (window.matchMedia('(hover: hover)').matches && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let hasMoved = false;

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

    // Lerp animation loop
    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Scale ring on interactive elements
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .talent-card, .bento-cell, .requirement-item, .accordion-trigger, .radio-option, .checkbox-option, .service-item, .project-card')) {
        cursorRing.style.width       = '48px';
        cursorRing.style.height      = '48px';
        cursorRing.style.borderColor = '#00e5ff';
        cursorRing.style.boxShadow   = '0 0 15px rgba(0, 229, 255, 0.4)';
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .talent-card, .bento-cell, .requirement-item, .accordion-trigger, .radio-option, .checkbox-option, .service-item, .project-card')) {
        cursorRing.style.width       = '28px';
        cursorRing.style.height      = '28px';
        cursorRing.style.borderColor = 'rgba(0, 229, 255, 0.5)';
        cursorRing.style.boxShadow   = 'none';
      }
    });
  }


  /* ==========================================================================
     9. Mobile Navigation Drawer
     ========================================================================== */
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileNav   = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });

    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }

}); // end DOMContentLoaded
