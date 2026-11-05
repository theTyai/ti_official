// src/pages/AboutPage.jsx – the chapter's story. Every sentence of copy here is
// taken from the chapter's own introduction and "Why Think India" slides
// (TI Content deck) or from the existing site data; nothing is invented.
import { motion } from 'framer-motion';
import { ArrowRight, Landmark, Feather, Users, Smartphone, Vote, Cpu } from 'lucide-react';
import PageHero from '../components/PageHero';
import { ArchFrame, Toran } from '../components/Ornaments';
import { SectionHeader, Reveal, Stagger, StaggerItem, fadeUp, imageReveal, EASE_OUT } from '../components/motion';
import { STATS } from '../data/stats';
import { EVENTS } from '../data/events';
import { useApp } from '../context';
import amerFort from '../assets/heritage/amer-fort.jpg';
import hawaMahal from '../assets/heritage/hawa-mahal.jpg';
import jaisalmer from '../assets/heritage/jaisalmer-tower.jpg';
import chhatriDome from '../assets/heritage/chhatri-dome.jpg';

const PRINCIPLES = [
  {
    dev: '१',
    label: 'Our philosophy',
    quote: <>Where the &lsquo;Nation First&rsquo; spirit is paramount over any other attitude.</>,
  },
  {
    dev: '२',
    label: 'Our mission',
    quote: <>A dynamic student movement committed to spreading a sense of national pride and purpose.</>,
  },
  {
    dev: '३',
    label: 'Our vision',
    quote: <>Students who are nationally inclined, socially committed, and culturally sensitive, poised to forge a greater, self-sustaining India.</>,
  },
];

const PILLARS = [
  {
    icon: Landmark,
    img: hawaMahal,
    alt: 'Hawa Mahal, Jaipur',
    title: 'National development',
    text: 'Through meaningful events and workshops, we help students value our nation and work towards its progress.',
  },
  {
    icon: Feather,
    img: jaisalmer,
    alt: 'Carved sandstone tower, Jaisalmer',
    title: 'Cultural identity',
    text: "Instigated by the dream of fusing minds with character, the society identifies students with India's rich cultural, spiritual, and intellectual past.",
  },
  {
    icon: Users,
    img: chhatriDome,
    alt: 'Chhatri dome against the sky',
    title: 'Student participation',
    text: 'Think India has evolved into an intimate community of ideas in action.',
  },
];

const WORK = [
  { icon: Smartphone, title: 'Bharat Buzz', text: 'A social-media series crossing 2.5 million views on Instagram.', to: 'buzz', cta: 'Read Bharat Buzz' },
  { icon: Vote, title: 'Election Commission of India', text: 'Collaboration with the ECI, and a Certificate of Appreciation from the Commission.', to: 'buzz', cta: 'See the recognition' },
  { icon: Landmark, title: 'National events', text: 'National events like ANUBHOOTI.', to: 'events', cta: 'Browse events' },
  { icon: Cpu, title: 'Workshops & seminars', text: 'Innovative workshops and seminars, from AI on the cloud to block printing and pottery.', to: 'events', cta: 'Browse events' },
];

// Campus venues, straight from the events data.
const VENUES = [...new Set(EVENTS.map((e) => e.venue).filter(Boolean))];

