// src/components/MedalStrip.jsx – Gold / silver / bronze tiles with a count-up animation.
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

const MEDALS = [
  { key: 'gold', label: 'Gold', color: '#B7791F', bg: 'rgba(255,193,7,0.12)', border: 'rgba(214,158,46,0.6)' },
  { key: 'silver', label: 'Silver', color: '#5B6170', bg: 'rgba(148,163,184,0.14)', border: 'rgba(148,163,184,0.6)' },
  { key: 'bronze', label: 'Bronze', color: '#A0612A', bg: 'rgba(205,127,50,0.12)', border: 'rgba(205,127,50,0.55)' },
];

function MedalTile({ medal, value, idx }) {
  const [count, ref] = useCountUp(value, 1500);
  return (
    <motion.div
      ref={ref}
      className="medal"
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + idx * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
      style={{ background: medal.bg, borderColor: medal.border }}
    >
      <b style={{ color: medal.color }}>{Math.min(count, value)}</b>
      <span>{medal.label}</span>
    </motion.div>
  );
}

export default function MedalStrip({ medals }) {
  return (
    <div className="medals">
      {MEDALS.map((m, idx) => (
        <MedalTile key={m.key} medal={m} value={medals[m.key]} idx={idx} />
      ))}
    </div>
  );
}
