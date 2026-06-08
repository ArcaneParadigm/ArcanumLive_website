# Realm Image Setup Handoff

When given a set of images for a realm (e.g. "here are 30 images for ai-divine"), here is exactly where they go and what each page does with them.

---

## Folder Structure

```
public/realms/[slug]/
  gallery/        ← ALL frames that play in Ken Burns on all 3 pages (Realms, Asc, card world)
  lore/           ← lore chapter images (card world only)
  characters/     ← character images (card world only)
  audio/          ← WAV/MP3 tracks (all 3 pages)
  seq/            ← master copy of raw sequence frames (source — copy all to gallery/ too)
  card.jpg        ← single card thumbnail image
```

## Seq Workflow (when given a new frame sequence)

1. Copy ALL frames → `public/realms/[slug]/seq/` (master archive)
2. Copy ALL frames → `public/realms/[slug]/gallery/` (this is what Ken Burns plays)
3. Done — all 3 pages auto-discover gallery/ and play the full sequence

Ken Burns cycles through every image in gallery/ in filename sort order. The speed slider (3–30s per frame) controls playback rate. All 300+ frames will play through continuously.

---

## How Each Page Uses the Images

### 1. Card World — `/realms/[slug]`
**File:** `app/realms/[slug]/page.tsx`  
**Component:** `GallerySystem` with `kenBurns` prop  
**Source:** `discoverRealmImages(slug).gallery` → `gallery/` folder  
**Behavior:** Ken Burns slideshow (zoom 1.0→1.3, random pan direction), Speed slider (3–30s) bottom-right, fade locked at speed/3  
**Also shows:** lore images, character images in lower page sections

### 2. Realms Page — `/realms`
**File:** `app/realms/page.tsx` → `components/realms/RealmsPageHub.tsx` (client wrapper)  
**Component:** `RealmsPlayer` → `KenBurnsSlideshow` (same Ken Burns tech)  
**Source:** `discoverRealmImages(slug).gallery` passed as `imageMap` prop  
**Behavior:** Switches imagery when user clicks a realm card → activates Ken Burns for that realm, autoplays music, scrolls player into view  
**Trigger:** `onActivate(slug)` from card click → `setActiveSlug` → `RealmsPlayer` `activeSlug` prop

### 3. Ascension Chamber — `/ascension`
**File:** `app/ascension/page.tsx` → `AscensionChamberHub` → `RealmsPlayer`  
**Component:** Same `RealmsPlayer` → same `KenBurnsSlideshow`  
**Source:** `discoverRealmImages(slug).gallery` passed as `imageMap`  
**Behavior:** Same as Realms page. Card click → `setActiveRealm` → `RealmsPlayer` `activeSlug` prop → Ken Burns switches + music autoplays

---

## Data Flow (all pages)

```
public/realms/[slug]/gallery/*.jpg
  ↓
discoverRealmImages(slug).gallery        [lib/utils/realmImages.ts — server side]
  ↓
imageMap: Record<string, string[]>       [built in server page component]
  ↓
RealmsPlayer prop imageMap               [client component]
  ↓
imageMap[currentSlug] → KenBurnsSlideshow images prop
```

---

## Audio Flow

```
public/realms/[slug]/audio/*.wav
  ↓
discoverRealmAudio(slug)                 [checks BOTH paths:]
  public/audio/realms/[slug]/            [legacy]
  public/realms/[slug]/audio/            [current]
  ↓
audioMap: Record<string, DiscoveredTrack[]>
  ↓
RealmsPlayer → buildPlaylists(audioMap)
  → when realm activated: setPlaying(true) autoplays track 1
```

Card world uses `WorldAudioPlayer` directly with same `discoverRealmAudio(slug)` output.

---

## Key Components

