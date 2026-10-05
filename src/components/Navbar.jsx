import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.jpg';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Vision', href: '#vision' },
  { label: 'Sankalp', href: '#pillars' },
  { label: 'Journey', href: '#impact' },
  { label: 'Sampark', href: '#contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <motion.a 
            href="#home" 
            onClick={(e) => smoothScroll(e, '#home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="nav-logo-img-wrapper" style={{ width: 55, height: 55, borderRadius: '50%', background: 'white', padding: 4, border: '2px solid var(--terracotta)', boxShadow: '0 4px 10px rgba(191,54,12,0.2)' }}>
              <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
            </div>
            <div>
              <span className="font-yatra nav-title" style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-dark)', letterSpacing: '1px' }}>THINK INDIA</span>
              <span className="nav-subtitle" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--terracotta)', textTransform: 'uppercase' }}>MANIT Chapter</span>
            </div>
          </motion.a>

          {/* Desktop Links */}
          <motion.ul 
            style={{ display: 'flex', gap: '3rem', listStyle: 'none' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a 
                  href={link.href} 
                  className="nav-link"
                  onClick={(e) => smoothScroll(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>

          {/* Mobile Toggle */}
          <motion.button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'none', zIndex: 1001, position: 'relative' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2" strokeLinecap="round">
              <path d={menuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, background: 'var(--bg-parchment)', zIndex: 1000, 
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem'
            }}
          >
            <div className="pattern-rangoli"></div>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 1002, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className="font-yatra"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ fontSize: '2.5rem', color: 'var(--terracotta)', position: 'relative', zIndex: 1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}
