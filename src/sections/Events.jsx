import { motion } from 'framer-motion';

const IMPACT_ITEMS = [
  { title: 'National Dialogues', desc: 'Curating spaces for youth to interact with national leaders and visionaries.', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop' },
  { title: 'Utsav & Heritage', desc: 'Celebrating the festivals of Bharat with true traditional fervor on campus.', img: 'https://images.unsplash.com/photo-1621643444061-0000a6e3a479?q=80&w=2000&auto=format&fit=crop' },
];

export default function Impact() {
  return (
    <section className="section" id="impact" style={{ background: 'transparent' }}>
      <div className="section-inner">
        
        <motion.div 
          style={{ marginBottom: '4rem', textAlign: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ color: 'var(--saffron-vibrant)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', textShadow: '0 2px 5px rgba(255,255,255,0.8)' }}>
            ॥ चरैवेति चरैवेति ॥
          </div>
          <h2 className="section-title font-yatra" style={{ fontSize: '3rem', color: 'var(--terracotta)', textShadow: '0 2px 10px rgba(253, 249, 241, 0.9)' }}>
            Glimpses of <span style={{ color: 'var(--saffron-vibrant)' }}>Our Journey</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {IMPACT_ITEMS.map((item, idx) => (
            <div key={item.title} style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexDirection: idx % 2 !== 0 ? 'row-reverse' : 'row' }} className="impact-row">
              
              <motion.div 
                style={{ flex: 1, background: 'rgba(253, 249, 241, 0.8)', backdropFilter: 'blur(10px)', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(191,54,12,0.1)' }}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="font-yatra" style={{ fontSize: '2.5rem', color: 'var(--india-navy)', marginBottom: '1rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 600 }}>
                  {item.desc}
                </p>
                <div style={{ width: '50px', height: '2px', background: 'var(--saffron-vibrant)' }} />
              </motion.div>
              
              <motion.div 
                style={{ flex: 1, position: 'relative' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div style={{ border: '4px solid var(--gold-dark)', padding: '0.5rem', background: 'rgba(253, 249, 241, 0.5)' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                </div>
              </motion.div>
              
            </div>
          ))}
        </div>

      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .impact-row { flex-direction: column !important; gap: 2rem !important; text-align: center; }
          .impact-row h3 { font-size: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
