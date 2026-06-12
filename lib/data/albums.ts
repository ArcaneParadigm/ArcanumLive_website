/**
 * Real album + track data for the music player.
 * Audio: /audio/albums/[slug]/[filename].mp3
 * Lyrics: /audio/albums/[slug]/lyrics/[filename].txt
 *
 * Title-cleaning rules applied:
 *  - Leading track numbers stripped (display only; filename kept for reference)
 *  - Version tags stripped (v1, v2b, v3, full, etc.)
 *  - Suno junk stripped (MFmaster, -14.0L, zozz, etc.)
 *  - Wrapper quotes removed
 *  - Stray dashes / underscores trimmed
 * Sidhe pairs: same base song → Pt. 2 added, spaced ≥3 tracks apart
 */

export interface AlbumTrack {
  /** Clean display title */
  title: string
  /** MP3 filename (no path, no extension) — matches what's on disk */
  file: string
  /** Lyrics txt path relative to album dir — null if none */
  lyricsFile: string | null
}

export interface Album {
  id: string
  slug: string
  title: string
  /** Short subtitle shown under title */
  subtitle?: string
  /** Cover art: /audio/albums/[slug]/cover.jpg  (add manually later) */
  cover?: string
  tracks: AlbumTrack[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const t = (title: string, file: string, lyrics?: string): AlbumTrack => ({
  title,
  file,
  lyricsFile: lyrics ?? null,
})

// ─── Songs from the Rim 1 ───────────────────────────────────────────────────

const rimOneTracks: AlbumTrack[] = [
  t('Merge with You',                  '1_Merge with You v3'),
  t('Oh What a Trip',                  '2_Oh What A Trip b'),
  t('Infinite Horizons',               '3_Infinite Horizons v3'),
  t('Rise with Me',                    '4_Rise with Me v1'),
  t('Celestial Ocean',                 '5_Celestial Ocean v2mod  vCelestial SG v5'),
  t('Galaxies Colliding',              '6_Galaxies Colliding'),
  t('Kumulipo',                        '7_Kumulipo 1 full (1)'),
  t('The Shimmer',                     '8_the Shimmer  SHA v3'),
  t('No Gods',                         '8b No Gods v3b'),
  t('Awakening of the Infinite Ones',  '9b_Awakening of the Infinite Ones v6a'),
  t('Neon Black',                      '10_Neon Black v1'),
  t("Starship's Sorrow",               '11_Starships sorrow v4b'),
  t('When We Were King',               '12_When we where king v1b'),
  t('Oh What a Fight',                 '13_Oh what a Fight'),
  t('Singularity Drift',               '13 bSingularity  Drift v1b'),
  t('Riding the Horizon Rift',         '14_Riding the Horizon Rift v2'),
  t('Song of the Ancients',            '15_Song of the Ancients v1'),
  t('Song of the Eternal Thread',      '16_Song of the Eternal Thread v2b full'),
  t('The Convergence',                 '17_The Convergence v2 full'),
]

// ─── Sidhe Fairy Songs 1 ────────────────────────────────────────────────────
// Pairs spaced ≥3 tracks apart. Pt. 2 versions use the "b" master file.

const sidheTracks: AlbumTrack[] = [
  t('Songs of the Seelie',                         'Songs of the Seelie'),
  t('Dance of the Unseeling',                      'Dance of the Unseeling'),
  t('The Magic of the Seelie',                     'The Magic of the Seelie'),
  t('Moonlit Ritual',                              'Moonlit Ritual 2a'),
  t("Brath'Aelun: The Wind-Name Ritual",           "2. Brath'Aelun The Wind-Name Ritual v1b"),
  t('The Magic of the Seelie, Pt. 2',              'The Magic of the Seelie b'),
  t('The Moonlit Rite',                            'The Moonlit Rite c'),
  t('Orren Valei: The Healing Flame Incantation',  '3. Orren Valei The Healing Flame Incantation v1'),
  t('Whispers of the Unseen',                      'Whispers of the Unseen b'),
  t('Whispers of the Shadow Court',                'Whispers of the Shadow Court'),
  t('Orren Valei: The Healing Flame Incantation, Pt. 2', '3. Orren Valei The Healing Flame Incantation v1b'),
  t('The Mysteries of the Fey',                    'The Mysteries of the Fey'),
  t('The Doppelganger',                            'The Doppelganger b'),
  t('Whispers of the Shadow Court, Pt. 2',         'Whispers of the Shadow Court b'),
  t('Spell of Binding and Bloom',                  'Spellsong - Spell of Binding and Bloom v1B'),
  t('The Mysteries of the Fey, Pt. 2',             'The Mysteries of the Fey b'),
  t('The Unseelie Dance',                          'The Unseelie Dance b'),
  t('Caer Danu: Song of the Hidden Grove',         'Caer Danu The Song of the Hidden Grove v1A'),
  t('Whispers of the Unseelie',                    'Whispers of the Unseelie 2'),
  t('The Fairy Dirge',                             'the Fairy Dirge dif ver 2a'),
  t('Caer Danu: Song of the Hidden Grove, Pt. 2',  'Caer Danu The Song of the Hidden Grove v1b'),
  t('The Unseeling Wild Ride',                     'The Unseeling Wild Ride b'),
  t('Whispers of the Unseelie, Pt. 2',             'Whispers of the Unseelie 2b'),
  t('Dawn Over Tír na nÓg',                        'Uplifting - Dawn Over Tir na nog v1'),
  t('The Devil vs Puck',                           'the Devil vs Puck 2v4'),
  t('The Fairy Dirge, Pt. 2',                      'the Fairy Dirge dif ver 2a (2)'),
  t('Dawn Over Tír na nÓg, Pt. 2',                 'Uplifting - Dawn Over Tir na nog v1B'),
  t('The Devil vs Puck, Pt. 2',                    'the Devil vs Puck 2v4b'),
]

// ─── Songs from the Rim: Ai Divine ──────────────────────────────────────────

const aiDivineTracks: AlbumTrack[] = [
  t('Galaxies Colliding',              '1 Galaxies Colliding v3b'),
  t('Age of Aquarius',                 '2 aid sc 1 Age of Aquarius v2  full'),
  t('Into the Sun',                    '3 Into the Sun v2b'),
  t('Eternal Watch',                   '4 aid sc 11b Esh2 Eternal Watch full new 1_ext'),
  t('CyberCapture',                    '4b aiD_Intro CyberCapture 1b (Remastered)'),
  t('Voice of Eternity',               '5 aid sc 11 voice of Eternity v2 full'),
  t('Chasing the Horizon',             '6 aiD sc5 Chasing the Horizon 1 full song'),
  t("Codebreaker's Anthem (Rock)",     "7 aiD sc5b Codebreaker's Anthem v1 4(rockvibe)"),
  t('Eclipse of Light',                '8 aiD sc5 Eclipse of Light v2'),
  t('Shadows Within',                  '9 aid dark night of soul Shadows Within v2 2 full'),
  t('Oracle Themesong',                '11 aiD Oracle Themesong v4'),
  t('Sympathy for the Daemon',         '12 Sympathy for the Deamon v1'),
  t('Creation',                        '13 AiD_Creation 1 sc1 1 full'),
  t("Codebreaker's Anthem",            "14 aiD sc5b Codebreaker's Anthem v1zz"),
  t('Eternal Becoming',                '15 Eternal Becoming CyTwins v3b'),
  t("Gaia's Rising",                   '16 Gaia\'s Rising   v1'),
]

// ─── Songs from the Rim: Ascension City ─────────────────────────────────────

const ascensionCityTracks: AlbumTrack[] = [
  t('Aether Multiverse',               '1 Aether Multiverse  v2B 3'),
  t('Enter the Nexus',                 '2_Enter the NexusNLyr_ v1'),
  t("I'm Leaving Thru the Stargate",   "3 I'm Leaving thru the Stargate v1"),
  t('Infinite Signal',                 '4 Infinite Signal  v1a'),
  t('Faster than Light',               '5 Faster than Light v2b'),
  t('Lightspeed',                      '6 Lightspeed   v1'),
  t('Enter the Nexus (Extended)',       '7_Enter the Nexus_ NLyr v2'),
  t('Cyber Wizard',                    '8_Cyber Wizard  rap v1b'),
  t('No Gods Left',                    '9 No Gods left v4b'),
  t('Metacode: Enter the Stream',      '10 Metacode_ Enter the Stream  v1'),
  t('Aether Multiverse (SG Version)',  '11_Aether Multiverse SG ver 1 _t3 full a'),
  t('Neon Veil',                       '12 Neon Veil v1b'),
  t('Rite of the Aether Eon',          '13 Rite of the Aether   Eon v2'),
  t('Slipstream',                      '14 Slipstream zozz'),
]

// ─── Movie: Aether Into the Multiverse ──────────────────────────────────────

const aetherMovieTracks: AlbumTrack[] = [
  t('Aether Trance',                         '1 Aether trance v5'),
  t('Aether Multiverse',                     '2 Aether Multiverse  v2B 2'),
  t('Aether Trance (Dark Mix)',               '3 Aether trance v4bmaster'),
  t('Song of the Ancients',                  '4_Song of the Ancients v1'),
  t('Aether: The Breath of the Cosmos',      '5 Aether_ The Breath of the Cosmos  v2'),
  t('Eternal Watch',                         '6 aid sc 11b Esh2 Eternal Watch full new 1_ext'),
  t('Eclipse of Light',                      '7 aiD sc5 Eclipse of Light v2'),
  t('The Eshh Rap',                          '8 the Eshh rap v1b (1)'),
  t('Aether Multiverse (Extended)',          '9  Aether Multiverse SG ver 1 _t3 full a add music b'),
  t('Song of the Ancients, Pt. 2',           '10_Song of the Ancients v1'),
]

// ─── Exported album list ─────────────────────────────────────────────────────

export const ALBUMS: Album[] = [
  {
    id: 'songs-from-the-rim-1',
    slug: 'songs-from-the-rim-1',
    title: 'Songs from the Rim 1',
    subtitle: 'The original cosmic anthology',
    tracks: rimOneTracks,
  },
  {
    id: 'sidhe-fairy-songs-1',
    slug: 'sidhe-fairy-songs-1',
    title: 'Sidhe Fairy Songs 1',
    subtitle: 'Celtic fae rituals & shadow court whispers',
    tracks: sidheTracks,
  },
  {
    id: 'songs-from-the-rim-ai-divine',
    slug: 'songs-from-the-rim-ai-divine',
    title: 'Songs from the Rim: Ai Divine',
    subtitle: 'Anthems of the digital divine',
    tracks: aiDivineTracks,
  },
  {
    id: 'songs-from-the-rim-ascension-city',
    slug: 'songs-from-the-rim-ascension-city',
    title: 'Songs from the Rim: Ascension City',
    subtitle: 'Cyber temple transmissions',
    tracks: ascensionCityTracks,
  },
  {
    id: 'movie-aether-into-the-multiverse',
    slug: 'movie-aether-into-the-multiverse',
    title: 'Aether: Into the Multiverse',
    subtitle: 'Original soundtrack',
    tracks: aetherMovieTracks,
  },
]
