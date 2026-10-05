# Gyms — Style Reference
> Carbon black with a volt-lime pulse.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Gyms is a dark-anchored fitness brand system: deep carbon-black canvases host towering condensed uppercase headlines, punctuated by a single high-voltage volt-lime accent and a warm ember-orange heat signal. A signature lime-to-ember energy gradient runs through the hero like a pulse, giving the otherwise raw, industrial UI one moment of kinetic heat. Cards are generously rounded (28px), buttons are fully pill-shaped, and Bebas Neue at massive sizes (72–128px) gives headlines a stacked, athletic poster weight, while Inter keeps body copy calm and legible. The visual rhythm alternates dark → volt → chalk, never plain white-on-white — every surface is a deliberate intensity level.

## Colors

| Name | Value | Role |
|------|-------|------|
| Carbon Black | `#0A0A0B` | Hero canvas, nav bar, page-level dark backgrounds, primary text on light surfaces — the structural anchor of the entire system |
| Graphite | `#141417` | Dark card fills, elevated panels on Carbon canvas, footer |
| Steel | `#24242A` | Hairline borders, dividers, input outlines on dark surfaces |
| Chalk | `#F2F2EC` | Light section canvas — warm off-white "gym chalk" breathing room between dark blocks |
| Pure White | `#FFFFFF` | Card surfaces on Chalk, headline text on dark |
| Ash Grey | `#8A8A93` | Secondary text, helper copy, captions, muted icons |
| Iron | `#2B2B30` | Body text on light surfaces where Carbon Black is too heavy |
| Volt Lime | `#C6FF00` | Primary action buttons, active nav indicators, stat numbers, focus rings, brand accent — the single chromatic moment that switches the UI on |
| Ember Orange | `#FF5A1F` | Secondary heat accent — badges ("HOT", "NEW"), progress, gradient endpoint, hover heat |
| Volt Wash | `#EEFFB8` | Soft lime tint for chips/tags and highlight washes on Chalk surfaces |
| Energy Gradient | `linear-gradient(270deg, #C6FF00 35%, #FF5A1F)` | Hero pulse graphic, accent strokes, stat underlines — the only decorative gradient in the system |

## Typography

### Oswald — Display face. Uppercase condensed sans with full Vietnamese diacritic support used for all headlines, stat numbers and big section titles. Set at 700 with slight positive tracking (+0.02em) and tight line-height (0.92–0.95) for an athletic, uniform voice.
- **Weights:** 600, 700
- **Sizes:** 44px, 56px, 72px, 96px, 120px
- **Line height:** 0.88–0.95
- **Letter spacing:** +0.02em
- **Text transform:** uppercase

### Inter — Text face. Body, UI labels, buttons, nav, forms. Body at 400/16px, labels/buttons at 600/14–16px, eyebrows at 600/12px uppercase with +0.14em tracking.
- **Substitute:** Inter (Google)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px
- **Line height:** 1.5 body, 1.3 subheading
- **Letter spacing:** -0.01em body, +0.14em eyebrow
- **OpenType features:** `"ss01" on, "cv11" on, "tnum" on` (tabular numbers for schedules/prices)

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| eyebrow | Inter | 600 | 12px | 1.4 | 1.7px (uppercase) |
| caption | Inter | 400 | 14px | 1.5 | -0.1px |
| body | Inter | 400 | 16px | 1.5 | -0.16px |
| body-lg | Inter | 400 | 18px | 1.5 | -0.18px |
| subheading | Inter | 600 | 24px | 1.3 | -0.36px |
| heading-sm | Bebas Neue | 400 | 44px | 0.95 | 0.9px |
| heading | Bebas Neue | 400 | 72px | 0.92 | 0.7px |
| heading-lg | Bebas Neue | 400 | 96px | 0.9 | 1px |
| display | Bebas Neue | 400 | 128px | 0.85 | 1.3px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1280px
- **Section gap:** 96px
- **Card padding:** 28px
- **Element gap:** 16px

### Border Radius

- **tags:** 9999px
- **cards:** 28px
- **small:** 16px
- **inputs:** 12px
- **buttons:** 9999px

## Components

### Hero Headline
**Role:** Oversized display headline on dark canvas

Bebas Neue 400 at 96–128px, uppercase, color #FFFFFF, line-height 0.85–0.9, letter-spacing +0.01em. One key word may be colored #C6FF00 Volt Lime. Sits left-aligned over the interactive energy background. Extreme size + condensed stacking is the system's signature.

### Join Now Button (Primary)
**Role:** Primary CTA on dark hero

Pill shape (9999px radius), background #C6FF00, text #0A0A0B, padding 16px 28px, Inter 700 16px uppercase, letter-spacing +0.04em. On hover: background shifts toward Ember via the Energy Gradient, translateY(-2px), glow `0 0 32px rgba(198,255,0,0.45)`.

### Free Trial Button (Ghost)
**Role:** Secondary CTA

Pill shape, transparent background, 1.5px border #FFFFFF at 0.4 opacity, text #FFFFFF, padding 16px 28px, Inter 600 16px. Hover: border #C6FF00, text #C6FF00.

### Trainer / Program Card
**Role:** Coach or program card on Chalk canvas

Background #FFFFFF, border-radius 28px, padding 28px, no visible border. Photo top (radius 20px), name in Bebas Neue 36px #0A0A0B, role/eyebrow in Inter 600 12px uppercase #8A8A93, body in Inter 400 14px #2B2B30. Shadow optional `rgba(10,10,11,0.08) 0 20px 40px`.

