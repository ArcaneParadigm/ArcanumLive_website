Arcanum Song Archive Extractor
Local-Only Build Specification for Claude Code / Codex
Purpose
Build a local-only desktop-style web app for organizing a large ChatGPT + Suno song archive.
The app must scan a ChatGPT export and a local Suno downloads folder, extract song lyrics and Suno prompts, identify song groups and variants, match audio files to lyric records, allow manual review and playlist curation, then export clean data for the future Arcanum.Live screensaver app.
This is not the public Arcanum.Live site. This is a private local archive and curation tool.

Core Goal
The system must convert a messy creative archive into structured data.
Input:
ChatGPT export zip or conversations.json
Local Suno downloads folder
Optional manually selected audio folders
Output:
Clean song catalog
Song groups
Variant groups
Matched audio records
Missing lyrics reports
Missing audio reports
Individual lyric documents
Master lyric book
Screensaver-ready JSON exports
Playlist data with manual ordering
Primary workflow:
ChatGPT Export + Suno Downloads Folder
? Extract lyrics/prompts/groups
? Scan audio files
? Match audio to lyrics
? Review songs
? Approve/reject/archive
? Assign to playlists
? Reorder playlists
? Export clean screensaver data

Build Type
V1 must be local-only
Do not build:
Public hosting
Supabase
Vercel deployment
User accounts
Login
Cloud upload
Payment features
Everything runs on the user's computer.
The app should be launched locally with:
npm run dev
Then used at:
http://localhost:3000

Recommended Tech Stack
Use:
Node.js
Next.js App Router
TypeScript
Tailwind CSS
SQLite
Local filesystem access through Node scripts/API routes
Local exports to JSON, CSV, and Markdown
Optional later:
Electron or Tauri wrapper
LLM enrichment
Supabase import/export
Arcanum.Live direct sync

Main Data Sources
1. ChatGPT export
The user will provide either:
chatgpt-export.zip
or:
conversations.json
The app must parse the conversations and extract:
Full songs
Draft songs
Rewrites
Variants
Remixes
Suno style prompts
Song fragments
Album concepts
Playlist concepts
Creative group/session context
2. Suno downloads folder
The user will provide a local folder path, such as:
C:\Users\USERNAME\Downloads\Suno
The app must scan recursively for audio files.
Supported extensions:
.mp3
.wav
.m4a
.flac
.aiff
.ogg
The app must read:
Filename
Path
Extension
File size
Created date
Modified date
Duration if possible
Embedded metadata title if possible
Embedded metadata artist if possible

Major App Sections
Create these routes/screens:
/
/import
/scan-audio
/dashboard
/groups
/songs
/audio
/review
/playlists
/playlists/[playlist_id]
/variants
/matches
/reports/missing-lyrics
/reports/missing-audio
/exports
/settings

Required Database
Use SQLite for V1.
Tables:
song_groups
songs
audio_files
variant_groups
matches
creative_sessions
playlists
playlist_items
song_reviews
app_settings

Schema: song_groups
Purpose: Songs are often created in batches of 3-15 around an IP, album, world, character, or theme. A later variant may need to go back into an earlier group.
Fields:
group_id TEXT PRIMARY KEY
group_title TEXT
group_slug TEXT
ip_world TEXT
album TEXT
group_type TEXT
first_seen_date TEXT
last_seen_date TEXT
source_chat_titles TEXT
source_conversation_ids TEXT
description TEXT
canonical_tags TEXT
adult_adjacent INTEGER
family_safe INTEGER
created_at TEXT
updated_at TEXT
Example groups:
Yum Yum Girls Batch
Raven Trickster Goddess Anthems
Kali Fire Songs
Coyote Trickster Set
Digital Domain / Cyber Geisha Songs
Burning Man Cosmic Party Songs
Aether Transmission Ambient Set
Girls of the Multiverse Anthems
Songs from the Rim

