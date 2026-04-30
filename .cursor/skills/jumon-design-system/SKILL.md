---
name: jumon-design-system
description: Enforces the Jumon design system for UI implementation, including color usage, component patterns, typography, spacing, and strict visual constraints. Use when building or styling Jumon frontend pages, components, dashboards, and design artifacts.
disable-model-invocation: true
---

# Jumon Design System

Before writing any UI code for Jumon, read this file in full and apply every rule below without being asked.

## Supporting files
- Use `apps/web/app/jumon-tokens.css` for CSS custom properties.
- Use `@jumon/ui/tokens` (source: `packages/ui/src/tokens.ts`) for JavaScript/TypeScript token imports.
- Never hardcode hex values in component code.

## Rules (verbatim)
# Jumon Design System — Agent Skill

## Overview
Jumon is a B2B infrastructure SaaS product — a connectivity layer between ad platforms (LinkedIn Ads, Google Ads, Meta) and AI agents via MCP. The UI must feel **premium, warm, and trustworthy** — not a generic SaaS tool.

Before writing any UI code for Jumon, read this file in full. Apply every rule below without being asked.

---

## Color tokens

Always import or reference `apps/web/app/jumon-tokens.css` for color values. Never hardcode hex values in component code — use the CSS custom properties defined there.

### Brand
| Token | Hex | Usage |
|---|---|---|
| `--j-deep-teal` | `#10282D` | Nav bar, page headings, dark filled buttons |
| `--j-ember` | `#C8601A` | Primary CTAs, logo border, avatar background, key actions |
| `--j-harvest` | `#F0A349` | Hover states, highlighted text, secondary accents |

### Green (status & depth only)
| Token | Hex | Usage |
|---|---|---|
| `--j-canopy` | `#1E3D44` | Dark surface variants, nav depth layers |
| `--j-moss` | `#2A7A5C` | "Connected" / success / live status — green is ONLY for status |
| `--j-fern` | `#4AB89A` | Status badge text, monospace links, active indicators |

### Surfaces & neutrals
| Token | Hex | Usage |
|---|---|---|
| `--j-mist` | `#F4F8F7` | Page background, card inner surfaces |
| `--j-sage` | `#D6E8E3` | Borders, dividers, card outlines |
| `--j-slate` | `#7A9E97` | Secondary text, captions, placeholders, meta info |
| `--j-dusk` | `#FDEBD8` | Warm tint behind Ember icons; subtle amber fills |

---

## Usage rules — enforce strictly

### Ember is the action color
- All primary buttons: `background: var(--j-ember); color: var(--j-mist)`
- Logo pill border: `border: 1px solid var(--j-ember)`
- Nav avatar background: `var(--j-ember)`
- Never use Ember for text on a white/light background — only on dark or Dusk backgrounds

### Deep Teal is structure
- Nav bar background always `var(--j-deep-teal)`
- Page-level headings (`h1`, `h2`): `color: var(--j-deep-teal)`
- Secondary/outline buttons: `color: var(--j-deep-teal); border: 0.5px solid var(--j-sage)`

### Green = status only
- `--j-moss` and `--j-fern` are ONLY used for connected/success/live states
- Never use green for decorative purposes, backgrounds, or branding elements
- Connected badge: `background: var(--j-sage); color: var(--j-moss)`

### Surfaces
- Page background: always `var(--j-mist)` — never pure white (`#fff`) for the page
- Card backgrounds: `#ffffff` with `border: 0.5px solid var(--j-sage)`
- Card inner sections (footers, sub-panels): `background: var(--j-mist)`
- Never use gray (`#f5f5f5`, etc.) — all neutrals must come from the green-tinted palette

### Typography
- Primary text: `color: var(--j-deep-teal)`
- Secondary / muted text: `color: var(--j-slate)`
- Monospace (URLs, code, endpoints): `color: var(--j-slate); font-family: monospace`
- Font weights: 400 (body), 500 (headings, labels) — never 600 or 700

---

## Component patterns

### Nav bar
```css
nav {
  background: var(--j-deep-teal);
  height: 52px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```
- Logo: white text, `border: 1px solid var(--j-ember)`, `border-radius: 6px`, `letter-spacing: 0.12em`
- Avatar: `background: var(--j-ember)`, `border-radius: 50%`, white initials
- Nav divider below nav: `height: 1px; background: var(--j-canopy)`

### Primary button (Ember CTA)
```css
.btn-primary {
  background: var(--j-ember);
  color: var(--j-mist);
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
}
```

### Outline button
```css
.btn-outline {
  background: #ffffff;
  color: var(--j-deep-teal);
  border: 0.5px solid var(--j-sage);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
}
```

### Platform / integration card
```css
.card {
  background: #ffffff;
  border: 0.5px solid var(--j-sage);
  border-radius: 12px;
  overflow: hidden;
}
.card-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-body {
  border-top: 0.5px solid var(--j-sage);
  padding: 14px 20px;
  background: var(--j-mist);
}
```

### Platform logo circle
- Connected platform: `background: var(--j-dusk); color: var(--j-ember)` — warm tint, Ember text
- Pending/unconnected: `background: var(--j-sage); color: var(--j-slate)`

### Connected status badge
```css
.badge-connected {
  background: var(--j-sage);
  color: var(--j-moss);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}
```

### Warning / auth-required badge
```css
.badge-warning {
  background: var(--j-dusk);
  color: var(--j-ember);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}
```

---

## Spacing & layout
- Page content padding: `40px 32px`
- Max content width: `860px`
- Card grid gap: `14px`
- Section divider: `height: 0.5px; background: var(--j-sage); margin: 28px 0`
- Border radius: `8px` (buttons, inputs), `12px` (cards), `50%` (avatars)
- Border width: always `0.5px` — never `1px` for card/input borders

---

## What NOT to do
- Do not use gray neutrals (`#f5f5f5`, `#e0e0e0`, `#999`, etc.) — use the teal-tinted palette
- Do not use green for anything except status indicators
- Do not use Harvest (`--j-harvest`) as a background — it is an accent/hover color only
- Do not use font-weight 600 or 700
- Do not use box shadows — use borders only
- Do not use gradients or blur effects
- Do not use pure black (`#000`) for text — use `var(--j-deep-teal)`
