# Arcanum.Live — Claude Project Rules

This file is loaded automatically every session. Keep it current.

---

## DESIGN PHILOSOPHY — NON-NEGOTIABLE

This is a **wizard cyberpunk dashboard**, not a mainstream consumer app. Every UI decision must reflect that.

**Text brightness:** No text below 80% opacity/brightness. `text-white/50` or dimmer is banned. Use `text-white/80` minimum for secondary text, `text-white` or gold for primary. Faded grey placeholder aesthetic is rejected.

**Spacing:** No extraneous padding or margins. Elements sit close together — tight, dense, intentional. No fluffy whitespace between sections. Use `gap-1`, `mb-1`, `pt-0.5` — not `gap-6`, `mb-8`, `pt-12` unless the design demands breathing room for a specific reason.

**Aesthetic target:** High-end alchemical instrument. Obsidian surfaces, gold glows, arcane glyphs, circuit-rune hybrids. Think dashboard of a starship built by a medieval wizard. Every element earns its place. Nothing decorative that doesn't also inform.

**Anti-patterns to avoid:**
- Rounded cards with soft drop shadows and centered emoji (mainstream SaaS)
- Large hero text with one sentence and 80px of whitespace below it
- Muted grey labels that look like disabled states
- "Clean and minimal" that means empty and boring
- Padding that exists to fill space rather than separate meaning

**When adding new UI:** Ask — does this look like it belongs on a scrying mirror or a Notion dashboard? It should look like the former.

---

## DEPLOY — ALWAYS PUSH BOTH BRANCHES

Every commit must go to both:
```
git push origin master
git push origin master:claude/stupefied-noyce-c31117
```
- `master` = local working branch
- `claude/stupefied-noyce-c31117` = Vercel deployment branch (what goes live)
- If site changes aren't appearing, run the second command manually.
- A `.git/hooks/post-push` hook mirrors this automatically but won't survive a fresh clone — always verify.

---

## WHERE USER ADDS NEW FILES

**New media / content to add to the site:**
- `C:\Users\arcan\Downloads\Claude Code\website_added\`
- User drops folders here when they want images, videos, or galleries added.
- Subfolders map to site sections (e.g. `dome_seq\`, `Seq\`).
- Copy images into `public\images\[section]\` before referencing in code.

**Lyrics files:**
- `C:\Users\arcan\Downloads\Suno Downloads1\`
- Organized by album/track folders.
- `scripts\copy-lyrics.ps1` copies them in — update `$allLyricDirs` when new folders appear.

---

## TECH STACK

- Next.js 15 App Router, `use client` components
- Tailwind CSS — breakpoint `md:` = 768px+ (desktop). No prefix = mobile.
- Framer Motion for animations
- Three.js / WebGL for the 3D Astrolabe Orb
- Vercel deployment

---

## LAYOUT RULES

### Mobile positioning
- Use **viewport units** (`top-[82vh]`) for absolutely-positioned elements on mobile — never `%` which is relative to container height and breaks when containers resize.
- Desktop can use `%` on `md:` variants.
- Always guard responsive positions: `top-[Xvh] md:top-[Y%]`

### 16:9 screensaver players (Realms + Music pages)
Both pages use identical sizing formula — keep in sync:
```tsx
// Outer wrapper
<div className="px-1 py-1 mb-3">
// Inner player
style={{ aspectRatio: '16/9', width: 'min(100%, calc((100vh - 165px) * 16 / 9))', minHeight: 200 }}
// Landscape mobile override
landscapeMobile ? { height: 'calc(100vh - 72px)', width: '100%' } : above
```

### GallerySystem component
- Has built-in lightbox + keyboard arrow nav — use instead of custom galleries.
- **Always guard against empty arrays** — `GallerySystem` crashes on `images={[]}`.
- Pattern: `{show.gallery.length > 0 ? <GallerySystem .../> : <placeholder/>}`

---

## HOME HERO (`/home2`) — Visual Shell Architecture

Two-layer structure — do not collapse:

```
<div ref={containerRef}  min-h-[150vh] md:min-h-screen>
  ← tall on mobile so 5 stacked buttons don't overlap DomeShows section

  <div ref={shellRef}  absolute inset-x-0 top-0 h-screen overflow-hidden>
    ← image ALWAYS fills 100vh regardless of outer height
    BG images · UI overlay · 3D Orb · Title · Controls · bottom-fade · scroll-cue
  </div>

  <audio hidden />
  <PlayMusic pill />   ← outside shell, vh-relative position
  <PortalButtons />    ← outside shell, vh-relative position
