import { motion, useTransform } from 'framer-motion';
import logoImg from '../assets/logo.jpg';

export default function Hero({ mouseX, mouseY }) {
  // subtle 3D rotation for the logo in hero based on global mouse
  const rotateX = useTransform(mouseY, [-500, 500], [10, -10]);
  const rotateY = useTransform(mouseX, [-500, 500], [-10, 10]);

  return (
    <section className="section" id="home" style={{ minHeight: '100vh', paddingTop: '180px', paddingBottom: '80px', overflow: 'hidden', perspective: '1500px' }}>
      
      <div className="section-inner" style={{ textAlign: 'center', zIndex: 2, transformStyle: 'preserve-3d' }}>
        
        {/* Sanskrit Shloka (Floating) */}
        <motion.div
          initial={{ opacity: 0, y: -20, translateZ: 20 }}
          animate={{ opacity: 1, y: 0, translateZ: 20 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          style={{ marginBottom: '2rem', color: 'var(--saffron-vibrant)', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 10px rgba(255,103,31,0.2)' }}
        >
          ॥ वसुधैव कुटुम्बकम् ॥
        </motion.div>

        {/* Floating 3D Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, translateZ: -100 }}
          animate={{ opacity: 1, scale: 1, translateZ: 50 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
          style={{ 
            marginBottom: '2rem', 
            display: 'flex', 
            justifyContent: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              width: '180px', height: '180px',
              background: 'rgba(253, 249, 241, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50%',
              padding: '1.5rem',
              border: '4px solid var(--gold-dark)',
              boxShadow: '0 20px 50px rgba(191, 54, 12, 0.3), inset 0 5px 15px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <img src={logoImg} alt="Think India Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))', borderRadius: '50%' }} />
          </motion.div>
        </motion.div>

        <motion.h1 
          className="font-yatra"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: 'var(--text-dark)', lineHeight: 1, marginBottom: '1rem', textShadow: '0 5px 20px rgba(255, 103, 31, 0.3)' }}
          initial={{ opacity: 0, scale: 0.9, translateZ: -50 }}
          animate={{ opacity: 1, scale: 1, translateZ: 60 }}
          transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
        >
          THINK <span style={{ color: 'var(--saffron-vibrant)' }}>INDIA</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: -20, translateZ: 50 }}
          animate={{ opacity: 1, y: 0, translateZ: 50 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ padding: '0.5rem 2rem', border: '2px solid var(--gold-dark)', borderRadius: '100px', color: 'var(--terracotta)', fontWeight: 'bold', letterSpacing: '3px', fontSize: '1rem', background: 'rgba(253, 249, 241, 0.8)', backdropFilter: 'blur(5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
            || MANIT CHAPTER ||
          </div>
        </motion.div>

        <motion.p 
          style={{ fontSize: '1.3rem', maxWidth: '750px', margin: '0 auto 3rem', color: 'var(--text-dark)', lineHeight: 1.8, fontWeight: 600, textShadow: '0 2px 4px rgba(253,249,241,0.9)', background: 'rgba(253, 249, 241, 0.5)', backdropFilter: 'blur(4px)', padding: '1rem', borderRadius: 'var(--radius-md)' }}
          initial={{ opacity: 0, translateZ: 0 }}
          animate={{ opacity: 1, translateZ: 30 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Embracing the rich cultural heritage of Bharat. A student-led society dedicated to fostering national consciousness, cultural pride, and intellectual resurgence at MANIT Bhopal.
        </motion.p>

        <motion.div 
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, y: 30, translateZ: -50 }}
          animate={{ opacity: 1, y: 0, translateZ: 80 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <motion.a whileHover={{ translateZ: 20, scale: 1.05 }} href="#vision" className="btn-cultural">
            Discover Our Roots
          </motion.a>
          <motion.a whileHover={{ translateZ: 20, scale: 1.05 }} href="#impact" className="btn-cultural-outline">
            Our Sankalp
          </motion.a>
        </motion.div>
        
      </div>
      
    </section>
  );
}
