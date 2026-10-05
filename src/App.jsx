import { useMotionValue } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalBackground from './components/GlobalBackground';
import Hero from './sections/Hero';
import Vision from './sections/About';
import Pillars from './sections/Initiatives';
import Impact from './sections/Events';

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleGlobalMouseMove(event) {
    const x = event.clientX - window.innerWidth / 2;
    const y = event.clientY - window.innerHeight / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  return (
    <div onMouseMove={handleGlobalMouseMove} style={{ minHeight: '100vh' }}>
      <GlobalBackground mouseX={mouseX} mouseY={mouseY} />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero mouseX={mouseX} mouseY={mouseY} />
        <Vision />
        <Pillars />
        <Impact />
      </main>
      <Footer />
    </div>
  );
}
