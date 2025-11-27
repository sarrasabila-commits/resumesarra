// script.js — Scroll reveal + progress bar animation + small UI helpers

document.addEventListener('DOMContentLoaded', function () {
  // Set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash.length > 1 && document.querySelector(hash)) {
        e.preventDefault();
        document.querySelector(hash).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // IntersectionObserver for reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Trigger progress bars when skills area appears
        if (entry.target.closest('#skills') || entry.target.id === 'skills') {
          animateProgressBars();
        }
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Progress bar animation function
  function animateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const target = parseInt(bar.getAttribute('data-width') || '0', 10);
      // Use setTimeout to create a stagger effect
      const delay = (Array.from(document.querySelectorAll('.progress-bar')).indexOf(bar)) * 120;
      setTimeout(() => {
        bar.style.width = target + '%';
      }, delay);
    });
  }

  // Portfolio light preview (simple)
  document.querySelectorAll('.card-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const img = this.dataset.img;
      openPreview(img, this.querySelector('.card-body h3').textContent);
    });
  });

  function openPreview(imgUrl, title) {
    // create modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.background = 'rgba(17,18,22,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '120';
    modal.addEventListener('click', () => document.body.removeChild(modal));

    const card = document.createElement('div');
    card.style.background = '#fff';
    card.style.borderRadius = '12px';
    card.style.maxWidth = '90%';
    card.style.maxHeight = '90%';
    card.style.overflow = 'hidden';
    card.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
    card.addEventListener('click', e => e.stopPropagation());

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = title;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    const caption = document.createElement('div');
    caption.style.padding = '12px';
    caption.style.fontWeight = '600';
    caption.textContent = title;

    card.appendChild(img);
    card.appendChild(caption);
    modal.appendChild(card);
    document.body.appendChild(modal);
  }

  // Contact form handling (demo only)
  window.submitForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      alert('Mohon isi semua field.');
      return;
    }
    // For demo, open mailto as fallback
    const subject = encodeURIComponent('Contact from website — ' + name);
    const body = encodeURIComponent(message + "\n\n— " + name + "\n" + email);
    window.location.href = `mailto:hello@sarrasabila.com?subject=${subject}&body=${body}`;
  };

  // Download resume stub
  window.downloadResume = function () {
    alert('Fungsi download CV belum terhubung. Anda dapat mengganti link ini dengan file CV Anda.');
  };

  // Accessibility: close modals with Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('div[role="dialog"]').forEach(d => d.remove());
      // also remove any simple modal (no role)
      document.querySelectorAll('body > div').forEach(div => {
        if (div && div.style && div.style.zIndex === '120') {
          document.body.removeChild(div);
        }
      });
    }
  });
});