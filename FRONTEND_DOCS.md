# 🎓 Luminaris University — Frontend Documentation

> **Stack:** Pure HTML / CSS / JavaScript — no frameworks, no build tools
> **Theme:** Navy `#0b1628` + Gold `#c9a84c` + Cream `#faf6ee`
> **Fonts:** Cormorant Garamond (display) + DM Sans (body)

---

## 🗂️ Complete File Structure
```
luminaris-university/
│
├── index.html               ← Home
├── about.html               ← About
├── academics.html           ← Programs & Faculties
├── admissions.html          ← Apply
├── campus-life.html         ← Student Life
├── research.html            ← Research & Innovation
├── contact.html             ← Contact
│
├── css/
│   ├── global.css           ← Variables, reset, cursor, buttons, footer
│   ├── navbar.css           ← Sticky glass nav + mobile menu
│   ├── transitions.css      ← All animations & keyframes
│   └── pages/
│       ├── home.css
│       ├── about.css
│       ├── academics.css
│       ├── admissions.css
│       ├── campus-life.css
│       ├── research.css
│       └── contact.css
│
├── js/
│   ├── main.js              ← Shared: cursor, navbar, footer, transitions
│   ├── animations.js        ← Shared: scroll reveal, counters, parallax
│   └── pages/
│       ├── home.js          ← Home only
│       ├── academics.js     ← Academics only
│       └── contact.js       ← Contact only
│
└── assets/                  ← (your real images go here later)
```

---

## 🎨 Design System

### Color Palette

| Variable | Value | Usage |
|---|---|---|
| `--navy` | `#0b1628` | Primary dark, backgrounds |
| `--navy-mid` | `#122040` | Cards on dark sections |
| `--navy-light` | `#1a2f5e` | Navbar scrolled bg |
| `--gold` | `#c9a84c` | Accent, highlights, CTAs |
| `--gold-light` | `#e8c96e` | Hover states, shimmer |
| `--gold-pale` | `#f5e9c8` | Subtle gold tints |
| `--cream` | `#faf6ee` | Page background |
| `--cream-dark` | `#f0ead8` | Alternate sections |
| `--white` | `#ffffff` | Cards, forms |
| `--gray` | `#9a9a9a` | Muted text, meta |
| `--text-dark` | `#1a1a2e` | Body text |
| `--text-mid` | `#3a4060` | Secondary text |

### Typography

| Font | Role | Usage |
|---|---|---|
| `Cormorant Garamond` | Display | Headings, logo, numbers, quotes |
| `DM Sans` | Body | Paragraphs, nav, buttons, labels |

### Spacing & Layout

| Token | Value |
|---|---|
| `.section` | `padding: 120px 0` |
| `.section-sm` | `padding: 72px 0` |
| `.container` max-width | `1300px` |
| `.container` padding | `0 48px` |
| `.container-narrow` max-width | `860px` |

### Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 2px 12px rgba(11,22,40,0.08)` |
| `--shadow-md` | `0 8px 32px rgba(11,22,40,0.14)` |
| `--shadow-lg` | `0 24px 64px rgba(11,22,40,0.22)` |
| `--shadow-gold` | `0 8px 32px rgba(201,168,76,0.25)` |

### Border Radius

| Token | Value |
|---|---|
| `--radius-sm` | `6px` |
| `--radius-md` | `14px` |
| `--radius-lg` | `28px` |
| `--radius-xl` | `56px` |

---

## 📄 Page by Page Breakdown

### 1. `index.html` — Home

| Section | Description |
|---|---|
| Hero | Full-screen, parallax bg image, animated badge, h1, typing subtitle, dual CTAs, floating stats bar |
| Marquee | Gold ticker strip scrolling 6 keywords |
| About Strip | 2-col: image left + text right, overlay reveal animation |
| Programs Grid | 6 faculty cards on navy bg, hover top-border reveal |
| Campus Life Strip | Text left + asymmetric image grid right |
| News Grid | 3 article cards with 3D tilt hover |
| CTA Banner | Full-width image overlay, apply CTA |

**JS:** mouse parallax, typewriter cycling 3 lines, counter animations, 3D news card tilt

---

### 2. `about.html` — About

| Section | Description |
|---|---|
| Page Hero | 72vh, overlay, tag + h1 + subtitle |
| Mission / Vision / Values | 3 white cards, gold bottom border |
| Story | Navy bg, 2-col text + image, overlay reveal |
| Timeline | Alternating left/right, gold dots, 1892 → 2024 |
| Stats Band | 5 animated counters on navy |
| Leadership | 4 team cards, image top + text body |
| Gallery | 5-column full-width photo strip with zoom hover |

