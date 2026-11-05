// src/components/intro/Intro.jsx
// The opening sequence (~5.5 s): globe → India in relief → a trail to Bhopal → MANIT
// marker → THINK INDIA × MANIT BHOPAL CHAPTER. Skippable, shown once per browser
// session, and never on internal navigation. Without WebGL (or if the 3D chunk is slow
// or fails) it starts at the map scene; with "reduce motion" it shows a still brand card.
import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDIA_PATH, BHOPAL } from '../../data/indiaPath';
import logoImg from '../../assets/logo.jpg';

const GlobeScene = lazy(() => import('./GlobeScene'));

const EASE = [0.16, 1, 0.3, 1];
const VB = '-40 -20 880 930';
const CX = 360, CY = 470; // relief contours shrink towards this point
const TRAIL = `M -40 70 C 80 110 150 240 ${BHOPAL.x} ${BHOPAL.y}`;
const LAYERS = ['#2A1C15', '#3A271D', '#553728', '#774A31', '#9A5938', '#BD704B', '#D9925A'];

// Seconds on the intro clock. The map scene starts at MAP when the globe runs first.
const T = { MAP: 1.75, TILT: 0.15, TRAIL: 0.45, CAM: 1.1, PIN: 1.75, BRAND: 2.15, LINE: 2.75, OUT: 3.75 };

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

function Spokes({ x, y, r }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#E99A36" strokeWidth="2" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} stroke="#E99A36" strokeWidth="1" />;
      })}
    </g>
  );
}

function MapScene({ size, delay, small }) {
  // Camera move to Bhopal, expressed in px of the map box
  const zoom = small ? 1.9 : 2.2;
  const bx = ((440 - (BHOPAL.x + 40)) / 880) * size * zoom;
  const by = ((465 - (BHOPAL.y + 20)) / 930) * size * zoom * 0.7;
  const d = (s) => delay + s;
  const [head, setHead] = useState(null);
  const trailRef = useRef(null);

  return (
    <motion.div
      className="intro-map"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 1.45 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ opacity: { duration: 0.6, delay: d(0) }, scale: { duration: 1.1, delay: d(0), ease: EASE } }}
    >
      <motion.div
        className="intro-map-3d"
        initial={{ rotateX: 0, x: 0, y: 0, scale: 1 }}
        animate={{ rotateX: [0, 48, 38], x: [0, 0, bx], y: [0, 0, by], scale: [1, 1, zoom] }}
        transition={{ duration: 2.2, delay: d(T.TILT), times: [0, 0.42, 1], ease: 'easeInOut' }}
      >
        {/* Relief: stacked contour layers, each clipped to India */}
        {LAYERS.map((fill, i) => {
          const s = 1 - i * 0.11;
          return (
            <motion.svg
              key={fill}
              viewBox={VB}
              className="intro-layer"
              initial={{ z: 0, opacity: i === 0 ? 1 : 0 }}
              animate={{ z: i * (size / 70), opacity: 1 }}
              transition={{ duration: 1.1, delay: d(T.TILT + 0.15 + i * 0.07), ease: EASE }}
            >
              <defs>
                <clipPath id={`ic-${i}`}><path d={INDIA_PATH} /></clipPath>
              </defs>
              {i === 0 && <path d={INDIA_PATH} fill="#22160F" stroke="#FF9933" strokeWidth="3" className="intro-coast" />}
              <g clipPath="url(#ic-0)">
                <path
                  d={INDIA_PATH}
                  transform={`translate(${CX} ${CY}) scale(${s}) translate(${-CX} ${-CY})`}
                  fill={fill}
                  stroke="#D8C2A2"
                  strokeOpacity={0.45}
                  strokeWidth={1.4 / s}
                />
              </g>
            </motion.svg>
          );
        })}

        {/* Trail, marker and chakra ride on top of the relief */}
        <motion.svg
          viewBox={VB}
          className="intro-layer intro-top"
          initial={{ z: 0 }}
          animate={{ z: LAYERS.length * (size / 70) + 4 }}
          transition={{ duration: 1.1, delay: d(T.TILT + 0.2), ease: EASE }}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <motion.path
            ref={trailRef}
            d={TRAIL}
            fill="none"
            stroke="#FFC46B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 0"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: d(T.TRAIL), ease: [0.45, 0, 0.2, 1] }}
            onUpdate={(v) => {
              const el = trailRef.current;
              if (!el || v.pathLength === undefined) return;
              const len = el.getTotalLength();
              const p = el.getPointAtLength(len * Math.min(1, v.pathLength));
              setHead({ x: p.x, y: p.y, done: v.pathLength >= 0.999 });
            }}
          />
          {head && !head.done && <circle cx={head.x} cy={head.y} r="7" fill="#FFF1D6" filter="url(#glow)" />}

          <motion.g
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1, rotate: 180 }}
            transition={{ delay: d(T.PIN + 0.1), duration: 1.6, ease: EASE }}
            style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }}
          >
            <Spokes x={BHOPAL.x} y={BHOPAL.y} r={30} />
          </motion.g>
          {[0, 1, 2].map((k) => (
            <motion.circle
              key={k}
              cx={BHOPAL.x}
              cy={BHOPAL.y}
              r="12"
              fill="none"
              stroke="#FFC46B"
              strokeWidth="2"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 4.5], opacity: [0.9, 0] }}
              transition={{ delay: d(T.PIN + k * 0.22), duration: 1.3, ease: 'easeOut' }}
              style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }}
            />
          ))}
          <motion.g
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: d(T.PIN - 0.15), type: 'spring', stiffness: 320, damping: 14 }}
          >
            <path d={`M ${BHOPAL.x} ${BHOPAL.y} c -14 -18 -22 -28 -22 -42 a 22 22 0 0 1 44 0 c 0 14 -8 24 -22 42 z`} fill="#A65338" stroke="#FFF1D6" strokeWidth="2.5" />
            <circle cx={BHOPAL.x} cy={BHOPAL.y - 42} r="8" fill="#FFF1D6" />
          </motion.g>
          <motion.text
            x={BHOPAL.x + 34}
            y={BHOPAL.y + 8}
            className="intro-pin-label"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: d(T.PIN + 0.25), duration: 0.6 }}
          >
            MANIT · BHOPAL
          </motion.text>
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

