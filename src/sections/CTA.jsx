// src/sections/CTA.jsx – "Join the chapter" (id="join"), a deep-brown editorial block
// with a heritage photograph, joining steps and the existing contact actions.
// The navbar "Join Us" button and the hero button both land here.
import { motion } from 'framer-motion';
import { Mail, ClipboardList, MessageCircle, ArrowRight } from 'lucide-react';
import { Stagger, StaggerItem, fadeUp, wipeUp } from '../components/motion';
import { JOIN_FORM_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE, CONTACT_EMAIL } from '../data/site';
import archImg from '../assets/heritage/arch-cenotaphs.jpg';
import { useApp } from '../context';

const STEPS = [
  {
    num: '०१',
    title: 'Follow us',
    text: `Follow ${INSTAGRAM_HANDLE} on Instagram to see what the chapter is working on.`,
  },
  {
    num: '०२',
    title: JOIN_FORM_URL ? 'Fill the form' : 'Say hello',
    text: JOIN_FORM_URL
      ? 'Tell us about yourself and what you would like to work on.'
      : 'Send us a DM or an email with your name, branch and year.',
  },
  {
    num: '०३',
    title: 'Come to an event',
    text: 'Join our next workshop, drive or talk and meet the team in person.',
  },
];

export default function CTA() {
  const { navigate } = useApp();
  return (
    <section className="section section--join" id="join">
      <div className="section-inner">
        <div className="join">
          <motion.figure
            className="join-photo"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={archImg} alt="Sandstone cenotaphs seen through a scalloped arch" width="284" height="528" loading="lazy" />
          </motion.figure>

          <div className="join-copy">
            <Stagger stagger={0.12}>
              <StaggerItem variants={fadeUp}>
                <span className="eyebrow"><span className="dev">०६</span><span className="eyebrow-rule" aria-hidden="true" />Sampark · Join the chapter</span>
              </StaggerItem>
              <StaggerItem variants={wipeUp}>
                <h2 className="sec-title">Ready to shape the future of <em>Bharat?</em></h2>
              </StaggerItem>
              <StaggerItem>
                <p className="join-lead">
                  Become part of a student movement that believes in India: her civilisational values, her technological prowess and her self-reliant future. <span className="shloka-inline" lang="sa">॥ उत्तिष्ठत जाग्रत ॥</span>
                </p>
              </StaggerItem>
            </Stagger>

            <Stagger as="ol" stagger={0.12} delay={0.2} className="join-steps">
              {STEPS.map((s) => (
                <StaggerItem as="li" key={s.num} variants={fadeUp} className="join-step">
                  <span className="join-step-num" aria-hidden="true">{s.num}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <motion.div
              className="cta-actions"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {JOIN_FORM_URL && (
                <motion.a whileTap={{ scale: 0.97 }} className="btn btn-primary" href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
                  <ClipboardList size={20} aria-hidden="true" />
                  <span>Apply to Join</span>
                </motion.a>
              )}
              <motion.a
                whileTap={{ scale: 0.97 }}
                className={JOIN_FORM_URL ? 'btn btn-light' : 'btn btn-primary'}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} aria-hidden="true" />
                <span>Message us on Instagram</span>
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.97 }}
                className="btn btn-light"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('I want to join Think India MANIT')}`}
              >
                <Mail size={20} aria-hidden="true" />
                <span>Email the chapter</span>
              </motion.a>
            </motion.div>

            <button type="button" className="cta-link" onClick={() => navigate('events')}>
              Or browse everything we have done so far <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
