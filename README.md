# Think India – MANIT Chapter website

React + Vite single-page site.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build for deployment

```bash
npm run build    # output in dist/
npm run preview  # check the production build locally
```

## Where to edit content

- `src/data/events.js` – events (set `featured: true` to show one on the home page)
- `src/data/buzz.js` – Bharat Buzz editions and ECI recognition
- `src/data/guests.js` – previous guests
- `src/data/stats.js` – impact numbers
- `src/data/site.js` – join form link, Instagram, contact email
- Images live in `src/assets/` and are referenced by file name from the data files.
