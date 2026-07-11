/*
# CAT-MANGA: manga & manhwa reading site schema

## Overview
Creates a single-tenant (no auth) schema for a manga/manhwa reading website.
Data is intentionally public/shared — any visitor can browse and read.

## New Tables
1. `series`
   - id (uuid, pk)
   - slug (text, unique) — URL-safe identifier
   - title (text, not null)
   - description (text)
   - author (text)
   - artist (text)
   - cover_url (text) — cover image URL
   - banner_url (text) — optional wide banner image
   - status (text) — 'ongoing' | 'completed' | 'hiatus'
   - type (text) — 'manga' | 'manhwa' | 'manhua'
   - genres (text[]) — array of genre tags
   - rating (numeric, 0-10) — average rating
   - year (int) — release year
   - featured (bool, default false) — show on home hero
   - created_at (timestamptz)
   - updated_at (timestamptz)

2. `chapters`
   - id (uuid, pk)
   - series_id (uuid, fk -> series.id ON DELETE CASCADE)
   - number (int, not null) — chapter number
   - title (text) — chapter title
   - pages (text[]) — ordered array of image URLs (manga pages)
   - created_at (timestamptz)
   - Unique on (series_id, number)

## Indexes
- series(slug) — lookup by slug
- series(type), series(status), series(featured) — filter/browse
- chapters(series_id, number) — chapter list ordering

## Security
- RLS enabled on both tables.
- Public read access for anon + authenticated (no sign-in app).
- No writes from the client (admin-managed content); only SELECT policies are added.
*/

CREATE TABLE IF NOT EXISTS series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  author text,
  artist text,
  cover_url text,
  banner_url text,
  status text NOT NULL DEFAULT 'ongoing',
  type text NOT NULL DEFAULT 'manga',
  genres text[] NOT NULL DEFAULT '{}',
  rating numeric(3,1) NOT NULL DEFAULT 0,
  year int,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  number int NOT NULL,
  title text,
  pages text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (series_id, number)
);

CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);
CREATE INDEX IF NOT EXISTS idx_series_type ON series(type);
CREATE INDEX IF NOT EXISTS idx_series_status ON series(status);
CREATE INDEX IF NOT EXISTS idx_series_featured ON series(featured);
CREATE INDEX IF NOT EXISTS idx_chapters_series_number ON chapters(series_id, number);

ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_series" ON series;
CREATE POLICY "public_read_series" ON series FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_chapters" ON chapters;
CREATE POLICY "public_read_chapters" ON chapters FOR SELECT
  TO anon, authenticated USING (true);
