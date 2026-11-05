// src/components/BuzzCard.jsx – one Bharat Buzz story, shared by the home page and the Buzz page.
// variant: 'feature' (lead story) | 'row' (compact headline row) | 'default' (archive card)
import { motion } from 'framer-motion';
import { Users, Heart, ArrowUpRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import MedalStrip from './MedalStrip';

export const BUZZ_CATEGORY = {
  'bharat-buzz-2': 'Policy',
  'bharat-buzz-3': 'Tribute',
  'paris-olympics': 'Sport',
  'paralympics': 'Sport',
};

export const buzzCategory = (item) => BUZZ_CATEGORY[item.id] || 'Digital';

export default function BuzzCard({ item, idx = 0, variant = 'default', showLikedBy = false, onOpen }) {
  const cat = buzzCategory(item);
  const open = onOpen ? () => onOpen(item) : null;
  const isRow = variant === 'row';
  return (
    <motion.article
      className={`buzz-card buzz-card--${variant}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: (idx % 3) * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {open ? (
        <button type="button" className="buzz-media" onClick={open} aria-label={`Read ${item.title}: ${item.focus}`}>
          <ImageWithFallback src={item.imagePath} alt={`${item.title} poster`} title={item.title} />
        </button>
      ) : (
        <div className="buzz-media">
          <ImageWithFallback src={item.imagePath} alt={`${item.title} poster`} title={item.title} />
        </div>
      )}

      <div className="buzz-body">
        <p className="buzz-kicker"><span>{cat}</span>{item.title}</p>
        <h3 className="buzz-headline">
          {open ? <button type="button" onClick={open}>{item.focus}</button> : item.focus}
        </h3>
        {!isRow && <p className="buzz-desc">{item.description}</p>}

        {!isRow && item.medals && <MedalStrip medals={item.medals} />}

        {!isRow && item.collaborators && item.collaborators.length > 0 && (
          <div className="collab">
            <div className="collab-label"><Users size={13} aria-hidden="true" /> In collaboration with</div>
            <div className="chips">
              {item.collaborators.map((c) => (
                <span key={c.handle} className="chip-sm" title={`${c.handle} (${c.desc})`}>
                  {c.handle} <em>{c.followers}</em>
                </span>
              ))}
            </div>
          </div>
        )}

        {showLikedBy && item.likedBy && item.likedBy.length > 0 && (
          <div className="collab">
            <div className="collab-label"><Heart size={13} aria-hidden="true" /> Liked by</div>
            <p className="liked-by">{item.likedBy.map((p) => p.name).join(' · ')}</p>
          </div>
        )}
        {open && (
          <button type="button" className="link-arrow buzz-read" onClick={open}>
            Read the story <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.article>
  );
}
