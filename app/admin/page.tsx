'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Cat,
  LogOut,
  Loader2,
  Plus,
  Trash2,
  BookOpen,
  Library,
  CheckCircle2,
  AlertCircle,
  Link2,
  GripVertical,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase, type Series, type Chapter } from '@/lib/supabase';
import { TYPE_LABELS } from '@/lib/data';

type Tab = 'series' | 'chapter';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('series');
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  const fetchSeries = useCallback(async () => {
    setSeriesLoading(true);
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAllSeries(data);
    setSeriesLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchSeries();
  }, [user, fetchSeries]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-border/60 bg-secondary/40 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground"
          >
            View Site
          </Link>
          <button
            onClick={async () => { await signOut(); router.replace('/admin/login'); }}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-xl bg-secondary/40 p-1">
        <button
          onClick={() => setTab('series')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            tab === 'series' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Library className="h-4 w-4" />
          Add Series
        </button>
        <button
          onClick={() => setTab('chapter')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            tab === 'chapter' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Add Chapter
        </button>
      </div>

      {tab === 'series' ? (
        <SeriesForm onCreated={fetchSeries} />
      ) : (
        <ChapterForm seriesList={allSeries} seriesLoading={seriesLoading} />
      )}

      {/* Existing series list */}
      {tab === 'series' && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold">
            Existing Series
            <span className="ml-2 text-sm font-normal text-muted-foreground">{allSeries.length}</span>
          </h2>
          {seriesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : allSeries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/60 py-8 text-center text-sm text-muted-foreground">
              No series yet. Create one above.
            </p>
          ) : (
            <div className="grid gap-2">
              {allSeries.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-3"
                >
                  <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {s.cover_url && (
                      <Image src={s.cover_url} alt={s.title} fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.author} · {TYPE_LABELS[s.type]} · {s.genres.join(', ') || 'no genres'}
                    </p>
                  </div>
                  <Link
                    href={`/series/${s.slug}`}
                    className="flex-shrink-0 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Series Form ─────────────────────────────────────────────────────────────

function SeriesForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [artist, setArtist] = useState('');
  const [genres, setGenres] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Series['type']>('manga');
  const [status, setStatus] = useState<Series['status']>('ongoing');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const slug = slugify(title);
    if (!slug) {
      setError('Title must contain at least one alphanumeric character to generate a slug.');
      setSubmitting(false);
      return;
    }

    const insert: Record<string, unknown> = {
      title: title.trim(),
      slug,
      author: author.trim() || null,
      artist: artist.trim() || null,
      genres: genres.split(',').map((g) => g.trim()).filter(Boolean),
      cover_url: coverUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      description: description.trim() || null,
      type,
      status,
      year: year ? parseInt(year, 10) : null,
      rating: rating ? parseFloat(rating) : 0,
    };

    const { error: insertError } = await supabase.from('series').insert(insert);

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setTitle(''); setAuthor(''); setArtist(''); setGenres(''); setCoverUrl('');
    setBannerUrl(''); setDescription(''); setYear(''); setRating('');
    setSubmitting(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" required>
          <input {...inputProps(title, setTitle)} placeholder="e.g. Solo Ascension" />
        </Field>
        <Field label="Author">
          <input {...inputProps(author, setAuthor)} placeholder="e.g. Chugong" />
        </Field>
        <Field label="Artist">
          <input {...inputProps(artist, setArtist)} placeholder="e.g. Dubu" />
        </Field>
        <Field label="Genres (comma-separated)">
          <input {...inputProps(genres, setGenres)} placeholder="Action, Fantasy, Adventure" />
        </Field>
        <Field label="Cover URL">
          <input {...inputProps(coverUrl, setCoverUrl)} placeholder="https://images.pexels.com/..." />
        </Field>
        <Field label="Banner URL (optional)">
          <input {...inputProps(bannerUrl, setBannerUrl)} placeholder="https://images.pexels.com/..." />
        </Field>
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value as Series['type'])} className={selectClass}>
            {Object.entries(TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as Series['status'])} className={selectClass}>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="hiatus">On Hiatus</option>
          </select>
        </Field>
        <Field label="Year (optional)">
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className={inputClass} />
        </Field>
        <Field label="Rating 0–10 (optional)">
          <input type="number" step="0.1" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="9.0" className={inputClass} />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="A brief synopsis..."
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Alert success={success} error={error} />

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Create Series
      </button>
    </form>
  );
}

// ─── Chapter Form ────────────────────────────────────────────────────────────

interface PageEntry {
  id: string;
  url: string;
}

function ChapterForm({ seriesList, seriesLoading }: { seriesList: Series[]; seriesLoading: boolean }) {
  const [seriesId, setSeriesId] = useState('');
  const [number, setNumber] = useState('1');
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState<PageEntry[]>([{ id: cryptoId(), url: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cryptoId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function updatePage(id: string, url: string) {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, url } : p)));
  }

  function addPage() {
    setPages((prev) => [...prev, { id: cryptoId(), url: '' }]);
  }

  function removePage(id: string) {
    setPages((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  }

  function movePage(index: number, dir: -1 | 1) {
    setPages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!seriesId) {
      setError('Please select a series.');
      setSubmitting(false);
      return;
    }

    const pageUrls = pages.map((p) => p.url.trim()).filter(Boolean);
    if (pageUrls.length === 0) {
      setError('At least one page image URL is required.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('chapters').insert({
      series_id: seriesId,
      number: parseInt(number, 10) || 1,
      title: title.trim() || null,
      pages: pageUrls,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setTitle('');
    setPages([{ id: cryptoId(), url: '' }]);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Series" required>
          {seriesLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : seriesList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Create a series first.</p>
          ) : (
            <select value={seriesId} onChange={(e) => setSeriesId(e.target.value)} className={selectClass} required>
              <option value="">Select a series...</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Chapter Number" required>
          <input type="number" min="1" value={number} onChange={(e) => setNumber(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Chapter Title (optional)">
          <input {...inputProps(title, setTitle)} placeholder="e.g. The Weakest Hunter" />
        </Field>
      </div>

      {/* Pages editor */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">
            Page Image URLs <span className="text-xs">({pages.filter((p) => p.url.trim()).length} valid)</span>
          </label>
          <button
            type="button"
            onClick={addPage}
            className="flex items-center gap-1 rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Page
          </button>
        </div>
        <div className="space-y-2">
          {pages.map((page, i) => (
            <div key={page.id} className="flex items-center gap-2">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => movePage(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground/50 transition-colors hover:text-foreground disabled:opacity-20"
                  aria-label="Move up"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              </div>
              <span className="w-6 flex-shrink-0 text-center text-xs font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="url"
                  value={page.url}
                  onChange={(e) => updatePage(page.id, e.target.value)}
                  placeholder={`https://images.pexels.com/... (page ${i + 1})`}
                  className={`${inputClass} pl-9`}
                />
              </div>
              {page.url.trim() && (
                <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                  <Image src={page.url.trim()} alt="" fill sizes="32px" className="object-cover" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removePage(page.id)}
                disabled={pages.length === 1}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                aria-label="Remove page"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Pages are displayed top-to-bottom in the reader. Use the grip icon to reorder.
        </p>
      </div>

      <Alert success={success} error={error} />

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add Chapter
      </button>
    </form>
  );
}

// ─── Shared bits ─────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/50';

const selectClass = inputClass;

function inputProps(value: string, setter: (v: string) => void) {
  return {
    type: 'text' as const,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value),
    className: inputClass,
    required: false,
  };
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function Alert({ success, error }: { success: boolean; error: string | null }) {
  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400 ring-1 ring-emerald-500/30">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        Created successfully.
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive ring-1 ring-destructive/30">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }
  return null;
}