function Brand({ delay, still }) {
  const word = 'THINK INDIA'.split('');
  const d = (s) => (still ? 0 : delay + s);
  return (
    <div className="intro-brand">
      <motion.div
        className="intro-logo"
        initial={still ? false : { scale: 0.4, opacity: 0, rotate: -40 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: d(0), duration: 0.9, ease: EASE }}
      >
        <img src={logoImg} alt="" width="96" height="96" />
      </motion.div>
      <h1 className="intro-title" aria-label="Think India">
        {word.map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={still ? false : { y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: d(0.15 + i * 0.035), duration: 0.7, ease: EASE }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h1>
      <motion.p
        className="intro-chapter"
        initial={still ? false : { opacity: 0, letterSpacing: '0.6em' }}
        animate={{ opacity: 1, letterSpacing: '0.32em' }}
        transition={{ delay: d(0.55), duration: 0.9, ease: EASE }}
      >
        <span className="intro-x">×</span> MANIT Bhopal Chapter
      </motion.p>
      <motion.span
        className="intro-rule"
        initial={still ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: d(0.7), duration: 0.8, ease: EASE }}
      />
      <motion.p
        className="intro-tagline"
        initial={still ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d(T.LINE - T.BRAND), duration: 0.7, ease: EASE }}
      >
        Where Ideas Meet Nation Building.
      </motion.p>
    </div>
  );
}

export default function Intro({ onDone }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches;
  const [useGlobe, setUseGlobe] = useState(() => !reduced && webgl());
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const t0 = useRef(0);
  const getStart = useCallback(() => t0.current, []);
  const skipRef = useRef(null);
  const [size, setSize] = useState(() => (typeof window === 'undefined' ? 600 : Math.min(window.innerWidth * (small ? 0.92 : 0.7), window.innerHeight * 0.72)));

  const start = useCallback(() => {
    setStarted((s) => {
      if (!s) t0.current = performance.now();
      return true;
    });
  }, []);

  const finish = useCallback(() => setLeaving(true), []);

  // Lock scrolling while the intro is on screen.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skipRef.current?.focus({ preventScroll: true });
    const onKey = (e) => { if (e.key === 'Escape') finish(); };
    const onResize = () => setSize(Math.min(window.innerWidth * (small ? 0.92 : 0.7), window.innerHeight * 0.72));
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [finish, small]);

  // Without the globe, or if it takes too long to arrive, start with the map.
  useEffect(() => {
    if (!useGlobe) { start(); return undefined; }
    const timer = setTimeout(() => { setUseGlobe(false); start(); }, 1400);
    const ok = () => clearTimeout(timer);
    window.addEventListener('ti-globe-ready', ok, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener('ti-globe-ready', ok); };
  }, [useGlobe, start]);

  const mapAt = useGlobe ? T.MAP : 0;
  const total = reduced ? 1.8 : mapAt + T.OUT;

  useEffect(() => {
    if (!started) return undefined;
    const timer = setTimeout(finish, total * 1000);
    return () => clearTimeout(timer);
  }, [started, total, finish]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          className="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Think India × MANIT Bhopal Chapter introduction"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="intro-bg" aria-hidden="true" />

          {!reduced && useGlobe && (
            <Quiet onFail={() => { setUseGlobe(false); start(); }}>
              <Suspense fallback={null}>
                <motion.div
                  className="intro-globe-wrap"
                  initial={{ opacity: 0 }}
                  animate={started ? { opacity: [1, 1, 0] } : { opacity: 1 }}
                  transition={started ? { duration: T.MAP + 0.5, times: [0, T.MAP / (T.MAP + 0.5), 1] } : { duration: 0.6 }}
                >
                  <GlobeScene
                    startAt={getStart}
                    onReady={() => { window.dispatchEvent(new Event('ti-globe-ready')); start(); }}
                  />
                </motion.div>
              </Suspense>
            </Quiet>
          )}

          {!reduced && started && (
            <motion.div
              className="intro-map-wrap"
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={{ opacity: 0.12, filter: 'blur(3px)' }}
              transition={{ delay: mapAt + T.BRAND - 0.15, duration: 0.9 }}
            >
              <MapScene size={size} delay={mapAt} small={small} />
            </motion.div>
          )}

          {started && (
            <motion.div
              className="intro-brand-wrap"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0 : mapAt + T.BRAND - 0.2, duration: 0.6 }}
            >
              <Brand delay={mapAt + T.BRAND} still={reduced} />
            </motion.div>
          )}

          {/* While the 3D globe loads: a quiet turning chakra, not a fake percentage */}
          <AnimatePresence>
            {!started && !reduced && (
              <motion.span className="intro-wait" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <svg viewBox="-40 -40 80 80"><Spokes x={0} y={0} r={30} /></svg>
              </motion.span>
            )}
          </AnimatePresence>

          <span className="intro-vignette" aria-hidden="true" />

          <button ref={skipRef} type="button" className="intro-skip" onClick={finish}>
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
