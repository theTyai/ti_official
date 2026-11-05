// src/components/PageCurtain.jsx – a short parchment curtain between pages: it rises
// with the next page's name and a toran line, then lifts away (~0.9 s, never on first load).
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PAGE_LABEL } from '../router';
import { Toran } from './Ornaments';

const DEV = { home: '०', about: '०१', events: '०३', buzz: '०४', guests: '०५', sampark: '०६' };

export default function PageCurtain({ page }) {
  const reduced = useReducedMotion();
  const first = useRef(true);
  const [run, setRun] = useState(null);

  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    if (reduced) return undefined;
    const key = `${page}-${Date.now()}`;
    setRun({ key, page });
    const t = setTimeout(() => setRun((r) => (r && r.key === key ? null : r)), 950);
    return () => clearTimeout(t);
  }, [page, reduced]);

  return (
    <AnimatePresence>
      {run && (
        <motion.div
          key={run.key}
          className="curtain"
          aria-hidden="true"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0 0 100% 0)'] }}
          transition={{ duration: 0.95, times: [0, 0.32, 0.6, 1], ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="curtain-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
            transition={{ duration: 0.95, times: [0, 0.35, 0.6, 0.9] }}
          >
            <span className="curtain-num">{DEV[run.page]}</span>
            <span className="curtain-title">{PAGE_LABEL[run.page]}</span>
            <Toran className="curtain-toran" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
