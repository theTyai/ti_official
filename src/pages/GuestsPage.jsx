// src/pages/GuestsPage.jsx – #/guests. A directory of the chapter's previous guests
// with search and field filters, and a profile for each at #/guests/<id>.
// Profiles show only what the chapter has published: name, portrait, designation,
// and any event on this site that names the guest. No biographies are invented.
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SearchX, ArrowUpRight, ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { GUESTS } from '../data/guests';
import { EVENTS } from '../data/events';
import ImageWithFallback from '../components/ImageWithFallback';
import PageHero from '../components/PageHero';
import Sheet from '../components/Sheet';
import { ArchFrame } from '../components/Ornaments';
import { EASE_OUT } from '../components/motion';
import { getAssetUrl } from '../utils/assets';
import { hashFor } from '../router';
import { useApp } from '../context';

// Fields, worked out from each guest's own designation.
const FIELDS = [
  { key: 'Public life', test: /IAS|Advocate|Activist/i },
  { key: 'Founders & industry', test: /Founder|CEO|Director|Starlink|PayPal|Startup/i },
  { key: 'Authors & thinkers', test: /Author|Columnist|Screenwriter|Academician|Thought Leader|Speaker/i },
];
const fieldsOf = (g) => FIELDS.filter((f) => f.test.test(g.designation)).map((f) => f.key);

/** Designation → separate roles ("IAS Officer, Speaker & Author" → three lines). */
const rolesOf = (g) => g.designation.split(/;\s*|,\s*(?![^()]*\))/).map((r) => r.trim()).filter(Boolean);

/** Events on this site whose text names the guest. */
function eventsFor(g) {
  const plain = g.name.replace(/^(Mr|Mrs|Ms|Dr)\.\s*/i, '');
  return EVENTS.filter((e) => [e.title, e.subtitle, ...e.bullets].join(' ').includes(plain));
}

const SALUTE = { 'Mr.': 'श्री', 'Mrs.': 'श्रीमती', 'Ms.': 'सुश्री', 'Dr.': 'डॉ.' };

