/* ═══════════════════════════════════════════════════════════════
   CodeWithShahzad Portfolio — script.js
   Author: Muhammad Shahzad
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── DOM Ready ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initContactForm();
  initScrollToTop();
  initNavMobile();
  initSmoothScroll();
  initHeroMotion();
});


// ══════════════════════════════════════════════════════════════
// 1. NAVBAR — scroll state + active link highlight
// ══════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


// ══════════════════════════════════════════════════════════════
// 2. TYPING EFFECT
// ══════════════════════════════════════════════════════════════
function initTypingEffect() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const phrases = [
    'Fast WordPress Experiences',
    'Conversion-Focused WooCommerce Stores',
    'Zero-Downtime Migrations',
    'Cloud-Ready Websites',
    'Secure Client Platforms',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPausing   = false;

  const TYPE_SPEED   = 70;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 300;

  function tick() {
    if (isPausing) return;

    const current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      target.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        isPausing = true;
        setTimeout(() => {
          isPausing  = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isPausing = true;
        setTimeout(() => {
          isPausing   = false;
          isDeleting  = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          tick();
        }, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, 800);
}


// ══════════════════════════════════════════════════════════════
// 3. SCROLL REVEAL — Intersection Observer
// ══════════════════════════════════════════════════════════════
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const staggerIndex = siblings.indexOf(entry.target);
          const delay = Math.max(0, staggerIndex * 80);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════════════════════════
// 4. SKILL BARS — animate when in view
// ══════════════════════════════════════════════════════════════
function initSkillBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.getAttribute('data-width') || '0';
          // Small delay so the reveal animation settles first
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}


// ══════════════════════════════════════════════════════════════
// 5. ANIMATED COUNTERS
// ══════════════════════════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const DURATION = 2000; // ms

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const start     = performance.now();
    const startVal  = 0;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.round(startVal + (target - startVal) * eased);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════════════════════════
// 6. CONTACT FORM
// ══════════════════════════════════════════════════════════════
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn  = form.querySelector('[type="submit"]');
    const span = btn.querySelector('span');

    // Simulate sending
    btn.disabled  = true;
    span.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      span.textContent = 'Send Message';

      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1400);
  });

  // Live input focus effects (already handled by CSS :focus, but add aria)
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus',  () => el.parentElement.classList.add('focused'));
    el.addEventListener('blur',   () => el.parentElement.classList.remove('focused'));
  });
}


// ══════════════════════════════════════════════════════════════
// 7. SCROLL TO TOP
// ══════════════════════════════════════════════════════════════
function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ══════════════════════════════════════════════════════════════
// 8. MOBILE NAV TOGGLE
// ══════════════════════════════════════════════════════════════
function initNavMobile() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on nav link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      document.body.style.overflow = '';
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) {
      links.classList.remove('open');
      document.body.style.overflow = '';
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });
}


// ══════════════════════════════════════════════════════════════
// 9. SMOOTH SCROLL for anchor links
// ══════════════════════════════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}




// ══════════════════════════════════════════════════════════════
// 10. HERO MOTION — premium hover + spotlight movement
// ══════════════════════════════════════════════════════════════
function initHeroMotion() {
  const hero = document.querySelector('.hero-upgrade');
  const card = document.getElementById('heroTilt');

  if (!hero || !card || window.innerWidth < 900) return;

  let raf = null;

  function update(e) {
    if (raf) cancelAnimationFrame(raf);

    raf = requestAnimationFrame(() => {
      const heroRect = hero.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const heroX = ((e.clientX - heroRect.left) / heroRect.width) * 100;
      const heroY = ((e.clientY - heroRect.top) / heroRect.height) * 100;
      hero.style.setProperty('--mouse-x', `${heroX}%`);
      hero.style.setProperty('--mouse-y', `${heroY}%`);

      const x = (e.clientX - cardRect.left) / cardRect.width - 0.5;
      const y = (e.clientY - cardRect.top) / cardRect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`);
    });
  }

  function reset() {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  }

  hero.addEventListener('mousemove', update, { passive: true });
  hero.addEventListener('mouseleave', reset, { passive: true });
}

// ══════════════════════════════════════════════════════════════
// 11. JOURNEY TIMELINE — progressive highlight on scroll
// ══════════════════════════════════════════════════════════════
(function initJourneyTimeline() {
  const nodes = document.querySelectorAll('.journey-node');
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.3, rootMargin: '0px 0px -60px 0px' }
  );

  nodes.forEach(node => observer.observe(node));
})();


// ══════════════════════════════════════════════════════════════
// 12. NAVBAR ACTIVE SECTION TRACKING
// ══════════════════════════════════════════════════════════════
(function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active-section',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => observer.observe(sec));
})();


// ══════════════════════════════════════════════════════════════
// 13. CURSOR GLOW EFFECT (subtle, desktop only)
// ══════════════════════════════════════════════════════════════
(function initCursorGlow() {
  if (window.innerWidth < 768) return; // Skip on mobile

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position:       'fixed',
    width:          '400px',
    height:         '400px',
    borderRadius:   '50%',
    background:     'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
    pointerEvents:  'none',
    zIndex:         '0',
    transform:      'translate(-50%, -50%)',
    transition:     'left 0.15s ease, top 0.15s ease',
    left:           '-9999px',
    top:            '-9999px',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
