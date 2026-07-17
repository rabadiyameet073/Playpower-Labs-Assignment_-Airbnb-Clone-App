# Master Prompt Collection — Airbnb Listing Clone
## Complete AI Prompt Sequence (13 Prompts) Used to Build This Project

> **Project Credit:** This full project was created using **Antigravity by Google DeepMind** — the AI coding agent built into Google Gemini — accessed through the **Google Gemini free tier (student page)** and **Jio Plan Pro Gemini plan**. Every component, architecture diagram, and design decision in this project was built and iterated using AI-native prompting workflows with zero prior template code.

---

## How to Use This Document

This file contains **13 sequential prompts** in the exact order they were used:

| # | Prompt | Purpose |
|---|--------|---------|
| 1 | Architecture Design | Generate the production-scale system architecture |
| 2 | Project Scaffold | Initialize the React + Vite + TypeScript project |
| 3 | Design Tokens | Extract real CSS values from the reference site |
| 4 | Main Listing Page | Build all main page components section by section |
| 5 | Pixel-Perfect Merge | Merge a reference repo to maximize visual fidelity |
| 6 | Photo Tour + Lightbox | Build fullscreen gallery and lightbox viewer |
| 7 | Universal Clone | Reusable prompt to clone ANY website end-to-end |
| 8 | Accessibility Pass | a11y audit, focus traps, keyboard navigation |
| 9 | Responsive + Polish | Breakpoints, micro-animations, hover effects |
| 10 | Reference Fix Prompt | Fix remaining 20% using attached reference screenshots |
| 11 | Code Quality | Refactor, dead code removal, strict TypeScript |
| 12 | Customizable Prompt | Template you can adapt for any web cloning project |
| 13 | Testing + QA | Full validation, Lighthouse checks, submission checklist |

---
---

## PROMPT 1 — Production-Scale Architecture Design

**When to use:** Before writing any code. Paste into Claude, ChatGPT, Gemini, or any AI assistant to generate the full architecture diagram and written rationale for your submission.

---

You are a Principal Solutions Architect at a company operating a global, production-grade vacation-rental marketplace (Airbnb-scale): tens of millions of listings, hundreds of millions of monthly users, multi-region traffic, real-money payments, and a search experience that must return geo-ranked, filtered results in under 200ms at p95.

Design and diagram the system's production architecture. This is NOT the take-home clone itself — it is the "how would this scale to real-world production" architecture that accompanies it. Treat the take-home app (a listing page + photo tour + lightbox, built in React/Vite) as the seed of the frontend client only. Everything else must be designed as if this were a real, venture-scale company.

Produce two things:

**PART 1 — ARCHITECTURE DIAGRAM**

Use a C4-style layered layout with swimlanes and clear arrows for data flow. Include these 9 layers with SPECIFIC real technology names — not generic terms like "a database". Say "Postgres, sharded by geo-region, with read replicas per region":

**Layer 1 — EDGE / CLIENT LAYER**
- Global CDN + edge cache (Cloudflare / CloudFront / Fastly) serving static assets, hashed bundles, and cached HTML for anonymous traffic
- Next.js frontend using SSR for SEO-critical listing pages, ISR (incremental static regeneration) for listings that change infrequently, and CSR for logged-in and interactive states (booking flow, wishlist, host dashboard)
- Image pipeline: on-the-fly resizing/format negotiation (AVIF/WebP) via an image CDN (Cloudflare Images / Imgix / Thumbor), srcset + lazy-loading + blur-up placeholders for the photo tour and lightbox
- Client-side performance budget: code-splitting per route, prefetch on hover/viewport-intersection, Core Web Vitals (LCP/INP/CLS) as explicit NFR
- A/B testing and feature flag service (LaunchDarkly/Optimizely-style) sitting between edge and origin

**Layer 2 — API / GATEWAY LAYER**
- API Gateway (Kong / AWS API Gateway / Envoy) handling authn/z, rate limiting, request routing, and TLS termination
- Backend-for-Frontend (BFF) per client surface (web BFF, host-app BFF) aggregating calls to downstream services so the client makes one round trip
- GraphQL federation — chosen over REST because it reduces over-fetching for the highly nested listing page: host, amenities, reviews, availability, and pricing can all be resolved in one query
- WAF + bot protection + DDoS mitigation at this layer

**Layer 3 — CORE DOMAIN SERVICES (microservices, independently deployable)**
Identity and Access (OAuth2/OIDC, JWT, social login); Listings Service (CRUD, amenities, house rules); Search and Discovery Service (query parsing, ranking, personalization); Availability and Calendar Service (per-listing date-range locking to prevent double-booking); Pricing Service (dynamic pricing, currency conversion); Booking and Reservation Service (orchestrates the booking saga); Payments Service (PCI-scope isolated, wraps Stripe/Adyen, tokenization only — never stores raw card data); Messaging/Inbox Service (guest-host chat, near real-time); Reviews and Ratings Service; Trust and Safety / Fraud Detection; Notifications Service (email/SMS/push fan-out); Media Service (upload, transcode, virus scan, store to S3, emit CDN-ready URLs); Host Tools / Analytics Service (dashboards, payouts, iCal sync).
Each service is independently deployable, owns its own datastore (database-per-service), communicates via async events for cross-service side effects and sync gRPC for request/response.

**Layer 4 — DATA LAYER (polyglot persistence — justify each choice)**
- Transactional core (Users, Listings, Bookings, Payments): PostgreSQL, horizontally sharded by geo-region/listing-id, with read replicas per region and PgBouncer connection pooler
- Caching: Redis cluster for session data, hot listing pages, rate-limit counters, and availability-calendar read-through cache
- Search index: Elasticsearch/OpenSearch cluster, geo-spatial (geo_point/geo_shape) indexing, denormalized listing documents rebuilt via CDC (Debezium) from Postgres
- High-write / flexible schema (chat messages, activity logs): Cassandra or DynamoDB
- Object storage: S3 (or GCS) for photos/media, fronted by the CDN
- Analytics / data warehouse: events streamed to Snowflake/BigQuery for BI, pricing models, and search-ranking model training
- Change Data Capture (CDC) pipeline: Debezium + Kafka, keeping Elasticsearch and caches in sync with source-of-truth Postgres

**Layer 5 — SEARCH AND RANKING (critical path — call out separately)**
- Query layer: parses free-text + structured filters (dates, guests, price, amenities) into Elasticsearch bool/geo query
- Geo-search: geohash/geo_point queries for map-bounds search, pre-aggregated tile-based clustering for map pins at low zoom levels
- Ranking: base relevance (ES score) blended with a learned ranking model (quality score, conversion likelihood, host responsiveness)
- Personalization: user embeddings folded in at re-ranking time — NOT at base query — to keep the ES query cacheable
- Caching: popular searches cached at edge and in Redis with short TTL + cache-busting on price/availability change

