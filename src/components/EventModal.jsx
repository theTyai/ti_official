// src/components/EventModal.jsx – event details in the shared Sheet dialog:
// the full poster, facts, and every highlight from src/data/events.js.
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import Sheet from './Sheet';
import { getAssetUrl } from '../utils/assets';

export default function EventModal({ event, onClose }) {
  const titleId = `ev-title-${event.id}`;
  return (
    <Sheet
      titleId={titleId}
      closeLabel="Close event details"
      onClose={onClose}
      blur={getAssetUrl(event.imagePath)}
      media={<ImageWithFallback src={event.imagePath} alt={`${event.title} poster`} title={event.title} />}
    >
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-saffron">{event.category}</span>
        {event.featured && <span className="badge badge-gold">★ Flagship initiative</span>}
      </div>

      <h2 id={titleId} className="modal-title">{event.title}</h2>
      {event.subtitle && <p className="ev-sub">{event.subtitle}</p>}

      {(event.date || event.venue || event.time || event.prizes) && (
        <div className="modal-facts">
          {event.date && <div><Calendar size={16} aria-hidden="true" /><span><strong>Date</strong>{event.date}</span></div>}
          {event.time && <div><Clock size={16} aria-hidden="true" /><span><strong>Time</strong>{event.time}</span></div>}
          {event.venue && <div><MapPin size={16} aria-hidden="true" /><span><strong>Venue</strong>{event.venue}</span></div>}
          {event.prizes && <div><Trophy size={16} aria-hidden="true" /><span><strong>Recognition &amp; awards</strong>{event.prizes}</span></div>}
        </div>
      )}

      <h4>Highlights &amp; impact</h4>
      <motion.ul
        className="bullets"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
      >
        {event.bullets.map((b, i) => (
          <motion.li key={i} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
            {b}
          </motion.li>
        ))}
      </motion.ul>
    </Sheet>
  );
}
