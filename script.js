// ============ SCROLL PROGRESS BAR ============
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ============ CUSTOM CURSOR ============
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
  let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorDot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (targetX - ringX) * 0.15;
    ringY += (targetY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('ring-active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('ring-active'));
  });
}

// ============ MAGNETIC BUTTONS ============
if (!isTouchDevice) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ============ TILT ON CARDS ============
if (!isTouchDevice) {
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -8;
      const rotateY = ((x - rect.width / 2) / rect.width) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ============ TYPEWRITER ROLE TEXT ============
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Aspiring HR Professional',
  'Web Designer',
  'Crafting Modern Digital Experiences'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    typewriterEl.textContent = phrases.join(' • ');
    return;
  }

  if (!isDeleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 35 : 65);
}
typeLoop();

// ============ MOBILE NAV TOGGLE ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ============ SCROLL REVEAL ============
const revealTargets = document.querySelectorAll(
  '.about, .services, .projects, .cta-band, .contact-footer'
);
revealTargets.forEach(el => el.classList.add('reveal'));

// Stagger: service and project cards fade in one after another
const staggerContainers = document.querySelectorAll('.service-grid, .project-grid');
staggerContainers.forEach(container => {
  container.classList.add('stagger');
  [...container.children].forEach((child, i) => {
    child.style.setProperty('--i', i);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));
staggerContainers.forEach(el => observer.observe(el));