**Layer 6 — ASYNC / EVENT-DRIVEN BACKBONE**
- Kafka (or Kinesis/Pub-Sub) as the central event bus
- Booking flow modeled as a SAGA: reserve-hold → payment-authorize → confirm → notify, with compensating transactions on failure (e.g., release date-hold if payment fails)
- Outbox pattern on each service's DB to guarantee at-least-once event publication without dual-write inconsistency
- Event consumers: search-index updater, notification dispatcher, analytics pipeline, fraud-scoring pipeline

**Layer 7 — DEPLOYMENT AND INFRASTRUCTURE**
- Kubernetes (EKS), one cluster per region, services as independently scaled Deployments with HPA (CPU/RPS-based) and KEDA for event-driven scaling (e.g., media transcoding queue depth)
- Service mesh (Istio) for mTLS between services, retries, circuit breaking, and traffic shifting (canary/blue-green)
- Multi-region active-active for read-heavy services (search, listings) and active-passive for payments/booking path (to keep transactional consistency simpler)
- Global traffic management: Route 53 geo-routing sending users to nearest healthy region
- IaC: Terraform for all cloud resources, GitOps (ArgoCD) for Kubernetes manifests
- CI/CD: GitHub Actions → build → test → containerize → canary deploy → automated rollback on SLO breach

**Layer 8 — OBSERVABILITY AND OPERATIONS**
- Metrics: Prometheus + Grafana, SLO dashboards per service
- Distributed tracing: OpenTelemetry → Jaeger/Tempo (trace a single booking request across all 6+ services it touches)
- Centralized logging: ELK / Loki
- Alerting/on-call: PagerDuty tied to SLO burn-rate alerts
- Synthetic monitoring on the critical path: search → listing → booking → payment

**Layer 9 — SECURITY AND COMPLIANCE**
- PCI-DSS scope isolated to the Payments service (tokenized cards only, never stored elsewhere)
- Encryption in transit (mTLS everywhere) and at rest (KMS-managed keys per datastore)
- Secrets management (Vault / AWS Secrets Manager)
- GDPR/data residency: EU user data pinned to EU region shards
- Rate limiting + WAF + bot detection at the edge

Render this as a single diagram with 9 clearly labeled swimlanes, arrows for the three most important flows: (1) search → listing page load, (2) browse-to-book saga, (3) photo upload → CDN-served image. Add a legend: solid arrow = sync, dashed arrow = async/event.

**PART 2 — ONE-PAGE WRITTEN RATIONALE**

For each of the 5 graded areas (Frontend scaling, Backend scaling, Storage scaling, Search scaling, Deployment scaling), write 3-4 sentences covering:
- (a) The bottleneck this app would hit first at 10x, then 100x scale
- (b) The specific mechanism from the diagram that addresses it
- (c) One explicit trade-off you accepted

Close with a "build first vs. defer" section — name the 3 components you would stand up in month 1 versus the 3 you would only introduce once traffic justifies the complexity. Name the metric/threshold that would trigger each migration.

Tone: precise, decisive, free of hedging. Use specific numbers (p95 latency targets, RPS, data volume) over vague adjectives. Do not pad with generic boilerplate not tied to this specific product (a two-sided vacation-rental marketplace with search, real-money payments, and media-heavy listings).

---
---

## PROMPT 2 — Project Scaffold and Setup

**When to use:** After architecture is finalized. Initialize the actual project from scratch.

---

Initialize a new React + Vite project in the current directory (./airbnb-clone) using TypeScript.

1. Set up index.html with:
   - Google Inter font (weights 400, 500, 600, 700) loaded from Google Fonts
   - Viewport meta tag for responsiveness
   - Title: "Airbnb | Romantic Jacuzzi 1BHK Candolim - Airbnb Clone"

2. Configure tsconfig.json with strict mode enabled (strict: true).

3. Configure vite.config.ts with the React plugin.

4. Install lucide-react for icons. No CSS frameworks — use Vanilla CSS only for all styling.

5. Create this folder structure inside src/:
   - assets/ (images and logos)
   - components/ (all UI components)
   - styles/index.css (global styles and CSS custom properties)
   - types/index.ts (TypeScript interfaces)
   - data.ts (mock listing data)
   - App.tsx (main orchestrator and state manager)

6. In src/data.ts, create a mock listing object with:
   - Property name: "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10"
   - Location: Candolim, Goa, India. Rating: 4.92. Reviews: 87. Price: Rs.15,000/night
   - 2 guests, 1 bedroom, 1 bed, 1 bath
   - 15 photo URLs using picsum.photos
   - Full amenities list (WiFi, AC, Kitchen, Pool, Hot Tub, Parking, Workspace, etc.)
   - 5 sample reviews with user names, dates, avatar URLs, and review text
   - Host info: name, avatar URL, years hosting, superhost status

7. Start the dev server with npm run dev and confirm it launches on localhost:5173.

---
---

## PROMPT 3 — Design Tokens Extraction and CSS Design System

**When to use:** Before building any component. Extract real design values from the reference site and set up the global CSS design system.

---

You are a Senior Frontend Engineer setting up a CSS design system for an Airbnb listing page clone.
Reference site: https://airbnb-clone-umber-two.vercel.app

STEP 1 — Extract Real Design Tokens:
Open the reference site in a browser with DevTools open. For each of the following, record the ACTUAL computed value — no approximations, no eyeballing:

Typography:
- font-family stack (check computed style on html and body elements, and @font-face in the Network tab)
- Font size + weight + line-height for: page title (h1), section headings, body text, small/meta text, price text in booking card
- Letter-spacing on any uppercase or label text

Color:
- Text color (primary and secondary/muted)
- Background color (page, cards, footer)
- Border and divider color
- Star-rating fill color
- Link and underline color plus hover color
- Button colors for Reserve button and ghost/secondary buttons — ALL states: default, hover, active, disabled
- Focus ring color (Tab into a button and read the outline color)

Spacing and Layout:
- Page container max-width and side padding
- Gap between major sections (gallery → title → description → amenities → reviews → footer)
- Grid gap in the hero photo grid
- Booking card width, padding, and top offset when sticky

Shape and Depth:
- border-radius on buttons, cards, images, avatar circles
- box-shadow values on booking card, hovered cards, modal surfaces

