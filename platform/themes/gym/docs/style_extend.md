# Gyms — Style Reference (Extended Tokens)
> Carbon black with a volt-lime pulse.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Gyms is a dark-anchored fitness brand system: deep carbon-black canvases host towering condensed uppercase headlines, punctuated by a single high-voltage volt-lime accent and a warm ember-orange heat signal. A signature lime-to-ember energy gradient runs through the hero like a pulse, giving the otherwise raw, industrial UI one moment of kinetic heat. Cards are generously rounded (28px), buttons are fully pill-shaped, and Bebas Neue at massive sizes (72–128px) gives headlines a stacked, athletic poster weight, while Inter keeps body copy calm and legible. The visual rhythm alternates dark → volt → chalk, never plain white-on-white — every surface is a deliberate intensity level.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Black | `#0A0A0B` | `--color-carbon-black` | Hero canvas, nav bar, dark backgrounds, primary text on light surfaces |
| Graphite | `#141417` | `--color-graphite` | Dark card fills, elevated panels, footer |
| Steel | `#24242A` | `--color-steel` | Hairline borders, dividers, input outlines on dark |
| Chalk | `#F2F2EC` | `--color-chalk` | Light section canvas between dark blocks |
| Pure White | `#FFFFFF` | `--color-pure-white` | Card surfaces on Chalk, headline text on dark |
| Ash Grey | `#8A8A93` | `--color-ash-grey` | Secondary text, captions, muted icons |
| Iron | `#2B2B30` | `--color-iron` | Body text on light surfaces |
| Volt Lime | `#C6FF00` | `--color-volt-lime` | Primary CTA, active states, stat numbers, focus rings — the single chromatic switch |
| Ember Orange | `#FF5A1F` | `--color-ember-orange` | Heat accent — badges, progress, gradient endpoint |
| Volt Wash | `#EEFFB8` | `--color-volt-wash` | Chip/tag backgrounds and highlight washes on Chalk |
| Energy Gradient | `linear-gradient(270deg, #C6FF00 35%, #FF5A1F)` | `--gradient-energy` | Hero pulse, accent strokes, stat underlines |

## Tokens — Typography

### Bebas Neue — Display face for headlines, stat numbers, section titles. Uppercase-only, condensed, 400 weight, tight line-height for stacked poster headlines. · `--font-display`
- **Substitute:** Anton (Google), Oswald 700
- **Weights:** 400
- **Sizes:** 44px, 56px, 72px, 96px, 128px
- **Line height:** 0.85–0.95
- **Letter spacing:** +0.01em (display), +0.02em (≤56px)
- **Text transform:** uppercase
- **Role:** All headlines and big numbers. Never for body copy, never lowercase, never below 36px.

### Inter — Text face for body, UI, buttons, nav, forms. · `--font-body`
- **Substitute:** Inter (Google)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px
- **Line height:** 1.5 body, 1.3 subheading
- **Letter spacing:** -0.01em body, +0.14em eyebrow
- **OpenType features:** `"ss01" on, "cv11" on, "tnum" on`
- **Role:** Calm, legible counterweight to the loud display face.

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| eyebrow | Inter | 600 | 12px | 1.4 | 1.7px | `--text-eyebrow` |
| caption | Inter | 400 | 14px | 1.5 | -0.1px | `--text-caption` |
| body | Inter | 400 | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | Inter | 400 | 18px | 1.5 | -0.18px | `--text-body-lg` |
| subheading | Inter | 600 | 24px | 1.3 | -0.36px | `--text-subheading` |
| heading-sm | Bebas Neue | 400 | 44px | 0.95 | 0.9px | `--text-heading-sm` |
| heading | Bebas Neue | 400 | 72px | 0.92 | 0.7px | `--text-heading` |
| heading-lg | Bebas Neue | 400 | 96px | 0.9 | 1px | `--text-heading-lg` |
| display | Bebas Neue | 400 | 128px | 0.85 | 1.3px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 28px |
| small | 16px |
| inputs | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| card | `rgba(10, 10, 11, 0.08) 0px 20px 40px 0px` | `--shadow-card` |
| glow-volt | `0 0 32px rgba(198, 255, 0, 0.45)` | `--shadow-glow-volt` |
| glow-ember | `0 0 24px rgba(255, 90, 31, 0.4)` | `--shadow-glow-ember` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 96px
- **Card padding:** 28px
- **Element gap:** 16px

## Components

### Hero Headline
**Role:** Oversized display headline on dark canvas

Bebas Neue 400 at 96–128px, uppercase, #FFFFFF, line-height 0.85–0.9, letter-spacing +0.01em. One key word may be #C6FF00. Left-aligned over the interactive energy background.

### Join Now Button (Primary)
**Role:** Primary CTA on dark hero

Pill (9999px), background #C6FF00, text #0A0A0B, padding 16px 28px, Inter 700 16px uppercase, +0.04em. Hover: Energy Gradient fill, translateY(-2px), `--shadow-glow-volt`.

