// src/pages/BharatBuzzPage.jsx – #/bharat-buzz. A news front page for the series:
// lead story, category filter, search, the full archive, and each story opening
// at its own URL (#/bharat-buzz/<id>). All copy comes from src/data/buzz.js.
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, TrendingUp, Users, Globe, Landmark, Search, SearchX, Heart, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { BUZZ_ITEMS, ECI_RECOGNITION } from '../data/buzz';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../data/site';
import ImageWithFallback from '../components/ImageWithFallback';
import BuzzCard, { buzzCategory } from '../components/BuzzCard';
import MedalStrip from '../components/MedalStrip';
import PageHero from '../components/PageHero';
import Sheet from '../components/Sheet';
import { Reveal, Stagger, StaggerItem, EASE_OUT } from '../components/motion';
import { getAssetUrl } from '../utils/assets';
import { hashFor } from '../router';
import { useApp } from '../context';

const METRICS = [
  { icon: TrendingUp, value: '2.5M+', label: 'Total series views' },
  { icon: Users, value: '200K+', label: 'Views on Bharat Buzz 3.0' },
  { icon: Award, value: '29 Medals', label: 'Paralympic coverage' },
  { icon: Globe, value: '7,828', label: 'Followers, Think India handle' },
];

const LEAD = 'bharat-buzz-3';
const CATS = ['All', ...new Set(BUZZ_ITEMS.map(buzzCategory))];

function Story({ item, onClose }) {
  const idx = BUZZ_ITEMS.findIndex((i) => i.id === item.id);
  const prev = BUZZ_ITEMS[(idx - 1 + BUZZ_ITEMS.length) % BUZZ_ITEMS.length];
  const next = BUZZ_ITEMS[(idx + 1) % BUZZ_ITEMS.length];
  // Swap stories without stacking history, so Close still returns to the list.
  const go = (it) => window.location.replace(hashFor('buzz', it.id));
  const titleId = `buzz-title-${item.id}`;
  return (
    <Sheet
      titleId={titleId}
      closeLabel="Close story"
      onClose={onClose}
      blur={getAssetUrl(item.imagePath)}
      media={<ImageWithFallback src={item.imagePath} alt={`${item.title} poster`} title={item.title} />}
      className="modal--story"
    >
      <p className="buzz-kicker"><span>{buzzCategory(item)}</span>{item.title}</p>
      <h2 id={titleId} className="modal-title">{item.focus}</h2>
      <p className="story-text">{item.description}</p>

      {item.medals && <MedalStrip medals={item.medals} />}

      {item.collaborators?.length > 0 && (
        <>
          <h4>In collaboration with</h4>
          <ul className="people">
            {item.collaborators.map((c) => (
              <li key={c.handle}>
                <b>{c.handle}</b>
                <span>{c.desc}</span>
                <em>{c.followers} followers</em>
              </li>
            ))}
          </ul>
        </>
      )}

      {item.likedBy?.length > 0 && (
        <>
          <h4><Heart size={14} aria-hidden="true" /> Liked by</h4>
          <ul className="people">
            {item.likedBy.map((p) => (
              <li key={p.name}><b>{p.name}</b><span>{p.desc}</span></li>
            ))}
          </ul>
        </>
      )}

      <a className="btn btn-primary story-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} aria-hidden="true" /> Watch the series on {INSTAGRAM_HANDLE}
      </a>

      <div className="story-nav">
        <button type="button" className="link-arrow" onClick={() => go(prev)}>
          <ArrowLeft size={16} aria-hidden="true" /> {prev.title}
        </button>
        <button type="button" className="link-arrow" onClick={() => go(next)}>
          {next.title} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </Sheet>
  );
}

