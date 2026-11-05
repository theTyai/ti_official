// src/hooks/useActiveSection.js
// Tracks which home-page section is under the navbar, for highlighting.
// Uses scroll position rather than IntersectionObserver thresholds so that
// very tall sections (Events, Bharat Buzz, Guests) still register, and it
// re-runs whenever the visitor comes back to the home page.
import { useEffect, useState } from 'react';

export const SECTION_IDS = ['home', 'about', 'why', 'events', 'buzz', 'guests', 'join', 'contact'];

export function useActiveSection(currentPage = 'home') {
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (currentPage !== 'home') return undefined;

    let rafId = null;
    const compute = () => {
      rafId = null;
      const probe = window.innerHeight * 0.35; // a line 35% down the screen
      let current = 'home';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      // At the very bottom, the footer is the active section.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = 'contact';
      }
      setActive(current);
    };
    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(compute);
    };

    // Sections mount during the page transition, so check again shortly after.
    const t = setTimeout(compute, 450);
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(t);
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [currentPage]);

  return active;
}
