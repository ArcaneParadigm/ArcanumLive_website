# Arcanum Live Design System

## Color & Typography Standards

### Text Brightness Hierarchy

**Three tiers — use the correct tier, do NOT default everything to the minimum:**

| Tier | Usage | Minimum opacity |
|------|-------|----------------|
| **Title** | Page titles, section headings, card titles | `1.0` (100%) — full white or full gold |
| **Body / Secondary** | Body copy, descriptions, labels, nav items, captions | `0.85` minimum — `rgba(255,255,255,0.85)` or higher |
| **Hint / Helper** | Keyboard hints, fine-print annotations, watermarks | `0.75` minimum — absolute floor, never go lower |

**75% is the FLOOR for the lowest-priority text only. It is NOT the default.**  
Body text, secondary labels, descriptions → 85%+. Titles → 100%.

```css
/* ✓ Title */        color: rgba(255,255,255,1.0);
/* ✓ Body/label */   color: rgba(255,255,255,0.88);
/* ✓ Hint/fine */    color: rgba(255,255,255,0.75);
/* ✗ Too dim */      color: rgba(255,255,255,0.5);
```

In Tailwind: `text-white` (100%), `text-white/90` (body), `text-white/75` (hint floor only)

### Color Palette

**Gold (Primary Accent)**
- Hex: `#c9973a`
- Usage: Navigation separators, borders, highlights, interactive states
- Gold text opacity follows same tier rule: titles `#c9973a` (100%), labels `#c9973acc` (80%+)

**Dark Background**
- Hex: `#08060e`
- Usage: Page backgrounds, dark surfaces

**Text Colors**
- Titles: `rgba(255,255,255,1.0)` or full gold — always 100%
- Body / secondary: `rgba(255,255,255,0.85)` to `rgba(255,255,255,0.95)`
- Hints / fine print: `rgba(255,255,255,0.75)` — absolute minimum, hint text only
- Never use faded white below 75% for any readable text

## Component Guidelines

### Navigation
- Separate nav items with thin gold vertical dividers
- Keep spacing tight (gap-2 on flex containers)
- All nav text at 0.75+ brightness
- Hover state: brightens to `#e8dcc8`

### Film/Content Cards
- 16:9 aspect ratio grids
- Gold borders: `1px solid ${GOLD}`
- Border opacity hierarchy:
  - Active/playing: `${GOLD}` (full opacity)
  - Hovered: `${GOLD}80` (50% opacity)
  - Default: `${GOLD}30` (18% opacity)
- Gradient overlay on thumbnails: `linear-gradient(to top, rgba(6,4,12,0.88) 0%, transparent 60%)`

### Dividers
- Line dividers use gold with 40% opacity
- Syntax: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`

### Typography
- Font: Cinzel for headings/titles
- Tracking: letter-spacing for uppercase nav (0.18em)
- Text shadow on overlaid text: `0 1px 6px rgba(0,0,0,1)`

## Grid Layouts

### Standard Responsive Grid
- Desktop (lg): 4 columns
- Tablet (sm): 3 columns
- Mobile: 2 columns
- Gap: `gap-1.5`

## Brightness Audit Checklist

When adding new text elements, verify:
- [ ] Titles are 100% opacity (full white or full gold)
- [ ] Body copy / labels / descriptions are ≥85% opacity
- [ ] Hints / fine-print / keyboard hints are ≥75% opacity
- [ ] Nothing is set to the 75% floor unless it genuinely is fine-print/hint tier
- [ ] High contrast maintained on dark backgrounds