### Dark Feature Card
**Role:** Feature / class card on Carbon canvas

Background #141417, 1px border #24242A, radius 28px, padding 28px. Icon in Volt Lime, title Inter 600 24px #FFFFFF, body Inter 400 16px #8A8A93. Hover: border #C6FF00 at 0.5 opacity.

### Stat Counter
**Role:** Big numbers (members, trainers, classes, years)

Number in Bebas Neue 96–128px #C6FF00 with tabular alignment, label below in Inter 600 12px uppercase +0.14em #8A8A93. 2px Energy Gradient underline under each number.

### Volt Accent Section Block
**Role:** Full-bleed chromatic content section

Background #C6FF00, text #0A0A0B in Bebas Neue 72–96px, padding 96–120px vertical. Used sparingly — one per page max — as a visual exclamation point (e.g. membership promo).

### Pricing Card
**Role:** Membership plan

Dark: #141417 bg, radius 28px, 32px padding. Price in Bebas Neue 72px #FFFFFF, period in Inter 400 14px #8A8A93. Featured plan: 2px #C6FF00 border + "POPULAR" Ember badge (pill, #FF5A1F bg, #0A0A0B text, Inter 700 11px uppercase).

### Navigation Bar
**Role:** Top-level site navigation

Background #0A0A0B at 0.8 opacity with `backdrop-filter: blur(12px)`, height ~72px, logo left, links center in Inter 600 14px #FFFFFF (Programs, Trainers, Schedule, Pricing), CTA right (Volt pill). Active link: 2px Volt underline.

### Partner / Brand Logo Strip
**Role:** Equipment / partner logo row

Monochrome white logos at 0.6 opacity, 40–56px height, column-gap 32px, centered on Carbon canvas. Hover: opacity 1.

### Floating Chat Widget
**Role:** Persistent help/booking bubble

Circular button 56px, background #C6FF00 with #0A0A0B chat icon, fixed bottom-right, soft volt glow.

### Carousel Arrow Button
**Role:** Testimonial / trainer carousel navigation

Circular 48px, background #0A0A0B (on Chalk) or #FFFFFF (on Carbon), contrasting arrow icon. Hover: background #C6FF00, icon #0A0A0B.

## Do's and Don'ts

### Do
- Use Bebas Neue uppercase for every headline and stat number — the condensed poster voice is the system's typographic signature
- Use Inter for all body, UI labels, buttons and forms — never Bebas for paragraphs
- Anchor every section to #0A0A0B Carbon Black, #F2F2EC Chalk, or #C6FF00 Volt Lime
- Apply 28px radius to cards and 9999px to buttons and tags
- Keep Volt Lime as the single primary accent; Ember Orange is only for heat signals (badges, gradient end, progress)
- Ensure lime text is only placed on dark surfaces (contrast ≥ 12:1 on #0A0A0B)
- Use tabular numbers (`tnum`) for prices, schedules and timers

### Don't
- Don't set Bebas Neue in lowercase or below 36px — it loses legibility
- Don't put #C6FF00 text on Chalk or white — use #0A0A0B text on a lime fill instead
- Don't use #FFFFFF as a full-bleed page canvas — use Chalk #F2F2EC
- Don't use Ember Orange as a large background fill — it's a heat accent, not a surface
- Don't add a third typeface
- Don't use heavy drop shadows on light cards — at most `rgba(10,10,11,0.08) 0 20px 40px`
- Don't mix more than two surface intensities per viewport (dark + volt, or chalk + volt)

## Elevation

- **Card (light):** `rgba(10, 10, 11, 0.08) 0px 20px 40px 0px`
- **Volt glow (CTA / featured):** `0 0 32px rgba(198, 255, 0, 0.45)`
- **Ember glow (hot badge):** `0 0 24px rgba(255, 90, 31, 0.4)`

## Surfaces

- **Carbon Canvas** (`#0A0A0B`) — Page-level dark background for hero and nav
- **Graphite Panel** (`#141417`) — Dark cards and elevated panels
- **Chalk Field** (`#F2F2EC`) — Light section canvas between dark blocks
- **Pure Card** (`#FFFFFF`) — Card interiors on Chalk
- **Volt Wash** (`#EEFFB8`) — Chips, tags, highlight zones on Chalk
- **Volt Lime** (`#C6FF00`) — One vivid full-bleed accent section and CTA fills

## Imagery

Photography-led and high-contrast: athletes mid-movement, sweat, chalk dust, steel equipment — graded dark with crushed blacks and slightly desaturated tones so the Volt Lime accent pops. Photos sit in 20–28px rounded frames or go full-bleed via the scroll-expansion pattern. Icons are line-style, 1.75px stroke, mono-color (white on dark, Carbon on light, Volt for active). The Energy Gradient is the only decorative graphic.

## Layout

Full-bleed dark hero with left-aligned stacked headline over an interactive energy background, followed by alternating full-width bands: Stats (dark) → Full-screen image expansion → Programs on Chalk → Volt promo block → Trainers carousel → Pricing (dark). Navigation is a blurred translucent dark bar (72px). Content is centered within 1280px max-width; dark and volt sections are full-bleed. Section gaps 96–120px. No section repeats a background color consecutively.

## Similar Brands

- **Nike Training Club** — Condensed uppercase display type, high-contrast athletic photography
- **Gymshark** — Dark canvas, bold sans headlines, single vivid accent
- **Whoop** — Carbon-black UI with a single neon data accent
- **Equinox** — Premium dark fitness aesthetic with generous spacing
