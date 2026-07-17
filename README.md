# Airbnb Clone — Playpower Labs Assignment Submission

> **I built all of this using Antigravity by Google** — powered by the **free Gemini Pro plan** claimed using the **Jio card offer** or **student plan**. Every component, design token, architecture decision, and prompt in this project was built through AI-native workflows with no prior template code.

---

## 📋 Assignment Tasks

The assignment required completing **5 core tasks**:

| # | Task | Status |
|---|------|--------|
| 1 | **Architecture Design** — Design and diagram a production-scale architecture for a vacation rental platform (Airbnb-scale: 9 layers, distributed systems, real tech names) | ✅ Done |
| 2 | **UI Clone — Pixel-Perfect** — Clone the Airbnb listing page from the reference site [`airbnb-clone-umber-two.vercel.app`](https://airbnb-clone-umber-two.vercel.app) with pixel accuracy at 1440px | ✅ Done |
| 3 | **Photo Tour** — Build a fullscreen photo gallery overlay with entrance animation, scroll-through, and keyboard support | ✅ Done |
| 4 | **Lightbox Viewer** — Build a single-photo lightbox inside the Photo Tour with arrow navigation, image counter, looping, and keyboard shortcuts | ✅ Done |
| 5 | **Prompt Documentation** — Document all prompts used in the AI-driven development workflow | ✅ Done |

The full problem statement document is at [`submission/Playpower Labs Assignment_ Airbnb-Clone App.docx`](submission/Playpower%20Labs%20Assignment_%20Airbnb-Clone%20App.docx).

---

## 📁 Submission Folder — What Each File Represents

Everything required for evaluation is inside the **`submission/`** folder.

```
submission/
├── Playpower Labs Assignment_ Airbnb-Clone App.docx   ← Official problem statement
├── ALL_PROMPTS_MASTER.md                              ← 13 AI prompts used (see below)
├── airbnb_clone_details.md                            ← Full project spec breakdown
├── DESIGN_TOKENS.md                                   ← Extracted CSS design system
├── airbnb_clone_reference_repos.txt                   ← Reference GitHub repos studied
├── BEYOND_THE_ASSIGNMENT.md                           ← Extra features built beyond tasks
├── README.md                                          ← Submission index
│
├── Architecture/
│   ├── Architecture_Diagram.mmd                       ← Source Mermaid diagram script
│   ├── architecture-diagram.png                       ← Exported hi-res architecture image
│   ├── document-export-7-11-2026-5_12_43-PM.md       ← Full Technical Design Document
│   └── diagram-export-7-11-2026-5_12_11-PM.png       ← Supplemental architecture diagram
│
└── Prompts/
    ├── PIXEL_PERFECT_CLONE_MASTER_PROMPT.md           ← Master UI clone prompt
    ├── architecture_generation_master_prompt.md       ← Architecture generation prompt
    ├── 00-original-prompts.txt                        ← Chronological build prompt log
    ├── prompt 1.pdf                                   ← Task 1 prompt (architecture)
    ├── prompt 2.pdf                                   ← Task 2 prompt (UI clone)
    └── prompt 3.txt                                   ← Task 3+ prompt (gallery/lightbox)
```

### What each file represents:

| File | What it represents |
|------|-------------------|
| `Playpower Labs Assignment_ Airbnb-Clone App.docx` | The original assignment brief from Playpower Labs with all task definitions |
| `ALL_PROMPTS_MASTER.md` | **The primary prompt submission file** — contains all 13 prompts in sequence (see section below) |
| `airbnb_clone_details.md` | Project requirements, technical constraints, and developer notes |
| `DESIGN_TOKENS.md` | Every CSS design token extracted from the reference site — colors, typography, spacing, shadows, radii |
| `airbnb_clone_reference_repos.txt` | 10+ Airbnb clone GitHub repos studied during planning phase (for patterns, not for copying) |
| `BEYOND_THE_ASSIGNMENT.md` | All extra features built beyond the 5 required tasks — a full list with explanations |
| `Architecture/Architecture_Diagram.mmd` | Mermaid source for the 9-layer C4-style architecture |
| `Architecture/architecture-diagram.png` | Rendered architecture diagram for submission |
| `Architecture/document-export-*.md` | Full Technical Design Document with written rationale for every architecture decision |
| `Prompts/PIXEL_PERFECT_CLONE_MASTER_PROMPT.md` | The detailed master prompt that drove the entire UI clone process |
| `Prompts/architecture_generation_master_prompt.md` | The prompt used to generate the production-scale architecture |
| `Prompts/00-original-prompts.txt` | The raw, chronological prompt log from the actual build sessions |

---

## 🤖 Prompt File — ALL_PROMPTS_MASTER.md

> **The complete prompt documentation is in [`submission/ALL_PROMPTS_MASTER.md`](submission/ALL_PROMPTS_MASTER.md)**

This file contains **13 detailed, production-quality prompts** in the exact sequence they were used to build this project end-to-end. Each prompt is self-contained and can be reused on any similar cloning project.

| Prompt # | Title | Task Coverage |
|----------|-------|---------------|
| 1 | Architecture Design | Task 1 — 9-layer C4 diagram + written rationale |
| 2 | Project Scaffold | Initialize React + Vite + TypeScript |
| 3 | Design Tokens | Extract CSS values from reference site |
| 4 | Main Listing Page | Task 2 — Build all 10+ page components |
| 5 | Pixel-Perfect Merge | Reference repo code reuse strategy |
| 6 | Photo Tour + Lightbox | Tasks 3 & 4 — Gallery and lightbox overlays |
| 7 | Universal Clone | Reusable prompt for any website clone |
| 8 | Accessibility Pass | a11y audit — focus traps, ARIA, keyboard nav |
| 9 | Responsive + Animations | Breakpoints and micro-animation polish |
| 10 | Reference Fix (20%) | Visual gap fixing using attached screenshots |
| 11 | Code Quality | TypeScript strictness, dead code, custom hooks |
| 12 | Customizable Prompt | Template for cloning any site (fill-in fields + attach files) |
| 13 | Testing + QA | Full 8-section validation and submission checklist |

---

## ⭐ Beyond the Assignment — Extra Features

> See the full list and code walkthroughs in [`submission/BEYOND_THE_ASSIGNMENT.md`](submission/BEYOND_THE_ASSIGNMENT.md)

Features built **beyond the 5 required tasks**:

1. **Premium Hover Zoom Animations** — Cinematic cubic-bezier zoom-in scaling (`scale(1.045)`) and dark overlay mask fades on all property listing photos on hover.
2. **Dynamic Stackable Toast Queue** — Stackable, self-dismissing notification toasts managed in global React Context with Framer Motion slide-in entries.
3. **Interactive Share & Saved Title Actions** — Instant URL clipboard copying and active heart wishlist toggles with state synchronized to persistent `localStorage` cache.
4. **High-Fidelity Hamburger Dropdown Menu** — User profile dropdown list featuring visual category icons, pulsing signup indicators, and staggered hover translates.
5. **Interactive Slide-out Wishlist Drawer** — Spring-animated dialog panel drawer tracking bookmarked stays with empty state explore prompts and dismiss bounds.
6. **Full-Screen Interactive Help Centre** — Custom FAQ portal overlay with real-time text query filters and clean sliding accordion expansions.
7. **Fullscreen Categorized Photo Gallery (Photo Tour)** — Spaces overlay gallery featuring sticky centered headers and scrollspy category sidebar sync.
8. **Dynamic Sticky Booking Card** — Sticky pricing card calculating total nights, check-in dates, and guest headcounts with automated scroll-to-focus triggers.
9. **Interactive 10% Stay Discount & Strikethrough Pricing** — Clickable promo claiming card that updates global stay costs and renders strikethroughs dynamically.
10. **Dynamic 2-Month Inline Calendar Picker** — Side-by-side paginated calendar with check-in/out range picks, hover range shading, and quick resets.
11. **Interactive Reviews Tag Filters & List Filtering** — Real-time filter buttons with dynamic tag counting to slice and filter visible reviews.
12. **Interactive Google Map Widget & Location Info** — Google Map widget with custom React zoom buttons, search shortcuts, and central marker badges.
13. **Business-Focused Site Footer** — Clean resource index columns mapping support shortcuts, language selectors, and social media portals.

---

## 🛠 Technologies Used

### Core Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.x | UI component library |
| **TypeScript** | 7.x | Type-safe JavaScript |
| **Vite** | 8.x | Build tool and dev server (uses Rolldown/Rollup) |
| **Tailwind CSS** | 4.x | Utility-first styling (via `@tailwindcss/vite` plugin) |

### Additional Libraries

| Library | Purpose |
|---------|---------|
| **Framer Motion** | Page-level animation config and `MotionConfig` with reduced-motion support |
| **Lucide React** | Icon library (used for nav, booking card, amenities) |
| **@radix-ui/react-dialog** | Accessible modal primitive for Auth Modal and Help Center |
| **clsx** | Conditional class name utility |
| **tailwind-merge** | Merge Tailwind classes without conflicts |
| **tw-animate-css** | Pre-built CSS animations via Tailwind |
| **oxlint** | Fast Rust-based linter (alternative to ESLint) |

### Map

| Service | Implementation |
|---------|---------------|
| **Google Maps Embed API** | Free embed via `<iframe>` — no API key required. Embedded at `maps.google.com/maps?q=Candolim,+Goa,+India&z={zoom}&output=embed`. Zoom controls are custom React state-driven (changes the `z` query parameter). Clicking "Search area" opens full Google Maps in a new tab. |

### Fonts

| Font | Source | Weights |
|------|--------|---------|
| **Inter** | Google Fonts (preconnect loaded) | 300, 400, 500, 600, 700, 800 |

### Dev Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Editor with Tailwind IntelliSense, Prettier |
| **Chrome DevTools** | Layout inspection, animation timing, responsive testing |
| **Antigravity (Google DeepMind)** | AI coding agent — built the entire project |

---

## 📐 Project Structure

```
airbnb-clone/
│
├── index.html                      ← Entry HTML with Inter font, SEO meta tags
├── package.json                    ← Dependencies and scripts
├── vite.config.js                  ← Vite + Tailwind + code splitting config
├── tsconfig.json                   ← TypeScript strict mode config + @ path alias
├── vercel.json                     ← Vercel deployment config (SPA routing + headers)
├── .gitignore
│
├── .vscode/
│   ├── settings.json               ← CSS unknown at-rules silenced (Tailwind v4)
│   ├── extensions.json             ← Recommended extensions for this project
│   └── tailwind.json               ← Tailwind v4 custom data for IDE IntelliSense
│
└── src/
    ├── main.tsx                    ← React root mount point
    ├── App.tsx                     ← Root component — assembles all sections
    ├── data.ts                     ← All mock listing data (photos, reviews, host, amenities)
    ├── vite-env.d.ts               ← Vite type declarations
    │
    ├── types/
    │   └── index.ts                ← TypeScript interfaces (Listing, Review, Host, Photo, etc.)
    │
    ├── styles/
    │   ├── index.css               ← Global CSS — Tailwind imports, design tokens, base styles
    │   └── App.css                 ← App-level layout utilities
    │
    ├── context/
    │   └── AppContext.tsx          ← Global state (photo tour open, lightbox index, modals)
    │
    ├── hooks/
    │   └── (custom hooks)          ← useFocusTrap, useScrollLock, useKeyPress, useClickOutside
    │
    ├── lib/
    │   └── utils.ts                ← cn() utility (clsx + tailwind-merge)
    │
    ├── constants/
    │   └── (shared constants)      ← Static data constants
    │
    ├── assets/
    │   └── image1_files/           ← 43 local property photos, host avatar, review avatars
    │
    └── components/
        ├── Navbar.tsx              ← Sticky top navbar with search pill and profile dropdown
        ├── StickySubNavbar.tsx     ← Scroll-aware sub-nav (Photos/Amenities/Reviews/Location)
        ├── TitleRow.tsx            ← Property title h1, rating, share/save buttons
        ├── PhotoGrid.tsx           ← 5-image hero grid with "Show all photos" button
        ├── PhotoTour.tsx           ← Fullscreen photo gallery overlay (lazy loaded)
        ├── Lightbox.tsx            ← Single-photo viewer inside Photo Tour
        ├── HostSummary.tsx         ← Host info, guest stats, highlights
        ├── DescriptionSection.tsx  ← Expandable property description
        ├── SleepingSection.tsx     ← Bedroom / bed type cards
        ├── AmenitiesSection.tsx    ← Amenities grid + full-list modal
        ├── InlineCalendar.tsx      ← Date-range calendar embedded in page
        ├── ReviewsSection.tsx      ← Rating bars + individual review cards
        ├── MapSection.tsx          ← Google Maps iframe + zoom controls + neighbourhood info
        ├── MeetHost.tsx            ← Host profile card with response rate
        ├── ThingsToKnow.tsx        ← House rules, safety info, cancellation policy
        ├── MoreStaysNearby.tsx     ← Horizontal scroll of nearby properties
        ├── BookingCard.tsx         ← Sticky price card with date picker and guest selector
        ├── AuthModal.tsx           ← Sign in / Sign up modal (Radix Dialog)
        ├── HelpCenter.tsx          ← Searchable help center modal
        ├── SiteFooter.tsx          ← 4-column footer with links
        └── Toast.tsx               ← Global toast notification system
```

---

## 🚀 Setup Guide

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

### Run Locally

```bash
# 1. Navigate into the project directory
cd airbnb-clone

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Build for Production

```bash
# Inside airbnb-clone/
npm run build
```

The built output will be in `airbnb-clone/dist/`. Open `dist/index.html` locally, or deploy the `dist/` folder to any static host.

To preview the production build locally:

```bash
npm run preview
```

Then open [http://localhost:4173](http://localhost:4173).

---

### Type Check

```bash
npx tsc --noEmit
```

Expected output: zero errors.

---

### Lint

```bash
npm run lint
```

Uses oxlint — fast Rust-based linter.

---

### Deploy to Vercel

The project includes a `vercel.json` at the root of `airbnb-clone/`. This handles:

- ✅ SPA routing (all URLs → `index.html`, prevents 404 on page refresh)
- ✅ 1-year immutable cache on all hashed assets
- ✅ Security headers

**Option A — Vercel Web UI:**
1. Go to [vercel.com](https://vercel.com) and click "Add New Project"
2. Import this GitHub repository
3. Set the **Root Directory** to `airbnb-clone`
4. Framework will auto-detect as Vite
5. Click Deploy

**Option B — Vercel CLI:**
```bash
npm install -g vercel
cd airbnb-clone
vercel
```

---

### Environment Variables

**None required.** The app uses:
- Local asset imports (compiled into `dist/assets/` by Vite)
- Google Maps Embed API free tier (no API key needed for the embed URL)
- Google Fonts (loaded via CDN in `index.html`)

No `.env` file is needed to run locally or deploy.

---

## 🌐 Known Deviations from Reference Site

| Section | Deviation | Reason |
|---------|-----------|--------|
| Map | Google Maps Embed (free) instead of Mapbox/Leaflet | No API key needed, works on Vercel without secrets |
| Booking | No actual payment processing | Frontend-only assignment — not required |
| More Stays Nearby | Static mock data | Real API would require Airbnb API access |
| Auth | UI-only modal, no backend | Frontend-only assignment |

---

*Built with ❤️ using Antigravity by Google — free Gemini Pro plan (Jio card offer / student plan).*
