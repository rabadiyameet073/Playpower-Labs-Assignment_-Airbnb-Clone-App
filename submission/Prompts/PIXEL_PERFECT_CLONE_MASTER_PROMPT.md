# Master Build Prompt — Pixel-Perfect Airbnb Listing Clone

*One document covering Tasks 1–8 in full detail. Paste this whole file into Claude Code / Cursor / Codex as your project brief, and check things off as you go. Keep this file inside your repo — the assignment explicitly asks for your working docs.*

> **Note on Step 0:** I tried to fetch `airbnb-clone-umber-two.vercel.app` directly from this chat to pull exact colors/fonts/copy for you, but the site's robots.txt blocks automated fetching from here. That's fine — your coding agent (Claude Code / Cursor) has live browser + DevTools access when you run it locally, so **Step 0 below is written as its first task**: extract the real design tokens itself before writing any code. Don't skip it and don't eyeball values — an agent that "guesses" a color that's *close* is exactly how clones fail the pixel-fidelity grade.

---

## 0. Ground Rules

- **Source of truth:** `https://airbnb-clone-umber-two.vercel.app` — visually and behaviorally, in all three views (Listing Page, Photo Tour, Lightbox).
- **Do not** view-source and copy-paste the reference's actual code/asset URLs/class names. Rebuild from extracted values. Direct lift-and-shift risks disqualification per the assignment.
- **Scope:** Desktop only. No mobile breakpoint required.
- **Backend:** optional. Local JSON/mock data or browser storage is acceptable and often *better* here — it keeps you focused on the pixel/behavior fidelity that's actually graded.

---

## 1. Recommended Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript | SSR-friendly, file-based routing, matches assignment's suggested stack |
| Styling | Tailwind CSS | Fast to hit exact spacing/color values once you have design tokens; utility classes map cleanly to Figma/DevTools measurements |
| Animation | Framer Motion | Declarative enter/exit transitions for gallery + lightbox; handles `AnimatePresence` for unmounting cleanly |
| Icons | `lucide-react` (or extract exact icon set from reference in Step 0) | Consistent, tree-shakeable |
| State | React Context or Zustand (gallery-open / lightbox-index / active-photo state) | No need for Redux at this scale |
| Data | Local `listing.json` mock | Backend is optional per the brief |
| Deployment | Vercel | Free, zero-config for Next.js |

If you prefer Angular or another stack, keep the same task breakdown below — only Section 1 changes.

---

## 2. Step 0 — Extract Real Design Tokens (do this before writing a single component)

Open the reference in a real browser with DevTools. For **each** of the following, record the *actual computed value*, not an approximation. Save them into `docs/DESIGN_TOKENS.md` in your repo so every later prompt can reference it instead of re-guessing.

**Typography**
- `font-family` stack (check `<html>`/`<body>` computed style, and any `@font-face` in Network tab)
- Font size + weight + line-height for: page title (h1), section headings, body text, small/meta text, price text in booking card
- Letter-spacing on any uppercase/label text

**Color**
- Text color (primary, secondary/muted)
- Background (page, card, footer)
- Border/divider color
- Star-rating fill color
- Link/underline color and hover color
- Button colors (primary "Reserve" button, secondary/ghost buttons) — default, hover, active, disabled states
- Focus ring color (Tab into a button and read the outline color)

**Spacing & Layout**
- Page container `max-width` and side padding
- Gap between major sections (gallery → title → description → amenities → reviews → footer)
- Grid gap in the hero photo grid
- Booking card width, padding, and its `top` offset when sticky

**Shape & Depth**
- `border-radius` on: buttons, cards, images, avatar circles
- `box-shadow` values on: booking card, hovered cards, modal/lightbox surfaces

**Icons**
- Icon set/style used (outline vs filled), approximate stroke width, size in px for nav icons vs. inline icons

