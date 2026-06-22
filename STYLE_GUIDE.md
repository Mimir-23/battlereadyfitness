# Battle Ready Fitness — Brand & Style Guide

A redesign of the Battle Ready Fitness Bootcamp homepage. The visual system is a
**tactical/athletic** identity anchored on the logo's battle-yellow + black, with
an "alert red" accent for energy and intensity. The mood: intense, powerful, and
performance-driven — a boot camp, not a boutique.

Built with **React 19 + Vite**, **Tailwind CSS v4**, **Motion (Framer Motion)**,
and **React Icons** (`react-icons/fa6`).

---

## 1. Color Palette

Extracted from the logo (tactical yellow on black) and expanded into a full,
gym-focused system. Defined as Tailwind v4 `@theme` tokens in `src/index.css`.

### Brand

| Token            | Hex       | Use                                      |
| ---------------- | --------- | ---------------------------------------- |
| `battle`         | `#FFD200` | **Primary** — logo yellow, CTAs, accents |
| `battle-bright`  | `#FFE14D` | Hover / highlight on yellow              |
| `battle-deep`    | `#E0B800` | Pressed / shadow variant                 |
| `alert`          | `#E11D2A` | **Accent** — energy/danger red glows     |
| `alert-bright`   | `#FF3B48` | Accent highlight                         |

### Neutrals (dark base)

| Token    | Hex       | Use                              |
| -------- | --------- | -------------------------------- |
| `ink`    | `#0A0A0B` | Page background                  |
| `coal`   | `#121214` | Raised sections / surfaces       |
| `steel`  | `#1C1C20` | Card surface (featured)          |
| `iron`   | `#2A2A30` | Borders, dividers                |
| `smoke`  | `#8A8A93` | Muted / label text               |
| `fog`    | `#C7C7CF` | Secondary body text              |
| `chalk`  | `#F5F5F4` | Primary text on dark             |