Schema: songs
Fields:
song_id TEXT PRIMARY KEY
title TEXT
slug TEXT
display_title TEXT
canonical_title TEXT
group_id TEXT
group_title TEXT
variant_group_id TEXT
parent_song_id TEXT
variant_type TEXT
version_label TEXT
version_number INTEGER
is_canonical_version INTEGER
song_status TEXT
extraction_type TEXT
lyrics TEXT
lyrics_plain TEXT
lyrics_doc_path TEXT
suno_style_prompt TEXT
album TEXT
ip_world TEXT
music_type TEXT
mood TEXT
energy_level INTEGER
bpm INTEGER
vocal_style TEXT
instrumentation TEXT
fx_tags TEXT
visual_pairing TEXT
is_adult_adjacent INTEGER
is_family_safe INTEGER
audio_files TEXT
matched_audio_count INTEGER
has_matching_audio INTEGER
has_matching_lyrics INTEGER
needs_review INTEGER
source_chat_title TEXT
source_conversation_id TEXT
source_message_id TEXT
source_excerpt TEXT
created_at_from_chat TEXT
classification_confidence REAL
extraction_confidence REAL
match_confidence REAL
duplicate_of_song_id TEXT
created_at TEXT
updated_at TEXT
song_status values
draft
working
final
published
unknown
extraction_type values
full_song
lyrics_only
style_prompt_only
metadata_only
discussion_reference
fragment

Schema: audio_files
Fields:
audio_id TEXT PRIMARY KEY
filename TEXT
filepath TEXT
title_guess TEXT
artist_guess TEXT
duration_seconds INTEGER
file_extension TEXT
file_size INTEGER
created_at_file TEXT
modified_at_file TEXT
embedded_metadata_title TEXT
embedded_metadata_artist TEXT
matched_song_id TEXT
matched_group_id TEXT
match_confidence REAL
match_reason TEXT
has_lyrics_match INTEGER
needs_review INTEGER
is_duplicate_audio INTEGER
duplicate_of_audio_id TEXT
created_at TEXT
updated_at TEXT

Schema: variant_groups
Purpose: Preserve relationships between original songs, remixes, rewrites, extended versions, and differently named versions.
Fields:
variant_group_id TEXT PRIMARY KEY
canonical_title TEXT
canonical_slug TEXT
group_id TEXT
ip_world TEXT
album TEXT
primary_song_id TEXT
song_ids TEXT
variant_count INTEGER
notes TEXT
needs_review INTEGER
created_at TEXT
updated_at TEXT

Schema: matches
Purpose: Store suggested and confirmed matches between audio files and song/lyric records.
Fields:
match_id TEXT PRIMARY KEY
song_id TEXT
audio_id TEXT
match_type TEXT
match_confidence REAL
match_reason TEXT
is_confirmed INTEGER
is_rejected INTEGER
created_at TEXT
updated_at TEXT
match_type values
auto_exact
likely
possible
manual
rejected

Schema: creative_sessions
Purpose: Track bursts of song creation. The user often creates 3-15 songs in a group, changes groups, then returns later.
Fields:
session_id TEXT PRIMARY KEY
session_title TEXT
start_date TEXT
end_date TEXT
source_conversation_ids TEXT
dominant_group TEXT
dominant_ip_world TEXT
song_count INTEGER
notes TEXT
created_at TEXT
updated_at TEXT

Schema: playlists
Fields:
playlist_id TEXT PRIMARY KEY
title TEXT
slug TEXT
description TEXT
playlist_type TEXT
ip_world TEXT
music_type TEXT
mood TEXT
energy_level_min INTEGER
energy_level_max INTEGER
is_screensaver_ready INTEGER
is_family_safe INTEGER
is_adult_adjacent INTEGER
max_songs INTEGER
limit_behavior TEXT
sequence_number INTEGER
parent_playlist_id TEXT
playback_mode TEXT
sort_order INTEGER
created_at TEXT
updated_at TEXT
playlist_type values
screensaver
album
world
mood
energy
party
ambient
review
archive
custom
limit_behavior values
warn_only
auto_create_next
block
unlimited
Default:
max_songs = 15
limit_behavior = warn_only
Important: playlists do not require a hard limit. max_songs can be null/unlimited. If max_songs is reached, warn by default but do not block.
playback_mode values
manual_order
shuffle
energy_curve
random_weighted
Default:
manual_order