</div>
```

**Why two layers:** Outer container must be 150vh on mobile to contain all 5 stacked portal buttons before the DomeShows section. But `object-cover` on the background image scales to the container height — if container is 150vh, image zooms wrong and orb mispositions. Shell fixes this by keeping the image in a 100vh box.

**Critical:** Pass `shellRef` (not `containerRef`) to `useImagePoint`. `containerRef` is only for `useScroll`.

---

## 3D ASTROLABE ORB

- Hook: `useImagePoint(shellRef, 1248, 832, fx, fy)` — maps image fraction to screen px
- Calibrated image: `arcanum-portal-v1.jpg` (1248×832)
- **Current: fx=0.52, fy=0.44** — centers on arcanum circle at 375×812 mobile
- Desktop original: fx=0.50, fy=0.48 (nav height shifts the circle ~44px on mobile)
- Size: **69vw** — user explicitly increased 3× at +33% each time
- CSS: `left: orbPt.x, top: orbPt.y, transform: translate(-50%,-50%)` — scales from center, no manual offsets
- Known: may drift at non-375px widths — future improvement is responsive fx/fy

---

## HOME HERO BUTTON POSITIONS

| Element | Mobile | Desktop |
|---|---|---|
| Play Music | `top-[73vh] left-0` | `md:top-[72%] md:left-[12%]` |
| Portal buttons | `top-[56vh]` no translate | `md:top-[84%] md:-translate-y-1/2` |
| CONTROLS | `bottom-[128px] right-0` | `md:bottom-4 md:right-4` |

- Portal gap: `gap-[3px] md:gap-4`
- Play Music and Controls pills are vertically center-aligned (~686px viewport Y on 375×812)
- BtnOrnate has ~105px visual height on mobile (72px button + ornament decorations above/below)

---

## EDGE PILLS (Mobile only)

Play Music and Controls are slim vertical pills on mobile, normal horizontal on desktop.

**Play Music** (left edge):
```tsx
className="... flex-col gap-1 px-2 py-3 rounded-r-md   md:flex-row md:px-4 md:py-1 md:rounded-md"
// Vertical text:
<span className="md:hidden" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>Music</span>
<span className="hidden md:inline">Play Music</span>
```

**Controls** (right edge) in `AstrolabeControls.tsx`:
```tsx
// Container: bottom-[128px] md:bottom-4   right-0 md:right-4
// Button: flex-col md:flex-row   px-2 py-3 rounded-l-lg md:rounded-lg
// Text: writingMode vertical-rl rotate(180deg) mobile only
```

---

## DOME SHOWS PAGE

- `app/dome-shows/page.tsx` contains all show data (title, desc, gallery arrays, youtube IDs)
- Galleries use `GallerySystem` with lightbox
- Aether: 24 equirec frames (every-other frame) + 21 dome fisheye in `public/images/dome-shows/aether/`
- TerrorDome: 8 images in `public/images/dome-shows/terrordome/`
- Set the Controls: has Area 15 Las Vegas 3-month run writeup in its `desc` field

---

## KEY FILES

| File | Purpose |
|---|---|
| `components/home2/Home2Hero.tsx` | Main hero — visual shell, orb, buttons, music pill |
| `components/home2/AstrolabeControls.tsx` | Controls pill widget |
| `components/home2/Home2Content.tsx` | Everything below hero (DomeShows section etc) |
| `components/home2/Home2Nav.tsx` | Top navigation |
| `components/realms/RealmsPlayer.tsx` | Realms page 16:9 screensaver player |
| `components/music/MusicPageClient.tsx` | Music page screensaver player |
| `components/screensaver/KenBurnsSlideshow.tsx` | Animated image slideshow used in players |
| `components/screensaver/GallerySystem.tsx` | Gallery with lightbox — use for all image grids |
| `app/dome-shows/page.tsx` | Dome shows data + gallery definitions |
| `app/home2/page.tsx` | Home page — imports hero + content |
| `lib/hooks/useImagePoint.ts` | Maps image-space coords to screen px (orb positioning) |
| `lib/hooks/useLandscapeMobile.ts` | Detects landscape mobile for player sizing |
| `lib/data/worlds.ts` | Featured worlds/realms data |
| `lib/data/albums.ts` | Music album definitions |
| `scripts/copy-lyrics.ps1` | Copies lyrics from Suno Downloads into project |
| `public/images/` | All site images |
| `public/realms/[slug]/` | Realm card images and gallery images |

---

## COMMIT STYLE

Concise subject line + body if needed. Always add:
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
