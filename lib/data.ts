import { supabase, type Series, type Chapter, type SeriesType, type SeriesStatus } from './supabase';

export async function getFeaturedSeries(): Promise<Series[]> {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllSeries(): Promise<Series[]> {
  const { data, error } = await supabase.from('series').select('*').order('title', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getChaptersBySeries(seriesId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('series_id', seriesId)
    .order('number', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getChapter(seriesId: string, number: number): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('series_id', seriesId)
    .eq('number', number)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const TYPE_LABELS: Record<SeriesType, string> = {
  manga: 'Manga',
  manhwa: 'Manhwa',
  manhua: 'Manhua',
};

export const STATUS_LABELS: Record<SeriesStatus, string> = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  hiatus: 'On Hiatus',
};

export const STATUS_STYLES: Record<SeriesStatus, string> = {
  ongoing: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  completed: 'bg-sky-500/15 text-sky-400 ring-sky-500/30',
  hiatus: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
};