export default function BharatBuzzPage() {
  const { route, openDetail, closeDetail } = useApp();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const open = (item) => openDetail('buzz', item.id);
  const selected = route.id ? BUZZ_ITEMS.find((i) => i.id === route.id) : null;
  const lead = BUZZ_ITEMS.find((i) => i.id === LEAD) || BUZZ_ITEMS[0];

  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    return BUZZ_ITEMS.filter((i) => {
      if (cat !== 'All' && buzzCategory(i) !== cat) return false;
      if (!s) return true;
      const hay = [i.title, i.focus, i.description, ...(i.collaborators || []).map((c) => `${c.handle} ${c.desc}`), ...(i.likedBy || []).map((p) => p.name)].join(' ').toLowerCase();
      return hay.includes(s);
    });
  }, [cat, q]);

  return (
    <div className="page-wrap">
      <div className="section-inner">
        <PageHero
          index="०४"
          eyebrow="Bharat Buzz"
          crumb="Bharat Buzz"
          title={<>Our voice, <em>online</em></>}
          shloka={<>॥ राष्ट्राय स्वाहा, इदं न मम ॥ <small>For the nation, not for me</small></>}
          shlokaLabel="Sanskrit: Rashtraya Swaha, Idam Na Mama"
          desc="A video series bringing the pulse of India's major events and developments to screens nationwide, with crisp takes on politics, economy, technology and culture."
          aside={(
            <div className="masthead-card" aria-hidden="true">
              <span className="masthead-card-top">The Bharat Buzz</span>
              <b>2.5M+</b>
              <span>views on Instagram</span>
            </div>
          )}
        />

        <Stagger className="metric-grid" stagger={0.08}>
          {METRICS.map(({ icon: Icon, value, label }) => (
            <StaggerItem key={label} className="metric">
              <div className="ic"><Icon size={22} aria-hidden="true" /></div>
              <b>{value}</b>
              <span>{label}</span>
            </StaggerItem>
          ))}
        </Stagger>

        <section className="ev-section" aria-labelledby="lead-h">
          <Reveal className="mini-head">
            <span className="dev">क</span>
            <h2 id="lead-h">Lead story</h2>
          </Reveal>
          <BuzzCard item={lead} variant="feature" onOpen={open} />
        </section>

        <section className="ev-section" aria-labelledby="all-h">
          <Reveal className="mini-head">
            <span className="dev">ख</span>
            <h2 id="all-h">Every story</h2>
          </Reveal>

          <div className="toolbar">
            <label className="search">
              <span className="sr-only">Search stories</span>
              <Search size={20} aria-hidden="true" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories, topics or collaborators…" />
            </label>
            <div className="filters" role="group" aria-label="Filter by category">
              {CATS.map((c) => (
                <button key={c} type="button" className="filter-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
                  {c} <span className="count">{c === 'All' ? BUZZ_ITEMS.length : BUZZ_ITEMS.filter((i) => buzzCategory(i) === c).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="results-row" aria-live="polite">
            <div>Showing <strong>{list.length}</strong> of {BUZZ_ITEMS.length} stories</div>
            {(q || cat !== 'All') && (
              <button type="button" className="link-arrow" onClick={() => { setQ(''); setCat('All'); }}>Clear filters</button>
            )}
          </div>

          {list.length > 0 ? (
            <motion.div layout className="buzz-grid">
              <AnimatePresence mode="popLayout">
                {list.map((item, idx) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
                    <BuzzCard item={item} idx={idx} onOpen={open} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="empty">
              <SearchX size={40} color="var(--terracotta)" style={{ margin: '0 auto 1rem' }} aria-hidden="true" />
              <h3 className="empty-title">No stories found</h3>
              <p className="empty-text">Nothing matched &ldquo;{q}&rdquo;. Try another term or clear the filters.</p>
            </div>
          )}
        </section>

        <motion.section
          className="eci"
          id="eci"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          aria-labelledby="eci-title"
        >
          <div className="eci-grid">
            <div>
              <span className="badge badge-green">
                <Landmark size={13} aria-hidden="true" /> Constitutional collaboration
              </span>
              <h2 id="eci-title" className="eci-title">{ECI_RECOGNITION.title}</h2>
              <p className="eci-desc">{ECI_RECOGNITION.description}</p>
              <div className="eci-note">
                During General Election 2024, Think India MANIT ran on-campus voter awareness activities with the Election Commission of India, encouraging students to recognise the power of their vote.
              </div>
            </div>
            <div className="eci-img">
              <ImageWithFallback src={ECI_RECOGNITION.imagePath} alt="Election Commission of India Certificate of Appreciation" title="ECI Certificate & Merch" />
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {selected && <Story key="story" item={selected} onClose={() => closeDetail('buzz')} />}
      </AnimatePresence>
    </div>
  );
}
