// src/router.js – tiny hash router. Every page has a shareable URL and the browser's
// back/forward buttons work:  #/  #/about  #/events  #/events/<id>  #/bharat-buzz
// #/bharat-buzz/<id>  #/guests  #/guests/<id>  #/sampark
// Plain section anchors (#about, #join …) still open the home page at that section.
export const PAGES = ['home', 'about', 'events', 'buzz', 'guests', 'sampark'];

const SLUG = { home: '', about: 'about', events: 'events', buzz: 'bharat-buzz', guests: 'guests', sampark: 'sampark' };
const ALIAS = { about: 'about', events: 'events', 'events-all': 'events', buzz: 'buzz', 'bharat-buzz': 'buzz', 'buzz-all': 'buzz', guests: 'guests', sampark: 'sampark', contact: 'sampark', join: 'sampark' };

export const PAGE_LABEL = { home: 'Home', about: 'About', events: 'Events', buzz: 'Bharat Buzz', guests: 'Guests', sampark: 'Sampark' };

export function parseHash(hash = window.location.hash) {
  const h = decodeURIComponent(hash || '').replace(/^#/, '');
  if (!h.startsWith('/')) {
    // "#about" style anchors belong to the home page
    return { page: 'home', id: null, section: h && h !== 'home' ? h : null };
  }
  const [, first = '', second = ''] = h.split('/');
  const page = ALIAS[first.toLowerCase()];
  if (!page) return { page: 'home', id: null, section: null };
  return { page, id: second || null, section: null };
}

export function hashFor(page, id = null) {
  const slug = SLUG[page] ?? '';
  if (!slug) return '#/';
  return id ? `#/${slug}/${encodeURIComponent(id)}` : `#/${slug}`;
}
