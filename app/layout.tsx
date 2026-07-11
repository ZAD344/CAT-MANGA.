import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { Cat } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  title: 'CAT-MANGA — Read Manga & Manhwa Online',
  description: 'A clean, fast reader for manga, manhwa, and manhua. Browse series, jump into chapters, and read with a smooth vertical viewer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <Cat className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                CAT<span className="text-primary">-</span>MANGA
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              >
                Browse
              </Link>
              <Link
                href="/admin"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/60 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Cat className="h-4 w-4 text-primary" />
              <span className="font-display font-semibold text-foreground">CAT-MANGA</span>
            </div>
            <p>A demo manga &amp; manhwa reader. Cover art from Pexels.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
