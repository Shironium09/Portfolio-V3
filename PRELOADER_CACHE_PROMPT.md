# TASK: Implement Preloader Screen with Asset Pre-caching & Swipe-Up Exit Animation

> [!IMPORTANT]
> **CRITICAL DIRECTIVE FOR CLAUDE (ZERO TOKEN WASTE):**
> 1. **DO NOT READ OR REQUEST ANY FILES.** All needed context, project architecture, exact file paths, asset lists, and dependencies are 100% contained in this document.
> 2. **DO NOT ASK CLARIFYING QUESTIONS.** Assume all best practices outlined below.
> 3. **DO NOT OUTPUT LONG EXPLANATIONS, PREAMBLES, OR PHILOSOPHY.**
> 4. **GENERATE THE COMPLETE, DROP-IN CODE IMMEDIATELY** for the specified files.

---

## 1. Project Context & Stack Summary

- **Framework**: Vite 8 + React 19 (SPA)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";`)
- **Animation**: `motion/react` (Motion v12 / Framer Motion: `import { motion, AnimatePresence } from 'motion/react'`)
- **Typography & Theme**:
  - Background color: `#07080b` (Dark background)
  - Fonts: `'Plus Jakarta Sans'`, `'JetBrains Mono'` (Google Fonts loaded in `index.html`)
- **App Layout (`src/App.jsx`)**:
  - Renders a fullscreen container (`w-screen h-screen h-[100dvh] overflow-hidden`) with `<SidebarStrip />` and `<BentoGrid />`.
  - Subviews (`ProjectsPanel`, `ExperiencesPanel`, `ContactPanel`, `CaseStudyView`) open dynamically inside `<ExpandedCardModal />`.
- **Assets to Pre-cache & Pre-decode**:
  - All images in `src/assets/` (`hero.png`, `cisco.png`, `gdg.png`)
  - All project screenshots in `src/assets/projects/` (`cebu-plant-depot.png`, `credenza.png`, `awas.png`, `leftover.png`, `alexandria.png`, `angbot.jpg`, `colloqium.png`)
  - All certificate images in `src/assets/certificates/` (`ailric.png`, `ccna-itn.png`, `ccna-srwe.png`, `devfest.png`, `philnits.png`, `raccetcon-2026.png`)
  - Fonts (`document.fonts.ready`)

---

## 2. Target Features & Requirements

1. **Pre-caching & Subpage Preloading Engine**:
   - Eagerly gather all project/subpage images using Vite's `import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,webp}', { eager: true, import: 'default' })`.
   - For every asset, preload and hardware-decode using `new Image()` and `await img.decode()`. This decompresses images directly onto GPU/browser cache, ensuring opening modals/case studies is 100% instant with zero flicker or layout shift.
   - Wait for `document.fonts.ready` so typography renders crisply.
   - Track real loading progress `(loaded / total) * 100`.

2. **Session / Cache Detection**:
   - Check `sessionStorage.getItem('portfolio_preloaded')`.
   - On first visit/refresh where session is empty, run the preloader.
   - Mark `sessionStorage.setItem('portfolio_preloaded', 'true')` upon completion so subsequent navigations don't show the loading screen again unless a new session begins.

3. **Visual UI (Full Dark Screen + Big Number Counter)**:
   - Fullscreen dark overlay (`fixed inset-0 z-[99999] bg-[#07080b] flex flex-col justify-between p-8 sm:p-12 lg:p-16`).
   - Massive, high-impact counter: `0%` to `100%` in giant monospace font (e.g., `text-8xl sm:text-9xl md:text-[12rem] xl:text-[16rem] font-black tracking-tighter tabular-nums text-white font-mono`).
   - Smooth animated number increment (lerp/RAF) so the counter feels organic and fluid even if assets load quickly.
   - Minimalist header/footer accents (e.g. `INITIALIZING PORTFOLIO // DUSTIN BALANSAG`, slim progress bar).

4. **Swipe-Up Animation**:
   - When counter hits `100%`, hold for ~150ms.
   - Animate the entire dark overlay upwards off the screen:
     - `y: 0` to `y: '-100%'`
     - Custom high-end easing: `[0.76, 0, 0.24, 1]` or `[0.87, 0, 0.13, 1]`
     - Duration: ~`0.85s`
   - Set `pointer-events-none` on exit so the main website becomes interactive immediately.
   - Unmount completely via `AnimatePresence` and `onAnimationComplete` to free memory.

---

## 3. Files to Generate

Generate the exact, complete code for the following 3 files:

### File 1: `src/utils/preloadAssets.js`
Utility function `preloadAllAssets(onProgress)`:
- Uses `import.meta.glob` to collect all images in `../assets/**/*.{png,jpg,jpeg,svg,webp}`.
- Iterates through assets, creates `new Image()`, sets `.src`, calls `.decode().catch(...)`.
- Awaits `document.fonts.ready`.
- Calls `onProgress(percent)` as assets resolve.
- Returns a Promise that resolves when all assets are ready.

### File 2: `src/components/Preloader.jsx`
Component `<Preloader onComplete={...} />`:
- Checks session cache flag or executes preloading sequence.
- Manages smooth displayed percentage state (0 to 100) using requestAnimationFrame.
- Displays the full dark screen (`bg-[#07080b]`) with the giant percentage counter and minimal status indicators.
- Uses `motion.div` from `motion/react` with `initial={{ y: 0 }}`, `exit={{ y: '-100%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}`.

### File 3: `src/App.jsx`
Updated root component:
- Integrates `<Preloader />` wrapped in `<AnimatePresence>`.
- Manages state `const [isLoading, setIsLoading] = useState(...)` initialized by checking `sessionStorage.getItem('portfolio_preloaded')`.
- Renders the existing BentoGrid underneath so it mounts and warms up while the preloader is visible, then smoothly reveals as the screen swipes up.

---

## 4. Expected Action

👉 **Immediately generate the complete code for `src/utils/preloadAssets.js`, `src/components/Preloader.jsx`, and `src/App.jsx`.**
