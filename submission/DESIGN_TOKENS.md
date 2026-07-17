# Airbnb Clone Design Tokens & UI/UX Observations

This document details the design tokens, layout dimensions, and interaction behaviors
observed on the Airbnb Clone reference website (`airbnb-clone-umber-two.vercel.app`).

---

## 1. Typography

### Font Family
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- Loaded via Google Fonts: `Inter` at weights 300, 400, 500, 600, 700

### Font Scale
| Element                  | Size   | Weight | Line-Height |
|--------------------------|--------|--------|-------------|
| Page Title (h1)          | 26px   | 600    | 1.3         |
| Section Headings (h2)    | 22px   | 600    | 1.3         |
| Body / Description       | 16px   | 400    | 24px        |
| Sub-heading / Meta       | 14px   | 500    | 20px        |
| Small / Captions         | 12px   | 400    | 16px        |
| Price Text               | 22px   | 700    | 1.3         |
| Booking Labels           | 9px    | 800    | 1.2 (uppercase) |

### Letter Spacing
- Uppercase booking labels (`CHECK-IN`, `CHECKOUT`, `GUESTS`): `0.5px`
- Navbar logo: `-0.5px`

---

## 2. Colors

### Core Palette
| Token              | Value      | Usage                                    |
|--------------------|------------|------------------------------------------|
| Brand              | `#FF385C`  | Logo, star rating, Reserve button, CTA   |
| Brand Hover        | `#E61E4D`  | Reserve button hover / gradient end      |
| Text Primary       | `#222222`  | Headings, body text, icons               |
| Text Secondary     | `#717171`  | Subtitles, metadata, muted labels        |
| Border / Divider   | `#DDDDDD`  | Card borders, booking form               |
| Border Light       | `#EBEBEB`  | Section dividers, dropdown separators    |
| Background Page    | `#FFFFFF`  | Main page background                     |
| Background Light   | `#F7F7F7`  | Hover states, footer background          |
| Background Dark    | `#000000`  | Lightbox overlay                         |

### Button States
| Button         | Default                        | Hover                | Active                |
|----------------|--------------------------------|----------------------|-----------------------|
| Reserve        | `linear-gradient(to right, #E61E4D 0%, #FF385C 100%)` | brightness(0.92) | `scale(0.98)` |
| Ghost (outline)| `border: 1px solid #222`       | `bg: #F7F7F7`       | —                     |
| Action (Share) | Transparent, underlined text   | `bg: #F7F7F7`       | —                     |

### Focus Ring
- Color: `#005A9C`
- Offset: `2px`
- Width: `3px`

---

## 3. Spacing & Layout

| Token                       | Value    |
|-----------------------------|----------|
| Container max-width         | `1120px` |
| Container side padding      | `24px`   |
| Navbar height               | `80px`   |
| Hero grid gap               | `8px`    |
| Hero grid height            | `450px`  |
| Section divider margin      | `32px 0` |
| Columns gap (left ↔ right)  | `64px`   |
| Right column (booking card) | `370px`  |
| Booking card sticky top     | `112px`  |

---

## 4. Shape & Depth

### Border Radius
| Element              | Radius  |
|----------------------|---------|
| Hero grid            | `12px`  |
| Booking card         | `12px`  |
| Buttons (primary)    | `8px`   |
| Search widget        | `40px`  |
| User profile menu    | `24px`  |
| Avatar circles       | `50%`   |
| Modal / cards        | `12px`  |
| Photo tour card      | `4px`   |
| Sleeping card        | `12px`  |

### Box Shadows
| Surface        | Value                                          |
|----------------|------------------------------------------------|
| Small          | `0 1px 2px rgba(0,0,0,0.08)`                  |
| Medium         | `0 6px 16px rgba(0,0,0,0.12)`                 |
| Large          | `0 12px 24px rgba(0,0,0,0.15)`                |
| Search hover   | `0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)` |

---

## 5. Icons

- **Icon set**: `lucide-react` (outline style)
- **Stroke width**: Default (2px)
- **Nav icons**: `18px`
- **Inline icons**: `16px`
- **Section icons**: `24px`
- **Lightbox nav arrows**: `28px`

---

## 6. Motion & Transitions

### Global Transition
- `all 0.25s cubic-bezier(0.2, 0, 0, 1)` — used site-wide

### Hover Effects
| Element              | Effect                           | Duration |
|----------------------|----------------------------------|----------|
| Hero images          | `scale(1.03)`, `brightness(0.92)` | `0.45s` cubic-bezier |
| Show all photos btn  | `scale(1.02)`                    | `0.25s`  |
| Reserve button       | `scale(0.98)` on `:active`       | `0.1s`   |
| Lightbox nav arrows  | `scale(1.05)` hover, `scale(0.95)` active | `0.25s` |
| Action buttons       | `bg: #F7F7F7`                    | `0.25s`  |

### Overlays
| Overlay      | Animation                         | Duration |
|--------------|------------------------------------|----------|
| Modal bg     | `fadeIn` (0→1 opacity)             | `0.2s`   |
| Modal card   | `slideUp` (40px→0 + fade)          | `0.3s`   |
| Photo Tour   | `slideUpFull` (100%→0)             | `0.35s`  |
| Lightbox     | `fadeIn`                           | `0.25s`  |
| Lightbox img | `zoomIn` (scale 0.95→1 + fade)     | `0.3s`   |
| Image fade   | opacity + scale transition         | `0.15s`  |

### Scroll Behavior
- Booking card: `position: sticky; top: 112px` — always sticky once rendered
- Navbar: `position: sticky; top: 0` — always at the top with border-bottom

---

## 7. Content Reference

### Property
- **Title**: "Kyo-Machi-Ya: Restored Luxury Historic House with Private Garden"
- **Rating**: 4.92
- **Reviews**: 148
- **Location**: Higashiyama Ward, Kyoto, Japan

### Host
- **Name**: Kenji & Yuki
- **Years hosting**: 8
- **Superhost**: Yes

### Property Details
- 6 guests · 3 bedrooms · 4 beds · 2.5 baths

### Price
- $320 / night
- Cleaning fee: $60
- Service fee: 12% of base

---

## 8. Interaction Behaviors

### Photo Tour
- **Trigger**: Click "Show all photos" or any hero image
- **Layout**: Full-screen overlay, scrollable vertical list of all 15 images with captions
- **Header**: Back arrow button (left), Share button (right)
- **Close**: Back button click or Escape key
- **Body scroll**: Locked while open

### Lightbox
- **Trigger**: Click any photo in the Photo Tour
- **Layout**: Full-screen dark overlay, single large centered image
- **Navigation**: Left/Right arrow buttons, loops from end to start
- **Counter**: Shows "X / 15" format
- **Keyboard**: ArrowLeft/ArrowRight navigate, Escape closes
- **Close behavior**: Closes lightbox only (returns to Photo Tour)
- **Animation**: Fade + slight scale transition between images (150ms)

### Amenities Modal
- **Trigger**: "Show all X amenities" button
- **Layout**: Centered modal with category-grouped amenity list
- **Close**: X button, backdrop click, or Escape key