Schema: playlist_items
Fields:
playlist_item_id TEXT PRIMARY KEY
playlist_id TEXT
song_id TEXT
variant_group_id TEXT
audio_id TEXT
position INTEGER
added_at TEXT
added_from_review_mode INTEGER
notes TEXT
transition_note TEXT
visual_mode_override TEXT
start_time_override INTEGER
end_time_override INTEGER
created_at TEXT
updated_at TEXT
A song can belong to multiple playlists.
The same song should not be added twice to the same playlist unless manually allowed.
A playlist can contain multiple variants from the same variant group, but the app must warn the user.

Schema: song_reviews
Fields:
song_id TEXT PRIMARY KEY
review_status TEXT
quality_rating INTEGER
screensaver_ready INTEGER
needs_lyrics INTEGER
needs_audio INTEGER
needs_cover INTEGER
notes TEXT
last_reviewed_at TEXT
created_at TEXT
updated_at TEXT
review_status values
unreviewed
approved
rejected
archive_only
needs_review
needs_audio_match
needs_lyrics_match
duplicate
quality_rating values
1 = bad / junk
2 = maybe salvage
3 = decent
4 = good
5 = strong / use
Rejected and archive-only songs must not be deleted. They should be excluded from screensaver exports by default.

Song Detection Requirements
The app must detect song candidates from ChatGPT conversations.
Strong lyric indicators
[Intro]
[Verse]
[Pre-Chorus]
[Chorus]
[Bridge]
[Final Chorus]
[Outro]
Other indicators
Suno
lyrics
song
anthem
remix
rewrite
variant
style prompt
instrumentation
FX
vocal
bpm
trance
psytrance
downtempo
ambient
cinematic
goddess
Yum Yum
HoneyVerse
Raven
Kali
Coyote
Creatrix
Digital Domain
Aether
SoulBlade
Atlantis
Gaia

Song Classification
Every extracted item must be classified as one of:
final_song
draft_song
rewrite
variant
remix
style_prompt_only
fragment
album_concept
playlist_concept
discussion_only
not_song
Rules:
Do not treat every song-like discussion as a full song.
Full songs usually contain multiple Suno sections.
Style prompts without lyrics are style_prompt_only.
One-line ideas are usually fragment or discussion_reference.
Remixes and rewrites must be kept as separate records.
Exact duplicates should be marked, not deleted.

Variant Detection
The app must identify variants and preserve relationships.
variant_type values
original
rewrite
extended_version
short_version
alternate_style
remix
genre_variant
lyric_variant
prompt_variant
final_version
duplicate
possible_variant
Strong variant signals
Same or similar title
Same chorus
Same hook phrase
Same source conversation
User says: redo, rewrite, make another version, same song, try again, did not work in Suno, make it smoother, make it harder, extend, remix, psy-slam, downtempo, final, v2
Medium signals
Same IP world
Same album
Same lyrical theme
Same repeated phrases
Same character
Similar opening lines
Nearby conversation context
Weak signals
Same genre only
Same mood only
Same BPM only
Weak signals should suggest possible relatedness but should not auto-group without review.

Naming Normalization for Variants
The app must normalize names for variant grouping while preserving the original display title.
Common suffixes/details to interpret:
v1
v2
v3
version 1
version 2
final
final final
extended
ext
xv
remix
psy
psy-slam
downtempo
anthem
alt
rewrite
new
suno
Example:
display_title: Lightspeed XV Ext v2
canonical_title: Lightspeed
version_label: XV Extended v2
variant_type: extended_version
If uncertain, set:
needs_review = true
variant_type = possible_variant

