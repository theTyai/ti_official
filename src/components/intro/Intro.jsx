// src/components/intro/Intro.jsx
// The opening sequence (~6 s), played on every full load of the home page and never on
// internal navigation:
//   1. a dotted 3D globe turns until India faces you, glowing saffron;
//   2. India is drawn as a glowing outline over a lat/long grid, filled with contour
//      lines and the Amer Fort heritage photograph, with the tricolour edges of the hero map;
//   3. trails of light run from Delhi, Mumbai, Kolkata and Chennai and converge on Bhopal,
//      where a pin lands on MANIT, the chakra turns and ripples spread;
//   4. the map recedes and THINK INDIA × MANIT BHOPAL CHAPTER is revealed,
//      then two carved doors open onto the hero.
// Without WebGL (or if the 3D chunk is slow or fails) it starts at scene 2.
import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { INDIA_PATH, BHOPAL } from '../../data/indiaPath';
import logoImg from '../../assets/logo.jpg';
import amerFort from '../../assets/heritage/amer-fort.jpg';

const GlobeScene = lazy(() => import('./GlobeScene'));
// Keep in step with TIMING in GlobeScene.jsx (seconds on the 3D clock).
const T3 = { BRAND: 3.6, OUT: 5.7 };

const EASE = [0.16, 1, 0.3, 1];
const VB = '-40 -20 880 930';
const CX = 380, CY = 460; // contour lines shrink towards this point

// City positions on the site's India outline (same projection as the map).
const CITIES = [
  { name: 'DELHI', x: 262, y: 279, dx: -14, dy: -14, anchor: 'end' },
  { name: 'MUMBAI', x: 156, y: 541, dx: -14, dy: 6, anchor: 'end' },
  { name: 'KOLKATA', x: 537, y: 445, dx: 14, dy: 6, anchor: 'start' },
  { name: 'CHENNAI', x: 338, y: 706, dx: 14, dy: 10, anchor: 'start' },
];
const trailPath = ({ x, y }) => {
  const mx = (x + BHOPAL.x) / 2, my = (y + BHOPAL.y) / 2;
  const vx = BHOPAL.x - x, vy = BHOPAL.y - y;
  return `M ${x} ${y} Q ${mx - vy * 0.32} ${my + vx * 0.32} ${BHOPAL.x} ${BHOPAL.y}`;
};

// Seconds, counted from the start of scene 2.
const T = { GLOBE: 1.35, TRAIL: 1.05, PIN: 1.7, BRAND: 2.35, OUT: 4.55, EXIT: 1.15 };

class Quiet extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function webgl() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

function Spokes({ x = 0, y = 0, r, color = '#E99A36', width = 1 }) {
  return (
    <g stroke={color}>
      <circle cx={x} cy={y} r={r} fill="none" strokeWidth={width * 2} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} strokeWidth={width} />;
      })}
      <circle cx={x} cy={y} r={r * 0.18} fill={color} stroke="none" />
    </g>
  );
}

