// src/pages/SamparkPage.jsx – #/sampark (also #/contact, #/join). How to join the
// chapter and every way to reach it. The note form has no server: it writes an
// email in the visitor's own mail app, addressed to the chapter, and says so.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, ClipboardList, Copy, Check, Send, MapPin } from 'lucide-react';
import PageHero from '../components/PageHero';
import { ArchFrame } from '../components/Ornaments';
import { Reveal, Stagger, StaggerItem, fadeUp } from '../components/motion';
import { JOIN_FORM_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE, CONTACT_EMAIL } from '../data/site';
import archImg from '../assets/heritage/arch-cenotaphs.jpg';

const STEPS = [
  { num: '०१', title: 'Follow us', text: `Follow ${INSTAGRAM_HANDLE} on Instagram to see what the chapter is working on.` },
  {
    num: '०२',
    title: JOIN_FORM_URL ? 'Fill the form' : 'Say hello',
    text: JOIN_FORM_URL
      ? 'Tell us about yourself and what you would like to work on.'
      : 'Send us a DM or an email with your name, branch and year.',
  },
  { num: '०३', title: 'Come to an event', text: 'Join our next workshop, drive or talk and meet the team in person.' },
];

const INTERESTS = ['Events & workshops', 'Bharat Buzz & media', 'Design & art', 'Tech & innovation', 'Outreach & social drives'];

function CopyEmail() {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch { /* clipboard blocked: the mailto link still works */ }
  };
  return (
    <button type="button" className="icon-btn copy-btn" onClick={copy} aria-label={done ? 'Email address copied' : 'Copy email address'}>
      {done ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
    </button>
  );
}

function NoteForm() {
  const [form, setForm] = useState({ name: '', branch: '', year: '', interests: [], message: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (i) => setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));

  const submit = (e) => {
    e.preventDefault();
    const body = [
      `Name: ${form.name}`,
      `Branch: ${form.branch}`,
      `Year: ${form.year}`,
      form.interests.length ? `Interested in: ${form.interests.join(', ')}` : null,
      '',
      form.message,
    ].filter((l) => l !== null).join('\n');
    const subject = `I want to join Think India MANIT: ${form.name}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="note-form" onSubmit={submit}>
      <div className="note-row">
        <label>
          <span>Your name</span>
          <input required value={form.name} onChange={set('name')} autoComplete="name" />
        </label>
        <label>
          <span>Branch</span>
          <input required value={form.branch} onChange={set('branch')} placeholder="e.g. Computer Science" />
        </label>
        <label className="note-year">
          <span>Year</span>
          <select required value={form.year} onChange={set('year')}>
            <option value="" disabled>Choose</option>
            {['1st', '2nd', '3rd', '4th', '5th', 'M.Tech / MBA / MCA', 'PhD'].map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
      </div>
      <fieldset className="note-interests">
        <legend>What would you like to work on? <small>(optional)</small></legend>
        <div className="filters">
          {INTERESTS.map((i) => (
            <button key={i} type="button" className="filter-chip" aria-pressed={form.interests.includes(i)} onClick={() => toggle(i)}>{i}</button>
          ))}
        </div>
      </fieldset>
      <label>
        <span>A line about yourself <small>(optional)</small></span>
        <textarea rows={4} value={form.message} onChange={set('message')} />
      </label>
      <div className="note-foot">
        <button type="submit" className="btn btn-primary"><Send size={18} aria-hidden="true" /> Write the email</button>
        <p>This opens your email app with the note addressed to {CONTACT_EMAIL}. Nothing is sent until you press send there.</p>
      </div>
    </form>
  );
}

export default function SamparkPage() {
  return (
    <div className="page-wrap">
      <div className="section-inner">
        <PageHero
          index="०६"
          eyebrow="Sampark · Join the chapter"
          crumb="Sampark"
          title={<>Ready to shape the future of <em>Bharat?</em></>}
          shloka={<>॥ उत्तिष्ठत जाग्रत ॥ <small>Arise, awake</small></>}
          shlokaLabel="Sanskrit: Uttishthata Jagrata, arise, awake"
          desc="Become part of a student movement that believes in India: her civilisational values, her technological prowess and her self-reliant future."
          aside={(
            <ArchFrame className="page-hero-arch">
              <img src={archImg} alt="Sandstone cenotaphs seen through a scalloped arch" width="284" height="528" />
            </ArchFrame>
          )}
        />

        <section className="ev-section" aria-labelledby="how-h">
          <Reveal className="mini-head">
            <span className="dev">क</span>
            <h2 id="how-h">How to join</h2>
          </Reveal>
          <Stagger as="ol" className="sampark-steps" stagger={0.12}>
            {STEPS.map((s) => (
              <StaggerItem as="li" key={s.num} variants={fadeUp} className="sampark-step">
                <span className="sampark-step-num" aria-hidden="true">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="ev-section" aria-labelledby="reach-h">
          <Reveal className="mini-head">
            <span className="dev">ख</span>
            <h2 id="reach-h">Reach us</h2>
          </Reveal>
          <Stagger className="reach-grid" stagger={0.1}>
            {JOIN_FORM_URL && (
              <StaggerItem className="reach-card reach-card--form">
                <ClipboardList size={26} aria-hidden="true" />
                <h3>Membership form</h3>
                <p>Tell us about yourself and what you would like to work on.</p>
                <a className="btn btn-primary" href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">Apply to Join</a>
              </StaggerItem>
            )}
            <StaggerItem className="reach-card reach-card--ig">
              <MessageCircle size={26} aria-hidden="true" />
              <h3>Instagram</h3>
              <p>Follow and DM us at <b>{INSTAGRAM_HANDLE}</b>. New events are announced here first.</p>
              <a className={JOIN_FORM_URL ? 'btn btn-ghost' : 'btn btn-primary'} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Message us on Instagram</a>
            </StaggerItem>
            <StaggerItem className="reach-card reach-card--mail">
              <Mail size={26} aria-hidden="true" />
              <h3>Email</h3>
              <p className="reach-mail">
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <CopyEmail />
              </p>
              <a className="btn btn-ghost" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('I want to join Think India MANIT')}`}>Email the chapter</a>
            </StaggerItem>
            <StaggerItem className="reach-card reach-card--place">
              <MapPin size={26} aria-hidden="true" />
              <h3>On campus</h3>
              <p>Maulana Azad National Institute of Technology, Bhopal, Madhya Pradesh.</p>
              <p className="reach-dev" lang="hi">भोपाल · मध्य प्रदेश</p>
            </StaggerItem>
          </Stagger>
        </section>

        <section className="ev-section" aria-labelledby="note-h">
          <Reveal className="mini-head">
            <span className="dev">ग</span>
            <h2 id="note-h">Write us a note</h2>
          </Reveal>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
            <NoteForm />
          </motion.div>
        </section>
      </div>
    </div>
  );
}
