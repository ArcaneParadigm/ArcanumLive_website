-- Arcanum.Live Database Schema
-- Run this in your Supabase SQL editor to create all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ip_worlds: Each mythic IP / creative world
-- ============================================================
create table if not exists ip_worlds (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  subtitle text,
  description text,
  short_description text,
  hero_image_url text,
  thumbnail_url text,
  logo_url text,
  color_primary text,
  color_secondary text,
  theme_style text,
  is_featured boolean default false,
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- media_assets: Images, videos, audio, Vimeo items
-- ============================================================
create table if not exists media_assets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text,
  asset_type text not null check (asset_type in ('image','video','audio','poster','thumbnail','vimeo','external')),
  file_url text not null,
  thumbnail_url text,
  poster_url text,
  storage_bucket text,
  storage_path text,
  duration_seconds integer,
  width integer,
  height integer,
  ip_world_id uuid references ip_worlds(id) on delete set null,
  description text,
  tags text[],
  mood text,
  energy_level integer check (energy_level between 1 and 10),
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- albums: Music albums / sound worlds
-- ============================================================
create table if not exists albums (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  ip_world_id uuid references ip_worlds(id) on delete set null,
  album_type text check (album_type in ('ambient','cinematic','trance','ritual','meditation','psychedelic','battle','sexy_burning_man','cosmic')),
  mood text,
  energy_level integer check (energy_level between 1 and 10),
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- tracks: Individual music tracks
-- ============================================================
create table if not exists tracks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text,
  audio_url text not null,
  duration_seconds integer,
  album_id uuid references albums(id) on delete set null,
  ip_world_id uuid references ip_worlds(id) on delete set null,
  bpm integer,
  mood text,
  energy_level integer check (energy_level between 1 and 10),
  tags text[],
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- playlists: Playlist groupings
-- ============================================================
create table if not exists playlists (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  ip_world_id uuid references ip_worlds(id) on delete set null,
  playlist_type text check (playlist_type in ('screensaver','music','gallery','video','mixed','ritual','party','ambient')),
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- playlist_items: Connects playlists to media/tracks
-- ============================================================
create table if not exists playlist_items (
  id uuid primary key default uuid_generate_v4(),
  playlist_id uuid references playlists(id) on delete cascade,
  media_asset_id uuid references media_assets(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  item_type text check (item_type in ('image','video','audio','mixed')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- screensaver_presets: Named screensaver configurations
-- ============================================================
create table if not exists screensaver_presets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  ip_world_id uuid references ip_worlds(id) on delete set null,
  playlist_id uuid references playlists(id) on delete set null,
  visual_mode text check (visual_mode in ('gallery_drift','video_temple','music_reactor','fluid_oracle','particle_cosmos','mythmachine_shuffle')),
  music_mode text,
  transition_style text,
  particle_style text,
  fluid_enabled boolean default false,
  audio_reactive boolean default false,
  default_intensity integer default 5 check (default_intensity between 1 and 10),
  default_speed integer default 5 check (default_speed between 1 and 10),
  default_bloom integer default 5 check (default_bloom between 1 and 10),
  default_color_palette text,
  is_featured boolean default false,
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- films: Vimeo On Demand film pages
-- ============================================================
create table if not exists films (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  subtitle text,
  description text,
  short_description text,
  poster_url text,
  trailer_embed_url text,
  vimeo_on_demand_url text,
  vimeo_embed_code text,
  runtime_minutes integer,
  ip_world_id uuid references ip_worlds(id) on delete set null,
  is_360 boolean default true,
  is_dome_available boolean default false,
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (public read for all public content)
-- ============================================================
alter table ip_worlds enable row level security;
alter table media_assets enable row level security;
alter table albums enable row level security;
alter table tracks enable row level security;
alter table playlists enable row level security;
alter table playlist_items enable row level security;
alter table screensaver_presets enable row level security;
alter table films enable row level security;

-- Public read policies
create policy "Public worlds are readable" on ip_worlds for select using (is_public = true);
create policy "Public assets are readable" on media_assets for select using (is_public = true);
create policy "Public albums are readable" on albums for select using (is_public = true);
create policy "Public tracks are readable" on tracks for select using (is_public = true);
create policy "Public playlists are readable" on playlists for select using (is_public = true);
create policy "Public playlist items are readable" on playlist_items for select using (true);
create policy "Public presets are readable" on screensaver_presets for select using (is_public = true);
create policy "Public films are readable" on films for select using (is_public = true);

-- ============================================================
-- Storage buckets (run after creating buckets in Supabase dashboard)
-- ============================================================
-- Buckets to create manually: images, videos, audio, thumbnails, posters, screensaver-assets
-- Set all to public read, authenticated write/delete

-- ============================================================
-- Updated_at trigger helper
-- ============================================================
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_ip_worlds_updated before update on ip_worlds for each row execute procedure handle_updated_at();
create trigger on_media_assets_updated before update on media_assets for each row execute procedure handle_updated_at();
create trigger on_albums_updated before update on albums for each row execute procedure handle_updated_at();
create trigger on_tracks_updated before update on tracks for each row execute procedure handle_updated_at();
create trigger on_playlists_updated before update on playlists for each row execute procedure handle_updated_at();
create trigger on_screensaver_presets_updated before update on screensaver_presets for each row execute procedure handle_updated_at();
create trigger on_films_updated before update on films for each row execute procedure handle_updated_at();
