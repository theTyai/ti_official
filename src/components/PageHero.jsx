// src/components/PageHero.jsx – the opening band of every dedicated page:
// a breadcrumb back to Home, the Devanagari index, a word-by-word title,
// a shloka, a short intro and a slowly turning mandala behind it all.
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { WordReveal, ruleDraw, EASE_OUT } from './motion';
import { Mandala, Toran } from './Ornaments';
import { useApp } from '../context';

const rise = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
});

export default function PageHero({ index, eyebrow, title, shloka, shlokaLabel, desc, crumb, aside, children }) {
  const { navigate } = useApp();
  return (
    <header className="page-hero">
      <Mandala className="page-hero-mandala" />
      <div className="page-hero-grid">
        <div className="page-hero-main">
          <motion.nav className="crumbs" aria-label="Breadcrumb" {...rise(0.2)}>
            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{crumb || eyebrow}</span>
          </motion.nav>

          <motion.span className="eyebrow" initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.3 } } }}>
            {index && <span className="dev">{index}</span>}
            <motion.span className="eyebrow-rule" aria-hidden="true" variants={ruleDraw} style={{ originX: 0 }} />
            {eyebrow}
          </motion.span>

          <WordReveal as="h1" className="page-title" inView={false} delay={0.35} stagger={0.07}>{title}</WordReveal>

          {shloka && (
            <motion.span className="shloka" aria-label={shlokaLabel} {...rise(0.75)}>{shloka}</motion.span>
          )}
          {desc && <motion.p className="page-desc" {...rise(0.85)}>{desc}</motion.p>}
          {children && <motion.div className="page-hero-extra" {...rise(0.95)}>{children}</motion.div>}
        </div>
        {aside && <motion.div className="page-hero-aside" {...rise(0.6)}>{aside}</motion.div>}
      </div>
      <Toran className="page-hero-toran" count={25} width={1200} />
    </header>
  );
}
