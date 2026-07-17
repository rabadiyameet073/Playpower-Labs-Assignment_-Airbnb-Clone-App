# Airbnb-Clone App: Project Specification & Task Breakdown

This document provides a highly detailed breakdown of all requirements, implementation details, and design considerations for cloning the Airbnb listing page.

---

## 1. Project Overview & Main Objective
The goal of this project is to build a high-fidelity, pixel-perfect desktop clone of the Airbnb listing page hosted at `https://airbnb-clone-umber-two.vercel.app`. It must match the source layout, typography, interactions, animations, and accessibility requirements. 

We will implement this as a modern **React SPA (Single Page Application)** using **Vite** for the build tool and **Vanilla CSS** for precise style recreation.

---

## 2. Requirements & Task Breakdown

### Task 1: The Main Listing Page
The main page represents the detailed view of a specific vacation property. It must implement the following structural and visual components:
*   **Navigation Bar (Navbar)**:
    *   Airbnb branding logo.
    *   Middle search widget (Where, Dates, Add Guests) with clean hover/active borders.
    *   Right menu section containing the "Become a host" link, globe icon, and a rounded profile dropdown container (hamburger icon + profile avatar).
*   **Property Header**:
    *   Property Title (`h1`) matching the typographic style.
    *   Rating, Review count, Host badge, and location (city/country) line.
    *   Action buttons: "Share" and "Save" with their respective icons (upload and heart) and subtle hover changes.
*   **Hero Image Grid (5-Image Collage)**:
    *   One large double-height image on the left.
    *   Four smaller square images on the right arranged in a 2x2 grid.
    *   All images must have zoom-on-hover effects.
    *   Rounded corners only on the outer edge boundaries of the grid.
    *   A "Show all photos" button at the bottom right corner with a grid icon, overlaying the bottom-right image.
*   **Main Body Layout (2-Column Structure)**:
    *   **Left Column (70% width)**:
        *   **Host Info**: Host name, host avatar image, and property capacity details (guests, bedrooms, beds, baths).
        *   **Property Highlights**: Sub-list with icons (e.g., self check-in, dedicated workspace, free cancellation).
        *   **Property Description**: Detailed paragraphs with a "Show more" expand/collapse toggle.
        *   **Sleeping Arrangements**: Card grid showing bed configurations per room.
        *   **Amenities Section**: A grid list of standard icons and names. A "Show all amenities" button that triggers a modal overlay showing categorized amenities.
        *   **Reviews Section**: Review metrics (average rating, progress bars for categories: Cleanliness, Communication, Check-in, Accuracy, Location, Value). A list of individual reviews with user avatars, dates, and review texts.
        *   **Location Map**: Visual map display utilizing dynamic leaflet coordinates or a high-fidelity interactive map module.
    *   **Right Column (30% width - Sticky Booking Card)**:
        *   The card must have a sticky position `position: sticky; top: 80px;`.
        *   Displays the price per night.
        *   Rating and reviews count indicator.
        *   Interactive **Date Picker** dropdown for Check-in / Checkout.
        *   Interactive **Guest Selector** dropdown (Adults, Children, Infants, Pets) with increment/decrement counters.
        *   Price breakdown calculation:
            *   Base cost: `price * nights`
            *   Cleaning fee
            *   Airbnb service fee
            *   Total before taxes
        *   A prominent "Reserve" button with gradient background and hover hover highlights.
*   **Footer**:
    *   Links categories (Support, Community, Hosting, About).
    *   Bottom row containing Copyright text, Privacy policy, Terms, Sitemap, and social/language preferences.

---

### Task 2: Full-screen Photo Gallery (Photo Tour)
*   Triggered by clicking "Show all photos" or any image in the Hero Image Grid.
*   Opens a full-screen overlay view.
*   **Header Bar**: Floating navbar containing a back arrow button (`<-`) and options to Share or Save.
*   **Gallery Content**: A vertical scroll list of high-quality photos, organized in categories or a clean grid.
*   **Exit**: Clicking the back button or pressing the ESC key closes the Photo Tour and returns the user to the main page.

---

### Task 3: Interactive Lightbox (Single Photo Viewer)
*   Triggered by clicking any photo in the Photo Tour gallery.
*   Opens a dark-themed modal overlay.
*   **Features**:
    *   Single large centered photo.
    *   A header indicating current photo index (e.g., `3 / 15`) and a Close (`X`) button.
    *   Navigation: Large floating Left (`<-`) and Right (`->`) arrows on the sides to cycle through images.
    *   **Keyboard Support**: Keyboard left and right arrow keys must cycle images. ESC key must close the Lightbox.
    *   **Transitions**: Smooth fade-in/fade-out or sliding transitions on image swap.

---

### Task 4: Design Aesthetics, Typography, and Polish
*   **Fonts**: Load clean typography (e.g. `Inter` or `Geist`) to replicate the clean sans-serif look of Airbnb.
*   **Colors**:
    *   Brand Accent: `#FF385C` (Airbnb Pink/Red)
    *   Dark Text: `#222222`
    *   Muted Text: `#717171`
    *   Borders: `#DDDDDD`
    *   White Background: `#FFFFFF`
    *   Lightbox Background: Solid Black `#000000` or `#1E1E1E`
*   **Visual Elements**: Drop shadows (`box-shadow`), borders, rounded corners (`border-radius: 8px` / `12px`), and spacing (padding/margins) must match modern web standards.
*   **Hover effects**: Clear visual hover responses (opacity changes, border colors, button scale, background-color shifts).

---

### Task 5: Accessibility (a11y)
*   **Keyboard Navigation**: Tab index sequence should move logically across links, date controls, buttons, and modals.
*   **Focus States**: Outlines on focused elements.
*   **Modals**: Focus must be trapped inside modals (Photo Tour, Amenities Modal, Lightbox) when active.
*   **Aria Roles**: `aria-expanded` for toggles, `aria-label` for icons, and descriptive alternative text (`alt`) for all listing images.

---

## 3. High-Scale Architecture Design
A production-scale implementation of a vacation-rental marketplace requires a distributed architecture:
```
Users ➔ DNS / CDN (Cloudflare/Fastly) ➔ Web Application Firewall (WAF)
  │
  ├─► Frontend (Next.js SSR deployed on Vercel/AWS Amplify)
  │
  └─► API Gateway (Kong/AWS APIGW)
        │
        ├─► User Auth Service (OAuth2 / JWT / Cognito)
        │
        ├─► Property Inventory Service ➔ Redis Cache ➔ Postgres Database (Read Replicas)
        │
        ├─► Booking & Pricing Engine ➔ Transactional DB (CockroachDB / Postgres)
        │
        ├─► Search & Discovery Service ➔ Elasticsearch / OpenSearch
        │
        ├─► Media Storage & CDN Service ➔ AWS S3 (Optimized with CloudFront)
        │
        └─► Review Service ➔ Document DB (MongoDB) / Postgres
```
*   **Frontend Scaling**: SSR (Server-Side Rendering) or ISR (Incremental Static Regeneration) for listings to optimize SEO and speed.
*   **Caching Strategy**: Redis clusters cache static inventory listings and available calendars to reduce DB hits.
*   **Database Partitioning**: Geographical partitioning for database clusters to locate user data closest to their booking region.

---

## 4. AI-Native Workflow Logs & Prompts
During implementation, we will document the exact prompts and instruction chains utilized by the coding agents. This provides clear traceability of the code generation path.
All prompts will be saved to `AI Prompts.md`.
