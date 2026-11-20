import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  Cpu,
  FileText,
  Lock,
  Mail,
  Network,
  Shield,
  Terminal,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  onOpenResume: () => void;
}

export default function Hero({ onOpenResume }: HeroProps) {
  const { data } = usePortfolio();
  const { profile } = data;
  const prefersReducedMotion = useReducedMotion();

  const [mousePos, setMousePos] = useState({ x: 55, y: 40 });
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(
    profile.typingSequence[0] || 'Cybersecurity Intern'
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sequence =
    profile.typingSequence.length > 0
      ? profile.typingSequence
      : ['Cybersecurity Intern'];

  useEffect(() => {
    setPhraseIndex(0);
    setDisplayedText(sequence[0]);
    setIsDeleting(false);
  }, [profile.typingSequence]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(sequence[0]);
      return;
    }

    const currentPhrase = sequence[phraseIndex % sequence.length];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedText === currentPhrase) {
      timeoutId = setTimeout(() => setIsDeleting(true), 1900);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % sequence.length);
    } else {
      const nextLength = displayedText.length + (isDeleting ? -1 : 1);
      const speed = isDeleting ? 30 : 54;
      timeoutId = setTimeout(() => {
        setDisplayedText(currentPhrase.slice(0, nextLength));
      }, speed);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, phraseIndex, prefersReducedMotion, sequence]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-900"
    >
      {/* Monochrome digital circuit grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(620px circle at ${mousePos.x}% ${mousePos.y}%, rgba(128,128,128,0.12), transparent 65%)`,
          }}
        />
      )}

      {/* Subtle geometric orbits */}
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
        transition={{ duration: 95, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -right-44 -top-44 w-[520px] h-[520px] rounded-full border border-neutral-200/70 dark:border-neutral-800/70"
      />
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { rotate: [360, 0] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -left-48 bottom-10 w-[380px] h-[380px] rounded-full border border-neutral-200/60 dark:border-neutral-900"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-stretch">
          {/* Left Column: Typography & Core Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Typographic Monogram + Open to Work Status (no pulsing dots) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#808080] mb-5"
            >
              <span className="font-semibold text-black dark:text-white tracking-wider">
                {profile.brandCode}
              </span>
              <span aria-hidden="true">/</span>
              <span className="text-black dark:text-white font-medium">{profile.workStatus}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.preferredWorkMode}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.location}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.04] text-balance mb-4"
            >
              {profile.fullName.toUpperCase()}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base sm:text-lg font-medium text-black dark:text-white mb-4"
            >
              <span>{profile.rolePrimary}</span>
              <span aria-hidden="true" className="text-[#808080]">·</span>
              <span>{profile.roleSecondary}</span>
            </motion.div>

            {/* Animated Typing Sequence */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[2rem] flex items-center mb-5"
            >
              <span className="inline-flex items-center gap-2 font-mono text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
                <Terminal className="w-4 h-4 shrink-0 text-[#808080]" />
                <span>{displayedText}</span>
                {!prefersReducedMotion && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-[2px] h-4 bg-black dark:bg-white animate-pulse"
                  />
                )}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#808080] leading-relaxed max-w-2xl mb-8"
            >
              &ldquo;{profile.tagline}&rdquo;
            </motion.p>

            {/* Primary CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5"
            >
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-black dark:text-white text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium whitespace-nowrap shrink-0 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Let&apos;s Connect</span>
              </button>
            </motion.div>

            {/* Verified Academic & Profile Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#808080]"
            >
              <span className="text-black dark:text-white font-medium">{profile.college}</span>
              <span aria-hidden="true">·</span>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                GitHub
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Right Column: Abstract Non-Human Cybersecurity Visual & Code Architecture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="relative w-full h-full min-h-[360px] sm:min-h-[430px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#121212] flex flex-col justify-between">
              {/* Abstract 3D Cybersecurity Wireframe Visual (Zero Human Imagery) */}
              {!imageError ? (
                <img
                  src={profile.heroVisualImage}
                  alt="Abstract monochrome geometric cybersecurity shield and digital network nodes"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
                  <Shield className="w-24 h-24 text-neutral-700" />
                </div>
              )}

              {/* Subtle Top Architectural Overlay */}
              <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between text-xs font-mono text-neutral-300 bg-gradient-to-b from-black/75 to-transparent">
                <span className="inline-flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>{profile.brandCode} · Security &amp; Engineering</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-neutral-400">
                  <Lock className="w-3 h-3" />
                  <span>Monochrome Architecture</span>
                </span>
              </div>

              {/* Bottom Scrim with Non-Human Technical Domain Indicators */}
              <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-3">
                <div className="grid grid-cols-3 gap-3 border-t border-white/15 pt-4 text-xs text-neutral-300">
                  <div className="space-y-1">
                    <Shield className="w-4 h-4 text-white" />
                    <p className="font-medium text-white">Cybersecurity</p>
                  </div>
                  <div className="space-y-1">
                    <Cpu className="w-4 h-4 text-white" />
                    <p className="font-medium text-white">Software Dev</p>
                  </div>
                  <div className="space-y-1">
                    <Network className="w-4 h-4 text-white" />
                    <p className="font-medium text-white">Web Systems</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 mt-10 flex justify-center"
      >
        <button
          type="button"
          onClick={() => scrollToSection('about')}
          aria-label="Scroll to About section"
          className="inline-flex flex-col items-center gap-1.5 text-xs font-medium text-[#808080] hover:text-black dark:hover:text-white transition-colors cursor-pointer py-2 px-4"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.span>
        </button>
      </motion.div>
    </section>
  );
}
