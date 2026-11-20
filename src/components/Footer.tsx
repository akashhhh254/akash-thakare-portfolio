import { ArrowUp, SlidersHorizontal } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const { data } = usePortfolio();
  const { profile } = data;
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">
            {profile.fullName.toUpperCase()}
          </p>
          <p className="text-xs sm:text-sm text-[#808080] mt-1">
            &ldquo;{profile.tagline}&rdquo;
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#808080]">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span aria-hidden="true">|</span>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <span aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#808080]">
        <p className="tabular-nums">
          &copy; {currentYear} {profile.fullName}. All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-[#808080] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Portfolio Admin</span>
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 text-[#808080] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
