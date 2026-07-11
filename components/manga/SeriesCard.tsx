import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, ArrowRight, Flame, TrendingUp } from 'lucide-react';
import type { Series } from '@/lib/supabase';
import { TYPE_LABELS, STATUS_LABELS, STATUS_STYLES } from '@/lib/data';

export function SeriesCard({ series, index = 0 }: { series: Series; index?: number }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className="group animate-fade-in-up relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {series.cover_url ? (
          <Image
            src={series.cover_url}
            alt={series.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/90 backdrop-blur-sm ring-1 ring-border/50">
          {TYPE_LABELS[series.type]}
        </span>
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm ring-1 ring-border/50">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {series.rating.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-display text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-primary">
          {series.title}
        </h3>
        <p className="text-xs text-muted-foreground">{series.author || 'Unknown'}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {series.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function FeaturedHero({ series }: { series: Series }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-border/60"
    >
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        {series.banner_url ? (
          <Image
            src={series.banner_url}
            alt={series.title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Flame className="h-4 w-4" />
          Featured
        </div>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold leading-tight text-balance sm:text-3xl lg:text-4xl">
          {series.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground line-clamp-2 sm:text-base">
          {series.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <BookOpen className="h-4 w-4" />
            Read Now
          </span>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {series.rating.toFixed(1)}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[series.status]}`}
          >
            {STATUS_LABELS[series.status]}
          </span>
        </div>
      </div>
    </Link>
  );
}
