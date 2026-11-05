// src/sections/About.jsx – "Nation First. Always." Asymmetric editorial bento.
// Copy is taken from the chapter's own introduction (TI Content deck).
import { motion } from 'framer-motion';
import { Landmark, Feather, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context';
import ImageWithFallback from '../components/ImageWithFallback';
import { SectionHeader, Reveal, Stagger, StaggerItem, imageReveal } from '../components/motion';
import amerFort from '../assets/heritage/amer-fort.jpg';

const PILLARS = [
  {
    icon: Landmark,
    kicker: 'National development',
    text: 'Instigated by the dream of fusing minds with character, we help students value our nation and work towards its progress.',
  },
  {
    icon: Feather,
    kicker: 'Cultural identity',
    text: "The society identifies students with India's rich cultural, spiritual, and intellectual past.",
  },
  {
    icon: Users,
    kicker: 'Student participation',
    text: 'An intimate community of ideas in action, built through meaningful events and workshops.',
  },
];

const CAMPUS = [
  { src: 'Block_Printing.png', alt: 'Block Printing Workshop poster', title: 'Block Printing Workshop' },
  { src: 'human_chain.png', alt: 'Human Chain event poster', title: 'Human Chain Event' },
  { src: 'Freedom_Wall.png', alt: 'Freedom Wall poster', title: 'Freedom Wall' },
  { src: 'Indiglam.png', alt: 'Indiglam 2.0 poster', title: 'Indiglam 2.0' },
];

export default function About() {
  const { navigate } = useApp();
  return (
    <section className="section section--paper" id="about">
      <div className="section-inner">
        <SectionHeader
          index="०१"
          eyebrow="About the chapter"
          title={<>Nation First.<br /><em>Always.</em></>}
          shloka={<>॥ सा विद्या या विमुक्तये ॥ <small>Knowledge is that which liberates</small></>}
          shlokaLabel="Sanskrit shloka: Sa Vidya Ya Vimuktaye"
          desc="A student movement at MANIT Bhopal that connects technical minds with the civilisational story of Bharat."
        />

        <div className="about-bento">
          <Reveal className="tile about-intro">
            <span className="tile-label">Introduction</span>
            <p className="lede">
              Think India, where the &lsquo;Nation First&rsquo; spirit is paramount over any other attitude.
            </p>
            <p>
              Nurtured in purpose and passion, Think India is a dynamic student movement committed to spreading a sense of national pride and purpose. Think India has evolved into an intimate community of ideas in action, enabling students to become nationally inclined, socially committed, and culturally sensitive individuals poised to forge a greater, self-sustaining India.
            </p>
            <span className="tri-rule" aria-hidden="true" />
            <button type="button" className="link-arrow about-more" onClick={() => navigate('about')}>
              Read our story <ArrowRight size={16} aria-hidden="true" />
            </button>
          </Reveal>

          <motion.figure
            className="tile about-photo"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageReveal}
          >
            <img src={amerFort} alt="Amer Fort, Jaipur" width="736" height="920" loading="lazy" />
            <figcaption>Amer Fort, Jaipur</figcaption>
          </motion.figure>

          <Stagger className="about-pillars" stagger={0.12}>
            {PILLARS.map(({ icon: Icon, kicker, text }, i) => (
              <StaggerItem key={kicker} className="tile pillar">
                <span className="pillar-num" aria-hidden="true">0{i + 1}</span>
                <Icon size={22} className="pillar-icon" aria-hidden="true" />
                <h3>{kicker}</h3>
                <p>{text}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="tile about-campus">
            <div className="campus-copy">
              <span className="tile-label">On campus</span>
              <p className="campus-big"><b>600+</b> students at our Block Printing Workshop</p>
            </div>
            <div className="campus-strip">
              {CAMPUS.map((c, i) => (
                <motion.div
                  key={c.src}
                  className="campus-print"
                  style={{ '--tilt': `${[-3, 2, -1.5, 2.5][i]}deg` }}
                  whileHover={{ y: -8, rotate: 0 }}
                >
                  <ImageWithFallback src={c.src} alt={c.alt} title={c.title} />
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
