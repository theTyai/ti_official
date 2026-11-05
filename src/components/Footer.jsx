import { MapPin, Mail, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { Stagger, StaggerItem } from './motion';
import { Toran } from './Ornaments';
import { useApp } from '../context';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, CONTACT_EMAIL } from '../data/site';

const EXPLORE = [
  { label: 'Our story', page: 'about', href: '#/about' },
  { label: 'Why Think India', page: 'home', id: 'why', href: '#why' },
  { label: 'Events', page: 'events', href: '#/events' },
  { label: 'Bharat Buzz', page: 'buzz', href: '#/bharat-buzz' },
  { label: 'Guests', page: 'guests', href: '#/guests' },
  { label: 'Join / Sampark', page: 'sampark', href: '#/sampark' },
];

// Simple camera glyph for the Instagram link (lucide has no brand icons).
function CameraGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const { navigate: onNavigate } = useApp();
  const year = new Date().getFullYear();
  const go = (e, page, id) => {
    e.preventDefault();
    if (onNavigate) onNavigate(page, id || null);
  };

  return (
    <footer className="footer" id="contact">
      <span className="footer-tri" aria-hidden="true" />
      <Toran className="footer-toran" count={21} width={1200} />

      <div className="section-inner">
        <Stagger stagger={0.1} className="footer-grid">
          {/* Brand */}
          <StaggerItem className="footer-brand">
            <div className="brand">
              <span className="brand-logo" style={{ width: 54, height: 54 }}>
                <img src={logoImg} alt="Think India MANIT Chapter logo" width="48" height="48" />
              </span>
              <span>
                <span className="brand-name">THINK INDIA</span>
                <span className="brand-sub">MANIT Chapter</span>
              </span>
            </div>
            <p className="footer-about">
              Fostering national consciousness and grooming young leaders to build a resurgent and self-reliant Bharat.
            </p>
            <p className="footer-shloka" lang="sa">॥ वन्दे मातरम् ॥</p>
          </StaggerItem>

          {/* Explore */}
          <StaggerItem className="footer-explore">
            <h2><span className="dev">अन्वेषण</span>Explore</h2>
            <ul className="footer-links">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <a className="footer-link" href={l.href} onClick={(e) => go(e, l.page, l.id)}>{l.label}</a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Contact */}
          <StaggerItem className="footer-contact-col">
            <h2><span className="dev">सम्पर्क</span>Sampark</h2>
            <address className="footer-contact">
              <div>
                <MapPin size={16} aria-hidden="true" />
                <span>MANIT Campus, Bhopal, Madhya Pradesh</span>
              </div>
              <div>
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">{CONTACT_EMAIL}</a>
              </div>
            </address>
            <a className="footer-link footer-link--accent footer-join" href="#/sampark" onClick={(e) => go(e, 'sampark')}>
              How to join <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </StaggerItem>

          {/* Connect */}
          <StaggerItem className="footer-connect">
            <h2><span className="dev">जुड़ें</span>Connect</h2>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={`Follow Think India MANIT on Instagram (${INSTAGRAM_HANDLE})`}>
              <span className="ic"><CameraGlyph /></span>
              <span style={{ fontSize: '0.92rem', overflowWrap: 'anywhere' }}>{INSTAGRAM_HANDLE}</span>
            </a>
            {/* TODO: add X and LinkedIn when the chapter confirms the URLs */}
            <p className="footer-note">More handles coming soon.</p>
          </StaggerItem>
        </Stagger>

        <p className="footer-word" aria-hidden="true">THINK INDIA</p>

        <div className="footer-bottom">
          <p><span className="tri" aria-hidden="true" />© {year} Think India MANIT Chapter. Vande Mataram.</p>
          <p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-link footer-link--accent">{INSTAGRAM_HANDLE}</a> on Instagram
          </p>
        </div>
      </div>
    </footer>
  );
}
