// src/sections/Hero.jsx
// Editorial hero: copy on the left, the India map artwork on the right.
// The artwork is drawn by the fixed page background (GlobalBackground → MapStage),
// which measures the `.hero-stage` slot here and carries the map from this spot to
// the centre of the page as you scroll. With "reduce motion" the map is drawn
// right here instead and does not travel.
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import HeritageMap from '../components/HeritageMap';
import { useApp } from '../context';
import hawaMahal from '../assets/heritage/hawa-mahal.jpg';
import chhatriDome from '../assets/heritage/chhatri-dome.jpg';

const EASE = [0.16, 1, 0.3, 1];
// Entrances wait for the intro to finish (`on`), then play in sequence.
const rise = (on, delay) => ({
  initial: { opacity: 0, y: 26 },
  animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
  transition: { duration: 0.9, delay, ease: EASE },
});
const wipe = (on, delay) => ({
  initial: { clipPath: 'inset(0 0 100% 0)', y: 30 },
  animate: on ? { clipPath: 'inset(0 0 -10% 0)', y: 0 } : { clipPath: 'inset(0 0 100% 0)', y: 30 },
  transition: { duration: 1.1, delay, ease: EASE },
});

export default function Hero() {
  const reduced = useReducedMotion();
  const { navigate, introDone } = useApp();
  const scrollTo = (id) => navigate('home', id);
  const on = introDone;

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-eyebrow" {...rise(on, 0.15)}>
            <span className="tri-dash" aria-hidden="true" />
            Think India <b aria-hidden="true">·</b> MANIT Bhopal Chapter
          </motion.p>

          <h1 id="hero-title" className="hero-title">
            <motion.span className="line" {...wipe(on, 0.3)}>Nation First.</motion.span>
            <motion.span className="line accent" {...wipe(on, 0.5)}>Ideas Forward.</motion.span>
          </h1>

          <motion.p className="hero-lead" {...rise(on, 0.8)}>
            Think India is a dynamic student movement committed to nurturing nationally inclined, socially committed, and culturally sensitive individuals.
          </motion.p>

          <motion.div className="hero-cta" {...rise(on, 0.95)}>
            <motion.button type="button" className="btn btn-primary" onClick={() => scrollTo('about')} whileTap={{ scale: 0.97 }}>
              Explore Think India <ArrowRight size={18} aria-hidden="true" />
            </motion.button>
            <motion.button type="button" className="btn btn-ghost" onClick={() => navigate('sampark')} whileTap={{ scale: 0.97 }}>
              Join the Movement
            </motion.button>
          </motion.div>

          <motion.div className="hero-strip" aria-hidden="true" {...rise(on, 1.15)}>
            <span className="chev"><img src={hawaMahal} alt="" width="120" height="220" /></span>
            <span className="chev"><img src={chhatriDome} alt="" width="120" height="220" /></span>
            <span className="hero-shloka" lang="sa">॥ वसुधैव कुटुम्बकम् ॥<small>The world is one family</small></span>
          </motion.div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          {reduced && <HeritageMap animate={false} />}
        </div>
      </div>

      <motion.button
        type="button"
        className="scroll-cue"
        onClick={() => scrollTo('about')}
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span>Scroll</span>
        <ArrowDown size={16} aria-hidden="true" />
      </motion.button>
    </section>
  );
}
