// src/components/HeritageMap.jsx
// The hero's signature artwork: India drawn as a window onto heritage architecture
// (Amer Fort, from the chapter's own deck), framed by an eight-point jaali star and
// fine concentric rings, with a misregistered tricolour outline and the Ashoka chakra
// marking MANIT Bhopal. Pure SVG, so it is crisp at any size and cheap to animate.
import { useId } from 'react';
import { motion } from 'framer-motion';
import { INDIA_PATH, BHOPAL } from '../data/indiaPath';
import amerFort from '../assets/heritage/amer-fort.jpg';

const EASE = [0.16, 1, 0.3, 1];
const CX = 399;
const CY = 444;

// Eight-point star (two squares) used in Mughal and Rajput jaali work.
function starPoints(r) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    pts.push(`${CX + Math.cos(a) * r},${CY + Math.sin(a) * r}`);
  }
  return pts;
}

function Chakra({ x, y, r }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} />;
  });
  return (
    <g className="hm-chakra" style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y} r={r} fill="rgba(250,247,240,0.92)" />
      <g stroke="#1B2A8C" strokeWidth="1.3">{spokes}</g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#1B2A8C" strokeWidth="2.4" />
      <circle cx={x} cy={y} r={r * 0.2} fill="#1B2A8C" />
    </g>
  );
}

/**
 * @param {boolean} animate  play the entrance (draw-on) animation
 * @param {boolean} labels   show the Bhopal call-out
 */
export default function HeritageMap({ animate = true, labels = true, ambient = true, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const clip = `hm-clip-${uid}`;
  const tone = `hm-tone-${uid}`;
  const sheen = `hm-sheen-${uid}`;
  const s = starPoints(410);
  const squareA = [s[0], s[2], s[4], s[6]].join(' ');
  const squareB = [s[1], s[3], s[5], s[7]].join(' ');

  const draw = (delay, duration = 2.2) => (animate
    ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { pathLength: { duration, delay, ease: 'easeInOut' }, opacity: { duration: 0.3, delay } } }
    : {});
  const fade = (delay, extra = {}) => (animate
    ? { initial: { opacity: 0, ...extra.from }, animate: { opacity: 1, ...extra.to }, transition: { duration: 1.2, delay, ease: EASE } }
    : {});

  return (
    <svg className={`heritage-map ${className}`} viewBox="-40 -20 880 930" role="img" aria-label="Map of India showing Bhopal, filled with an image of Amer Fort">
      <defs>
        <clipPath id={clip}><path d={INDIA_PATH} /></clipPath>
        <linearGradient id={tone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E99A36" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#BD704B" stopOpacity="0.12" />
          <stop offset="1" stopColor="#39271F" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0.35" stopColor="#FFF6E4" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF6E4" stopOpacity="0.45" />
          <stop offset="0.65" stopColor="#FFF6E4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Geometric frame: rings + eight-point star, turning very slowly */}
      <motion.g className="hm-frame" {...fade(0.1, { from: { scale: 0.9 }, to: { scale: 1 } })} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <g className="hm-spin" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r="430" fill="none" stroke="#D8C2A2" strokeWidth="1.2" />
          <circle cx={CX} cy={CY} r="414" fill="none" stroke="#D8C2A2" strokeWidth="0.8" strokeDasharray="2 9" />
          <polygon points={squareA} fill="none" stroke="#BD704B" strokeWidth="1" opacity="0.55" />
          <polygon points={squareB} fill="none" stroke="#BD704B" strokeWidth="1" opacity="0.55" />
          {s.map((p, i) => {
            const [x, y] = p.split(',').map(Number);
            return <circle key={i} cx={x} cy={y} r="4.5" fill="#A65338" />;
          })}
        </g>
        <circle cx={CX} cy={CY} r="300" fill="none" stroke="#D8C2A2" strokeWidth="0.8" />
        {ambient && (
          <g className="hm-orbit" style={{ transformOrigin: `${CX}px ${CY}px` }}>
            <circle cx={CX} cy={CY - 430} r="7" fill="#E99A36" />
            <circle cx={CX} cy={CY - 430} r="14" fill="#E99A36" opacity="0.25" />
          </g>
        )}
        {ambient && (
          <g className="hm-orbit hm-orbit--slow" style={{ transformOrigin: `${CX}px ${CY}px` }}>
            <circle cx={CX} cy={CY + 300} r="4.5" fill="#138808" opacity="0.8" />
          </g>
        )}
      </motion.g>

      {/* Tricolour misregistration behind the map */}
      <motion.path d={INDIA_PATH} fill="none" stroke="#FF9933" strokeWidth="3" transform="translate(-12 -9)" opacity="0.75" {...draw(0.3)} />
      <motion.path d={INDIA_PATH} fill="none" stroke="#138808" strokeWidth="3" transform="translate(12 9)" opacity="0.7" {...draw(0.45)} />

      {/* The map itself: heritage photograph with a warm duotone */}
      <motion.g {...fade(0.55, { from: { scale: 0.96 }, to: { scale: 1 } })} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <g clipPath={`url(#${clip})`}>
          <rect x="30" y="40" width="740" height="810" fill="#EDE1D0" />
          <image href={amerFort} x="-10" y="20" width="820" height="840" preserveAspectRatio="xMidYMid slice" className="hm-photo" />
          <rect x="30" y="40" width="740" height="810" fill={`url(#${tone})`} />
          <rect x="30" y="40" width="740" height="810" fill="#F3EBDD" opacity="0.08" />
          {ambient && <rect className="hm-sheen" x="-300" y="40" width="740" height="810" fill={`url(#${sheen})`} />}
        </g>
      </motion.g>
      <motion.path d={INDIA_PATH} fill="none" stroke="#39271F" strokeWidth="2.4" strokeLinejoin="round" {...draw(0.2, 2.6)} />
      {/* A point of saffron light that keeps tracing the coastline and border */}
      {ambient && (
        <>
          <path className="hm-trace" d={INDIA_PATH} pathLength="1000" fill="none" stroke="#E99A36" strokeWidth="5" strokeLinecap="round" />
          <path className="hm-trace hm-trace--b" d={INDIA_PATH} pathLength="1000" fill="none" stroke="#FAF7F0" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* MANIT Bhopal */}
      <motion.g {...fade(1.6)}>
        <circle className="hm-pulse" cx={BHOPAL.x} cy={BHOPAL.y} r="34" fill="none" stroke="#A65338" strokeWidth="2" style={{ transformOrigin: `${BHOPAL.x}px ${BHOPAL.y}px` }} />
        <Chakra x={BHOPAL.x} y={BHOPAL.y} r={24} />
        {labels && (
          <g className="hm-label">
            <polyline points={`${BHOPAL.x - 28},${BHOPAL.y + 8} ${BHOPAL.x - 120},${BHOPAL.y + 70} ${BHOPAL.x - 250},${BHOPAL.y + 70}`} fill="none" stroke="#39271F" strokeWidth="1.4" />
            <circle cx={BHOPAL.x - 250} cy={BHOPAL.y + 70} r="4" fill="#39271F" />
            <text x={BHOPAL.x - 250} y={BHOPAL.y + 56} className="hm-t1">MANIT · BHOPAL</text>
            <text x={BHOPAL.x - 250} y={BHOPAL.y + 100} className="hm-t2">भोपाल · 23.26° N</text>
          </g>
        )}
      </motion.g>
    </svg>
  );
}
