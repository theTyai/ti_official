import { motion, useMotionValue, useTransform } from 'framer-motion';

const PILLARS = [
  { title: 'Vichar (Thought)', desc: 'Cultivating original, India-centric perspectives on global and national issues through continuous dialogue.', icon: '🕉️' },
  { title: 'Vimarsh (Discussion)', desc: 'Providing a platform for open debates, conclaves, and seminars with thought leaders and policymakers.', icon: '🪔' },
  { title: 'Karya (Action)', desc: 'Translating ideas into ground-level impact through social outreach and nation-building activities.', icon: '🪷' },
];

function Card3D({ pillar, idx }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, translateZ: -100 }}
      whileInView={{ opacity: 1, y: 0, translateZ: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.2, duration: 0.8, type: "spring" }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="border-ornate"
        style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'rgba(253, 249, 241, 0.8)', // Glassmorphism
          backdropFilter: 'blur(8px)',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
          boxShadow: '0 25px 50px -12px rgba(191, 54, 12, 0.15)'
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.div style={{ transform: 'translateZ(60px)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', color: 'var(--terracotta)', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>
            {pillar.icon}
          </div>
          <h3 className="font-yatra" style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '1.5rem', textShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            {pillar.title}
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 600 }}>
            {pillar.desc}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Pillars() {
  return (
    <section className="section" id="pillars" style={{ perspective: 1500, background: 'transparent' }}>
      
      <div className="section-inner">
        
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '5rem', transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, scale: 0.8, translateZ: -200 }}
          whileInView={{ opacity: 1, scale: 1, translateZ: 50 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div style={{ color: 'var(--saffron-vibrant)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', textShadow: '0 2px 5px rgba(255,255,255,0.8)' }}>
            ॥ कर्मण्येवाधिकारस्ते ॥
          </div>
          <h2 className="section-title font-yatra" style={{ fontSize: '3.5rem', textShadow: '0 2px 10px rgba(253, 249, 241, 0.9)' }}>
            Our <span style={{ color: 'var(--green-india)' }}>Sankalp</span>
          </h2>
          <p className="section-desc" style={{ background: 'rgba(253, 249, 241, 0.6)', backdropFilter: 'blur(5px)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            The core pillars that guide the journey of every Think India member towards realizing their duty to the nation.
          </p>
        </motion.div>

        <div className="grid-3" style={{ transformStyle: 'preserve-3d' }}>
          {PILLARS.map((pillar, idx) => (
            <Card3D key={pillar.title} pillar={pillar} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
