import { motion } from 'framer-motion';

const VISION_POINTS = [
  { icon: '🌺', title: 'Cultural Resurgence (Sanskriti)', desc: 'Reviving and celebrating the timeless arts, philosophy, and wisdom of our ancestors.' },
  { icon: '📜', title: 'Intellectual Discourse (Vimarsh)', desc: 'Fostering deep, meaningful conversations around India-centric policies and narratives.' },
  { icon: '🤝', title: 'Selfless Service (Seva)', desc: 'Embracing the spirit of selfless service to uplift the marginalized and build a stronger society.' },
];

export default function Vision() {
  return (
    <section className="section" id="vision" style={{ background: 'transparent' }}>
      
      <div className="section-inner">
        <div className="border-ornate" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', background: 'rgba(253, 249, 241, 0.75)', backdropFilter: 'blur(12px)', padding: '4rem', borderRadius: 'var(--radius-md)' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ color: 'var(--saffron-vibrant)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
              ॥ सा विद्या या विमुक्तये ॥
            </div>
            <h2 className="section-title font-yatra" style={{ fontSize: '3rem' }}>
              Our <span style={{ color: 'var(--saffron-vibrant)' }}>Vision</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 600 }}>
              At Think India MANIT, we believe that understanding our past is the key to building our future. We are a collective of minds dedicated to preserving the cultural ethos of Bharat while innovating for tomorrow.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {VISION_POINTS.map((point, idx) => (
                <motion.div 
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                  style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
                >
                  <div style={{ fontSize: '2rem', lineHeight: 1 }}>{point.icon}</div>
                  <div>
                    <h3 className="font-yatra" style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{point.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative', height: '100%', minHeight: '500px' }}
          >
            <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--gold-dark)', padding: '1rem', background: 'rgba(253, 249, 241, 0.5)' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(216, 67, 21, 0.3), rgba(4, 106, 56, 0.3))', zIndex: 1, mixBlendMode: 'overlay' }} />
                <img 
                  src="https://images.unsplash.com/photo-1599385501867-5fbca6eb1d76?q=80&w=2000&auto=format&fit=crop" 
                  alt="Indian Culture" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .border-ornate { grid-template-columns: 1fr !important; padding: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
