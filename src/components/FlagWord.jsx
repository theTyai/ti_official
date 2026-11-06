// src/components/FlagWord.jsx – the footer wordmark. "THINK INDIA" is cut out of a
// waving tricolour: the bands are wavy paths that drift sideways (a GPU transform,
// no repaint of the page), clipped to the letters, with a soft cloth shading on
// top and the Ashoka Chakra turning between the two words. The fill wipes in
// from the left the first time the wordmark scrolls into view.
import { useId, useRef } from 'react';
import { useInView } from 'framer-motion';

const W = 1200;          // viewBox width
const TOP = 18;          // cap top of the letters
const BASE = 214;        // baseline
const WL = 300;          // wavelength of the cloth wave
const AMP = 7;

/** A closed band from y=-40 down to a sine edge at `y`. */
function band(y, phase = 0) {
  let d = `M ${-WL} -40 L ${W + WL} -40 L ${W + WL} ${y}`;
  for (let x = W + WL; x >= -WL; x -= 15) {
    d += ` L ${x} ${(y + AMP * Math.sin(((x / WL) * 2 + phase) * Math.PI)).toFixed(2)}`;
  }
  return `${d} Z`;
}

const third = (BASE - TOP) / 3;
const SAFFRON = band(TOP + third);
const WHITE = band(TOP + third * 2, 0.15);

const SPOKES = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  return `M0 0 L${(Math.cos(a) * 46).toFixed(2)} ${(Math.sin(a) * 46).toFixed(2)}`;
}).join(' ');

export default function FlagWord({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const clip = `fw-clip-${uid}`;
  const shade = `fw-shade-${uid}`;
  const wipe = `fw-wipe-${uid}`;
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const words = (
    <>
      <text x="0" y={BASE} textLength="505" lengthAdjust="spacingAndGlyphs">THINK</text>
      <text x={W - 505} y={BASE} textLength="505" lengthAdjust="spacingAndGlyphs">INDIA</text>
    </>
  );
  return (
    <svg ref={ref} className={`flag-word${seen ? ' is-in' : ''} ${className}`} viewBox={`0 0 ${W} 240`} role="img" aria-label="Think India">
      <defs>
        <clipPath id={clip}>{words}</clipPath>
        <linearGradient id={shade} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={WL} y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <mask id={wipe} maskUnits="userSpaceOnUse" x="-40" y="-40" width={W + 80} height="320">
          <rect className="flag-word-wipe" x="-40" y="-40" width={W + 80} height="320" fill="#fff" />
        </mask>
      </defs>

      <g className="flag-word-fill" mask={`url(#${wipe})`}>
        <g clipPath={`url(#${clip})`}>
          <g className="flag-word-cloth">
            <rect x={-WL} y="-40" width={W + WL * 2} height="320" fill="var(--flag-green)" />
            <path d={WHITE} fill="#FBF7EE" />
            <path d={SAFFRON} fill="var(--flag-saffron)" />
            <rect x={-WL} y="-40" width={W + WL * 2} height="320" fill={`url(#${shade})`} />
          </g>
        </g>
      </g>

      {/* thin outline over the fill keeps the carved, hollow look */}
      <g className="flag-word-outline">{words}</g>

      {/* Ashoka Chakra between the words */}
      <g transform={`translate(${W / 2} ${(TOP + BASE) / 2})`} className="flag-word-chakra" aria-hidden="true">
        <g className="flag-word-spin">
          <circle r="54" fill="none" stroke="currentColor" strokeWidth="7" />
          <circle r="9" fill="currentColor" />
          <path d={SPOKES} stroke="currentColor" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
