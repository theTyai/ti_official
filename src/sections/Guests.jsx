// src/sections/Guests.jsx – previous guests as an editorial portrait wall:
// tall arch-topped frames on warm sandstone, staggered columns, terracotta index.
import { motion } from 'framer-motion';
import { GUESTS } from '../data/guests';
import ImageWithFallback from '../components/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/motion';
import { useApp } from '../context';

const EASE = [0.16, 1, 0.3, 1];

export default function Guests() {
  const { navigate, openDetail } = useApp();
  return (
    <section className="section section--paper" id="guests">
      <div className="section-inner">
        <SectionHeader
          index="०५"
          eyebrow="Previous guests"
          title={<>Voices who <em>inspired us</em></>}
          shloka={<>॥ अतिथि देवो भव ॥ <small>The guest is god</small></>}
          shlokaLabel="Sanskrit: Atithi Devo Bhava"
          desc="Civil servants, authors, founders and leaders who have addressed the MANIT community."
        />

        <ul className="guest-wall">
          {GUESTS.map((guest, i) => (
            <motion.li
              key={guest.id}
              className="guest"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: (i % 5) * 0.08, ease: EASE }}
            >
              <figure>
                <div className="guest-frame">
                  <motion.div
                    className="guest-img"
                    initial={{ clipPath: 'inset(100% 0 0 0)' }}
                    whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: 0.15 + (i % 5) * 0.08, ease: EASE }}
                  >
                    <ImageWithFallback src={guest.imagePath} alt={`Portrait of ${guest.name}`} title={guest.name} />
                  </motion.div>
                  <span className="guest-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <figcaption>
                  <h3><button type="button" className="stretch" onClick={() => openDetail('guests', guest.id)}>{guest.name}</button></h3>
                  <p>{guest.designation}</p>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>

        <div className="section-cta">
          <p>Every guest, with their roles and the sessions they led at MANIT.</p>
          <button type="button" className="btn btn-dark" onClick={() => navigate('guests')}>
            All guest profiles <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
