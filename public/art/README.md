# Page Art Drop Folders

Drop your 16:9 art into the folder for each page — it appears automatically. No config needed.

## Folders

| Folder         | Page                        | Used as                          |
|----------------|-----------------------------|----------------------------------|
| `home/`        | Homepage hero               | Full-bleed cycling background    |
| `worlds/`      | Realms browser              | Page background                  |
| `dome-shows/`  | Dome Shows page             | Page background                  |
| `watch/`       | Watch page                  | Page background                  |
| `music/`       | Music page                  | Page background                  |
| `screensaver/` | Ascension Chamber           | Page background                  |
| `store/`       | Store page                  | Page background                  |
| `archive/`     | Archive page                | Page background                  |

## Naming

Prefix files with `01-`, `02-` etc. to control the display order:

```
home/
  01-arcanum-portal.jpg      ← shown first / default hero
  02-temple-interior.jpg     ← cycles in after 9 seconds
  03-cosmic-drift.jpg        ← cycles in after 18 seconds
```

## Formats

JPG · PNG · WEBP · AVIF · GIF

## Ratio

16:9 is ideal (1920×1080, 3840×2160, etc.) — images are `object-cover` so other ratios work but may crop.

## How it works

- Server reads the folder at page load — zero config
- If the folder is empty the page falls back to its default art
- Multiple images cycle with a slow crossfade + Ken Burns zoom
- One image = static background with Ken Burns only
