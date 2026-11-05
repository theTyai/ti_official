// src/sections/Events.jsx – one large featured event and three secondary events,
// all from src/data/events.js, with the existing details modal.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EVENTS } from '../data/events';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { SectionHeader } from '../components/motion';
import { useApp } from '../context';

const EASE = [0.16, 1, 0.3, 1];
const reveal = (i) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.75, delay: i * 0.1, ease: EASE },
});

export default function Events() {
  const { navigate } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Featured events first, topped up with the most recent others.
  const preview = [...EVENTS.filter((e) => e.featured), ...EVENTS.filter((e) => !e.featured)].slice(0, 4);
  const [lead, ...rest] = preview;

  return (
    <section className="section section--cream" id="events">
      <div className="section-inner">
        <SectionHeader
          index="०३"
          eyebrow="Events & initiatives"
          title={<>Glimpses of <em>our journey</em></>}
          shloka={<>॥ चरैवेति चरैवेति ॥ <small>Keep moving forward</small></>}
          shlokaLabel="Sanskrit shloka: Charaiveti Charaiveti — Keep moving forward"
          desc="Student summits, heritage workshops and nation-building drives at MANIT Bhopal."
        />

        <div className="events-layout">
          <EventCard event={lead} onOpen={setSelectedEvent} variant="feature" bulletCount={2} motionProps={reveal(0)} />
          <div className="events-secondary">
            {rest.map((event, idx) => (
              <EventCard key={event.id} event={event} onOpen={setSelectedEvent} motionProps={reveal(idx + 1)} />
            ))}
          </div>
        </div>

        <motion.div className="section-cta" {...reveal(1)}>
          <p>From Innofest and the voting campaign with ECI to the Freedom Wall and pottery workshop, see the full chronicle.</p>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate('events')}
          >
            All {EVENTS.length} events <ArrowRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </section>
  );
}
