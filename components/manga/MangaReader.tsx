'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Loader2,
} from 'lucide-react';
import type { Chapter } from '@/lib/supabase';

interface ReaderProps {
  pages: string[];
  chapter: Chapter;
  seriesSlug: string;
  seriesTitle: string;
  prevChapter: number | null;
  nextChapter: number | null;
  totalChapters: number;
}

export function MangaReader({
  pages,
  chapter,
  seriesSlug,
  seriesTitle,
  prevChapter,
  nextChapter,
  totalChapters,
}: ReaderProps) {
  const [showBar, setShowBar] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setScrollProgress(progress);
    setShowBar(scrollTop < 100 || scrollTop > docHeight - 200);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const markLoaded = (i: number) => {
    setLoadedImages((prev) => new Set(prev).add(i));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top bar */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
          showBar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="border-b border-border/60 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link
              href={`/series/${seriesSlug}`}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{seriesTitle}</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="text-center">
              <p className="text-sm font-semibold">Chapter {chapter.number}</p>
              {chapter.title && (
                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px] sm:max-w-md">
                  {chapter.title}
                </p>
              )}
            </div>
            <Link
              href={`/series/${seriesSlug}`}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Chapters</span>
            </Link>
          </div>
          {/* Progress bar */}
          <div className="h-0.5 w-full bg-border/40">
            <div
              className="h-full bg-primary transition-[width] duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pages */}
      <div className="mx-auto max-w-3xl pt-16">
        <div className="flex flex-col items-center">
          {pages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <p>This chapter has no pages.</p>
            </div>
          ) : (
            pages.map((url, i) => (
              <div
                key={i}
                className="relative w-full"
                style={{ aspectRatio: '3 / 4', minHeight: '400px' }}
              >
                {!loadedImages.has(i) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
                  </div>
                )}
                <Image
                  src={url}
                  alt={`Page ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                  onLoad={() => markLoaded(i)}
                />
                <span className="absolute bottom-2 right-2 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
                  {i + 1}/{pages.length}
                </span>
              </div>
            ))
          )}
        </div>

        {/* End of chapter nav */}
        <div className="mx-4 mt-8 rounded-2xl border border-border/60 bg-card/40 p-5">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            You&apos;ve reached the end of Chapter {chapter.number}
          </p>
          <div className="flex items-center justify-center gap-3">
            {prevChapter !== null ? (
              <Link
                href={`/series/${seriesSlug}/chapter/${prevChapter}`}
                className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/40 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 rounded-xl border border-border/40 px-4 py-2 text-sm text-muted-foreground/40">
                <ChevronLeft className="h-4 w-4" />
                Prev
              </span>
            )}
            <Link
              href={`/series/${seriesSlug}`}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/40 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              All Chapters
            </Link>
            {nextChapter !== null ? (
              <Link
                href={`/series/${seriesSlug}/chapter/${nextChapter}`}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 rounded-xl border border-border/40 px-4 py-2 text-sm text-muted-foreground/40">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating scroll-to-top */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 left-1/2 z-50 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-card border border-border/60 text-foreground shadow-lg transition-all hover:bg-secondary hover:scale-110 ${
          scrollProgress > 5 ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
