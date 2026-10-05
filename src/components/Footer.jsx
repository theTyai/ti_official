import { motion } from 'framer-motion';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-section" id="contact" style={{ background: 'var(--green-dark)', color: 'var(--bg-parchment)', padding: '6rem 2rem 2rem', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--saffron-vibrant) 33%, white 33%, white 66%, var(--green-india) 66%)' }} />
      
      <div className="section-inner">
        <div className="grid-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4rem', marginBottom: '2rem' }}>
          
          <div style={{ paddingRight: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'white', padding: 4 }}>
                <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
              </div>
              <div>
                <span className="font-yatra" style={{ display: 'block', fontSize: '1.8rem', color: 'var(--gold-rich)', lineHeight: 1 }}>THINK INDIA</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--white)', textTransform: 'uppercase' }}>MANIT Chapter</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '1rem' }}>
              Fostering national consciousness and grooming young leaders to build a resurgent and self-reliant Bharat.
            </p>
          </div>

          <div>
            <h4 className="font-yatra" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--gold-dark)' }}>Sampark (Contact)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--gold-dark)' }}>📍</span>
                <span>MANIT Campus, Bhopal, Madhya Pradesh</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--gold-dark)' }}>✉️</span>
                <span>thinkindia@manit.ac.in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-yatra" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--gold-dark)' }}>Judein (Connect)</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['IG', 'X', 'IN'].map((platform) => (
                <a key={platform} href="#" style={{ width: 45, height: 45, borderRadius: '50%', border: '2px solid var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', color: 'var(--gold-dark)', fontWeight: 'bold' }}
                   onMouseEnter={(e) => { e.target.style.background = 'var(--gold-dark)'; e.target.style.color = 'var(--green-dark)'; }}
                   onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--gold-dark)'; }}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
          <p>© {year} Think India MANIT Chapter. Vande Mataram.</p>
        </div>

      </div>
    </footer>
  );
}
