'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Series, SeriesType } from '@/lib/supabase';
import { SeriesCard } from './SeriesCard';
import { TYPE_LABELS } from '@/lib/data';

const TYPES: (SeriesType | 'all')[] = ['all', 'manga', 'manhwa', 'manhua'];

export function BrowseFilters({ series }: { series: Series[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SeriesType | 'all'>('all');
  const [genre, setGenre] = useState<string>('all');

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    series.forEach((s) => s.genres.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [series]);

  const filtered = useMemo(() => {
    return series.filter((s) => {
      if (type !== 'all' && s.type !== type) return false;
      if (genre !== 'all' && !s.genres.includes(genre)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.author?.toLowerCase().includes(q) ||
          s.genres.some((g) => g.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [series, query, type, genre]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search title, author, or genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-card/60 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-card"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                type === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {t === 'all' ? 'All' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {allGenres.length > 0 && (
        <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setGenre('all')}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              genre === 'all'
                ? 'bg-accent text-accent-foreground ring-1 ring-primary/40'
                : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            All Genres
          </button>
          {allGenres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                genre === g
                  ? 'bg-accent text-accent-foreground ring-1 ring-primary/40'
                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-muted-foreground">No series match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((s, i) => (
            <SeriesCard key={s.id} series={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
