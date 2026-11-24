/* ============================================================
   SCRIPT.JS - GSAP 3 ve ScrollTrigger Animasyonları
   Kural: Hareketi azaltmayı seçen kullanıcılarda animasyon olmasın
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Hareketi azaltma tercihi kontrolü
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menü bağlantılarını yumuşakça kaydırma
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Hareketi azaltma tercih edilmişse GSAP animasyonlarını devre dışı bırak
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-elem').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
    return;
  }

  // GSAP ve ScrollTrigger yüklü mü kontrol et
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Her bölümdeki başlıklar, metinler ve görseller için sinematik yumuşak beliriş
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
      const elementsToReveal = section.querySelectorAll('.reveal-elem');

      if (elementsToReveal.length > 0) {
        gsap.fromTo(elementsToReveal,
          {
            opacity: 0,
            y: 40,
            scale: 0.97
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.16,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    // 3D Kartlar için hafif sinematik etkileşim
    const cards = document.querySelectorAll('.cinematic-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power1.out',
          transformPerspective: 1000
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });
  } else {
    // GSAP yüklenemezse içeriklerin görünür kalmasını sağla
    document.querySelectorAll('.reveal-elem').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});
