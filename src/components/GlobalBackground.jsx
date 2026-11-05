// src/components/GlobalBackground.jsx
// The fixed backdrop behind every page:
//  • warm parchment with a faint paper grain and a sandstone skyline of domes and chhatris;
//  • the hero's India map artwork. On the home page it starts on the hero's right
//    (it reads the position of the hero's `.hero-stage` slot) and, as you scroll,
//    glides to the centre, grows and settles behind the content while a parchment veil
//    fades in so sections stay readable. On the other pages it is simply the backdrop.
// With "reduce motion" the map does not travel: the hero draws its own copy and the
// backdrop map just appears once the hero is out of view.
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionValueEvent, useScroll } from 'framer-motion';
import HeritageMap from './HeritageMap';
import { Mandala } from './Ornaments';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Skyline() {
  // Simple silhouette: domes, chhatris and a gateway arch, drawn as one path.
  return (
    <svg className="bg-skyline" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 220V170h60v-30h14v-18c0-14 10-24 22-30 12 6 22 16 22 30v18h14v30h40v-60l10-8 10 8v60h50v-22h12c0-26 16-46 38-56l4-14 4 14c22 10 38 30 38 56h12v22h40v-48h10v-16h8v-10l8-6 8 6v10h8v16h10v48h64v-90c0-34 26-58 58-70l6-18 6 18c32 12 58 36 58 70v90h40v-30h8v-14c0-10 8-18 18-22 10 4 18 12 18 22v14h8v30h70v-70h20v-20c0-22 18-38 40-46l5-12 5 12c22 8 40 24 40 46v20h20v70h50v-36h10v-12c0-8 6-14 14-18 8 4 14 10 14 18v12h10v36h56v-120h8v-14l12-10 12 10v14h8v120h40v-26h12c0-18 12-32 28-40l4-10 4 10c16 8 28 22 28 40h12v26h60v-56h10v-14c0-12 10-22 22-28 12 6 22 16 22 28v14h10v56h80V220Z"
      />
    </svg>
  );
}

/** Slow dust motes in warm light. One small canvas, paused when the tab is hidden. */
function Motes() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return undefined;
    const c = ref.current;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0; let h = 0; let raf = 0; let last = performance.now();
    const n = window.innerWidth < 700 ? 22 : 42;
    const COLORS = ['233,154,54', '189,112,75', '216,194,162', '119,115,74'];
    const motes = Array.from({ length: n }, () => ({
      x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.006, vy: -0.004 - Math.random() * 0.01,
      a: 0.15 + Math.random() * 0.35, ph: Math.random() * Math.PI * 2,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    const size = () => {
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.ph += dt * 0.8;
        m.x += (m.vx + Math.sin(m.ph) * 0.002) * dt * 6;
        m.y += m.vy * dt * 6;
        if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
        if (m.x < -0.02) m.x = 1.02; else if (m.x > 1.02) m.x = -0.02;
        const tw = 0.6 + 0.4 * Math.sin(m.ph * 1.7);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${m.c},${m.a * tw})`;
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    size();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', size);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);
  if (reduced) return null;
  return <canvas ref={ref} className="bg-motes" />;
}

/** Fine geometric lines that drift across the paper, like a surveyor's grid. */
function Lines() {
  return (
    <svg className="bg-lines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <path className="bg-line bg-line--a" d="M-100 720 L520 140 L1540 520" />
        <path className="bg-line bg-line--b" d="M-100 260 Q 720 520 1540 180" />
        <circle className="bg-line bg-line--c" cx="1220" cy="160" r="190" />
        <circle className="bg-line bg-line--c" cx="180" cy="780" r="140" />
      </g>
    </svg>
  );
}

function MapStage({ isHome }) {
  const reduced = useReducedMotion();
  const layout = useRef({ dx: 0, dy: 0, s: 1, has: false });
  const target = useMotionValue(isHome ? 0 : 1);
  const tick = useMotionValue(0);
  const prog = useSpring(target, { stiffness: 90, damping: 24, mass: 0.6 });
  const { scrollY } = useScroll();
  const drift = useSpring(useTransform(scrollY, (y) => (reduced ? 0 : -Math.min(y, 6000) * 0.035)), { stiffness: 60, damping: 20 });
  const [bgHidden, setBgHidden] = useState(isHome);
  const [isBg, setIsBg] = useState(!isHome);
  useMotionValueEvent(prog, 'change', (v) => setIsBg(v > 0.35));

  useEffect(() => {
    const measure = () => {
      const stage = isHome ? document.querySelector('.hero-stage') : null;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = Math.min(vw * (vw < 700 ? 1.15 : 0.82), vh * 1.02); // the map's size as a backdrop
      const el = document.querySelector('.bg-map');
      if (el) { el.style.width = `${size}px`; el.style.height = `${size}px`; }
      if (!stage) { layout.current.has = false; tick.set(tick.get() + 1); return; }
      const r = stage.getBoundingClientRect();
      const side = Math.min(r.width, r.height);
      layout.current = {
        dx: r.left + r.width / 2 - vw / 2,
        dy: r.top + window.scrollY + r.height / 2 - vh / 2, // where it sits when scrolled to the top
        s: side / size,
        has: side > 0,
      };
      tick.set(tick.get() + 1);
    };
    const onScroll = () => {
      const vh = window.innerHeight;
      if (!isHome || !layout.current.has) { target.set(1); setBgHidden(false); return; }
      const p = clamp01(window.scrollY / (vh * 0.75));
      if (reduced) {
        target.jump(1); prog.jump(1);
        setBgHidden(window.scrollY < vh * 0.6);
      } else {
        target.set(p);
        setBgHidden(false);
      }
    };
    measure();
    onScroll();
    if (!isHome) prog.jump(1);
    // Re-measure once fonts and images have settled.
    const t1 = setTimeout(() => { measure(); onScroll(); }, 400);
    const t2 = setTimeout(() => { measure(); onScroll(); }, 1500);
    const onResize = () => { measure(); onScroll(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome, reduced, target, prog, tick]);

  const transform = useTransform([prog, tick, drift], ([p, , d]) => {
    const L = layout.current;
    const e = ease(clamp01(p));
    // Once it is a backdrop, the watermark drifts gently against the scroll.
    const par = (d + (isHome ? window.innerHeight * 0.75 * 0.035 : 0)) * e;
    if (!L.has) return `translate(-50%, -50%) translate(0px, ${par}px)`;
    const x = L.dx * (1 - e);
    const y = L.dy * (1 - e) + par;
    const s = L.s + (1 - L.s) * e;
    return `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`;
  });
  const opacity = useTransform(prog, (p) => 1 - 0.76 * ease(clamp01(p)));
  const veil = useTransform(prog, (p) => ease(clamp01(p)));

  return (
    <>
      <motion.div
        className={`bg-map${isBg ? ' is-bg' : ''}`}
        style={{ transform, opacity: bgHidden ? 0 : opacity }}
      >
        <div className="bg-map-float">
          <HeritageMap animate={isHome && !reduced} labels ambient={!reduced} />
        </div>
      </motion.div>
      <motion.div className="bg-veil" style={{ opacity: veil }} />
    </>
  );
}

export default function GlobalBackground({ page = 'home', ready = true }) {
  const isHome = page === 'home';
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-paper" />
      <div className="bg-light" />
      <Lines />
      <Mandala className="bg-mandala" />
      <Skyline />
      {/* On the home page the map draws itself in only once the intro has finished. */}
      {(ready || !isHome) && <MapStage key={page} isHome={isHome} />}
      <Motes />
      <div className="bg-grain" />
    </div>
  );
}