**JS:** scroll reveal, counter animations, overlay image reveal

---

### 3. `academics.html` — Academics

| Section | Description |
|---|---|
| Page Hero | Standard page hero |
| Search Bar | Text input + level dropdown filter |
| Faculties Grid | 8 cards (2-col), each with number, icon, tags, CTA |
| Why Luminaris | 6 feature items on navy with hover border glow |
| Faculty Profiles | 3 professor cards with image + bio |

**JS:** live search filter with opacity fade, level keyword matching, 3D tilt on faculty cards

---

### 4. `admissions.html` — Admissions

| Section | Description |
|---|---|
| Page Hero | Hero + dual CTA buttons |
| Deadlines Banner | 4 deadlines with open/closed badges |
| Steps | 5-step process with gold connector line |
| Requirements Tabs | 4 tabs: Undergraduate / Postgraduate / PhD / International |
| Scholarships | 4 cards, featured card in navy |
| Apply CTA | Split: text left + quick enquiry form right |

**JS:** tab switching, inline script for tab activation

---

### 5. `campus-life.html` — Campus Life

| Section | Description |
|---|---|
| Page Hero | Standard |
| Life Stats | 5 counters on navy |
| Clubs Grid | 4 category cards (image + text split, 2-col) |
| Events List | 4 events with date block, type tag, register CTA |
| Housing | 3 residence cards with pricing and feature tags |
| Testimonials | 3 student quote cards with author photo |

**JS:** scroll reveal, counter animations

---

### 6. `research.html` — Research

| Section | Description |
|---|---|
| Page Hero | Standard |
| Stats Band | 5 counters (£180M budget, 40 centres, 1200 publications...) |
| Research Areas | 4 cards (AI / Climate / Biomedical / Quantum) image+text split |
| Innovation Hub | Navy, 2-col text+image, 4 feature pills |
| Publications | 4 journal entries, list style with journal name in gold italic |
| Partners | 8 institution logo pills with hover gold effect |

**JS:** scroll reveal, counter animations, partner logo hover

---

### 7. `contact.html` — Contact

| Section | Description |
|---|---|
| Page Hero | Standard |
| Contact Cards | 4 department cards (email, phone, hours) |
| Main Contact | Split: full form left, map+address+socials right |
| FAQ | 5 accordion items with smooth max-height animation |

**JS:** FAQ accordion, form validation with shake on error, success state, float label focus effects

---

## 🧩 Shared Components

### Navbar
- **Files:** `css/navbar.css` + `js/main.js`
- Injected via `injectNavbar()` — **never manually added to HTML**
- `transparent` class on load → `scrolled` (glass dark) after 60px scroll
- Active link auto-detected from `window.location.pathname`
- Mobile: hamburger → full-screen overlay with large links
- "Apply Now" = gold bordered pill button

### Footer
- **File:** `js/main.js`
- Injected via `injectFooter()` — **never manually added to HTML**
- 4-column grid: Brand / Explore / Admissions / Contact
- Bottom bar: copyright left + social circles right

### Page Transition Overlay
- **File:** `js/main.js`
- Single navy `<div>` injected once via `initPageTransitions()`
- Intercepts all `<a>` clicks to internal pages
- `scaleY(0→1)` from bottom on exit → 600ms → navigate
- `scaleY(1→0)` from top on new page load
- Easing: `cubic-bezier(0.77, 0, 0.18, 1)`

### Custom Cursor
- **Files:** `css/global.css` + `js/main.js`
- Gold dot `10px` + gold ring `40px`
- Ring follows with `requestAnimationFrame` smooth lag (12% lerp)
- Grows on hover of `a`, `button`, `.hover-target`, `.hover-lift`, `.card-glow`
- Hidden on mobile via `display: none` under `768px`
- `body { cursor: none }` — cursor hidden globally

---

## ⚙️ JavaScript Architecture

### `js/main.js` — Runs on Every Page
```
initCursor()          → Gold dot + ring, lerp animation
injectNavbar()        → Dynamically builds & inserts full nav HTML
initNavbar()          → Scroll listener → toggles .scrolled class
initMobileMenu()      → Hamburger click → toggles mobile overlay
initPageTransitions() → Injects overlay, intercepts link clicks
injectFooter()        → Dynamically builds & inserts full footer HTML
```

