// src/components/EventCard.jsx – one event, shared by the home page and the All Events page.
// Posters are small originals, so they are shown as prints on a parchment matte
// (never stretched), with a soft blurred copy filling the frame behind them.
// variant: 'feature' (large, two columns) | 'default'
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { getAssetUrl } from '../utils/assets';

export default function EventCard({ event, onOpen, variant = 'default', bulletCount = 0, motionProps = {} }) {
  const open = () => onOpen(event);
  const poster = getAssetUrl(event.imagePath);
  return (
    <motion.article className={`ev-card ev-card--${variant}`} {...motionProps}>
      <button type="button" className="ev-poster" onClick={open} aria-label={`Open ${event.title} details`}>
        {poster && <span className="ev-poster-bg" style={{ backgroundImage: `url(${poster})` }} aria-hidden="true" />}
        <span className="ev-print">
          <ImageWithFallback src={event.imagePath} alt={`${event.title} poster`} title={event.title} />
        </span>
        <span className="ev-cat">{event.category}</span>
      </button>

      <div className="ev-body">
        {event.date && <p className="ev-date">{event.date}</p>}
        <h3 className="ev-title">
          <button type="button" onClick={open}>{event.title}</button>
        </h3>
        {event.subtitle && <p className="ev-sub">{event.subtitle}</p>}
        {bulletCount > 0 && (
          <ul className="bullets">
            {event.bullets.slice(0, bulletCount).map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
        <div className="ev-foot">
          {event.venue && variant === 'feature' && (
            <span className="ev-venue"><MapPin size={14} aria-hidden="true" />{event.venue}</span>
          )}
          <button type="button" className="link-arrow" onClick={open} aria-label={`View full details for ${event.title}`}>
            View details <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