Group Assignment Logic
The user usually creates songs in batches of 3-15 songs around one world, album, character, or style. The app must detect and preserve groups.
If the same song or IP returns later, the later variant should be assigned back to the earlier group when appropriate.
Assign later variant to earlier group if:
Same explicit title
Same canonical title
Same hook phrase
Same chorus phrase
Same IP world
Same album
Same user instruction chain
User says redo/rewrite/remix/try again/previous one did not work
Do not auto-assign if:
Only genre is similar
Only mood is similar
Title overlap is weak
Lyrics are unrelated
Uncertain cases go to manual review.

Audio Matching Logic
The app must match Suno audio files to extracted song records.
Match signals
Filename contains exact song title
Filename contains normalized title
Embedded metadata title matches
Same group keyword
Same album/IP keyword
Same variant keyword
File date is near chat/song creation date
Manual user match
Scoring example
Exact filename/title match: +60
Similar title match: +40
Embedded metadata match: +40
Same group keyword: +25
Same album/IP keyword: +20
Same variant keyword: +20
File created near chat date: +15
Match confidence behavior
80+ = likely auto-match
60-79 = likely match, needs review
40-59 = possible match
below 40 = unmatched
The app must never delete or merge automatically.

Missing Lyric Reality Report
The app must identify Suno audio files that do not have matching lyric records.
Export:
unmatched_suno_files.csv
Fields:
filename
title_guess
filepath
matched_group_guess
reason_no_lyrics
needs_review
Possible reasons:
Suno file found but no lyric record
Filename similar to group but no exact lyrics
Likely instrumental
Likely renamed manually
Likely duplicate export
Low-confidence match only

Missing Audio Report
The app must identify lyrics that do not have matching Suno audio files.
Export:
songs_missing_audio.csv
Fields:
song_id
title
group_title
ip_world
album
source_chat_title
created_at_from_chat
reason_no_audio
needs_review

Review Mode
Create a route:
/review
This is one of the most important screens.
Layout
Left panel: Song list
Center panel: Selected song detail
Right panel: Playlist manager
Bottom/side panel: Variants + match warnings

Review Mode: Left Panel
Show a searchable/filterable song table.
Columns:
title
group
variant label
review status
quality rating
has audio
has lyrics
playlist count
adult/family flag
Filters:
Unreviewed
Approved
Rejected
Archive Only
Has Audio
Missing Audio
Missing Lyrics
In No Playlists
In Multiple Playlists
Has Variants
Adult Adjacent
Family Safe
By Group
By IP World
By Music Type
Sort options:
Newest
Oldest
Title
Group
Quality
Playlist Count
Energy Level
Needs Review First

Review Mode: Center Panel
When a song is selected, show:
title
audio player
lyrics
metadata
source chat
matched audio file
review controls
variant info
playlist membership
Controls:
Approve
Reject
Archive Only
Needs Review
Set Quality 1-5
Toggle Screensaver Ready
Edit Title
Edit Canonical Title
Edit Variant Label
Edit Group
Edit Lyrics
Edit Metadata
Save
Do not delete songs by default. Rejecting a song only removes it from screensaver exports.

Review Mode: Right Playlist Panel
When a song is selected, the right panel must show all playlists.
Each playlist row should show:
playlist title
song count
max songs or unlimited
whether selected song is already in it
whether sibling variant is already in it
family/adult compatibility warning
Add button
Remove button
Move button
Copy button
A song can be added to multiple playlists.
The UI must clearly show:
This song is in:
- Playlist A
- Playlist B
- Playlist C
If sibling variants are already placed elsewhere, show:
Variants already placed:
- Lightspeed v1 ? Songs from the Rim
- Lightspeed XV Extended v2 ? Hyperspace Reactor
If the current playlist already contains another variant from the same variant group, show a warning but allow override.

Playlist Creation Inside Review Mode
The right panel must include:
Create New Playlist
Fields:
title
playlist_type
ip_world
mood
music_type
family_safe
adult_adjacent
max_songs
limit_behavior
Default:
max_songs = 15
limit_behavior = warn_only

