# Creative Research Lab — React + Vite

A fresh starter website with a cinematic video hero, responsive research sections, and a dark editorial visual style.

## 1. Requirements
Install a current Node.js LTS version from https://nodejs.org/.

## 2. Add your videos
Copy your ten MP4 files into `public/videos/` and name them `video-1.mp4` through `video-10.mp4`.
If you want to keep their existing names, update the `VIDEO_FILES` array in `src/components/VideoBackground.jsx`.

## 3. Install and run
Open Terminal in this project folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## 4. Test production build
```bash
npm run build
npm run preview
```

## 5. Customize your content
Edit `src/data/siteData.js` to change the headline, research areas, projects, publications, contact email, and services. Replace all sample/placeholder publication information with verified details before publishing.

## Notes
- No external animation library is required.
- The background video is muted and uses `playsInline`.
- Only one background video is active at a time.
- The design includes a reduced-motion fallback.
- Google Fonts are loaded from Google Fonts; local system fonts will be used if unavailable.
