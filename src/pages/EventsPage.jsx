// src/pages/EventsPage.jsx – #/events. Hero, the flagship spotlight, an honest
// "upcoming" panel, and the full searchable archive. Each event opens at its own
// URL (#/events/<id>); closing it returns to the list exactly as it was.
// Every event, date and detail comes from src/data/events.js.
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, SearchX, ArrowUpRight, CalendarClock, MessageCircle, MapPin, Calendar } from 'lucide-react';
import { EVENTS, EVENT_CATEGORIES } from '../data/events';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../data/site';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import ImageWithFallback from '../components/ImageWithFallback';
import PageHero from '../components/PageHero';
import { Reveal, EASE_OUT } from '../components/motion';
import { getAssetUrl } from '../utils/assets';
import { useApp } from '../context';

const STORE = 'ti-events-filter';
const MONTHS = 'january february march april may june july august september october november december'.split(' ');

/** A full calendar date ("8 August 2026") → Date, else null. Ranges and undated events return null. */
function exactDate(str) {
  const m = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec((str || '').trim());
  if (!m) return null;
  const mi = MONTHS.indexOf(m[2].toLowerCase());
  return mi < 0 ? null : new Date(Number(m[3]), mi, Number(m[1]));
}

function readStore() {
  try { return JSON.parse(sessionStorage.getItem(STORE)) || {}; } catch { return {}; }
}

function Spotlight({ event, onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const poster = getAssetUrl(event.imagePath);
  return (
    <motion.article
      ref={ref}
      className="spotlight"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      <button type="button" className="spotlight-media" onClick={() => onOpen(event)} aria-label={`Open ${event.title} details`}>
        {poster && <span className="spotlight-bg" style={{ backgroundImage: `url(${poster})` }} aria-hidden="true" />}
        <motion.span className="spotlight-print float-idle" style={{ y }}>
          <ImageWithFallback src={event.imagePath} alt={`${event.title} poster`} title={event.title} />
        </motion.span>
      </button>
      <div className="spotlight-body">
        <span className="badge badge-gold">★ Flagship · {event.category}</span>
        <h2 className="spotlight-title">{event.title}</h2>
        {event.subtitle && <p className="ev-sub">{event.subtitle}</p>}
        <div className="spotlight-facts">
          {event.date && <span><Calendar size={15} aria-hidden="true" />{event.date}</span>}
          {event.venue && <span><MapPin size={15} aria-hidden="true" />{event.venue}</span>}
        </div>
        <p className="spotlight-text">{event.bullets[0]}</p>
        <button type="button" className="btn btn-dark" onClick={() => onOpen(event)}>
          Read the full story <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}

export default function EventsPage() {
  const { route, openDetail, closeDetail } = useApp();
  const saved = readStore();
  const [activeCategory, setActiveCategory] = useState(EVENT_CATEGORIES.includes(saved.cat) ? saved.cat : 'All');
  const [searchQuery, setSearchQuery] = useState(saved.q || '');

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify({ cat: activeCategory, q: searchQuery })); } catch { /* ignore */ }
  }, [activeCategory, searchQuery]);

  const selected = route.id ? EVENTS.find((e) => e.id === route.id) : null;
  const open = (event) => openDetail('events', event.id);

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const upcoming = useMemo(() => EVENTS.filter((e) => { const d = exactDate(e.date); return d && d >= today; }), [today]);
  const flagship = EVENTS.find((e) => e.featured && !upcoming.includes(e)) || EVENTS[0];
  const latest = EVENTS.map((e) => exactDate(e.date)).filter(Boolean).sort((a, b) => b - a)[0];

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return EVENTS.filter((e) => {
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.date && e.date.toLowerCase().includes(q)) ||
        e.bullets.some((b) => b.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const categoryCount = EVENT_CATEGORIES.length - 1;

  return (
    <div className="page-wrap">
      <div className="section-inner">
        <PageHero
          index="०३"
          eyebrow="Events & initiatives"
          crumb="Events"
          title={<>Glimpses of <em>our journey</em></>}
          shloka={<>॥ चरैवेति चरैवेति ॥ <small>Keep moving forward</small></>}
          shlokaLabel="Sanskrit: Charaiveti Charaiveti, keep moving forward"
          desc="Workshops, innovation fests, cultural festivals and nation-building drives across the MANIT campus."
          aside={(
            <dl className="hero-ledger">
              <div><dt>Events on record</dt><dd>{EVENTS.length}</dd></div>
              <div><dt>Categories</dt><dd>{categoryCount}</dd></div>
              <div><dt>Most recent</dt><dd className="small">{latest ? latest.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</dd></div>
            </dl>
          )}
        />

        {/* Flagship */}
        <section className="ev-section" aria-labelledby="flagship-h">
          <Reveal className="mini-head">
            <span className="dev">क</span>
            <h2 id="flagship-h">Flagship</h2>
          </Reveal>
          <Spotlight event={flagship} onOpen={open} />
        </section>

        {/* Upcoming */}
        <section className="ev-section" aria-labelledby="upcoming-h">
          <Reveal className="mini-head">
            <span className="dev">ख</span>
            <h2 id="upcoming-h">Upcoming</h2>
          </Reveal>
          {upcoming.length > 0 ? (
            <div className="events-grid">
              {upcoming.map((event) => <EventCard key={event.id} event={event} onOpen={open} />)}
            </div>
          ) : (
            <Reveal className="upcoming-empty">
              <CalendarClock size={30} aria-hidden="true" />
              <div>
                <h3>No upcoming events announced yet</h3>
                <p>New events are announced on Instagram first. Follow {INSTAGRAM_HANDLE} so you hear about the next workshop, drive or talk.</p>
              </div>
              <a className="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" /> Follow on Instagram
              </a>
            </Reveal>
          )}
        </section>

        {/* Archive */}
        <section className="ev-section" aria-labelledby="archive-h">
          <Reveal className="mini-head">
            <span className="dev">ग</span>
            <h2 id="archive-h">The archive</h2>
          </Reveal>

          <div className="toolbar">
            <label className="search">
              <span className="sr-only">Search events</span>
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, keyword, speaker or venue…"
              />
            </label>
            <div className="filters" role="group" aria-label="Filter by category">
              {EVENT_CATEGORIES.map((cat) => {
                const count = cat === 'All' ? EVENTS.length : EVENTS.filter((e) => e.category === cat).length;
                return (
                  <button key={cat} type="button" className="filter-chip" aria-pressed={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                    {cat} <span className="count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="results-row" aria-live="polite">
            <div>Showing <strong>{filteredEvents.length}</strong> of {EVENTS.length} events</div>
            {(searchQuery || activeCategory !== 'All') && (
              <button type="button" className="link-arrow" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                Clear filters
              </button>
            )}
          </div>

          {filteredEvents.length > 0 ? (
            <motion.div layout className="events-grid">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onOpen={open}
                    motionProps={{
                      layout: true,
                      initial: { opacity: 0, y: 24, scale: 0.97 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
                      transition: { duration: 0.45, delay: Math.min(index, 8) * 0.05, ease: EASE_OUT },
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="empty">
              <SearchX size={40} color="var(--terracotta)" style={{ margin: '0 auto 1rem' }} aria-hidden="true" />
              <h3 className="empty-title">No events found</h3>
              <p className="empty-text">
                {searchQuery
                  ? <>No events matched &ldquo;{searchQuery}&rdquo;{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}. Try another term or clear the filters.</>
                  : <>No events in this category yet.</>}
              </p>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selected && <EventModal key={selected.id} event={selected} onClose={() => closeDetail('events')} />}
      </AnimatePresence>
    </div>
  );
}