Playlist Limit Behavior
Playlists do not have to have a hard limit.
If a playlist reaches max_songs, do not block by default.
Show warning:
This playlist has reached 15/15 songs.
Offer:
Add anyway
Create next sequel playlist
Move to another playlist
Cancel
limit_behavior behavior
warn_only = warn but allow adding
auto_create_next = automatically create sequel playlist when full
block = do not allow adding when full
unlimited = no max limit

Sequel Playlist Logic
Example:
Songs from the Rim
Songs from the Rim 2
Songs from the Rim 3
If Songs from the Rim fills and the user chooses to create a sequel playlist:
Create a new playlist with same settings
Title becomes Songs from the Rim 2
sequence_number = 2
parent_playlist_id points to original base playlist
Add the song to the new playlist
If Songs from the Rim 2 fills, create Songs from the Rim 3.

Playlist Detail Page
Create route:
/playlists/[playlist_id]
Show:
Playlist title
Description
Song count
Max songs / unlimited
Total runtime
Family/adult flag
Screensaver-ready flag
Playback mode
Main table:
position
title
variant label
group
duration
energy level
has lyrics
has audio
review status
Controls:
drag reorder
move to playlist
copy to playlist
remove
play preview
edit notes

Playlist Reordering
The app must support manual sequencing.
Requirements:
Drag-and-drop songs up and down inside a playlist
Preserve the position field
Allow manual ordering for album/screening/saver playback
Export playlist order exactly
Screensaver exports must preserve manual order.

Move vs Copy
The app must distinguish move and copy.
Move = remove from current playlist and add to target playlist
Copy = keep in current playlist and also add to target playlist
When moving/copying:
Warn if exact song already exists in target playlist
Warn if sibling variant already exists in target playlist
Still allow override
Removing a song from a playlist must not delete the song from the archive.

Keyboard Shortcuts
Add useful shortcuts for fast review:
A = approve
R = reject
N = next song
P = previous song
1-5 = quality rating
Space = play/pause
F = filter unreviewed

Bulk Tools
Add bulk actions:
Approve selected
Archive selected
Reject selected
Add selected to playlist
Remove selected from playlist
Create playlist from current filter
Mark selected missing audio
Export current filter

Lyrics Export
The app must export lyrics in three ways.
1. Individual markdown files
Folder structure:
lyrics_export/
  yum-yum-girls/
    yum-yum-girls__original.md
    yum-yum-girls__psy-slam-mix.md
    yum-yum-girls__sacred-downtempo-remix.md

  raven-trickster-goddess/
    raven-oracle-shadows.md
    raven-bone-dice.md

  kali-goddess-anthems/
    when-kali-dances.md
Each markdown file should include frontmatter:
---
title: "When Kali Dances"
group: "Kali Goddess Anthems"
album: "kali-goddess-anthems"
ip_world: "Kali"
variant_type: "final_version"
music_type: "mythic_goddess"
energy_level: 9
is_adult_adjacent: false
is_family_safe: true
matched_audio_files: []
---

[Intro]
...
2. Master lyrics book
Export:
lyrics_master.md
Organize by group:
# Arcanum Song Lyrics Master

## Yum Yum Girls Batch

### Yum Yum Girls - Original

### Yum Yum Girls - Psy-Slam Mix

## Raven Trickster Goddess Anthems

### Raven Oracle Shadows
3. Screensaver lyric JSON
Export:
screensaver_lyrics.json
Shape:
[
  {
    "song_id": "when-kali-dances",
    "title": "When Kali Dances",
    "group": "Kali Goddess Anthems",
    "ip_world": "Kali",
    "lyrics_plain": "",
    "lyrics_sections": [
      {
        "section": "Intro",
        "lines": []
      },
      {
        "section": "Verse",
        "lines": []
      }
    ],
    "display_mode": "karaoke_scroll",
    "family_safe": true,
    "adult_adjacent": false
  }
]
Screensaver use cases:
floating lyric lines
karaoke scroll
section-based overlays
oracle text mode
ambient subtitle mode

