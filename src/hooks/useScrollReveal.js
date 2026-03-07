import { useEffect } from 'react';

/**
 * Attaches IntersectionObserver to all .reveal elements,
 * adding 'visible' class when they enter the viewport.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const els = document.querySelectorAll('.reveal');
    els.forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);
}