function MapScene({ size, delay }) {
  const d = (s) => delay + s;
  const draw = (at, dur, extra = {}) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1, ...extra },
    transition: { pathLength: { delay: d(at), duration: dur, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: d(at), duration: 0.2 } },
  });
  const fade = (at, dur = 0.8, to = 1) => ({
    initial: { opacity: 0 }, animate: { opacity: to }, transition: { delay: d(at), duration: dur, ease: EASE },
  });

  return (
    <motion.div
      className="intro-map"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, rotateX: 26, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, rotateX: 0, scale: 1.08, y: 0 }}
      transition={{ opacity: { delay: d(0), duration: 0.5 }, default: { delay: d(0), duration: 2.4, ease: EASE } }}
    >
      <svg viewBox={VB} className="intro-svg" aria-hidden="true">
        <defs>
          <clipPath id="intro-india"><path d={INDIA_PATH} /></clipPath>
          <linearGradient id="intro-tone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E99A36" stopOpacity="0.35" />
            <stop offset="0.55" stopColor="#3A2418" stopOpacity="0.55" />
            <stop offset="1" stopColor="#140D09" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="intro-bhopal-glow">
            <stop offset="0" stopColor="#FFC46B" stopOpacity="0.75" />
            <stop offset="1" stopColor="#FFC46B" stopOpacity="0" />
          </radialGradient>
          <filter id="intro-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Surveyor's grid */}
        <motion.g {...fade(0.05, 1, 1)} stroke="#D8C2A2" strokeOpacity="0.09" strokeWidth="1">
          {Array.from({ length: 12 }, (_, i) => <line key={`v${i}`} x1={-40 + i * 80} y1={-20} x2={-40 + i * 80} y2={910} />)}
          {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1={-40} y1={-20 + i * 80} x2={840} y2={-20 + i * 80} />)}
        </motion.g>

        {/* Tricolour edges, as on the hero map */}
        <motion.path d={INDIA_PATH} fill="none" stroke="#FF9933" strokeWidth="3" transform="translate(-11 -8)" {...draw(0.75, 1.1, { opacity: 0.7 })} />
        <motion.path d={INDIA_PATH} fill="none" stroke="#138808" strokeWidth="3" transform="translate(11 8)" {...draw(0.85, 1.1, { opacity: 0.75 })} />

        {/* Land: heritage photograph in a dark duotone, with contour lines */}
        <g clipPath="url(#intro-india)">
          <rect x="-40" y="-20" width="880" height="930" fill="#22160F" />
          <motion.image
            href={amerFort} x="-10" y="20" width="820" height="840" preserveAspectRatio="xMidYMid slice"
            initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 0.55, scale: 1 }}
            transition={{ delay: d(0.65), duration: 1.6, ease: EASE }}
            style={{ transformOrigin: '400px 440px' }}
          />
          <rect x="-40" y="-20" width="880" height="930" fill="url(#intro-tone)" />
          {[0.86, 0.72, 0.58, 0.44, 0.3].map((s, i) => (
            <motion.path
              key={s}
              d={INDIA_PATH}
              transform={`translate(${CX} ${CY}) scale(${s}) translate(${-CX} ${-CY})`}
              fill="none" stroke="#D8C2A2" strokeWidth={1.3 / s} strokeOpacity="0.38"
              {...draw(0.35 + i * 0.09, 1.1)}
            />
          ))}
          <motion.circle cx={BHOPAL.x} cy={BHOPAL.y} r="220" fill="url(#intro-bhopal-glow)"
            initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 0.9, scale: 1 }}
            transition={{ delay: d(T.PIN), duration: 1.2, ease: EASE }}
            style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }}
          />
        </g>

        {/* Glowing coastline and border, drawn first */}
        <motion.path d={INDIA_PATH} fill="none" stroke="#FFB45C" strokeWidth="3.2" strokeLinejoin="round" filter="url(#intro-glow)" {...draw(0, 1.15)} />

        {/* Four cities, four trails, one destination */}
        {CITIES.map((c, i) => {
          const at = 0.9 + i * 0.08;
          const path = trailPath(c);
          return (
            <g key={c.name}>
              <motion.path d={path} fill="none" stroke="#FFC46B" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.85" {...draw(T.TRAIL + i * 0.06, 0.75)} />
              <motion.path
                d={path} pathLength="1" fill="none" stroke="#FFF1D6" strokeWidth="6" strokeLinecap="round" filter="url(#intro-glow)"
                strokeDasharray="0.05 1.2"
                initial={{ strokeDashoffset: 0.05, opacity: 0 }}
                animate={{ strokeDashoffset: -0.95, opacity: [0, 1, 1, 0] }}
                transition={{ delay: d(T.TRAIL + i * 0.06), duration: 0.75, ease: [0.65, 0, 0.35, 1], opacity: { delay: d(T.TRAIL + i * 0.06), duration: 0.8, times: [0, 0.1, 0.85, 1] } }}
              />
              <motion.circle cx={c.x} cy={c.y} r="6" fill="#FFC46B" filter="url(#intro-glow)"
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: d(at), type: 'spring', stiffness: 400, damping: 18 }}
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              />
              <motion.text x={c.x + c.dx} y={c.y + c.dy} textAnchor={c.anchor} className="intro-city" {...fade(at + 0.1, 0.5, 0.85)}>{c.name}</motion.text>
            </g>
          );
        })}

        {/* MANIT, Bhopal */}
        {[0, 1, 2].map((k) => (
          <motion.circle
            key={k} cx={BHOPAL.x} cy={BHOPAL.y} r="14" fill="none" stroke="#FFC46B" strokeWidth="2"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 5], opacity: [0.9, 0] }}
            transition={{ delay: d(T.PIN + 0.05 + k * 0.25), duration: 1.4, ease: 'easeOut' }}
            style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }}
          />
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: d(T.PIN + 0.1), duration: 0.9, ease: EASE }}
          style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }}
        >
          <g className="intro-chakra" style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }}>
            <circle cx={BHOPAL.x} cy={BHOPAL.y} r="30" fill="rgba(250,247,240,0.95)" />
            <Spokes x={BHOPAL.x} y={BHOPAL.y} r={30} color="#1B2A8C" width={1.3} />
          </g>
        </motion.g>
        <motion.g
          initial={{ y: -120, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: d(T.PIN - 0.1), type: 'spring', stiffness: 300, damping: 15 }}
        >
          <path d={`M ${BHOPAL.x} ${BHOPAL.y - 30} c -14 -18 -22 -28 -22 -42 a 22 22 0 0 1 44 0 c 0 14 -8 24 -22 42 z`} fill="#A65338" stroke="#FFF1D6" strokeWidth="2.5" />
          <circle cx={BHOPAL.x} cy={BHOPAL.y - 72} r="8" fill="#FFF1D6" />
        </motion.g>
        <motion.g initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d(T.PIN + 0.3), duration: 0.6, ease: EASE }}>
          <polyline points={`${BHOPAL.x + 34},${BHOPAL.y - 14} ${BHOPAL.x + 70},${BHOPAL.y - 46} ${BHOPAL.x + 96},${BHOPAL.y - 46}`} fill="none" stroke="#FFC46B" strokeWidth="1.5" />
          <text x={BHOPAL.x + 104} y={BHOPAL.y - 36} className="intro-pin-label">MANIT · BHOPAL</text>
          <text x={BHOPAL.x + 104} y={BHOPAL.y - 8} className="intro-pin-sub">23.26° N · 77.41° E</text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

