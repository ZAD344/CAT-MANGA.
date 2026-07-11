import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, BookOpen, Calendar, User, Palette, ArrowLeft, ChevronRight, Play } from 'lucide-react';
import { getSeriesBySlug, getChaptersBySeries, TYPE_LABELS, STATUS_LABELS, STATUS_STYLES } from '@/lib/data';

export default async function SeriesDetailPage({ params }: { params: { slug: string } }) {
  const series = await getSeriesBySlug(params.slug);
  if (!series) notFound();

  const chapters = await getChaptersBySeries(series.id);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-80">
        {series.banner_url ? (
          <Image
            src={series.banner_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to browse
        </Link>

        <div className="-mt-24 flex flex-col gap-6 sm:-mt-32 sm:flex-row sm:gap-8">
          {/* Cover */}
          <div className="relative aspect-[3/4] w-36 flex-shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-2xl sm:w-48 lg:w-56">
            {series.cover_url ? (
              <Image
                src={series.cover_url}
                alt={series.title}
                fill
                sizes="(max-width: 640px) 144px, 224px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col pt-2 sm:pt-8 lg:pt-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/30">
                {TYPE_LABELS[series.type]}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[series.status]}`}
              >
                {STATUS_LABELS[series.status]}
              </span>
              {series.year && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {series.year}
                </span>
              )}
            </div>

            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
              {series.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              {series.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {series.author}
                </span>
              )}
              {series.artist && (
                <span className="flex items-center gap-1.5">
                  <Palette className="h-4 w-4" />
                  {series.artist}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {series.rating.toFixed(1)}
              </span>
            </div>

            {series.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {series.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-lg bg-secondary/60 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {series.description && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {series.description}
              </p>
            )}

            {chapters.length > 0 && (
              <Link
                href={`/series/${series.slug}/chapter/${chapters[0].number}`}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105"
              >
                <Play className="h-4 w-4 fill-primary-foreground" />
                Start Reading
              </Link>
            )}
          </div>
        </div>

        {/* Chapter list */}
        <div className="mt-10 mb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              Chapters
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {chapters.length} total
              </span>
            </h2>
          </div>

          {chapters.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center text-muted-foreground">
              No chapters available yet.
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {[...chapters].reverse().map((ch, i) => (
                <Link
                  key={ch.id}
                  href={`/series/${series.slug}/chapter/${ch.number}`}
                  className="group flex items-center justify-between rounded-xl border border-border/50 bg-card/40 px-4 py-3 transition-all hover:border-primary/30 hover:bg-card/80"
                  style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/60 font-display text-sm font-bold text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                      {ch.number}
                    </span>
                    <div>
                      <p className="text-sm font-medium transition-colors group-hover:text-primary">
                        Chapter {ch.number}
                        {ch.title ? ` — ${ch.title}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ch.pages.length} pages
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