### Free Trial Button (Ghost)
**Role:** Secondary CTA

Pill, transparent, 1.5px border rgba(255,255,255,0.4), text #FFFFFF, padding 16px 28px, Inter 600 16px. Hover: border + text #C6FF00.

### Trainer / Program Card
**Role:** Coach or program card on Chalk canvas

#FFFFFF, radius 28px, padding 28px. Photo top (radius 20px), name Bebas Neue 36px #0A0A0B, eyebrow Inter 600 12px uppercase #8A8A93, body Inter 400 14px #2B2B30. Optional `--shadow-card`.

### Dark Feature Card
**Role:** Feature / class card on Carbon canvas

#141417, 1px border #24242A, radius 28px, padding 28px. Volt icon, title Inter 600 24px #FFFFFF, body Inter 400 16px #8A8A93. Hover: border rgba(198,255,0,0.5).

### Stat Counter
**Role:** Big animated numbers

Bebas Neue 96–128px #C6FF00, label Inter 600 12px uppercase +0.14em #8A8A93, 2px Energy Gradient underline.

### Volt Accent Section Block
**Role:** Full-bleed chromatic section

#C6FF00 background, #0A0A0B Bebas Neue 72–96px, 96–120px vertical padding. One per page max.

### Pricing Card
**Role:** Membership plan

#141417, radius 28px, padding 32px. Price Bebas Neue 72px #FFFFFF. Featured: 2px #C6FF00 border + Ember "POPULAR" pill badge.

### Navigation Bar
**Role:** Top-level site navigation

rgba(10,10,11,0.8) + `backdrop-filter: blur(12px)`, height 72px, logo left, links center Inter 600 14px #FFFFFF, Volt pill CTA right. Active link: 2px Volt underline.

### Partner Logo Strip
**Role:** Equipment / partner logos

Monochrome white logos at 0.6 opacity, 40–56px height, gap 32px, on Carbon. Hover opacity 1.

### Floating Chat Widget
**Role:** Help / booking bubble

56px circle, #C6FF00 bg, #0A0A0B icon, fixed bottom-right, `--shadow-glow-volt`.

### Carousel Arrow Button
**Role:** Carousel navigation

48px circle, #0A0A0B (on Chalk) or #FFFFFF (on Carbon). Hover: #C6FF00 bg, #0A0A0B icon.

## Do's and Don'ts

### Do
- Use Bebas Neue uppercase for every headline and stat number
- Use Inter for all body, UI labels, buttons and forms
- Anchor every section to #0A0A0B Carbon, #F2F2EC Chalk, or #C6FF00 Volt
- Apply 28px radius to cards and 9999px to buttons and tags
- Keep Volt Lime the single primary accent; Ember only for heat signals
- Place lime text only on dark surfaces
- Use tabular numbers for prices, schedules, timers

### Don't
- Don't set Bebas Neue lowercase or below 36px
- Don't put #C6FF00 text on Chalk/white — use Carbon text on a lime fill
- Don't use #FFFFFF as a full-bleed canvas — use Chalk
- Don't use Ember Orange as a large surface fill
- Don't add a third typeface
- Don't use heavy shadows on light cards
- Don't mix more than two surface intensities per viewport

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Carbon Canvas | `#0A0A0B` | Page-level dark background for hero and nav |
| 1 | Graphite Panel | `#141417` | Dark cards and elevated panels |
| 2 | Chalk Field | `#F2F2EC` | Light section canvas |
| 3 | Pure Card | `#FFFFFF` | Card interiors on Chalk |
| 4 | Volt Wash | `#EEFFB8` | Chips, tags, highlight zones |
| 5 | Volt Lime | `#C6FF00` | Vivid accent section and CTA fills |

## Elevation

- **Card (light):** `rgba(10, 10, 11, 0.08) 0px 20px 40px 0px`
- **Volt glow:** `0 0 32px rgba(198, 255, 0, 0.45)`
- **Ember glow:** `0 0 24px rgba(255, 90, 31, 0.4)`

## Imagery

Photography-led and high-contrast: athletes mid-movement, chalk dust, steel equipment — graded dark with crushed blacks and slightly desaturated tones so Volt Lime pops. Photos in 20–28px rounded frames or full-bleed via scroll expansion. Icons line-style, 1.75px stroke, mono-color. The Energy Gradient is the only decorative graphic.

## Layout

Full-bleed dark hero with left-aligned stacked headline over an interactive energy background, then: Stats (dark) → Full-screen image expansion → Programs on Chalk → Volt promo → Trainers carousel → Pricing (dark). Blurred translucent nav (72px). Content within 1280px; dark and volt sections full-bleed. Section gaps 96–120px.

## Agent Prompt Guide

**Quick Color Reference**
- text (on light): #0A0A0B (Carbon Black)
- text (on dark): #FFFFFF / secondary #8A8A93
- background (dark): #0A0A0B (Carbon Black)
- background (light): #F2F2EC (Chalk)
- surface/card: #FFFFFF (light) / #141417 (dark)
- border: #24242A on dark, rgba(10,10,11,0.08) on light
- accent: #C6FF00 (Volt Lime), heat: #FF5A1F (Ember Orange)
- primary action: #C6FF00 fill, #0A0A0B text

