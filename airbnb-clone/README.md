# Airbnb Clone - Kyoto Luxury Traditional Villa

> **I built all of this using Antigravity by Google** — powered by the **free Gemini Pro plan** claimed using the **Jio card offer** or **student plan**.

A pixel-perfect, high-fidelity responsive clone of the Airbnb listing page. Built as a single-page application (SPA) using React and Vite, showcasing curated styling variables, interactive widgets, responsive layouts (supporting resolutions from 1920px down to 320px), custom fullscreen overlays, and deep keyboard accessibility.

---

## 🚀 Key Features

*   **Pixel-Perfect Main Page**: Replica navigation bar, search pill widget, user profile menu, header metadata (ratings, anchor-linked reviews, location, interactive save/share), details column, and full footer.
*   **Hero Image Collage**: Five-image layout grid. Features subtle zoom animations on hover, outer-edge borders, and a custom "Show all photos" toggle.
*   **Sticky Booking Card**: Calculates pricing dynamically based on checkout dates. Includes an inline date selector, and a custom guest selector dropdown (Adults, Children, Infants, Pets counters) with limit boundaries.
*   **Fullscreen Photo Tour (Task 2)**: Fullscreen view displaying all 15 property photos with captions, back navigation, scroll lock, and ESC key closure.
*   **Interactive Lightbox (Task 3)**: Dark overlay single-photo viewer with:
    *   Previous (`<-`) / Next (`->`) floating controls with looping.
    *   Keyboard navigation (`ArrowLeft` / `ArrowRight` to change images).
    *   Independent `Escape` key closure (event isolated from parent modal).
    *   Adjacent photo preloading for zero-latency switching.
    *   Smooth opacity and scale transitions.
*   **Accessibility & UX (Task 5)**: 
    *   Keyboard-navigable controls with high-contrast focus outlines.
    *   Custom tab focus trapping (focus cycles inside modal overlays).
    *   Restoration of focus to previous active elements upon closing overlays.
    *   Toast notifications confirming link copying and reservation success.
    *   Progress bar widgets displaying detailed review ratings.
    *   `prefers-reduced-motion` compliance to respect user accessibility configurations.

---

## 🛠 Tech Stack

*   **Frontend Library**: React 19
*   **Build Tool / Server**: Vite 8
*   **Styling**: Vanilla CSS (no CSS frameworks, complying with developer guidelines for custom designs)
*   **Icons**: Lucide React

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v16 or higher recommended).

### Installation & Run

1. Navigate to the project folder:
   ```bash
   cd airbnb-clone
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
airbnb-clone/
├── docs/
│   ├── reference-screenshots/ # Screenshots of the reference site
│   └── DESIGN_TOKENS.md       # Design system tokens and spacing variables
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images & Logos
│   ├── components/         # Sub-components
│   │   ├── AmenitiesModal.jsx # Full amenities overlay with focus trapping
│   │   ├── BookingCard.jsx    # Sticky price card + date/guest dropdowns
│   │   ├── Header.jsx         # Airbnb Navbar & profile menu
│   │   ├── HeroGrid.jsx       # 5-Image grid collage
│   │   ├── Lightbox.jsx       # Lightbox viewer with image preloading and key controls
│   │   ├── ListingHeader.jsx  # Property title, rating, share & save actions
│   │   └── PhotoTour.jsx      # Fullscreen image tour modal with isolated ESC key
│   ├── App.jsx             # Main orchestrator
│   ├── data.js             # Listing mock data
│   ├── index.css           # Global CSS, Responsive breakpoints, Design Tokens
│   └── main.jsx            # React SPA Entrypoint
├── AI Prompts.txt          # Prompt sequence log
├── Architecture Diagram.png # Production scaling blueprint
├── package.json            # Dependencies & Scripts
└── README.md               # Documentation
```

---

## 📐 Production-Scale Architecture

The `Architecture Diagram.png` included in this folder illustrates the production design for scaling a vacation-rental marketplace:

1.  **Frontend Delivery**: Next.js Server-Side Rendered (SSR) client hosting on a global CDN (e.g., Cloudflare, Vercel) for rapid page speed and optimal SEO indexing.
2.  **API Gateway Layer**: Manages security, rate limiting, authentication verification, and routes client traffic to downstream microservices.
3.  **Services**:
    *   *Inventory Service*: Manages listing metadata. Utilizes Redis caching clusters for calendar availabilities to prevent intensive DB lookups.
    *   *Booking & Transaction Engine*: Ensures double-booking prevention using transactional properties of PostgreSQL.
    *   *Search & Discovery Service*: Uses Elasticsearch to power keyword searches, maps bounding boxes, and filtering.
    *   *Media Engine*: Uploads images/videos to AWS S3 and optimizes resolutions for low-bandwidth clients via image CDNs.