function Brand({ delay }) {
  const word = 'THINK INDIA'.split('');
  const d = (s) => delay + s;
  const tagline = 'Where Ideas Meet Nation Building.'.split(' ');
  return (
    <div className="intro-brand">
      <motion.div
        className="intro-logo-wrap"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: d(0), duration: 0.9, ease: EASE }}
      >
        <svg className="intro-logo-ring" viewBox="-60 -60 120 120" aria-hidden="true">
          <Spokes r={56} color="#E99A36" width={0.8} />
        </svg>
        <span className="intro-logo"><img src={logoImg} alt="" width="96" height="96" /></span>
      </motion.div>
      <h1 className="intro-title" aria-label="Think India">
        {word.map((ch, i) => (
          <span key={i} className="intro-ch" aria-hidden="true">
            <motion.span
              initial={{ y: '115%' }}
              animate={{ y: '0%' }}
              transition={{ delay: d(0.2 + i * 0.04), duration: 0.8, ease: EASE }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.p
        className="intro-chapter"
        initial={{ opacity: 0, letterSpacing: '0.7em' }}
        animate={{ opacity: 1, letterSpacing: '0.34em' }}
        transition={{ delay: d(0.6), duration: 1, ease: EASE }}
      >
        <span className="intro-x">×</span> MANIT Bhopal Chapter
      </motion.p>
      <motion.span
        className="intro-rule"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: d(0.8), duration: 0.9, ease: EASE }}
      />
      <p className="intro-tagline">
        {tagline.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: d(1.0 + i * 0.09), duration: 0.6, ease: EASE }}
          >
            {w}{' '}
          </motion.span>
        ))}
      </p>
    </div>
  );
}

