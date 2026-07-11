import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type SeriesStatus = 'ongoing' | 'completed' | 'hiatus';
export type SeriesType = 'manga' | 'manhwa' | 'manhua';

export interface Series {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  author: string | null;
  artist: string | null;
  cover_url: string | null;
  banner_url: string | null;
  status: SeriesStatus;
  type: SeriesType;
  genres: string[];
  rating: number;
  year: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  series_id: string;
  number: number;
  title: string | null;
  pages: string[];
  created_at: string;
}

export interface SeriesWithChapters extends Series {
  chapters: Chapter[];
}