**Example Component Prompts**

1. *Primary Action Button*: #C6FF00 background, #0A0A0B text, Inter 700 16px uppercase, 9999px radius, 16px 28px padding, hover glow 0 0 32px rgba(198,255,0,.45).

2. *Volt accent section*: Full-bleed #C6FF00. Headline Bebas Neue 96px #0A0A0B, line-height 0.9. Body Inter 400 18px #0A0A0B at 0.75 opacity. 120px vertical padding. Carbon pill CTA (#0A0A0B bg, #C6FF00 text).

3. *Trainer card on Chalk*: Background #F2F2EC. Card #FFFFFF, 28px radius, 28px padding, shadow rgba(10,10,11,.08) 0 20px 40px. Photo 20px radius. Name Bebas Neue 36px #0A0A0B. Eyebrow Inter 600 12px uppercase #8A8A93.

4. *Navigation bar*: rgba(10,10,11,.8) + blur(12px), 72px, full-width. Logo left in Bebas Neue 28px #FFFFFF with Volt dot. Center links Inter 600 14px #FFFFFF, 32px gaps. Right: Volt pill "JOIN NOW".

5. *Stats row*: On #0A0A0B, 4 columns. Numbers Bebas Neue 128px #C6FF00 with count-up on scroll. Labels Inter 600 12px uppercase +0.14em #8A8A93.

## Similar Brands

- **Nike Training Club** — Condensed uppercase display type, high-contrast athletic photography
- **Gymshark** — Dark canvas, bold sans headlines, single vivid accent
- **Whoop** — Carbon-black UI with a single neon data accent
- **Equinox** — Premium dark fitness aesthetic with generous spacing

## Quick Start

### Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-black: #0A0A0B;
  --color-graphite: #141417;
  --color-steel: #24242A;
  --color-chalk: #F2F2EC;
  --color-pure-white: #FFFFFF;
  --color-ash-grey: #8A8A93;
  --color-iron: #2B2B30;
  --color-volt-lime: #C6FF00;
  --color-ember-orange: #FF5A1F;
  --color-volt-wash: #EEFFB8;
  --gradient-energy: linear-gradient(270deg, #C6FF00 35%, #FF5A1F);

  /* Typography — Font Families */
  --font-display: 'Bebas Neue', 'Anton', 'Oswald', Impact, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1.7px;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 44px;
  --leading-heading-sm: 0.95;
  --tracking-heading-sm: 0.9px;
  --text-heading: 72px;
  --leading-heading: 0.92;
  --tracking-heading: 0.7px;
  --text-heading-lg: 96px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: 1px;
  --text-display: 128px;
  --leading-display: 0.85;
  --tracking-display: 1.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 96px;
  --card-padding: 28px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 28px;
  --radius-small: 16px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-card: rgba(10, 10, 11, 0.08) 0px 20px 40px 0px;
  --shadow-glow-volt: 0 0 32px rgba(198, 255, 0, 0.45);
  --shadow-glow-ember: 0 0 24px rgba(255, 90, 31, 0.4);

  /* Surfaces */
  --surface-carbon-canvas: #0A0A0B;
  --surface-graphite-panel: #141417;
  --surface-chalk-field: #F2F2EC;
  --surface-pure-card: #FFFFFF;
  --surface-volt-wash: #EEFFB8;
  --surface-volt-lime: #C6FF00;
}

body {
  font-family: var(--font-body);
  font-feature-settings: "ss01" on, "cv11" on;
  background: var(--color-carbon-black);
  color: var(--color-pure-white);
}

h1, h2, h3, .display {
  font-family: var(--font-display);
  font-weight: 400;
  text-transform: uppercase;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-black: #0A0A0B;
  --color-graphite: #141417;
  --color-steel: #24242A;
  --color-chalk: #F2F2EC;
  --color-pure-white: #FFFFFF;
  --color-ash-grey: #8A8A93;
  --color-iron: #2B2B30;
  --color-volt-lime: #C6FF00;
  --color-ember-orange: #FF5A1F;
  --color-volt-wash: #EEFFB8;

  /* Typography */
  --font-display: 'Bebas Neue', 'Anton', 'Oswald', Impact, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 12px;
  --text-caption: 14px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-subheading: 24px;
  --text-heading-sm: 44px;
  --text-heading: 72px;
  --text-heading-lg: 96px;
  --text-display: 128px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-small: 16px;
  --radius-cards: 28px;
  --radius-inputs: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: rgba(10, 10, 11, 0.08) 0px 20px 40px 0px;
  --shadow-glow-volt: 0 0 32px rgba(198, 255, 0, 0.45);
  --shadow-glow-ember: 0 0 24px rgba(255, 90, 31, 0.4);
}
```