export default function AboutPage() {
  const { navigate } = useApp();
  return (
    <div className="page-wrap page-wrap--about">
      <div className="section-inner">
        <PageHero
          index="०१"
          eyebrow="About the chapter"
          crumb="About"
          title={<>Nation First. <em>Always.</em></>}
          shloka={<>॥ सा विद्या या विमुक्तये ॥ <small>Knowledge is that which liberates</small></>}
          shlokaLabel="Sanskrit: Sa Vidya Ya Vimuktaye"
          desc="Think India is a dynamic student movement committed to nurturing nationally inclined, socially committed, and culturally sensitive individuals. This is its chapter at MANIT Bhopal."
          aside={(
            <ArchFrame className="page-hero-arch">
              <img src={amerFort} alt="Amer Fort, Jaipur" width="736" height="920" />
            </ArchFrame>
          )}
        />
      </div>

      {/* Introduction */}
      <section className="section about-story" aria-labelledby="story-title">
        <div className="section-inner about-story-grid">
          <Reveal className="about-story-side">
            <span className="eyebrow"><span className="dev">क</span><span className="eyebrow-rule" aria-hidden="true" />Introduction</span>
            <h2 id="story-title" className="about-story-title">Ideas in <em>action</em></h2>
          </Reveal>
          <Reveal className="about-story-body" delay={0.1}>
            <p className="dropcap">
              Think India, where the &lsquo;Nation First&rsquo; spirit is paramount over any other attitude. Nurtured in purpose and passion, Think India is a dynamic student movement committed to spreading a sense of national pride and purpose.
            </p>
            <p>
              Instigated by the dream of fusing minds with character, the society identifies students with India&rsquo;s rich cultural, spiritual, and intellectual past. Through meaningful events and workshops, we help students value our nation and work towards its progress.
            </p>
            <p>
              Think India has evolved into an intimate community of ideas in action, enabling students to become nationally inclined, socially committed, and culturally sensitive individuals poised to forge a greater, self-sustaining India.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy, mission, vision */}
      <section className="section section--dark principles" aria-label="Philosophy, mission and vision">
        <div className="section-inner">
          <Stagger className="principles-grid" stagger={0.14}>
            {PRINCIPLES.map((p) => (
              <StaggerItem key={p.label} className="principle" variants={fadeUp}>
                <span className="principle-dev" aria-hidden="true">{p.dev}</span>
                <span className="principle-label">{p.label}</span>
                <blockquote>{p.quote}</blockquote>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Three pillars */}
      <section className="section" aria-labelledby="pillars-title">
        <div className="section-inner">
          <SectionHeader
            index="ख"
            eyebrow="What we stand for"
            title={<span id="pillars-title">Three <em>commitments</em></span>}
            shloka={<>॥ एकोऽहं बहुस्याम् ॥ <small>I am one, may I become many</small></>}
            shlokaLabel="Sanskrit: Eko'ham Bahusyam"
          />
          <div className="pillar-rows">
            {PILLARS.map(({ icon: Icon, img, alt, title, text }, i) => (
              <motion.article
                key={title}
                className={`pillar-row ${i % 2 ? 'is-flip' : ''}`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              >
                <motion.figure className="pillar-row-img" variants={imageReveal}>
                  <img src={img} alt={alt} width="288" height="528" loading="lazy" />
                </motion.figure>
                <motion.div className="pillar-row-copy" variants={fadeUp}>
                  <span className="pillar-row-num" aria-hidden="true">0{i + 1}</span>
                  <Icon size={24} className="pillar-icon" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <div className="section-inner"><Toran className="divider-toran" count={25} width={1200} /></div>

      {/* What we do */}
      <section className="section" aria-labelledby="work-title">
        <div className="section-inner">
          <SectionHeader
            index="ग"
            eyebrow="Why Think India"
            title={<span id="work-title">India&rsquo;s largest student platform for <em>national development</em></span>}
            desc="Four things the chapter is known for. Each one links to the full record on this site."
          />
          <Stagger as="ol" className="work-list" stagger={0.1}>
            {WORK.map(({ icon: Icon, title, text, to, cta }, i) => (
              <StaggerItem as="li" key={title} className="work-item">
                <span className="work-num" aria-hidden="true">{['०१', '०२', '०३', '०४'][i]}</span>
                <Icon size={22} className="work-icon" aria-hidden="true" />
                <div className="work-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <button type="button" className="link-arrow" onClick={() => navigate(to)}>
                  {cta} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* MANIT identity */}
      <section className="section section--cream manit" aria-labelledby="manit-title">
        <div className="section-inner manit-grid">
          <Reveal className="manit-copy">
            <span className="eyebrow"><span className="dev">घ</span><span className="eyebrow-rule" aria-hidden="true" />The MANIT chapter</span>
            <h2 id="manit-title" className="sec-title">Rooted in <em>Bhopal</em></h2>
            <p className="manit-coord" lang="hi">भोपाल · 23.26° N, 77.41° E</p>
            <p className="sec-desc">
              The chapter works on the MANIT Bhopal campus. These are the venues our events have used so far:
            </p>
            <ul className="venue-list">
              {VENUES.map((v) => <li key={v}>{v}</li>)}
            </ul>
          </Reveal>
          <Stagger className="manit-stats" stagger={0.08}>
            {STATS.map((s) => (
              <StaggerItem key={s.id} className="manit-stat">
                <b>{s.display}</b>
                <span>{s.label}</span>
                <small>{s.sublabel}</small>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="section about-close">
        <div className="section-inner">
          <motion.div
            className="close-band"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <p className="close-shloka" lang="sa">॥ उत्तिष्ठत जाग्रत ॥</p>
            <h2>Ready to shape the future of <em>Bharat?</em></h2>
            <div className="close-actions">
              <button type="button" className="btn btn-primary" onClick={() => navigate('sampark')}>
                Join the Movement <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('events')}>
                See our events
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
