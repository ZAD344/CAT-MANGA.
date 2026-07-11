import { notFound } from 'next/navigation';
import { getSeriesBySlug, getChaptersBySeries } from '@/lib/data';
import { MangaReader } from '@/components/manga/MangaReader';

export default async function ChapterPage({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const series = await getSeriesBySlug(params.slug);
  if (!series) notFound();

  const chapters = await getChaptersBySeries(series.id);
  const chapterNumber = parseInt(params.chapter, 10);
  const chapter = chapters.find((c) => c.number === chapterNumber);

  if (!chapter) notFound();

  const sorted = [...chapters].sort((a, b) => a.number - b.number);
  const currentIndex = sorted.findIndex((c) => c.number === chapterNumber);
  const prevChapter = currentIndex > 0 ? sorted[currentIndex - 1].number : null;
  const nextChapter =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1].number : null;

  return (
    <MangaReader
      pages={chapter.pages}
      chapter={chapter}
      seriesSlug={series.slug}
      seriesTitle={series.title}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      totalChapters={sorted.length}
    />
  );
}
