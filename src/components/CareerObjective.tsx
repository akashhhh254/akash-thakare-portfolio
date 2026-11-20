import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function CareerObjective() {
  const { data } = usePortfolio();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="objective"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-900 overflow-hidden"
    >
      {/* Subtle monochrome geometric background */}
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
        transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full border border-neutral-200/60 dark:border-neutral-900"
      />
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { rotate: [360, 0] }}
        transition={{ duration: 85, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-neutral-200/40 dark:border-neutral-800/40"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#808080]"
        >
          <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
          <span>08 · Career Objective</span>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-black dark:text-white leading-snug text-balance"
        >
          &ldquo;{data.profile.careerObjective}&rdquo;
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-xs font-mono text-[#808080]"
        >
          {data.profile.fullName} · {data.profile.tagline}
        </motion.p>
      </div>
    </section>
  );
}