**Motion** (use the Rendering tab → "Emulate CSS prefers-reduced-motion" toggled off, and slow down animations via DevTools "Animations" panel if available)
- Gallery open: fade? scale-from-thumbnail? slide-up? — note duration + easing
- Lightbox image change: crossfade vs. slide, duration
- Hover states: scale amount on card hover, opacity change on icon hover, transition duration used site-wide (Airbnb-style UIs are usually consistent, e.g. all `150–250ms ease`)
- Scroll behavior: does the booking card become sticky at a scroll threshold? Does the navbar shrink/change background on scroll?

**Copy & Content** (so your clone isn't just visually right but content-accurate)
- Exact property title, location line, rating + review count
- Full description text (and where the "Show more" truncation cuts off)
- Full amenities list
- Review section: overall category breakdown (cleanliness, communication, etc. if shown) and 3–5 sample reviews
- House rules / cancellation policy text if present

**Screenshots** — capture full-page and per-component screenshots of all three views (listing page, photo tour, lightbox) at your build viewport width. Keep these in `docs/reference-screenshots/` for side-by-side diffing later.

---

## Task 1 — Clone the Main Listing Page

Build each section as its own component. For each, the agent should reproduce **structure, spacing, and interaction**, using the tokens from Step 0 — not default Tailwind/Bootstrap values.

| Component | Must include |
|---|---|
| **Navbar** | Logo, nav-center (if present), right-side auth/menu button; background/border behavior on scroll if the reference has it |
| **Photo grid (hero)** | 1 large + 4 small tiles (or whatever exact grid the reference uses), rounded corners, hover overlay/opacity change, "Show all photos" pill button bottom-right |
| **Title row** | Title (h1), rating (★ + number) · review count · location, right-aligned **Share** and **Save** icon-buttons with underline-on-hover text |
| **Host summary** | Host avatar, "Hosted by X", key stats row (guests/bedrooms/beds/baths) |
| **Description** | Paragraph text with "Show more" expand — implement as a real expand/collapse, not a fake truncate |
| **Amenities** | Icon + label grid, "Show all amenities" opens a modal listing everything |
| **Reviews** | Overall rating + category bars, individual review cards (avatar, name, date, text with own "show more" if long), "Show all reviews" |
| **Map/location** | Static map or placeholder matching layout footprint (exact map tiles aren't graded — position/sizing is) |
| **Booking card** | Sticky on scroll once past the hero, price/night, date range inputs, guest-count selector, **Reserve** button, price breakdown lines, disclaimer text ("You won't be charged yet") |
| **Footer** | Match column structure, links, divider, copyright row |

---

## Task 2 — Fullscreen Photo Gallery ("Photo Tour")

- **Trigger:** clicking "Show all photos" OR any hero image tile.
- **Layout:** full-viewport overlay, scrollable column/masonry of every listing photo — match the reference's exact grid (single column? two-column staggered?).
- **Close (✕) button:** fixed top-left (check reference for exact position), always visible while scrolling.
- **Entrance/exit animation:** match the reference exactly — likely a scale/fade from the triggering thumbnail's screen position, not a generic modal fade. Framer Motion's shared layout animation (`layoutId`) is the right tool if the reference does a "photo grows into place" transition.
- **Body scroll lock** while open; restore scroll position on close.
- Each photo is clickable → opens the **Lightbox** at that photo's index.

---

## Task 3 — Lightbox (Single Photo Viewer)

- Opens on top of the gallery (or directly from the main page), showing one large image, centered, with the rest dimmed/hidden.
- **⬅ Previous / ➡ Next** arrow buttons, positioned and styled to match reference exactly (size, background pill, hover state).
- **Keyboard:** `←`/`→` change photos, `Esc` closes.
- **Image counter** if the reference shows one ("3 / 24").
- **Animation:** match whether the reference crossfades or slides between images; preload the next/previous image so navigation doesn't flash a blank frame.
- **Edge behavior:** does it loop from last photo back to first, or disable/hide the arrow at the ends? Check the reference and match it exactly — this is an easy detail to get wrong.
- Closing returns you to the gallery (not straight to the main page), matching reference behavior, unless the reference does otherwise — verify.

---

## Task 4 — Visual & Motion Fidelity Pass

Do this as an explicit second pass after Tasks 1–3 are functionally complete — compare side-by-side against your Step 0 screenshots and fix drift:

- [ ] Fonts (family, size, weight, line-height) match at every text level
- [ ] Colors match exactly (use a color-picker/eyedropper against your screenshots, not memory)
- [ ] Spacing/padding/margins match (use browser DevTools ruler overlay on both, side by side)
- [ ] Buttons match (padding, radius, color states, icon+label alignment)
- [ ] Icons match (set, size, stroke weight)
- [ ] Shadows match (card elevation, modal elevation)
- [ ] Border-radius matches on every rounded element
- [ ] Hover effects match (what scales, what fades, timing)
- [ ] All transition durations/easings match (don't leave Tailwind/Framer defaults if the reference is snappier or slower)
- [ ] Scroll behavior matches (sticky booking card threshold, any scroll-triggered nav change)

---

## Task 5 — Accessibility

- **Tab order** is logical (navbar → gallery trigger → title actions → description toggle → amenities → reviews → booking card fields → reserve button → footer).
- **Enter/Space** activates all buttons (native `<button>` elements get this for free — don't build custom clickable `<div>`s).
- **Esc** closes whichever overlay is open (gallery or lightbox) — implement via a single top-level keydown listener that closes the topmost open surface.
- **Arrow keys** (`←`/`→`) navigate the lightbox — only bind this listener while the lightbox is actually mounted, to avoid intercepting arrow keys elsewhere on the page.
- **Focus management:** when a modal/gallery/lightbox opens, move focus into it (e.g., onto the close button); when it closes, return focus to the element that triggered it. Trap focus inside the overlay while it's open (Tab shouldn't escape to the page behind it).
- **ARIA:** `role="dialog"` + `aria-modal="true"` on gallery/lightbox containers; `aria-label` on every icon-only button (Share, Save, Close, Previous, Next); descriptive `alt` text on all images.
- **Visible focus states** on every interactive element — don't strip the outline without replacing it with an equally visible custom one.
- Respect `prefers-reduced-motion` — reduce/remove non-essential animation for users who've set that OS preference.

---

## Task 6 — Architecture Diagram (Production-Scale System)

This is graded separately from the clone itself — it's assessing **production architecture thinking**, not your clone's actual code. Keep the clone's own storage simple (local JSON/browser storage is fine), and treat this diagram as "how would this become a real, Airbnb-scale product."

A compact version of the flow to diagram:

```
Users
  │
Global CDN (edge cache + static assets)
  │
Next.js Frontend (SSR/ISR for listing pages, CSR for interactive booking flow)
  │
API Gateway (auth, rate limiting, routing)
  │
Backend Services (Listings, Search, Booking, Payments, Reviews, Media — independently scaled)
  │
┌────────────┬────────────┬──────────────────┬────────────────────┐
PostgreSQL     Redis        Elasticsearch       S3 / Image CDN
(sharded,      (cache,      (search + geo       (photos, fronted
read replicas) sessions)    ranking)            by CDN)
```

I already built you a **much more detailed version of this** — covering scaling strategy for frontend, backend, storage, search, and deployment specifically, plus a written rationale template — in the architecture prompt from earlier in this conversation (`architecture_generation_master_prompt.md`). Use that document to generate the full diagram; the block above is just the compressed version to sanity-check you haven't missed a layer.

Minimum bar for this task specifically: the diagram must show a **distinct scaling strategy** for each of frontend, backend, storage, search, and deployment — five separate call-outs, not one generic box per layer.

---

## Task 7 — Save Your AI Prompts

Keep a running `PROMPTS.md` (or `.txt`) in your repo, in chronological order, with every prompt you actually used. Log the prompt *and* a one-line note on what you did with the output (accepted as-is / edited / rejected and retried). Suggested prompt sequence to adapt as you go:

1. `"Set up a Next.js 14 + TypeScript + Tailwind project scaffold for an Airbnb listing-page clone."`
2. `"Here are the extracted design tokens [paste DESIGN_TOKENS.md]. Configure tailwind.config to use these as the theme's colors, fontFamily, borderRadius, and spacing scale."`
3. `"Build the Navbar component matching this screenshot and these tokens: [attach]."`
4. `"Build the hero photo grid — 1 large + 4 small tiles, rounded corners, hover overlay, 'Show all photos' button bottom-right."`
5. `"Build the title row: property title, star rating + review count + location, Share and Save icon-buttons."`
6. `"Build the description section with a real expand/collapse 'Show more' — not a fake truncate."`
7. `"Build the amenities grid and its 'Show all amenities' modal."`
8. `"Build the reviews section: overall rating breakdown bars + individual review cards + 'Show all reviews' modal."`
9. `"Build the sticky booking card: price, date inputs, guest selector, Reserve button, price breakdown."`
10. `"Build the Footer matching the reference's column structure."`
11. `"Build the fullscreen Photo Gallery overlay opened from 'Show all photos' or any hero image, with [specific animation] matching the reference, body-scroll-lock, and a persistent close button."`
12. `"Build the Lightbox: single-photo view with Previous/Next arrows, Esc to close, Left/Right arrow keys to navigate, and [crossfade/slide] animation matching the reference."`
13. `"Accessibility pass: audit and fix Tab order, add focus trapping to the gallery and lightbox, add aria-label to all icon-only buttons, restore focus on close, and respect prefers-reduced-motion."`
14. `"Visual fidelity pass: compare against these reference screenshots [attach] and fix any drift in spacing, color, shadow, or radius."`
15. `"Review the codebase for organization/clean-code issues and refactor into a clear components/ + lib/ + types/ structure."`

If you use sub-agents/skills (e.g., a dedicated "accessibility-reviewer" or "pixel-diff-checker" agent config), save those config files too — the assignment explicitly asks for them.

---

## Task 8 — Submission Package

Final structure:

```
airbnb-clone/
├── src/ (or app/)              — full source code
├── docs/
│   ├── DESIGN_TOKENS.md        — Step 0 extracted values
│   └── reference-screenshots/  — side-by-side comparison captures
├── README.md                   — setup/run instructions, stack + rationale, known deviations
├── Architecture Diagram.pdf     — from Task 6
├── AI Prompts.pdf (or .txt)    — from Task 7
└── Agent Config Files/         — sub-agent/skill configs, if used
```

**README.md should cover:**
- How to install and run locally (`npm install && npm run dev`)
- Tech stack chosen + one-line rationale for each major choice
- Which parts match the reference exactly vs. any deliberate/unavoidable deviations (and why)
- How to run the architecture diagram / where prompts are logged

**Do not** push this to a public GitHub repo — zip and submit per the instructions you were given over email.

---

## Definition of Done — Final Checklist

- [ ] All three views (listing page, photo tour, lightbox) visually match reference screenshots side-by-side
- [ ] Full keyboard walkthrough works with no mouse: Tab through the whole page, open gallery, open lightbox, navigate photos, Esc out of both, land focus back where you started
- [ ] `prefers-reduced-motion` respected
- [ ] No code/assets lifted directly from the reference's shipped bundle
- [ ] Lighthouse accessibility score checked (aim for 90+, investigate anything lower)
- [ ] `docs/DESIGN_TOKENS.md`, `PROMPTS.md`, and the architecture diagram are all present in the final zip
- [ ] README lets a stranger clone, install, and run it in under 2 minutes