export default function Intro({ onReveal, onDone }) {
  const small = window.matchMedia('(max-width: 700px)').matches;
  const [useGlobe, setUseGlobe] = useState(() => webgl());
  const [started, setStarted] = useState(false);
  const [out, setOut] = useState(false);
  const t0 = useRef(0);
  const getStart = useCallback(() => t0.current, []);
  const calc = () => Math.min(window.innerWidth * (small ? 1.05 : 0.62), window.innerHeight * (small ? 0.62 : 0.8));
  const [size, setSize] = useState(calc);

  const start = useCallback(() => {
    setStarted((s) => {
      if (!s) t0.current = performance.now();
      return true;
    });
  }, []);

  // Lock scrolling while the intro is on screen. Escape still ends it for keyboard users.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setOut(true); };
    const onResize = () => setSize(calc());
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Without the globe, or if it takes too long to arrive, start with the map.
  useEffect(() => {
    if (!useGlobe) { start(); return undefined; }
    const timer = setTimeout(() => { setUseGlobe(false); start(); }, 1400);
    const ok = () => clearTimeout(timer);
    window.addEventListener('ti-globe-ready', ok, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener('ti-globe-ready', ok); };
  }, [useGlobe, start]);

  // 3D: the whole story plays in the Three.js scene and the brand comes in over it.
  // 2D fallback: the SVG map scene below, on its own timings.
  const brandAt = useGlobe ? T3.BRAND : T.BRAND;
  const outAt = useGlobe ? T3.OUT : T.OUT;

  useEffect(() => {
    if (!started) return undefined;
    const timer = setTimeout(() => setOut(true), outAt * 1000);
    return () => clearTimeout(timer);
  }, [started, outAt]);

  // Doors open: the page starts its entrance underneath, then the intro is removed.
  useEffect(() => {
    if (!out) return undefined;
    onReveal?.();
    const timer = setTimeout(() => onDone?.(), T.EXIT * 1000 + 50);
    return () => clearTimeout(timer);
  }, [out, onReveal, onDone]);

  // Exit: one soft cross-fade. The whole intro dissolves while the scene drifts
  // towards the viewer, and the home page starts its own entrance underneath at
  // the same moment, so there is no hard cut between the two.
  const fadeOut = { duration: T.EXIT, ease: [0.45, 0, 0.2, 1] };

  return (
    <MotionConfig reducedMotion="never">
      <motion.div
        className={`intro${out ? ' is-out' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Think India × MANIT Bhopal Chapter introduction"
        initial={{ opacity: 1 }}
        animate={{ opacity: out ? 0 : 1 }}
        transition={fadeOut}
      >
        <span className="intro-door intro-door--l" aria-hidden="true" />
        <span className="intro-door intro-door--r" aria-hidden="true" />

        <motion.div
          className="intro-stage"
          animate={out ? { scale: 1.07, y: -10 } : { scale: 1, y: 0 }}
          transition={{ duration: T.EXIT + 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {useGlobe && (
            <Quiet onFail={() => { setUseGlobe(false); start(); }}>
              <Suspense fallback={null}>
                <motion.div className="intro-globe-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <GlobeScene
                    startAt={getStart}
                    onReady={() => { window.dispatchEvent(new Event('ti-globe-ready')); start(); }}
                  />
                </motion.div>
              </Suspense>
            </Quiet>
          )}

          {started && useGlobe && (
            <motion.span
              className="intro-dim"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: brandAt - 0.1, duration: 0.9 }}
            />
          )}

          {started && !useGlobe && (
            <motion.div
              className="intro-map-wrap"
              initial={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              animate={{ opacity: 0.14, scale: 0.82, y: small ? -40 : -20, filter: 'blur(2px)' }}
              transition={{ delay: T.BRAND, duration: 0.9, ease: EASE }}
            >
              <MapScene size={size} delay={0} />
            </motion.div>
          )}

          {started && (
            <motion.div
              className="intro-brand-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: brandAt, duration: 0.5 }}
            >
              <Brand delay={brandAt + 0.05} />
            </motion.div>
          )}

          {!started && (
            <motion.span className="intro-wait" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
              <svg viewBox="-40 -40 80 80"><Spokes r={30} /></svg>
            </motion.span>
          )}

          <span className="intro-vignette" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