**Contrast:** Body copy uses `fog` (#C7C7CF) and headings `chalk` (#F5F5F4) on
`ink`/`coal`, all exceeding WCAG AA 4.5:1. Yellow (`battle`) is only used on dark
or with `ink` text on top — never light-on-light.

**Signature pattern:** `.bg-hazard` — 45° yellow/black hazard stripes, used as
thin caution bands on the CTA section and "No esperes más" tile.

---

## 2. Typography

Three Google Fonts, each with a job:

| Role               | Font          | Weights      | Usage                                            |
| ------------------ | ------------- | ------------ | ------------------------------------------------ |
| **Display**        | `Bebas Neue`  | 400          | Huge impact headlines, hero, stats, section H2s  |
| **Headings / UI**  | `Oswald`      | 400–700      | Condensed sub-heads, nav, buttons, labels, tags  |
| **Body**           | `Inter`       | 400–700      | Paragraphs, descriptions, contact details        |

Bebas Neue (condensed, all-caps) carries the military/athletic punch; Oswald
gives a tactical, stenciled feel for UI; Inter keeps body copy clean and legible.

### Type scale

| Element        | Font       | Size (desktop)          | Weight | Treatment                       |
| -------------- | ---------- | ----------------------- | ------ | ------------------------------- |
| H1 (hero)      | Bebas Neue | `text-8xl` (~6rem)      | 400    | leading-[0.9], uppercase        |
| H2 (section)   | Bebas Neue | `text-6xl` (~3.75rem)   | 400    | leading-[0.95], uppercase       |
| H3 (card)      | Oswald     | `text-2xl` (1.5rem)     | 600    | uppercase, tracking-wide        |
| Kicker / label | Oswald     | `text-xs` (.75rem)      | 600    | uppercase, tracking-[0.3em]     |
| Body           | Inter      | `text-base`–`lg`        | 400    | leading-relaxed (≈1.6)          |
| CTA / button   | Oswald     | `text-xs`–`sm`          | 600–700| uppercase, tracking-widest      |

Body text is ≥16px on mobile; line length capped via `max-w-xl/2xl` containers.

---

## 3. Visual Identity

How the design communicates gym/fitness energy:

- **Dark, high-contrast canvas** (`ink`/`coal`) makes yellow pop like stadium
  lights — intensity by contrast.
- **Condensed all-caps display type** reads as athletic, urgent, commanding.
- **Hazard stripes & tactical accents** reference the "Battle Ready" military
  theme without being literal.
- **Yellow accent glows + grid texture** (`.bg-grid`) give a charged, gym-floor
  atmosphere.
- **Movement-based motion** (scan line, jump-rope loader, marquee) keeps the
  page feeling alive and kinetic.
- **Iconography:** consistent React Icons (`fa6`) at fixed sizes inside rounded
  yellow-tinted tiles that fill solid yellow on hover — a clear "power" cue.

---

## 4. Animation Behaviors

Powered by Motion. All respect `prefers-reduced-motion` (globally neutralized in
`index.css`).

| Animation             | Where                     | Behavior                                                                  |
| --------------------- | ------------------------- | ------------------------------------------------------------------------- |
| **Scroll progress**   | Top of page               | Yellow bar scales x with scroll (spring-smoothed `useScroll`)             |
| **Ken Burns**         | Hero & CTA bg images      | Slow 22s cinematic zoom/pan (`kenburns`), alternating                     |
| **Hero zoom-parallax**| Hero                      | Bg scales 1→1.18 and content drifts `y`/fades on scroll                   |
| **Parallax image**    | About (coach) image       | Image translates `y` opposite to scroll inside a clipped frame            |
| **Fade-up reveal**    | Every section             | `opacity 0→1`, `y 32→0`, `power` ease, once on scroll                     |
| **Stagger**           | All grids                 | Children cascade in at 90ms intervals                                     |
| **Scan line**         | Hero background           | Yellow line sweeps top→bottom (3.5s) — tactical scope feel                |
| **Jump-rope loader**  | Hero scroll cue           | 5 bars bounce in sequence — a loader that *feels* like a workout          |
| **Count-up stats**    | Stats bar                 | Numbers animate 0→value over 1.4s in view                                 |
| **Dual marquee**      | Two ticker bands          | Yellow band scrolls left; dark outlined band scrolls right               |
| **Image card reveal** | Program cards             | Spring lift, image zoom + grayscale→color, description slides open        |
| **Gallery hover**     | Battleground gallery      | Image zoom + grayscale→color, caption slides up with accent rule          |
| **Button sheen**      | Primary CTAs              | Light sweep on hover; `active:scale` press feedback                       |
| **Pulse ring**        | Final "Claim Yours" CTA   | Expanding yellow ring draws the eye to the key conversion action          |
| **WhatsApp FAB**      | Floating bottom-right     | `animate-ping` halo, label expands on hover; back-to-top appears >600px   |
| **Mobile menu**       | Navbar (mobile)           | Height/opacity expand-collapse via `AnimatePresence`                      |

**Timing:** micro-interactions 150–300ms; reveals ~600ms; all transform/opacity
based for GPU performance. Easing standard: `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 5. Imagery & Sections

**Imagery** lives in `public/images/` (9 optimized Unsplash gym photos, self-hosted
for speed/reliability). All photos default to **grayscale** and bloom to full color
on hover/in context — a consistent, high-impact "switch on" effect that keeps the
dark+yellow palette dominant. Dark gradient overlays guarantee text contrast.

**Page structure (with editorial section numbers):**
Scroll progress → Navbar → **Hero** (full-bleed image, Ken Burns) → Marquee →
Stats → **01 Programs** (image cards) → **02 Why Battle Ready** (parallax coach
image + features) → **03 The Battleground** (gallery) → reverse Marquee →
**Testimonial** (image overlay) → **Membership CTA** (image band) →
**04 Contact** (cards + Google Map embed) → **Footer** (4-column: brand/social,
programs, explore + hours, contact) + legal bar → Floating WhatsApp + back-to-top.

**WhatsApp** is wired everywhere (navbar, hero, CTA band, contact card, footer,
floating button) to `wa.me/17862345399` with a prefilled Spanish message.

## 6. Content Source

All copy is reused from the live site (battlereadyfitness.com):

- Tagline "we're not just the best, we're just simply unique"
- 7 programs (Personal Training, Bootcamp, Step Circuit, Kickboxing, Full Body,
  Zumba, HIIT by Javi) with original descriptions
- CTAs: "3 Day Free Pass", "Reserva Ahora", "No esperes más", "Are you ready?",
  "Claim Yours Now"
- Ana Machado's Google testimonial (verbatim)
- Contact: address, phone, mobile, email, social links
- Footer copyright

---

## 7. Files

| File                | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `src/index.css`     | Tailwind v4 `@theme` tokens, fonts, keyframes, utilities |
| `src/App.jsx`       | Full homepage — all sections, motion, icons              |
| `vite.config.js`    | Adds `@tailwindcss/vite` plugin                          |

Run: `npm run dev` (dev) · `npm run build` (production).
