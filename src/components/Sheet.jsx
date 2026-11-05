// src/components/Sheet.jsx – the shared details dialog used for events, Bharat Buzz
// stories and guest profiles. Desktop: media on the left (shown whole), details scroll
// on the right. Phones: a bottom sheet with the media on top. Focus is trapped inside,
// Escape and the backdrop close it, and focus returns to where it was.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

function useIsPhone() {
  const q = '(max-width: 860px)';
  const [phone, setPhone] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = (e) => setPhone(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

export default function Sheet({ titleId, closeLabel = 'Close', onClose, media, blur, className = '', children }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const phone = useIsPhone();

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const panelMotion = phone
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', damping: 32, stiffness: 320 } }
    : { initial: { scale: 0.92, y: 30, opacity: 0 }, animate: { scale: 1, y: 0, opacity: 1 }, exit: { scale: 0.94, y: 20, opacity: 0 }, transition: { type: 'spring', bounce: 0.2, duration: 0.5 } };

  return createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div ref={panelRef} className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} {...panelMotion}>
        <span className="tri-bar" aria-hidden="true" />
        <span className="sheet-handle" aria-hidden="true" />
        <button ref={closeRef} type="button" onClick={onClose} className="icon-btn modal-close" aria-label={closeLabel}>
          <X size={20} aria-hidden="true" />
        </button>
        <div className="modal-inner-scroll">
          <div className="modal-media">
            {blur && <div className="blur-bg" style={{ backgroundImage: `url(${blur})` }} aria-hidden="true" />}
            {media}
          </div>
          <div className="modal-scroll">{children}</div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
