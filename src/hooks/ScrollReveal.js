import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -10px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    // Fallback: if any .reveal element is still hidden after 2s (can happen on
    // Android Chrome with dynamic URL bar or in-app browsers), force them visible.
    const fallback = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        el.classList.add('visible');
      });
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}