Main Export Files
Create an Export Center with buttons for:
songs_master.json
songs_master.csv
song_groups.json
variant_groups.json
audio_files.csv
unmatched_suno_files.csv
songs_missing_audio.csv
lyrics_master.md
lyrics_export_folder
screensaver_catalog.json
screensaver_playlists.json
screensaver_lyrics.json
screensaver_audio_manifest.json

Screensaver Export Rules
By default, screensaver exports should include only songs that are:
review_status = approved
screensaver_ready = true
has_matching_audio = true
Optional export toggles:
Include approved songs without lyrics
Include lyric-only songs
Include archive-only songs
Include adult-adjacent playlists
Include unreviewed songs
Adult-adjacent songs must never appear in family-safe exports unless explicitly included.

screensaver_playlists.json Shape
{
  "playlists": [
    {
      "playlist_id": "",
      "title": "Songs from the Rim",
      "slug": "songs-from-the-rim",
      "sequence_number": 1,
      "parent_playlist_id": null,
      "playlist_type": "screensaver",
      "ip_world": "The Rim",
      "mood": ["cosmic", "cinematic"],
      "is_family_safe": true,
      "is_adult_adjacent": false,
      "playback_mode": "manual_order",
      "songs": [
        {
          "position": 1,
          "song_id": "",
          "title": "",
          "canonical_title": "",
          "variant_label": "",
          "audio_file": "",
          "lyrics_doc": "",
          "energy_level": 8,
          "visual_pairing": "",
          "is_variant_of": ""
        }
      ]
    }
  ]
}

screensaver_catalog.json Shape
{
  "songs": [
    {
      "song_id": "",
      "title": "",
      "slug": "",
      "group_id": "",
      "group_title": "",
      "variant_group_id": "",
      "canonical_title": "",
      "variant_type": "",
      "version_label": "",
      "album": "",
      "ip_world": "",
      "music_type": "",
      "mood": [],
      "energy_level": 0,
      "bpm": null,
      "vocal_style": "",
      "instrumentation": [],
      "fx_tags": [],
      "visual_pairing": "",
      "is_adult_adjacent": false,
      "is_family_safe": true,
      "audio_files": [],
      "lyrics_doc_path": "",
      "screensaver_ready": true
    }
  ]
}

screensaver_audio_manifest.json Shape
{
  "audio_files": [
    {
      "audio_id": "",
      "song_id": "",
      "filename": "",
      "filepath": "",
      "duration_seconds": 0,
      "title_guess": "",
      "matched_song_title": "",
      "match_confidence": 0
    }
  ]
}

UI Design Direction
The app should be functional first, beautiful second.
Style:
Dark interface
Compact tables
High contrast text
Obsidian / charcoal backgrounds
Gold/cyan accent highlights
Clear status badges
Fast keyboard navigation
Avoid:
Huge decorative cards in data-heavy screens
Slow animations in review mode
Overly precious UI that makes bulk work painful

App Dashboard
Dashboard should show:
Total conversations scanned
Song candidates found
Songs extracted
Audio files scanned
Matched audio files
Unmatched audio files
Songs missing audio
Songs missing lyrics
Unreviewed songs
Approved songs
Rejected songs
Archive-only songs
Total playlists
Screensaver-ready songs

Review Philosophy
The app must prioritize preservation over guessing.
Rules:
Do not invent songs
Do not delete songs automatically
Do not merge lyrics automatically
Do not overwrite original extracted lyrics
Preserve source references
Use confidence scores
Mark uncertain items as needs_review
Allow the user to override classifications quickly

