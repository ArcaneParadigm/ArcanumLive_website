export type IpWorld = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  description: string | null
  short_description: string | null
  hero_image_url: string | null
  thumbnail_url: string | null
  logo_url: string | null
  color_primary: string | null
  color_secondary: string | null
  theme_style: string | null
  is_featured: boolean
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type MediaAsset = {
  id: string
  title: string
  slug: string | null
  asset_type: 'image' | 'video' | 'audio' | 'poster' | 'thumbnail' | 'vimeo' | 'external'
  file_url: string
  thumbnail_url: string | null
  poster_url: string | null
  storage_bucket: string | null
  storage_path: string | null
  duration_seconds: number | null
  width: number | null
  height: number | null
  ip_world_id: string | null
  description: string | null
  tags: string[] | null
  mood: string | null
  energy_level: number | null
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Album = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  ip_world_id: string | null
  album_type: string | null
  mood: string | null
  energy_level: number | null
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Track = {
  id: string
  title: string
  slug: string | null
  audio_url: string
  duration_seconds: number | null
  album_id: string | null
  ip_world_id: string | null
  bpm: number | null
  mood: string | null
  energy_level: number | null
  tags: string[] | null
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Playlist = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  ip_world_id: string | null
  playlist_type: string | null
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ScreensaverPreset = {
  id: string
  title: string
  slug: string
  description: string | null
  ip_world_id: string | null
  playlist_id: string | null
  visual_mode: string | null
  music_mode: string | null
  transition_style: string | null
  particle_style: string | null
  fluid_enabled: boolean
  audio_reactive: boolean
  default_intensity: number | null
  default_speed: number | null
  default_bloom: number | null
  default_color_palette: string | null
  is_featured: boolean
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Film = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  description: string | null
  short_description: string | null
  poster_url: string | null
  trailer_embed_url: string | null
  vimeo_on_demand_url: string | null
  vimeo_embed_code: string | null
  runtime_minutes: number | null
  ip_world_id: string | null
  is_360: boolean
  is_dome_available: boolean
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type GatewayButton = {
  label: string
  href: string
  description: string
  icon: string
}

export type HeroHotspot = {
  id: string
  label: string
  href: string
  x: number
  y: number
  width: number
  height: number
  description: string
  visualEffect: string
}

export type ScreensaverMode = {
  title: string
  description: string
  href: string
  icon?: string
}

export type VisualMode =
  | 'gallery_drift'
  | 'video_temple'
  | 'music_reactor'
  | 'fluid_oracle'
  | 'particle_cosmos'
  | 'mythmachine_shuffle'