### `js/animations.js` — Runs on Every Page
```
initScrollReveal()        → IntersectionObserver on .reveal / .reveal-left /
                            .reveal-right / .reveal-scale / .overlay-reveal
                            Auto-stagger siblings with data-delay
initCounters()            → Count-up animation on [data-count] elements
                            Ease-out cubic, 2200ms duration
initParallax()            → translateY on [data-parallax] on scroll
                            requestAnimationFrame throttled
initCursorHoverTargets()  → Grow cursor on a/button/inputs/cards
initProgressBars()        → Width animation on [data-progress]
initSmoothAnchorLinks()   → Smooth scroll to #id with 90px offset
initActiveNavLink()       → IntersectionObserver on section[id]
                            Highlights matching nav link
```

### `js/pages/home.js` — Home Only
```
initHeroMouseParallax()  → Mouse-move on .hero → translates bg image
                           Smooth lerp at 6% per frame
initHeroTyping()         → Cycles 3 subtitle lines with typewriter effect
                           65ms per char typing, 40ms deleting, 2800ms pause
initProgramCardStagger() → Sets data-delay on .program-card elements
initNewsCardHover()      → 3D perspective tilt on .news-card mousemove
                           Dynamic box-shadow shift
```

### `js/pages/academics.js` — Academics Only
```
initProgramSearch() → Input + select filter on .faculty-card elements
                      Opacity 0.25 + scale(0.97) on non-matching
                      Keyword map per level (undergraduate/postgraduate/phd)
initFacultyHover()  → 3D perspective tilt on .faculty-card mousemove
                      Resets on mouseleave
```

### `js/pages/contact.js` — Contact Only
```
initFAQ()             → Accordion: closes all, opens clicked
                        max-height: scrollHeight animation
initContactForm()     → Required field validation + red border
                        Shake animation on invalid submit
                        Success state: green button, resets after 4s
initFormFloatLabels() → .focused class on .form-group on input focus
```

---

## 🔗 Page Navigation Flow
```
index.html (Home)
├── About strip CTA          → about.html
├── Programs "View All"      → academics.html
├── Hero CTA "Apply Now"     → admissions.html
├── Campus strip CTA         → campus-life.html
├── CTA Banner "Book a Tour" → contact.html
└── Navbar                   → all pages

about.html
└── Navbar → all pages

academics.html
├── Faculty card CTAs        → admissions.html
└── Navbar → all pages

admissions.html
├── "Speak to an Advisor"    → contact.html
└── Navbar → all pages

campus-life.html / research.html
└── Navbar → all pages

contact.html
└── Navbar → all pages
```

---

## 🎞️ Animation Classes Reference

| Class | Effect |
|---|---|
| `.reveal` | Fade up from `translateY(48px)` |
| `.reveal-left` | Slide in from `translateX(-60px)` |
| `.reveal-right` | Slide in from `translateX(60px)` |
| `.reveal-scale` | Scale up from `scale(0.92)` |
| `.overlay-reveal` | Navy overlay slides off on visible |
| `.hover-lift` | `translateY(-8px)` + shadow on hover |
| `.img-zoom-wrapper` | Inner `img` scales to `1.06` on hover |
| `.card-glow` | Gold shadow + lift on hover |
| `.shimmer-text` | Animated gold gradient on text |
| `.animate-float` | Infinite vertical float `±16px` |
| `.animate-pulse-gold` | Pulsing gold box-shadow ring |
| `.animate-rotate` | Infinite slow rotation (20s) |
| `data-delay="300"` | Delays reveal by 300ms |
| `data-count="32000"` | Triggers count-up animation |
| `data-parallax="0.3"` | Sets parallax scroll speed |

---

## 📦 External Dependencies

| Resource | URL | Usage |
|---|---|---|
| Google Fonts | `fonts.googleapis.com` | Cormorant Garamond + DM Sans |
| Unsplash | `images.unsplash.com` | All placeholder images (replace later) |
| Google Maps | `maps.google.com/maps/embed` | Contact page iframe map |

> ⚠️ No npm packages. No bundler. No framework.
> Just open `index.html` in any browser. ✅

---

## 🔜 Next Step — Backend

**Stack:** Node.js + Express + MongoDB Atlas + JWT
**Folder:** `luminaris-backend/` (separate from this folder)
**Connects to frontend via:** REST API calls from JS form handlers

---

*Last updated: 2025 — Luminaris University Frontend v1.0*