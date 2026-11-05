// src/sections/WhyUs.jsx – "Why Think India": a sticky editorial column with a heritage
// photograph on the left, oversized numbered reasons on the right, and an impact band.
// Reasons and figures come from the chapter's deck and src/data/stats.js.
import { motion } from 'framer-motion';
import { Smartphone, Vote, Landmark, Cpu } from 'lucide-react';
import { STATS } from '../data/stats';
import { useCountUp } from '../hooks/useCountUp';
import { SectionHeader, Stagger, StaggerItem, Reveal, imageReveal } from '../components/motion';
import chhatriSunset from '../assets/heritage/chhatri-sunset.jpg';

const REASONS = [
  { num: '01', icon: Smartphone, title: 'A series India watches', text: 'Social-media series BHARAT BUZZ, crossing 2.5 million views on Instagram.' },
  { num: '02', icon: Vote, title: 'Trusted by institutions', text: 'Collaboration with the Election Commission of India, and a Certificate of Appreciation from the Commission.' },
  { num: '03', icon: Landmark, title: 'National platforms', text: 'National events like ANUBHOOTI, bringing together student leaders from premier institutions.' },
  { num: '04', icon: Cpu, title: 'Ideas, made hands-on', text: 'Innovative workshops and seminars spanning AI, cloud, traditional arts, and civilisational discourse.' },
];

function StatItem({ stat }) {
  const [count, ref] = useCountUp(stat.value, 2000);
  const done = count >= stat.value;
  return (
    <div ref={ref} className="stat">
      <div className="stat-value">{done ? stat.display : count.toLocaleString('en-IN')}</div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-sub">{stat.sublabel}</div>
    </div>
  );
}

export default function WhyUs() {
  return (
    <section className="section" id="why">
      <div className="section-inner">
        <SectionHeader
          index="०२"
          eyebrow="Why Think India"
          title={<>India&rsquo;s largest student platform for <em>national development</em></>}
          shloka={<>॥ एकोऽहं बहुस्याम् ॥ <small>I am one, may I become many</small></>}
          shlokaLabel="Sanskrit: Eko'ham Bahusyam"
        />

        <div className="why-layout">
          <div className="why-aside">
            <motion.figure
              className="why-photo"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageReveal}
            >
              <img src={chhatriSunset} alt="Sandstone chhatri at sunset" width="608" height="1080" loading="lazy" />
            </motion.figure>
            <p className="why-aside-note">Four reasons students across India choose Think India.</p>
          </div>

          <Stagger as="ol" className="why-list" stagger={0.12}>
            {REASONS.map(({ num, icon: Icon, title, text }, i) => (
              <StaggerItem as="li" key={num} className={`why-item ${i % 2 ? 'shift' : ''}`}>
                <span className="why-num" aria-hidden="true">{num}</span>
                <div className="why-body">
                  <span className="why-icon"><Icon size={20} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="stats-band">
          <span className="tri-rule" aria-hidden="true" />
          <div className="stats-row">
            {STATS.map((stat) => <StatItem key={stat.id} stat={stat} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