Optional LLM Enrichment: Phase 2
V1 should work with deterministic parsing and heuristics.
Later add optional LLM enrichment.
LLM can help classify:
album
ip_world
music_type
mood
energy_level
bpm if present
vocal_style
instrumentation
fx_tags
visual_pairing
is_adult_adjacent
is_family_safe
version_type
title_confidence
classification_confidence
Rules for LLM:
Must not rewrite lyrics
Must not invent songs
Must not add audio_url or cover_image
Must preserve original text
Must keep audit trail of generated fields
User must be able to accept/reject changes

Suggested LLM Classification Prompt
Use this later only if an LLM option is added:
Analyze this extracted ChatGPT message and classify whether it contains a song, song draft, remix, variant, style prompt, fragment, or discussion.

Return strict JSON only.

Fields:
is_song_candidate
classification
title
canonical_title
variant_type
probable_parent_title
album
ip_world
music_type
mood
energy_level
bpm
vocal_style
instrumentation
fx_tags
visual_pairing
is_adult_adjacent
is_family_safe
song_status
extraction_type
title_confidence
classification_confidence
reasoning_summary

Rules:
- Do not invent content.
- Preserve exact lyrics if present.
- If title is not explicit, infer provisional title and set title_confidence low.
- If this is just a discussion about a song and not the song itself, classify as discussion_only.
- If this is only a Suno style prompt, classify as style_prompt_only.
- If it is a remix or rewrite, classify as variant or remix and identify probable parent title if possible.

Build Phases
Phase 1: Local app foundation
Build:
Next.js local app
SQLite setup
Dashboard
Import ChatGPT export
Scan audio folder
Basic tables
Basic exports
Phase 2: Song extraction
Build:
Conversation parser
Lyric block detection
Style prompt detection
Song candidate extraction
Initial classification
Source tracking
Phase 3: Audio scan and matching
Build:
Recursive audio folder scanner
Audio metadata extraction
Title guessing
Audio-to-song matching
Missing lyrics report
Missing audio report
Phase 4: Groups and variants
Build:
Song group detection
Creative session detection
Variant group detection
Naming normalization
Variant review screen
Phase 5: Review mode
Build:
Three-panel review UI
Audio preview
Lyrics preview/editor
Approve/reject/archive
Quality ratings
Screensaver-ready toggle
Keyboard shortcuts
Phase 6: Playlist curation
Build:
Create playlists
Add/remove songs
Multiple playlist membership
Variant warnings
Playlist detail page
Drag-and-drop reordering
Move/copy between playlists
Optional max song warnings
Sequel playlist creation
Phase 7: Screensaver exports
Build:
screensaver_catalog.json
screensaver_playlists.json
screensaver_lyrics.json
screensaver_audio_manifest.json
lyric markdown exports
master lyric book
Phase 8: Optional polish
Build:
Electron/Tauri wrapper
LLM enrichment
Supabase import
Arcanum.Live sync

Critical Acceptance Criteria
The app is successful when the user can:
1. Import ChatGPT export.
2. Scan a Suno downloads folder.
3. See all extracted songs.
4. See all detected audio files.
5. Identify Suno files with no lyric match.
6. Identify lyric records with no audio match.
7. Review a song by clicking it.
8. Listen to matched audio.
9. Read/edit lyrics.
10. Approve, reject, or archive the song.
11. Add the song to one or more playlists.
12. See which playlists the song is already in.
13. See whether variants are in other playlists.
14. Create a new playlist instantly.
15. Reorder playlist songs manually.
16. Move/copy songs between playlists.
17. Export clean screensaver-ready JSON.
18. Export separate lyric documents.
19. Preserve all original source data.
20. Avoid accidentally pushing bad/unreviewed songs into screensaver exports.

Final Instruction to Developer/AI Agent
Build this as a practical local archive tool first. Do not over-focus on visual polish in V1. The most important features are accurate extraction, preservation of original lyrics, audio matching, review status, playlist assignment, variant awareness, and clean exports for the future Arcanum.Live screensaver system.
The app should behave like a private music librarian, playlist builder, lyric archivist, and screensaver data generator.


















































































































































































































































































































































































































































































































































































































































































































































