Motion (use DevTools Animations panel and slow down 4x):
- Gallery open animation: fade? scale from thumbnail? slide-up? Note duration and easing
- Lightbox image change: crossfade vs. slide, duration
- Hover transitions: scale amount on card hover, opacity change on icons, transition duration

STEP 2 — Create src/styles/index.css with all tokens as CSS custom properties:

    :root {
      --color-brand: #FF385C;
      --color-brand-hover: #E61E4D;
      --color-text-primary: #222222;
      --color-text-secondary: #717171;
      --color-text-light: #B0B0B0;
      --color-bg-white: #FFFFFF;
      --color-bg-light: #F7F7F7;
      --color-bg-footer: #F7F7F7;
      --color-border: #DDDDDD;
      --color-border-dark: #B0B0B0;
      --shadow-card: 0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);
      --shadow-booking: 0 6px 16px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.08);
      --shadow-modal: 0 8px 28px rgba(0,0,0,0.28);
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-size-xs: 12px;
      --font-size-sm: 14px;
      --font-size-base: 16px;
      --font-size-lg: 18px;
      --font-size-xl: 22px;
      --font-size-2xl: 26px;
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;
      --spacing-2xl: 48px;
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --radius-full: 9999px;
      --container-max-width: 1280px;
      --navbar-height: 80px;
      --transition-fast: 150ms ease;
      --transition-base: 200ms ease;
      --transition-slow: 300ms ease;
      --focus-ring: #005A9C;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      background: var(--color-bg-white);
      -webkit-font-smoothing: antialiased;
    }
    :focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

STEP 3 — Create docs/DESIGN_TOKENS.md documenting every token with its extracted real value and a one-line explanation of where it is used.

---
---

## PROMPT 4 — Build the Full Main Listing Page (All Components)

**When to use:** Core component build pass. Run this after design tokens are set up.

---

You are a Senior Frontend Engineer building a pixel-perfect Airbnb listing page clone in React + Vite + TypeScript + Vanilla CSS.
Reference site: https://airbnb-clone-umber-two.vercel.app
Use ONLY design token values from src/styles/index.css. Do NOT use default browser values or magic numbers.

Build each section as its own TypeScript component in src/components/. Match structure, spacing, color, and interaction EXACTLY to the reference.

