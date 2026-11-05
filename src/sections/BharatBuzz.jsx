// src/sections/BharatBuzz.jsx – Bharat Buzz presented like a news front page:
// a lead story, a column of headlines, and a link to the full archive.
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BUZZ_ITEMS } from '../data/buzz';
import BuzzCard from '../components/BuzzCard';
import { SectionHeader } from '../components/motion';
import { useApp } from '../context';

const LEAD = 'bharat-buzz-3';
const SIDE = ['paris-olympics', 'paralympics', 'bharat-buzz-2'];

export default function BharatBuzz() {
  const { navigate, openDetail } = useApp();
  const lead = BUZZ_ITEMS.find((i) => i.id === LEAD);
  const side = SIDE.map((id) => BUZZ_ITEMS.find((i) => i.id === id)).filter(Boolean);

  return (
    <section className="section" id="buzz">
      <div className="section-inner">
        <div className="masthead" aria-hidden="true">
          <span>The Bharat Buzz</span>
          <span>A Think India MANIT series</span>
          <span>2.5M+ views on Instagram</span>
        </div>
        <SectionHeader
          index="०४"
          eyebrow="Bharat Buzz"
          title={<>Our voice, <em>online</em></>}
          shloka={<>॥ राष्ट्राय स्वाहा, इदं न मम ॥ <small>For the nation, not for me</small></>}
          shlokaLabel="Sanskrit: Rashtraya Swaha, Idam Na Mama"
          desc="A video series bringing the pulse of India's major events and developments to screens nationwide, with crisp takes on politics, economy, technology and culture."
        />

        <div className="buzz-front">
          {lead && <BuzzCard item={lead} variant="feature" onOpen={(it) => openDetail('buzz', it.id)} />}
          <div className="buzz-side">
            <p className="buzz-side-head">More stories</p>
            {side.map((item, i) => <BuzzCard key={item.id} item={item} idx={i + 1} variant="row" onOpen={(it) => openDetail('buzz', it.id)} />)}
            <motion.button
              type="button"
              className="btn btn-dark buzz-more"
              onClick={() => navigate('buzz')}
              whileTap={{ scale: 0.97 }}
            >
              Read the full Bharat Buzz <ArrowRight size={18} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