| File | Role |
|------|------|
| `components/screensaver/KenBurnsSlideshow.tsx` | Core animation: scale 1.0→1.3, random pan, Speed slider self-contained, fade=speed/3 |
| `components/ui/GallerySystem.tsx` | Card world gallery wrapper — passes `showControls accentColor` to KenBurns |
| `components/realms/RealmsPlayer.tsx` | Realms+Asc player — imagery band, sequencer, audio controls |
| `components/realms/RealmsPageHub.tsx` | Client wrapper sharing `activeSlug` between RealmsPlayer and grid |
| `components/realms/RealmCard.tsx` | Shared card (both pages) — image click=activate, Enter=navigate |
| `components/realms/RealmsPortraitGrid.tsx` | Realms page card grid + InfoStrip hover bars |
| `components/screensaver/AscensionChamberHub.tsx` | Asc page hub — realm cards, presets, music list |
| `lib/utils/realmImages.ts` | All file discovery functions |

---

## Lore and Character Image Sections (card world only)

### How lore images work
- All lore images go in `public/realms/[slug]/lore/`
- Distributed across 3 lore chapters evenly by `splitAcrossChapters(imgs.lore, 3)`
- **Target: 33 lore images** — gives exactly 11 per chapter
- Name them `01-name.jpg`…`33-name.jpg` — first 11 → chapter 1, next 11 → chapter 2, last 11 → chapter 3
- Each chapter panel has hover behavior (see below)

### How character images work
- All character images go in `public/realms/[slug]/characters/`
- **Target: 11 images**
- **Selection rule**: characters centered/prominent in frame — fills ≥40% frame height, clear subject, not background crowd/environment shots

### When given a batch of images to sort

**For lore folder:**
1. Read the 3 lore chapter captions in `WORLD_LORE` in `app/realms/[slug]/page.tsx`
2. Match image content to chapter theme — assign to correct 01–11 / 12–22 / 23–33 range
3. Aim for variety within each chapter (close/wide/atmospheric mix)

**For characters folder:**
1. Scan all candidates
2. Select: central framing, subject fills most of frame height, clear character identity
3. Reject: wide establishing shots, extreme periphery, busy group scenes
4. Pick 11 best — diverse poses/characters if multiple exist in the realm

### Lore/Character panel hover behavior
- Main image scales `1.03` + edge glow (accent color, 3-layer shadow)
- Deep gong fires: G2 (~98Hz), temple bowl tone, ~5.5s decay
- Thumbnail strip slides in below image — shows all panel images
- Auto-cycles every 2.4s — crossfade 0.6s
- Active thumbnail: gold border + glow, scales `1.08`
- Click thumbnail → jump to image; click main image → fullscreen lightbox

---

## Adding a New Realm's Images (checklist)

1. Create folder: `public/realms/[slug]/gallery/`
2. Drop images in (any JPG/PNG/WEBP, prefix `01-` `02-` etc. to control order)
3. Optionally add `public/realms/[slug]/audio/*.wav` for music
4. Optionally add a card thumbnail at `public/realms/[slug]/card.jpg`
5. **No code changes needed** — discovery is automatic

The realm must exist in `lib/data/worlds.ts` `featuredWorlds` array with the matching `slug`.

---

## KenBurns Behavior Summary

- **Scale:** always 1.0 → 1.3 (zoom in), 6 pan direction variants (random each image)
- **Fade:** `speed / 3` seconds (locked ratio, not user-controllable)
- **Speed slider:** 3–30s, changes take effect immediately (remounts current image)
- **Header/footer overlay:** dark gradient top 1/3 and bottom 1/3, locked
- **Slider location:** bottom-right of the imagery band, only when `showControls` prop passed

---

## Active Card State

`RealmCard` (`components/realms/RealmCard.tsx`) receives `isActive` boolean:  
- Hot glow: `0 0 60px ${color}cc` multi-layer box-shadow  
- Pulse ring animation (Framer Motion opacity loop)  
- `▶ Active` label (font-bold, text-[11px], with glow)  
- On hover when not active: `▶ Activate` hint centered  
- Enter button: gold gradient, navigates to `/realms/[slug]`
