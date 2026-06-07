# Arcanum Live Design System

## Color & Typography Standards

### Text Brightness Requirement
**All text must have a minimum brightness of 75% opacity (0.75 alpha channel).**

This applies to:
- Navigation labels
- Body copy
- Labels and annotations
- Helper text and descriptions
- Any readable text across the platform

Example:
```css
color: rgba(255, 255, 255, 0.75); /* ✓ Valid */
color: rgba(255, 255, 255, 0.5);  /* ✗ Too dull */
```

In Tailwind:
```jsx
style={{ color: 'rgba(255,255,255,0.75)' }} /* Minimum brightness */
```

### Color Palette

**Gold (Primary Accent)**
- Hex: `#c9973a`
- Usage: Navigation separators, borders, highlights, interactive states

**Dark Background**
- Hex: `#08060e`
- Usage: Page backgrounds, dark surfaces

**Text Colors**
- Primary text: `rgba(255,255,255,0.85)` to `rgba(255,255,255,1.0)` — high brightness
- Secondary text: `rgba(255,255,255,0.75)` minimum — medium brightness (do not go lower)
- Disabled/subtle: Use gold tints instead of dim white (`rgba(201,151,58,0.4)`)

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
- [ ] Text color is at least 0.75 opacity or higher
- [ ] Disabled/secondary text uses muted gold instead of faded white
- [ ] All labels meet readability standard
- [ ] High contrast maintained on dark backgrounds
