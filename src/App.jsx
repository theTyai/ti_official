import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalBackground from './components/GlobalBackground';
import PageCurtain from './components/PageCurtain';
import { Toran } from './components/Ornaments';
import Intro from './components/intro/Intro';
import { ScrollProgress, BackToTop, EASE_OUT } from './components/motion';
import { AppContext } from './context';
import { parseHash, hashFor } from './router';

import Hero from './sections/Hero';
import About from './sections/About';
import WhyUs from './sections/WhyUs';
import Events from './sections/Events';
import BharatBuzz from './sections/BharatBuzz';
import Guests from './sections/Guests';
import CTA from './sections/CTA';

import EventsPage from './pages/EventsPage';
import BharatBuzzPage from './pages/BharatBuzzPage';
import AboutPage from './pages/AboutPage';
import GuestsPage from './pages/GuestsPage';
import SamparkPage from './pages/SamparkPage';


const INTRO_KEY = 'ti-intro-seen';

function scrollToSection(id, behavior = 'smooth') {
  if (!id || id === 'home') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior });
}

// The home page, as one component so it can scroll to a requested section
// right after it mounts (e.g. clicking "Why Us" from the Events page).
function HomePage({ scrollTarget, onScrolled }) {
  useEffect(() => {
    if (!scrollTarget) return undefined;
    const id = requestAnimationFrame(() => {
      scrollToSection(scrollTarget, 'instant');
      onScrolled();
    });
    return () => cancelAnimationFrame(id);
  }, [scrollTarget, onScrolled]);

  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <div className="section-inner"><Toran className="divider-toran" count={25} width={1200} /></div>
      <Events />
      <BharatBuzz />
      <div className="section-inner"><Toran className="divider-toran" count={25} width={1200} /></div>
      <Guests />
      <CTA />
    </>
  );
}

const pageTransition = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15, ease: EASE_OUT } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } },
};

function shouldShowIntro(route) {
  if (route.page !== 'home' || route.section) return false;
  try { return !sessionStorage.getItem(INTRO_KEY); } catch { return true; }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash());
  const [scrollTarget, setScrollTarget] = useState(() => route.section);
  const scrollTargetRef = useRef(route.section);
  const detailPushed = useRef(false);
  const [showIntro, setShowIntro] = useState(() => shouldShowIntro(route));
  const [introDone, setIntroDone] = useState(() => !showIntro);

  // Browser back / forward and typed URLs
  useEffect(() => {
    const onHash = () => {
      const next = parseHash();
      setRoute((prev) => {
        if (next.page === 'home' && next.section) {
          if (prev.page === 'home') scrollToSection(next.section);
          else { scrollTargetRef.current = next.section; setScrollTarget(next.section); }
        }
        if (!next.id) detailPushed.current = false;
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /** Go to a page (and optionally a home-page section). */
  const navigate = useCallback((page, sectionId = null) => {
    if (page === 'home') {
      if (route.page === 'home') {
        scrollToSection(sectionId);
        if (window.location.hash !== '#/' && window.location.hash !== '') history.replaceState(null, '', '#/');
        return;
      }
      scrollTargetRef.current = sectionId;
      setScrollTarget(sectionId);
      window.location.hash = '#/';
      return;
    }
    if (page === route.page && !route.id) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    scrollTargetRef.current = null;
    window.location.hash = hashFor(page);
  }, [route]);

  /** Open a detail view (event, story, guest) with its own URL. */
  const openDetail = useCallback((page, id) => {
    detailPushed.current = route.page === page;
    window.location.hash = hashFor(page, id);
  }, [route.page]);

  /** Close a detail view, returning to the listing exactly as it was. */
  const closeDetail = useCallback((page) => {
    if (detailPushed.current) { detailPushed.current = false; history.back(); return; }
    history.replaceState(null, '', hashFor(page));
    setRoute({ page, id: null, section: null });
  }, []);

  const clearScrollTarget = useCallback(() => {
    scrollTargetRef.current = null;
    setScrollTarget(null);
  }, []);

  const endIntro = useCallback(() => {
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* private mode */ }
    setShowIntro(false);
    setIntroDone(true);
  }, []);

  const ctx = useMemo(() => ({ route, navigate, openDetail, closeDetail, introDone }), [route, navigate, openDetail, closeDetail, introDone]);

  const page = route.page;
  let content;
  if (page === 'events') content = <EventsPage />;
  else if (page === 'buzz') content = <BharatBuzzPage />;
  else if (page === 'about') content = <AboutPage />;
  else if (page === 'guests') content = <GuestsPage />;
  else if (page === 'sampark') content = <SamparkPage />;
  else content = <HomePage scrollTarget={scrollTarget} onScrolled={clearScrollTarget} />;

  return (
    <AppContext.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <ScrollProgress />
          <GlobalBackground page={page} ready={introDone} />

          <Navbar />

          <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
            <AnimatePresence
              mode="wait"
              initial={false}
              onExitComplete={() => {
                // New page: start at the top unless a section was requested.
                if (!scrollTargetRef.current) window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <motion.div key={page} {...pageTransition}>
                {content}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
          <BackToTop />
          <PageCurtain page={page} />

          {showIntro && (
            <Intro onDone={endIntro} />
          )}
        </div>
      </MotionConfig>
    </AppContext.Provider>
  );
}