**Header.tsx** — Sticky navbar (position: sticky, top: 0, z-index: 100, height: 80px, white background, bottom border: 1px solid #DDDDDD). Airbnb SVG logo on left (brand red). Middle search pill: three sections (Where | Dates | Add Guests) with a search icon button. Pill has border, hover shadow effect. Right side: "Become a host" link text, globe icon button, rounded profile container (hamburger icon + user avatar icon). Profile dropdown opens and closes on click. Closes on outside click.

**ListingHeader.tsx** — Property title as h1 (26px, font-weight 600). Second row: filled star icon + rating number + dot + review count + "reviews" link + dot + location. Right-aligned Share button (upload icon + "Share" text) and Save button (heart icon + "Save" text). Both have underline on hover and rgba(0,0,0,0.04) background on hover. Save button toggles: heart fills red (#FF385C) when saved. Share button copies page URL to clipboard and shows a toast notification "Link copied!".

**HeroGrid.tsx** — CSS grid layout: 1 large image on the left spanning full height, 4 smaller images in a 2x2 grid on the right. All images use object-fit: cover. Zoom on hover: transform: scale(1.03) on the img element (not the container), overflow: hidden on the container, transition: 300ms ease. Outer edge corners only have border-radius: 12px (top-left on main image, top-right on top-right small, bottom-right on bottom-right small, bottom-left on bottom-left small). Gap between images: 8px. "Show all photos" button overlays the bottom-right image: absolute position, background white, border: 1px solid black, border-radius: 8px, contains a grid icon + "Show all photos" text. Clicking any image or the button triggers onShowPhotoTour(clickedIndex) prop callback.

**HostInfo.tsx** — "Hosted by [Name]" heading with host avatar circle (48px) beside it. Stat row: [N] guests · [N] bedrooms · [N] beds · [N] baths. Property highlights list with 3-4 items, each with an icon (self check-in: door icon, dedicated workspace: monitor icon, free cancellation: calendar icon, great location: map-pin icon). Each highlight: bold label on first line, description text on second line. Bottom divider line.

**Description.tsx** — Full property description paragraph text from data.ts. Initially truncated to 3 lines. "Show more" expand arrow link that shows the full text. "Show less" link collapses it back. This must be a REAL expand/collapse — actually render different amounts of text, not a CSS overflow clip.

**AmenitiesSection.tsx** — Grid of 6-8 default amenity items, each with icon + label. "Show all [N] amenities" button below. Opens AmenitiesModal on click.

**AmenitiesModal.tsx** — Full-screen modal overlay. Categorized list of all amenities with icons. Header with "What this place offers" title and X close button. Click outside modal card closes it. ESC key closes it. Focus is trapped inside the modal while open. On close, focus returns to the "Show all amenities" button.

**ReviewsSection.tsx** — Large star + overall rating number at the top. Six category progress bars in a 2-column grid: Cleanliness, Communication, Check-in, Accuracy, Location, Value. Each bar: label on left, progress bar in center, score number on right. Grid of individual review cards below: circle avatar, user name, date, review text. Long reviews truncated with their own "Show more" toggle. "Show all [N] reviews" button at the bottom.

**LocationMap.tsx** — Section heading "Where you'll be". Leaflet.js interactive map centered on property lat/long coordinates. Zoom controls. Location description text below the map.

**BookingCard.tsx** — position: sticky, top: 88px, box-shadow from --shadow-booking. Price per night (24px, bold) + rating and review count on same line right side. Date picker row: "Check-in" and "Checkout" side by side with a divider between them, clicking opens a date-range calendar dropdown. Guest selector: clicking opens dropdown with Adults (max 2), Children (max 2), Infants (max 2), Pets (max 1) with +/- counter buttons and max limit enforcement. "Done" button closes dropdown. Full-width "Reserve" button: gradient background (#FF385C → #E61E4D), white bold text, border-radius: 8px, hover: slightly darker + box-shadow 0 4px 16px rgba(255,56,92,0.4). Price breakdown section visible after dates are selected: Base cost (nights × price), Cleaning fee (Rs.2,000), Airbnb service fee (12%), subtotals, and total before taxes. "You won't be charged yet" disclaimer below the Reserve button.

**SiteFooter.tsx** — Top border line. 4 columns: Support (Help Center, AirCover, Disability support, Anti-discrimination), Community (Airbnb.org, Disaster relief), Hosting (Airbnb your home, AirCover for Hosts, Hosting resources), Airbnb (Newsroom, New features, Careers). Each column: bold heading + list of links with underline-on-hover. Bottom row: copyright left side, Privacy · Terms · Sitemap links center, globe icon + "English (IN)" + currency selector right side.

**App.tsx** — Assemble all components. Sticky Header. Page container: max-width 1280px, centered, padding 0 80px. Full-width ListingHeader and HeroGrid below header. Two-column layout below hero: left column 65% / right column 35%. Left column contains: HostInfo → Description → SleepingSection → AmenitiesSection → ReviewsSection → LocationMap. Right column contains sticky BookingCard. SiteFooter full-width below the two-column layout. State managed in App.tsx: isPhotoTourOpen, isLightboxOpen, lightboxIndex, isAmenitiesModalOpen.

---
---

## PROMPT 5 — Pixel-Perfect Merge from Reference Repository

**When to use:** When you have a second reference codebase. Use this to maximize visual accuracy by reusing code from the reference repo instead of rewriting.

---

You are a Senior Frontend Engineer and UI Pixel-Perfect Specialist.

I have my Airbnb clone project at ./airbnb-clone. I also have another Airbnb clone repository at ./refrence that contains a more accurate implementation of some sections.

Reference website: https://airbnb-clone-umber-two.vercel.app/

Goal: Make ./airbnb-clone visually identical to the reference website while REUSING as much code as possible from ./refrence instead of rewriting from scratch.

Step 1 — Analyze both projects completely: compare folder structure, components, layouts, styling approach, responsiveness, animations, icons, spacing, typography, and interactions.

Step 2 — When ./refrence has a component that matches the reference website: copy the relevant code into my project. Preserve its logic. Do NOT rewrite it unless absolutely necessary.

Step 3 — When my project already has a similar component: merge the better implementation. Keep clean architecture. Avoid duplicate code.

Step 4 — Make every section pixel-perfect. Check every detail: Navbar, search bar, hero section, hero photo grid, listing cards, card hover effects, image gallery, price section, rating stars, footer, buttons, inputs, icons, modals, dropdowns, loading states, empty states.

Step 5 — Match exactly: widths, heights, margins, padding, border-radius, shadows, font sizes, font weights, letter-spacing, line-height, colors, hover/active/focus/disabled states, transition timing, animation easing, scroll behavior.

Step 6 — Responsive breakpoints required: Desktop (1920px / 1728px / 1536px / 1440px / 1280px), Laptop (1024px), Tablet (768px), Mobile (430px / 390px / 375px / 360px / 320px). Layout must match the reference at every breakpoint.

Step 7 — Code quality rules: never duplicate components, extract reusable components, keep TypeScript types strict, follow existing project architecture, remove unused code and dead CSS, keep imports clean, preserve all SEO metadata and accessibility features.

Step 8 — Before changing anything, identify existing reusable components, utilities, hooks, styles, and icons in BOTH projects. Reuse them first.

Step 9 — After every completed section, verify: pixel-perfect match to reference, no visual regressions at any breakpoint, no TypeScript errors, no ESLint errors, no console errors.

Step 10 — Never replace working code unless the reference implementation is visibly better.

Step 11 — Work in this order: Layout structure → Header/Navbar → Search bar → Hero photo grid → Listing content (host info, description, amenities, reviews) → Booking card → Footer → Responsive fixes → Micro-animations → Final polish.

Step 12 — End with a full summary: files modified, files copied from reference repository, components reused/merged/newly created, remaining visual differences (if any) with explanation.

---
---

## PROMPT 6 — Build Photo Tour and Lightbox (Tasks 2 and 3)

**When to use:** After the main listing page is functional. Build the fullscreen gallery overlay and lightbox viewer.

---

You are a Senior Frontend Engineer. My Airbnb listing clone at ./airbnb-clone has the main listing page built. Now build the two remaining overlay features.

Reference: https://airbnb-clone-umber-two.vercel.app

**TASK A: Fullscreen Photo Tour Gallery — src/components/PhotoTour.tsx**

Build a fullscreen overlay triggered when the user clicks "Show all photos" or any hero image tile.

Requirements:
- Full-viewport overlay: position fixed, inset 0, z-index 1000. Background: white.
- Body scroll must be locked (overflow: hidden on body element) while open. Restore exact scroll position on close.
- Fixed header bar at top: back arrow button (←) on the left, "Share" and "Save" icon-text buttons on the right.
- Gallery content area: vertically scrollable column of all 15 property photos. Each photo centered at 80% of viewport width. Caption text below each photo.
- Entrance animation: fade-in from slightly scaled (0.97 to 1.0) in 250ms ease-out.
- Clicking the back arrow or pressing ESC closes the Photo Tour. ESC key closure must be isolated so it closes ONLY the Photo Tour and NOT an open Lightbox simultaneously. Use a stopPropagation or separate event handler for the nested ESC logic.
- Each gallery photo is clickable and triggers onOpenLightbox(photoIndex) prop callback to open the Lightbox.

**TASK B: Lightbox Single-Photo Viewer — src/components/Lightbox.tsx**

Build a dark-themed photo viewer that opens on top of the Photo Tour overlay.

Requirements:
- Dark overlay: background #000000, z-index 1100 (above Photo Tour).
- Single large image centered on screen. Max-height: 90vh. Object-fit: contain.
- Top bar: "[currentIndex + 1] / [total]" counter on the left, X close button on the right.
- Left (←) and right (→) floating arrow buttons positioned on sides of the image. Styled as circular white background with opacity. Hover: opacity increases.
- Image looping: navigating past the last photo wraps to the first, and vice versa.
- Adjacent image preloading: preload the src for the next and previous images using hidden img elements to prevent blank-frame flashes.
- Image transition: smooth opacity crossfade (0 to 1) in 200ms when changing photos.
- Keyboard support: ArrowLeft and ArrowRight navigate photos. Escape closes the LIGHTBOX ONLY and does not bubble up to close the Photo Tour too.
- On close: return focus to the Photo Tour and restore the gallery scroll position.
- Accessibility: role="dialog" aria-modal="true" on the overlay container, aria-label on every icon-only button, focus the X close button when Lightbox opens, return focus to the gallery photo that triggered it when it closes.

**INTEGRATION in App.tsx:**
- State: isPhotoTourOpen (boolean), isLightboxOpen (boolean), lightboxIndex (number).
- Clicking a hero image: open Photo Tour first then also open Lightbox at the clicked index.
- Clicking "Show all photos": open Photo Tour only, no Lightbox.
- Closing Lightbox: stay in Photo Tour, Lightbox unmounts.
- Closing Photo Tour: close everything, unmount both overlays, restore page scroll.

---
---

## PROMPT 7 — Universal Clone Prompt (Clone ANY Website)

**When to use:** This is a reusable, universal prompt you can adapt to clone any website — not just Airbnb. Replace [REFERENCE_SITE_URL] and [TECH_STACK] with your project details.

---

You are an expert UI Clone Engineer with 10+ years of experience building pixel-perfect replicas of production web applications.

YOUR MISSION: Clone the website at [REFERENCE_SITE_URL] using [TECH_STACK — e.g., React + Vite + TypeScript + Vanilla CSS].

**PHASE 1: DEEP ANALYSIS — do this BEFORE writing any code**

Open the reference site in a browser with DevTools. Systematically document:

Layout structure: page max-width, horizontal padding, number of columns, sticky and fixed elements (navbar, sidebars, floating buttons), order of all major sections top to bottom.

Design tokens (record EXACT computed values — no guessing, no approximating): font family from computed styles and @font-face in Network tab, all distinct font sizes and weights used on the page, all background colors (page, cards, header, footer, modals), all text colors (primary, secondary, muted, links, labels), border color and width, border-radius per element type, box-shadow values per surface type, ALL button states (default, hover, active, disabled, focus) for every button type.

Interactions and animations: which elements are clickable and what they trigger, all hover effects (color change, scale, shadow, underline), all modals and overlays and what triggers them, all expand/collapse toggles, all dropdowns and their behaviors, scroll-triggered behaviors (sticky elements, parallax, lazy load), exact transition timing and easing from DevTools Animations panel.

Keyboard and accessibility: tab order across the page, all keyboard shortcuts (ESC, Arrow keys, Enter, Space), ARIA roles and labels on interactive elements.

**PHASE 2: SET UP DESIGN TOKENS**

Before building any component, create a CSS custom properties file (or equivalent theme config). Every color, spacing value, font-size, border-radius, and shadow value must be a named token. Zero magic numbers allowed in components.

**PHASE 3: BUILD COMPONENT BY COMPONENT**

Work in this exact order: page layout skeleton (header/main/footer positioning and column grid) → Navigation/Header → Hero/above-the-fold section → main content sections left-to-right and top-to-bottom → Sidebar/sticky elements → modal overlays (amenities, gallery, lightbox) → Footer → global states (loading, empty, error).

For each component: match all dimensions to within plus or minus 2px of reference, match all colors exactly using an eyedropper against screenshots, implement all hover/focus/active states, add proper ARIA labels and roles, test keyboard navigation individually.

**PHASE 4: VALIDATION PASS**

Take full-page screenshots of both the reference and your clone at the same viewport width. Compare side by side. Fix every visual deviation you can identify. Check specifically: all font sizes and weights match, all colors match (use eyedropper), all spacing/padding/margins match (use DevTools ruler overlay on both), all border-radii match, all shadows match, all hover effects match (type, color, timing), all animations match (duration, easing, direction), all interactive behaviors work identically.

**PHASE 5: POLISH AND QUALITY**

Remove all placeholder and TODO comments. Ensure zero TypeScript/ESLint errors and zero console errors. Test at all breakpoints (desktop, laptop, tablet, mobile). Verify prefers-reduced-motion compliance. Run Lighthouse accessibility audit and target a score of 90 or above.

Deliverables: complete source code in a clean components/ structure, docs/DESIGN_TOKENS.md with all extracted values and explanations, docs/reference-screenshots/ with before/after comparison captures, README.md with setup instructions and tech stack rationale, PROMPTS.md logging this prompt sequence with one-line notes on output for each step.

---
---

## PROMPT 8 — Accessibility Pass (a11y Deep Audit)

**When to use:** After all components are built. Run this as a dedicated second pass — do NOT change any visual styles or layout. Fix accessibility only.

---

You are an Accessibility (a11y) Specialist. Audit and fix the accessibility of my Airbnb listing clone at ./airbnb-clone. This is a DEDICATED pass — do not change visual styles, colors, spacing, or component logic. Only fix accessibility issues.

**1. Tab Order and Keyboard Navigation**
Verify the tab order is logical: Navbar → Hero buttons → Listing header actions (Share, Save) → Description toggle → Amenities toggle → Review cards → Booking card fields (dates, guests) → Reserve button → Footer links. Ensure all interactive elements are reachable via Tab. Ensure no interactive elements are inside non-focusable div or span elements. Use native button elements everywhere — never build clickable div elements.

**2. Focus Management in Modals**
For each of these overlays — AmenitiesModal, PhotoTour, Lightbox:
- When the overlay opens: move focus to the first interactive element inside it (usually the Close or Back button).
- While the overlay is open: pressing Tab must cycle ONLY inside the overlay. Implement a focus trap utility function (getFocusableElements, trap first/last).
- When the overlay closes: return focus to the exact element that triggered the overlay to open. Store that element reference before opening.

**3. Keyboard Shortcuts**
- ESC: closes the topmost open overlay ONLY. It must NOT close both Photo Tour and Lightbox simultaneously when both are open — they must have isolated ESC handlers.
- ArrowLeft and ArrowRight: navigate Lightbox images. These listeners must be active ONLY while Lightbox is mounted — add and remove them in useEffect with a cleanup function.
- Enter and Space: must activate all buttons and links. (Native button elements get this for free — verify no custom div buttons exist.)
- All keyboard listeners must be added/removed using useEffect cleanup functions tied to component lifecycle.

**4. ARIA Roles and Labels**
- Add role="dialog" and aria-modal="true" to every overlay container.
- Add aria-labelledby pointing to the overlay's heading on each dialog element.
- Add aria-label to every icon-only button: "Share listing", "Save listing", "Close gallery", "Previous photo", "Next photo", "Close lightbox", "Open search", "Open user menu".
- Add descriptive alt text to ALL images. Format: "[property name] — photo [index] of [total]".
- Add aria-expanded="true" or "false" to all expand/collapse toggle buttons (Description "Show more", Amenities section toggle).

**5. Focus Visible States**
Every interactive element must have a visible focus indicator when tabbed to. The default browser outline must NOT be removed without a visible replacement. Verify this rule is applied globally: :focus-visible { outline: 2px solid #005A9C; outline-offset: 2px; }. Check every button, link, input, and dropdown trigger.

**6. Reduced Motion**
Verify the @media (prefers-reduced-motion: reduce) block in index.css is active and removes all non-essential animations. Test by enabling "Emulate CSS prefers-reduced-motion: reduce" in Chrome DevTools Rendering tab. All interactive behaviors must still work — only the animations are removed.

**7. Toast Notifications**
Add role="status" aria-live="polite" to the toast notification container element so screen readers announce toast messages automatically.

End report with: list of every file modified, list of every accessibility issue found and fixed, list of issues found but NOT fixed with reason why, and an estimated Lighthouse accessibility score improvement.

---
---

## PROMPT 9 — Responsive Breakpoints and Animation Polish

**When to use:** After accessibility is complete. Final polish pass for responsiveness and micro-animations. Do NOT change any component logic.

---

You are a Senior Frontend Engineer doing a final polish pass on my Airbnb listing page clone at ./airbnb-clone.
Reference: https://airbnb-clone-umber-two.vercel.app

This pass has two goals only. Do not change component logic or TypeScript code.

**GOAL 1: RESPONSIVE BREAKPOINTS**

Test and fix layout at each of these viewport widths, matching the reference at each one:

1920px — large desktop: Verify the max-width container is perfectly centered with equal margins on both sides. No content touches the screen edge.
1440px — standard desktop: This is the primary target viewport. Layout must be pixel-perfect here.
1280px — small desktop: Hero grid and booking card must both still fit without wrapping.
1024px — laptop: The two-column main layout (content left, booking card right) may need to stack vertically. Booking card goes below content.
768px — tablet: Navigation collapses to a simplified version. Hero grid becomes a single full-width column. Two-column layout is now single column.
430px — standard mobile: Full single-column stacking. All sections are full-width. Booking card goes at the bottom.
375px — small mobile: No horizontal overflow. No content clipped. All text readable. All buttons are at least 44px tall for touch targets.

For each breakpoint: fix any horizontal overflow (apply overflow-x: hidden only where needed, not globally), fix incorrectly truncated text, fix distorted images, fix buttons under 44px touch target height, fix any overlapping elements.

**GOAL 2: MICRO-ANIMATIONS AND HOVER EFFECTS**

Add or fix these animations to match the reference:

Hero image grid zoom on hover: transform: scale(1.03) on the img element inside each grid cell. The container div must have overflow: hidden. Transition: 300ms ease. ONLY the image zooms — the container does not change size.

"Show all photos" button hover: subtle border-color change from #DDDDDD to #222222 on hover, transition 200ms.

Share and Save header buttons hover: background-color changes to rgba(0,0,0,0.04), transition 150ms ease.

Reserve button states: default is gradient background (#FF385C to #E61E4D). Hover: slightly darker gradient (#E61E4D to #D70466) plus box-shadow: 0 4px 16px rgba(255,56,92,0.4). Active/press state: transform: scale(0.99).

Review card hover: very subtle box-shadow appears (0 2px 8px rgba(0,0,0,0.08)), transition 200ms.

Footer link hover: text-decoration underline fades in, transition 150ms.

Photo Tour entrance animation: fade-in combined with scale from 0.97 to 1.0 in 250ms ease-out. Applied to the main container element.

Lightbox image change transition: opacity crossfade from 0 to 1 in 200ms ease. The old image fades out while the new one fades in.

Toast notification: slides in from the top (translateY from -100% to 0) in 200ms ease-out, then auto-dismisses with fade-out after 3 seconds.

Amenities modal: backdrop fades in (opacity 0 to 0.5) and the modal card slides up (translateY 20px to 0) simultaneously in 250ms ease-out.

All animations MUST: use CSS transitions or React state-driven class toggles — no heavy animation libraries needed. Respect prefers-reduced-motion (already handled in index.css). Not cause layout jank — test by enabling 4x CPU slowdown in Chrome DevTools Performance tab.

---
---

## PROMPT 10 — Interactive Reference Fix Prompt (Fix the Remaining 20%)

**When to use:** After the clone is approximately 80% complete. ATTACH to your AI chat: (1) a full-page screenshot of the reference site, (2) the saved .html file of the reference page, (3) a screenshot of your current clone.

---

You are an expert pixel-perfect UI specialist. My Airbnb clone is approximately 80% complete. I need you to analyze the remaining visual gaps and fix them precisely.

Context:
- My clone project: ./airbnb-clone
- Reference site: https://airbnb-clone-umber-two.vercel.app
- I have attached:
  - File 1: A full-page screenshot of the REFERENCE SITE at 1440px viewport (the target)
  - File 2: The saved .html source file of the reference page — use this to extract EXACT computed CSS values, inline styles, class names, and element structures. This is your ground truth.
  - File 3: A screenshot of MY CURRENT CLONE at 1440px viewport (the current state)

YOUR TASK:

Step 1 — Compare both screenshots (reference vs. clone) carefully, section by section. Go through: Navbar/Header, Hero image grid, Listing title and metadata row, Host info section, Description section, Amenities section, Reviews section, Booking card, Footer.

Step 2 — For each section, identify every visual difference: color differences (even subtle shade differences), spacing/padding/margin differences, font size or weight differences, border-radius differences, shadow differences, missing or wrong icons, hover state differences, missing animations or wrong timing.

Step 3 — For each identified difference: state the REFERENCE VALUE (extracted from the screenshot or .html file), state the CURRENT VALUE in my clone, then apply the exact fix in the relevant component file or CSS file.

Step 4 — Cross-reference with the attached .html file: use it to extract the EXACT computed CSS values used in the reference (inspect element styles, class names, computed properties, inline styles). Do not guess or approximate values. Copy exact pixel values, hex color codes, and timing functions directly from this file.

Step 5 — Image sections specifically: for the hero grid, photo tour, and lightbox sections, the attached reference screenshot shows the exact layout. Match the exact aspect ratio of each image slot, the exact border-radius on each image, the exact gap between images, the exact position and styling of the "Show all photos" overlay button, and the exact styling of any text overlays.

Step 6 — After applying all fixes, describe any remaining differences that could not be resolved with the information provided. List what additional data would be needed to fix them.

Rules:
- Do not refactor or restructure working code.
- Apply only the minimum changes required to achieve pixel accuracy.
- Do not change any TypeScript logic — CSS and layout fixes only.
- After every fix, verify no other section regressed visually.

End report: list all files changed, before-value and after-value for every CSS fix applied, any remaining unresolved differences with explanation.

---
---

## PROMPT 11 — Code Quality and Refactor Pass

**When to use:** After the clone is visually complete. Clean up code, remove dead code, enforce strict TypeScript. Do NOT change any visual output.

---

You are a Senior Software Engineer doing a code quality pass on a completed React + TypeScript project at ./airbnb-clone.
Do NOT change any visual output or user-facing behavior. Only improve the code structure, types, and cleanliness.

**1. TypeScript Strictness**
Enable "strict": true in tsconfig.json if not already set. Remove all uses of any type — replace with proper typed interfaces. Define proper interfaces for all component props in src/types/index.ts (Listing, Review, Host, Amenity, Photo, BookingCardProps, PhotoTourProps, LightboxProps, etc.). Add explicit return types to all functions and React components.

**2. Component Organization**
Review each component file and verify: single responsibility (each component does ONE thing), minimal props (no "god props" passing everything), no prop drilling beyond 2 levels deep (lift state or use context if needed), any repeated JSX patterns extracted into named sub-components, no inline styles (all styles belong in CSS files).

**3. Dead Code Removal**
Remove: commented-out code blocks that are no longer relevant, unused import statements, unused CSS class definitions, console.log and console.error debug statements, TODO comments that reference completed work.

**4. CSS Cleanup**
Ensure every spacing, color, border-radius, and shadow value uses a CSS custom property from :root — zero magic numbers allowed in component CSS. Remove duplicate CSS rules by consolidating them. Consolidate similar selectors into shared rules. Organize all media queries together at the bottom of each CSS block instead of scattered throughout.

**5. Custom Hooks Extraction**
Extract these repeated patterns into custom hooks in src/hooks/:
- useFocusTrap(containerRef, isActive): traps keyboard focus inside a container element while isActive is true
- useScrollLock(isLocked): adds overflow: hidden to body when true, restores when false, saves and restores scroll position
- useKeyPress(key, handler, isActive): registers a keydown listener for a specific key, only active when isActive is true, cleans up on unmount
- useClickOutside(ref, handler): calls handler when a click event occurs outside the ref element

**6. Data Layer**
Verify all mock data lives exclusively in src/data.ts and is not scattered across component files. Verify TypeScript interfaces for all data shapes are defined in src/types/index.ts and imported everywhere they are used.

**7. Performance**
Wrap with React.memo any components that receive only stable primitive props (ReviewCard, AmenityItem, FooterColumn, HighlightItem). Add explicit width and height attributes to all img elements to prevent Cumulative Layout Shift. Wrap any expensive computations (price calculations, filtered arrays) in useMemo.

End report: list all files modified, summary of each change made and why, TypeScript error count before and after this pass, issues found but intentionally left for future improvement with reason.

---
---

## PROMPT 12 — Customizable Submission Prompt (Template for Any Project)

**When to use:** Use this as a template you can adapt to clone any website. Fill in the fields marked with [BRACKETS] with your specific project details. This prompt is specifically designed to be used AFTER the clone is approximately 80% complete — use it to fix the remaining visual gaps with high precision by attaching your reference files.

---

You are a Senior Frontend Engineer completing a pixel-perfect clone project.

PROJECT CONTEXT:

Reference Site URL:
[INSERT THE URL OF THE SITE YOU ARE CLONING HERE]

Reference Saved HTML File (ATTACH THIS FILE):
[ATTACH THE SAVED .HTML FILE OF THE REFERENCE PAGE — downloaded by saving the page from your browser]
This file is your ground truth. Use it to extract EXACT computed CSS values, class names, element structures, inline styles, and computed property values. Always prefer values from this file over values estimated from screenshots.

Reference Screenshots (ATTACH THESE):
[ATTACH FULL-PAGE SCREENSHOTS OF THE REFERENCE SITE AT YOUR TARGET VIEWPORT WIDTH]
These show exactly how the site should look.

My Current Clone Screenshots (ATTACH THESE):
[ATTACH SCREENSHOTS OF YOUR CURRENT CLONE AT THE SAME VIEWPORT WIDTH]
These show the current state of my project for side-by-side comparison.

My Project Directory:
[INSERT PATH TO YOUR PROJECT, e.g., ./airbnb-clone]

Technology Stack:
[INSERT YOUR STACK, e.g., React + Vite + TypeScript + Vanilla CSS]

CURRENT COMPLETION STATE:

My clone is approximately [INSERT PERCENTAGE, e.g., 80%] complete.

Already built and working:
[LIST WHAT IS DONE — example:]
- Navbar / Header with search pill
- Hero image grid with 5 images
- Listing title, rating, metadata row
- Host info section with highlights
- Description with Show more toggle
- Amenities section and modal
- Reviews with progress bars and cards
- Booking card (sticky, with date picker and guest selector)
- Footer with 4 columns

Still needs work:
[LIST WHAT STILL NEEDS FIXING — example:]
- Photo Tour entrance animation does not match reference
- Lightbox arrow button styling and size is off
- Booking card price breakdown spacing is incorrect
- Footer bottom row alignment is wrong

YOUR TASK:

Using the attached reference screenshots and saved .html file as ground truth, identify and fix every remaining visual difference between my clone and the reference site.

For each section listed as needing work:
1. Compare the reference screenshot vs. my current clone screenshot for that specific section.
2. Open the relevant component file and CSS in my project.
3. Cross-reference with the attached .html file to extract the EXACT CSS values (computed hex colors, exact pixel measurements, exact animation timing functions).
4. Apply the minimum necessary changes to close the visual gap.

Specific focus areas:
[INSERT YOUR SPECIFIC CONCERNS — example:]
- The hero image grid gap appears larger in my clone than the reference. Extract the exact grid-gap value from the reference .html and apply it to HeroGrid component.
- The Reserve button gradient does not match. Look up the exact gradient stops in the reference .html and update the booking card CSS.
- The Photo Tour back button is positioned incorrectly. Extract exact positioning from the reference .html.
- The Lightbox arrow buttons are too large. Extract the exact width, height, and font-size from the reference .html.

Constraints:
- Do NOT copy reference site component code — only extract computed CSS values.
- Do NOT change any TypeScript logic — CSS and layout fixes only.
- Do NOT restructure the project component architecture.
- Apply only the minimum code changes to fix each visual difference.
- After each fix, verify no other section visually regressed.

End report: all files changed with summary, before-value to after-value for every CSS fix, remaining unresolvable differences with explanation of what additional data would be needed.

---
---

## PROMPT 13 — Testing, QA and Final Submission Validation

**When to use:** The final step before submitting. Run through every check. Fix each failure before moving to the next.

---

You are a QA Engineer and Frontend Testing Specialist. My Airbnb listing clone at ./airbnb-clone is complete and ready for final validation before submission. Run through all checks below. Report status as PASS, FAIL, or PARTIAL for each item. Fix every FAIL before moving to the next section.

**SECTION 1: BUILD VALIDATION**

Run npm run build — must complete with zero errors. Note any warnings but do not block on them.
Run npm run dev — dev server must start on localhost:5173. Browser console must show zero errors on initial page load.
Run npx tsc --noEmit — must complete with zero TypeScript type errors.
Run npx eslint src/ — must show zero errors. Document any remaining warnings.

**SECTION 2: VISUAL FIDELITY at 1440px viewport**

Verify every section of the page against the reference site:
- Navbar: logo position, search pill layout, profile button styling, hover states
- Hero grid: 1 large + 4 small images, correct 8px gaps, correct border-radius only on outer corners, "Show all photos" button position
- Listing header: title font size and weight, rating row content and spacing, Share/Save button styling
- Host info: avatar size, stat line content, highlights with icons
- Description: correct line truncation, Show more button styling and function
- Amenities: correct grid, "Show all" button, modal opens correctly with categorized list
- Reviews: rating bars aligned and correct, review cards layout
- Booking card: sticky position correct, price display, date picker layout, guest selector, Reserve button gradient, price breakdown layout
- Footer: 4 columns aligned, link hover states, bottom row content

**SECTION 3: INTERACTION TESTING**

Test every user interaction manually:
- Click any hero image → Photo Tour opens at clicked index
- Click "Show all photos" → Photo Tour opens (no Lightbox yet)
- Photo Tour entrance animation plays (fade-in + scale)
- Scroll through all 15 photos in Photo Tour
- Click a photo in Photo Tour → Lightbox opens at that photo's index
- Lightbox left and right arrow buttons cycle through images correctly
- Keyboard left and right arrows also navigate Lightbox images
- Image counter at top of Lightbox updates correctly (e.g., "3 / 15")
- Press ESC in Lightbox → Lightbox closes, Photo Tour remains open
- Press ESC in Photo Tour → Photo Tour closes entirely
- Click back arrow in Photo Tour → Photo Tour closes
- Image looping works: navigating past the last photo wraps to photo 1
- Amenities "Show all" button → modal opens
- Amenities modal X button → modal closes
- ESC while amenities modal is open → modal closes
- Clicking outside amenities modal card → modal closes
- Description "Show more" → full text appears, button changes to "Show less"
- Description "Show less" → text collapses back
- Save button toggles heart icon between empty and filled red
- Share button copies URL to clipboard and shows "Link copied!" toast
- Date picker opens and closes, date selection works
- Guest selector opens and closes, +/- counters increment and decrement correctly with limits enforced
- Price breakdown section appears after valid dates are selected
- Reserve button shows a confirmation toast or performs the expected action

**SECTION 4: KEYBOARD-ONLY NAVIGATION**

Test the complete user flow using ONLY the keyboard — no mouse interactions:
- Tab through the entire main page — every interactive element must be reachable
- Focus rings are clearly visible on every focused element
- Press Enter on "Show all photos" → Photo Tour opens
- Tab cycles through Photo Tour content in a logical order (back button, photos, share, save)
- Press Enter on a gallery photo → Lightbox opens
- Arrow keys navigate between Lightbox images
- ESC in Lightbox closes it, focus returns to the gallery photo that opened it
- ESC in Photo Tour closes it, focus returns to the element that opened the Photo Tour
- Tab through Booking card: date inputs → guest selector → Reserve button
- Press Tab from footer last item — focus does NOT escape into background content behind any open modal
- While any modal is open, Tab cycles ONLY inside the modal (focus trap active)

**SECTION 5: RESPONSIVE TESTING**

Open Chrome DevTools and test at each viewport width:
- 1920px: container is centered, no content touches screen edges, no horizontal scroll
- 1440px: pixel-perfect match to reference site (primary target)
- 1280px: all sections still readable, booking card and content both visible
- 1024px: two-column layout adapts, booking card may stack below content
- 768px: navigation simplified, hero grid becomes single column, all sections readable
- 430px: full single-column layout, no horizontal scroll, all buttons tappable
- 375px: no overflow, all text readable, all buttons are at least 44px tall for touch targets

**SECTION 6: LIGHTHOUSE AUDIT**

Run Lighthouse in Chrome DevTools with Desktop preset at 1440px viewport:
- Accessibility score: target 90 or above. Investigate and fix any item bringing the score below 90.
- Performance score: note the value. Do not block submission on this but document it.
- Verify zero images are missing alt text
- Verify zero buttons are missing accessible labels
- Verify all modal overlays have role="dialog" and aria-modal="true"
- Verify heading hierarchy: exactly one h1 on the page, logical h2 and h3 structure below it

**SECTION 7: REDUCED MOTION TEST**

In Chrome DevTools → Rendering tab → Emulate CSS media feature → select "prefers-reduced-motion: reduce":
- Hero image zoom on hover: removed or instant (no animation)
- Photo Tour entrance animation: removed or instant
- Lightbox image crossfade: removed or instant
- All CSS transitions: removed or instant
- Verify ALL interactive behaviors still work correctly — only animations are removed, functionality is preserved

**SECTION 8: SUBMISSION PACKAGE CHECK**

Verify these files and folders exist and are complete:
- README.md: contains installation instructions, tech stack with rationale, list of known deviations from the reference
- docs/DESIGN_TOKENS.md: all extracted design token values documented
- docs/architecture-diagram.png: the production-scale architecture diagram
- submission/ folder: contains problem statement document, all prompt files, architecture documents, and this master prompt file (ALL_PROMPTS_MASTER.md)
- src/ directory: all source code present, organized, with no placeholder or TODO files

FINAL REPORT FORMAT:

Provide a table with PASS / FAIL / PARTIAL for all 8 sections.

For every FAIL or PARTIAL: describe the issue, what was done to fix it, and if not fixed, explain why and what the user impact is.

Final line: OVERALL SUBMISSION READINESS: READY / NEEDS WORK

---
---

## Submission Folder Structure

    submission/
    |-- ALL_PROMPTS_MASTER.md       <- THIS FILE (all 13 prompts)
    |-- Playpower Labs Assignment_ Airbnb-Clone App.docx
    |-- airbnb_clone_details.md     <- Project specification and task breakdown
    |-- DESIGN_TOKENS.md            <- Extracted design system tokens
    |-- airbnb_clone_reference_repos.txt
    |-- README.md                   <- Submission index
    |-- Architecture/
    |   |-- Architecture_Diagram.mmd
    |   |-- architecture-diagram.png
    |   |-- document-export-7-11-2026-5_12_43-PM.md
    |   |-- diagram-export-7-11-2026-5_12_11-PM.png
    |-- Prompts/
        |-- PIXEL_PERFECT_CLONE_MASTER_PROMPT.md
        |-- architecture_generation_master_prompt.md
        |-- 00-original-prompts.txt
        |-- prompt 1.pdf
        |-- prompt 2.pdf
        |-- prompt 3.txt

---

*Built using Antigravity by Google DeepMind via Google Gemini free tier (student page) and Jio Plan Pro Gemini plan.*
