// src/components/motion.jsx
// Shared animation building blocks so every section moves the same way.
// All of these respect the visitor's "reduce motion" setting through the
// <MotionConfig reducedMotion="user"> wrapper in App.jsx.

import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState, Children, Fragment, isValidElement, cloneElement } from 'react';
import { ArrowUp } from 'lucide-react';

export const EASE_OUT = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Text rises out of a mask — used for big headings. */
export const wipeUp = {
  hidden: { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
  show: { opacity: 1, y: 0, clipPath: 'inset(0 0 -20% 0)', transition: { duration: 0.9, ease: EASE_OUT } },
};

/** Image reveal: a curtain lifts off the picture. */
export const imageReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', scale: 1.08 },
  show: { clipPath: 'inset(0% 0 0 0)', scale: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

export const staggerParent = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});


/** One word rising out of its own mask (child of a staggering parent). */
export const wordRise = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.85, ease: EASE_OUT } },
};

function splitWords(node, path = 'w') {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((part, i) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return ' ';
      return (
        <span className="w" key={`${path}-${i}`}>
          <motion.span className="wi" variants={wordRise}>{part}</motion.span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) return node.map((n, i) => splitWords(n, `${path}.${i}`));
  if (isValidElement(node)) {
    if (node.type === 'br') return node;
    if (node.type === Fragment) return splitWords(Children.toArray(node.props.children), `${path}f`);
    const kids = node.props.children;
    if (kids == null) return node;
    return cloneElement(node, { key: node.key ?? path }, ...Children.toArray(kids).map((k, i) => splitWords(k, `${path}.${i}`)));
  }
  return node;
}

/** Heading whose words rise one after another when scrolled into view. */
export function WordReveal({ children, as = 'h2', className, stagger = 0.06, delay = 0, inView = true, ...rest }) {
  const Comp = motion[as] || motion.h2;
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } }
    : { initial: 'hidden', animate: 'show' };
  return (
    <Comp className={className} variants={staggerParent(stagger, delay)} {...trigger} {...rest}>
      {splitWords(children)}
    </Comp>
  );
}

/** A thin rule that draws itself from the left. */
export const ruleDraw = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: EASE_OUT } },
};

/** Fades + lifts its children into view once, when scrolled to. */
export function Reveal({ children, variants = fadeUp, delay = 0, as = 'div', amount = 0.2, style, className, ...rest }) {
  const Comp = motion[as] || motion.div;
  const v = delay
    ? { ...variants, show: { ...variants.show, transition: { ...(variants.show.transition || {}), delay } } }
    : variants;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={v}
      style={style}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Container whose direct <StaggerItem> children reveal one after another. */
export function Stagger({ children, stagger = 0.08, delay = 0, amount = 0.15, style, className, as = 'div' }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={staggerParent(stagger, delay)}
      style={style}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, variants = fadeUp, style, className, as = 'div', ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp variants={variants} style={style} className={className} {...rest}>
      {children}
    </Comp>
  );
}

/**
 * Editorial section header. Left: Devanagari index, eyebrow and an oversized
 * condensed title. Right (or below on phones): the shloka and a short intro.
 * align="center" stacks everything centred (used for the Join section).
 */
export function SectionHeader({ index, eyebrow, shloka, shlokaLabel, title, desc, align = 'split', children }) {
  return (
    <Stagger stagger={0.1} className={`sec-head sec-head--${align}`}>
      <div className="sec-head-main">
        {eyebrow && (
          <StaggerItem variants={fadeIn}>
            <span className="eyebrow">
              {index && <span className="dev">{index}</span>}
              <motion.span className="eyebrow-rule" aria-hidden="true" variants={ruleDraw} style={{ originX: 0 }} />
              {eyebrow}
            </span>
          </StaggerItem>
        )}
        <WordReveal className="sec-title" stagger={0.07} delay={0.1}>{title}</WordReveal>
      </div>
      {(shloka || desc || children) && (
        <div className="sec-head-side">
          {shloka && (
            <StaggerItem variants={fadeIn}>
              <span className="shloka" aria-label={shlokaLabel}>{shloka}</span>
            </StaggerItem>
          )}
          {desc && (
            <StaggerItem>
              <p className="sec-desc">{desc}</p>
            </StaggerItem>
          )}
          {children}
        </div>
      )}
    </Stagger>
  );
}

/** Thin tricolour bar at the top of the window showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Floating "back to top" button that appears after scrolling down. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          aria-label="Back to top"
        >
          <ArrowUp size={22} strokeWidth={2.4} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