function Profile({ guest, onClose, openEvent }) {
  const idx = GUESTS.findIndex((g) => g.id === guest.id);
  const prev = GUESTS[(idx - 1 + GUESTS.length) % GUESTS.length];
  const next = GUESTS[(idx + 1) % GUESTS.length];
  const go = (g) => window.location.replace(hashFor('guests', g.id));
  const events = eventsFor(guest);
  const salute = SALUTE[guest.name.split(' ')[0]];
  const titleId = `guest-title-${guest.id}`;
  return (
    <Sheet
      titleId={titleId}
      closeLabel="Close profile"
      onClose={onClose}
      blur={getAssetUrl(guest.imagePath)}
      className="modal--profile"
      media={(
        <ArchFrame className="profile-arch">
          <ImageWithFallback src={guest.imagePath} alt={`Portrait of ${guest.name}`} title={guest.name} />
        </ArchFrame>
      )}
    >
      <p className="profile-kicker">
        <span className="dev" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
        Guest of Think India MANIT{salute ? <span lang="hi" aria-hidden="true"> · {salute}</span> : null}
      </p>
      <h2 id={titleId} className="modal-title">{guest.name}</h2>

      <h4>Roles</h4>
      <ul className="role-list">
        {rolesOf(guest).map((r) => <li key={r}>{r}</li>)}
      </ul>

      <div className="chips profile-fields">
        {fieldsOf(guest).map((f) => <span key={f} className="chip-sm">{f}</span>)}
      </div>

      <h4>With the chapter</h4>
      {events.length > 0 ? (
        <ul className="profile-events">
          {events.map((e) => (
            <li key={e.id}>
              <CalendarDays size={16} aria-hidden="true" />
              <div>
                <b>{e.title}</b>
                <span>{e.bullets.find((b) => b.includes(guest.name.replace(/^(Mr|Mrs|Ms|Dr)\.\s*/i, ''))) || e.subtitle}</span>
                <button type="button" className="link-arrow" onClick={() => openEvent(e.id)}>
                  Open the event <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="profile-note">
          {guest.name} has addressed the MANIT community as a guest of the chapter. Notes from the session have not been published on this site yet.
        </p>
      )}

      <div className="story-nav">
        <button type="button" className="link-arrow" onClick={() => go(prev)}>
          <ArrowLeft size={16} aria-hidden="true" /> {prev.name}
        </button>
        <button type="button" className="link-arrow" onClick={() => go(next)}>
          {next.name} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </Sheet>
  );
}

export default function GuestsPage() {
  const { route, openDetail, closeDetail } = useApp();
  const [q, setQ] = useState('');
  const [field, setField] = useState('All');
  const selected = route.id ? GUESTS.find((g) => g.id === route.id) : null;

  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    return GUESTS.filter((g) => {
      if (field !== 'All' && !fieldsOf(g).includes(field)) return false;
      return !s || `${g.name} ${g.designation}`.toLowerCase().includes(s);
    });
  }, [q, field]);

  return (
    <div className="page-wrap">
      <div className="section-inner">
        <PageHero
          index="०५"
          eyebrow="Previous guests"
          crumb="Guests"
          title={<>Voices who <em>inspired us</em></>}
          shloka={<>॥ अतिथि देवो भव ॥ <small>The guest is god</small></>}
          shlokaLabel="Sanskrit: Atithi Devo Bhava"
          desc="Civil servants, authors, founders and leaders who have addressed the MANIT community."
          aside={(
            <div className="guest-stack" aria-hidden="true">
              {GUESTS.slice(0, 3).map((g, i) => (
                <span key={g.id} className={`guest-stack-${i}`}>
                  <ImageWithFallback src={g.imagePath} alt="" title={g.name} />
                </span>
              ))}
            </div>
          )}
        />

        <div className="toolbar">
          <label className="search">
            <span className="sr-only">Search guests</span>
            <Search size={20} aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or role…" />
          </label>
          <div className="filters" role="group" aria-label="Filter by field">
            {['All', ...FIELDS.map((f) => f.key)].map((f) => (
              <button key={f} type="button" className="filter-chip" aria-pressed={field === f} onClick={() => setField(f)}>
                {f} <span className="count">{f === 'All' ? GUESTS.length : GUESTS.filter((g) => fieldsOf(g).includes(f)).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="results-row" aria-live="polite">
          <div>Showing <strong>{list.length}</strong> of {GUESTS.length} guests</div>
          {(q || field !== 'All') && (
            <button type="button" className="link-arrow" onClick={() => { setQ(''); setField('All'); }}>Clear filters</button>
          )}
        </div>

        {list.length > 0 ? (
          <motion.ul layout className="guest-register">
            <AnimatePresence mode="popLayout">
              {list.map((g, i) => {
                const n = GUESTS.indexOf(g) + 1;
                return (
                  <motion.li
                    key={g.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: EASE_OUT }}
                  >
                    <button type="button" className="register-row" onClick={() => openDetail('guests', g.id)} aria-label={`Open profile of ${g.name}`}>
                      <span className="register-num" aria-hidden="true">{String(n).padStart(2, '0')}</span>
                      <span className="register-photo">
                        <ImageWithFallback src={g.imagePath} alt="" title={g.name} />
                      </span>
                      <span className="register-copy">
                        <b>{g.name}</b>
                        <span>{g.designation}</span>
                      </span>
                      <span className="register-go" aria-hidden="true"><ArrowUpRight size={20} /></span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="empty">
            <SearchX size={40} color="var(--terracotta)" style={{ margin: '0 auto 1rem' }} aria-hidden="true" />
            <h3 className="empty-title">No guests found</h3>
            <p className="empty-text">Nothing matched &ldquo;{q}&rdquo;. Try another name or clear the filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <Profile key="profile" guest={selected} onClose={() => closeDetail('guests')} openEvent={(id) => openDetail('events', id)} />
        )}
      </AnimatePresence>
    </div>
  );
}
