// src/components/Ornaments.jsx – heritage ornaments used sparingly across the site.
//  • Toran: a festive doorway garland, drawn as a fine line with hanging leaves; it
//    draws itself when it scrolls into view. Used as a section divider.
//  • Mandala: lotus geometry for slow ambient rotation in backgrounds.
//  • ArchFrame: a jharokha (cusped-arch window) frame around an image.
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

export function Toran({ className = '', count = 13, width = 520 }) {
  const step = width / (count - 1);
  // Garland: a run of shallow scallops between the drops.
  let d = `M 0 8`;
  for (let i = 0; i < count - 1; i++) d += ` Q ${i * step + step / 2} 26 ${(i + 1) * step} 8`;
  return (
    <svg className={`toran ${className}`} viewBox={`-6 0 ${width + 12} 64`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <motion.path
        d={`M -6 8 H ${width + 6}`}
        stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.path
        d={d}
        stroke="currentColor" strokeWidth="1.4" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.6, delay: 0.15, ease: EASE }}
      />
      {Array.from({ length: count }, (_, i) => {
        const x = i * step;
        const long = i % 2 === 0;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: EASE }}
          >
            <line x1={x} y1="8" x2={x} y2={long ? 30 : 20} stroke="currentColor" strokeWidth="1" />
            {/* mango-leaf drop */}
            <path
              d={`M ${x} ${long ? 30 : 20} q 6 8 0 ${long ? 22 : 14} q -6 -${long ? 14 : 6} 0 -${long ? 22 : 14} z`}
              fill={long ? 'var(--terracotta)' : 'var(--olive)'}
              opacity={long ? 0.9 : 0.75}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

const pt = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [250 + r * Math.cos(a), 250 + r * Math.sin(a)];
};

export function Mandala({ className = '' }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  return (
    <svg className={`mandala ${className}`} viewBox="0 0 500 500" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="250" cy="250" r="240" />
        <circle cx="250" cy="250" r="232" strokeDasharray="2 8" />
        <circle cx="250" cy="250" r="170" />
        <circle cx="250" cy="250" r="96" />
        <circle cx="250" cy="250" r="40" />
        {petals.map((deg) => {
          const [x1, y1] = pt(170, deg - 11.25);
          const [x2, y2] = pt(170, deg + 11.25);
          const [tx, ty] = pt(232, deg);
          return <path key={deg} d={`M ${x1} ${y1} Q ${pt(215, deg - 6).join(' ')} ${tx} ${ty} Q ${pt(215, deg + 6).join(' ')} ${x2} ${y2}`} />;
        })}
        {inner.map((deg) => {
          const [x1, y1] = pt(96, deg - 22.5);
          const [x2, y2] = pt(96, deg + 22.5);
          const [tx, ty] = pt(165, deg);
          return <path key={deg} d={`M ${x1} ${y1} Q ${tx} ${ty} ${x2} ${y2}`} />;
        })}
        {Array.from({ length: 24 }, (_, i) => {
          const [x1, y1] = pt(40, i * 15);
          const [x2, y2] = pt(96, i * 15);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

/** Jharokha-style frame: a cusped arch mask over the image, with a sandstone keyline. */
export function ArchFrame({ children, className = '' }) {
  return (
    <div className={`arch-frame ${className}`}>
      <div className="arch-frame-mask">{children}</div>
    </div>
  );
}
