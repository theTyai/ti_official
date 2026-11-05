import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { useActiveSection } from '../hooks/useActiveSection';
import { useApp } from '../context';
import archImg from '../assets/heritage/arch-cenotaphs.jpg';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../data/site';

// Pages have their own URLs; "Home" and "Why Us" are places on the home page.
const NAV_LINKS = [
  { label: 'Home',        page: 'home',    section: 'home', href: '#/' },
  { label: 'About',       page: 'about',   href: '#/about' },
  { label: 'Why Us',      page: 'home',    section: 'why', href: '#why' },
  { label: 'Events',      page: 'events',  href: '#/events' },
  { label: 'Bharat Buzz', page: 'buzz',    href: '#/bharat-buzz' },
  { label: 'Guests',      page: 'guests',  href: '#/guests' },
  { label: 'Sampark',     page: 'sampark', href: '#/sampark' },
];

const DEV_NUM = ['०१', '०२', '०३', '०४', '०५', '०६', '०७'];
const EASE = [0.16, 1, 0.3, 1];

const drawerList = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } };
const drawerItem = { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } };

function Brand({ onClick }) {
  return (
    <a href="#/" onClick={onClick} className="brand" aria-label="Think India MANIT — home">
      <span className="brand-logo">
        <img src={logoImg} alt="" width="40" height="40" />
      </span>
      <span>
        <span className="brand-name">THINK INDIA</span>
        <span className="brand-sub">MANIT Chapter</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const { route, navigate: onNavigate } = useApp();
  const currentPage = route.page;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const menuBtnRef = useRef(null);
  const drawerRef = useRef(null);
  const activeSection = useActiveSection(currentPage);

  // The bar stays fixed; after a little scroll it tightens and gains a parchment backing.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drawer: lock scroll, focus the close button, Escape closes, Tab stays inside.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); return; }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const f = drawerRef.current.querySelectorAll('a[href], button');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const btn = menuBtnRef.current;
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      btn?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  // Close the drawer if the window grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const go = (e, link) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(link.page, link.section || null);
  };
  const HOME = NAV_LINKS[0];
  const JOIN = { page: 'sampark' };

  const isActive = (link) => {
    if (link.page !== 'home') return currentPage === link.page;
    if (currentPage !== 'home') return false;
    return link.section === 'why' ? activeSection === 'why' : activeSection !== 'why';
  };

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav-inner">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Brand onClick={(e) => go(e, HOME)} />
          </motion.div>

          <motion.ul
            className="nav-links"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <motion.li key={link.label} variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>
                  <a
                    href={link.href}
                    className="nav-link"
                    onClick={(e) => go(e, link)}
                    aria-current={active ? 'true' : undefined}
                  >
                    {link.label}
                        {active && <motion.span layoutId="nav-dot" className="nav-dot" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>

          <div className="nav-actions">
            <motion.a
              href="#/sampark"
              className="btn btn-primary btn-sm nav-join"
              onClick={(e) => go(e, JOIN)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 18 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Us <ArrowRight size={16} aria-hidden="true" />
            </motion.a>

            <button
              ref={menuBtnRef}
              type="button"
              className="icon-btn menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="drawer-backdrop"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={{ clipPath: 'inset(0 0 0 100%)' }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div className="drawer-head">
                <Brand onClick={(e) => go(e, HOME)} />
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="icon-btn drawer-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </div>

              <div className="drawer-body">
                <p className="drawer-kicker">॥ वसुधैव कुटुम्बकम् ॥</p>
                <motion.ul className="drawer-links" variants={drawerList} initial="hidden" animate="show">
                  {NAV_LINKS.map((link, i) => {
                    const active = isActive(link);
                    return (
                      <motion.li key={link.label} variants={drawerItem}>
                        <a
                          href={link.href}
                          className="drawer-link"
                          onClick={(e) => go(e, link)}
                          aria-current={active ? 'true' : undefined}
                        >
                          <span className="drawer-num" aria-hidden="true">{DEV_NUM[i]}</span>
                          {link.label}
                          <ArrowRight size={18} className="arrow" aria-hidden="true" />
                        </a>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>

              <div className="drawer-foot">
                <div className="drawer-photo" aria-hidden="true"><img src={archImg} alt="" width="280" height="200" loading="lazy" /></div>
                <a href="#/sampark" className="btn btn-primary btn-block" onClick={(e) => go(e, JOIN)}>
                  Join the Chapter <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-block">
                  {INSTAGRAM_HANDLE} <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
