# tasteskill: Anti-Slop Frontend Skill — Comprehensive Summary

## Core Purpose

This is a design engineering skill for building landing pages, portfolios, and redesigns that avoid common AI-generated visual tells. It enforces clarity-first aesthetics, rigorous interaction patterns, and production-quality discipline.

## Key Sections Overview

**Section 0: Brief Inference**
Read the design context before any code. Output a one-line design read identifying page type, audience, and aesthetic family. Never guess ambiguity—ask one clarifying question maximum.

**Section 1: Three Dials**
- `DESIGN_VARIANCE (1-10)`: Layout predictability vs. asymmetry
- `MOTION_INTENSITY (1-10)`: Static to cinematic animation
- `VISUAL_DENSITY (1-10)`: Art gallery whitespace to cockpit density

These variables gate every layout and motion decision.

**Section 2: Design System Selection**
Reach for official packages (Material Web, Fluent UI, Carbon, Polaris, GOV.UK Frontend) when the brief matches. For aesthetic briefs (glassmorphism, brutalism, editorial), build with Tailwind + native CSS + a component library.

**Section 3: Default Architecture**
- Framework: React / Next.js with Server Components
- Styling: Tailwind v4
- Animation: Motion library (formerly Framer Motion)
- Icons: Phosphor, HugeIcons, Radix, or Tabler only
- Fonts: Always use `next/font` or self-hosted

**Section 4: Design Engineering Directives**

Core bias corrections:

- **Typography**: Avoid Inter as default; rotate serif pools carefully (never Fraunces/Instrument_Serif by default).
- **Color**: One accent maximum; desaturate by default; ban the warm-beige+brass premium-consumer default unless brand-justified.
- **Layout**: Force asymmetry when variance > 4; ban centered heroes; avoid the three-equal-feature-card pattern.
- **Interactive UI**: Implement loading, empty, error, and success states; validate button contrast (WCAG AA 4.5:1); keep CTA labels to 1–2 words, no wrapping.
- **Content Density**: Cut ruthlessly; max 25-word sub-paragraphs; use alternative UI components (grids, carousels, tabs) for lists > 5 items.
- **Layout Hard Rules**:
  - Hero fits viewport without scroll
  - Hero top padding capped at `pt-24`
  - Hero max 4 text elements (eyebrow, headline, subtext, CTAs)
  - Navigation on one line at desktop, height ≤ 80px
  - No 3+ consecutive zigzag image+text sections
  - Eyebrow count ≤ ceil(sectionCount / 3)
  - Bento grids have exactly as many cells as content

**Section 5: Context-Aware Patterns**

- Glassmorphism: Use only for premium/luxury/media-overlay vibes
- Magnetic micro-physics: Client Component only, `useMotionValue` driven
- Scroll hijacking: GSAP ScrollTrigger with canonical skeletons (sticky-stack, horizontal-pan)
- Marquees: Max one per page
- **Forbidden**: `window.addEventListener('scroll')` directly; custom scroll progress in React state

**Section 6: Performance & Accessibility**

- Animate only `transform` and `opacity`
- Honor `prefers-reduced-motion` for all motion > intensity 3
- Dual dark mode by default (Tailwind `dark:` variant or CSS variables)
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1

**Section 7: Dial Definitions**

Technical reference for what each dial range means:
- VARIANCE 1–3 = symmetric grid; 8–10 = masonry/asymmetric
- MOTION 1–3 = hover/active only; 8–10 = scroll-driven/parallax
- DENSITY 1–3 = spacious; 8–10 = packed/mono data

**Section 8: Dark Mode Protocol**

Pick one token strategy (Tailwind `dark:` or CSS variables) and stick with it. Test both modes before shipping. Maintain brand hierarchy across light and dark.

**Section 9: AI Tells (Forbidden Patterns)**

The most critical section. Bans include:

- **Typography**: No Inter default; serif only editorial/luxury; no oversized H1s
- **Layout**: No three-equal-card rows; no floating top-right sub-text in headers; no decoration text strips at hero bottom
- **Content**: No generic names (Jane Doe); no fake-perfect numbers (99.99%); no startup-slop brand names (Acme, Nexus)
- **Images**: No div-based fake screenshots; no hand-rolled decorative SVGs; hero needs real visual
- **Micro-interactions**: No scroll cues; no decorative dots by default; no version labels in hero (V0.6, BETA)
- **Typography flourishes**: No em-dashes anywhere (headlines, eyebrows, body, quotes, captions)
- **Copy patterns**: No "Quietly in use at"; no "Field notes" labels; no micro-meta sentences under eyebrows

**Section 9.G: Em-Dash Complete Ban (Non-Negotiable)**

`—` (em-dash) is completely forbidden on every landing page, portfolio, and redesign. Not "use sparingly"—zero instances. Replace with periods, commas, colons, parentheses, or line breaks. This is the #1 LLM design tell.

**Section 10: Reference Vocabulary**

Names for 50+ design patterns (Asymmetric Split Hero, Sticky-Stack Sections, Kinetic Marquee, Bento Grid, etc.). These are mental anchors for discussing design, not code libraries. Implementations live in the Block Library.

**Section 11: Redesign Protocol**

Detect mode first: greenfield, preserve (modernize without breaking), or overhaul (new visuals, old content).

For preserve mode:
1. Audit existing brand tokens, IA, content, patterns
2. Extract color / typography / spacing rules
3. Apply Modernization Levers (typography refresh, spacing, color, motion, hero recomposition, full-block replacement)
4. Never change URL structure, nav labels, form field names, legal copy

**Section 12: Block Library**

Schema for implementing reference patterns. Blocks include: frontmatter (category, dial compatibility, when-to-use), visual sketch, props API, code implementation, mobile fallback, motion variants per intensity band, dark-mode notes, anti-patterns, production references.

**Section 13: Out of Scope**

Dashboards, data tables, multi-step forms, code editors, native mobile, realtime collab UIs. This skill applies to marketing surfaces, not product surfaces.

**Section 14: Pre-Flight Checklist**

80+ mandatory checks before delivery:
- Brief inference declared
- Dial values reasoned
- Zero em-dashes anywhere
- Page theme locked (no mid-page mode flips)
- Color consistency lock (one accent)
- All CTA buttons readable (no overlap text)
- Hero fits viewport, headline ≤ 2 lines, subtext ≤ 20 words
- No duplicate CTA intents
- Real images (not div mocks)
- Dark mode tested
- Motion is motivated and shown (not claimed)
- Mobile collapse explicit
- All forbidden patterns absent
