import { getFeaturedSeries, getAllSeries } from '@/lib/data';
import { SeriesCard, FeaturedHero } from '@/components/manga/SeriesCard';
import { BrowseFilters } from '@/components/manga/BrowseFilters';
import { TrendingUp } from 'lucide-react';

export default async function HomePage() {
  const [featured, allSeries] = await Promise.all([getFeaturedSeries(), getAllSeries()]);

  const hero = featured[0];
  const featuredRest = featured.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {hero && (
        <section className="mb-8">
          <FeaturedHero series={hero} />
        </section>
      )}

      {featuredRest.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {featuredRest.map((s, i) => (
              <SeriesCard key={s.id} series={s} index={i} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-display text-xl font-bold">Browse All</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {allSeries.length} series
          </span>
        </div>
        <BrowseFilters series={allSeries} />
      </section>
    </div>
  );
}
