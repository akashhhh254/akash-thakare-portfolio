import { useState } from 'react';
import { motion } from 'motion/react';
import { Code2, Cpu, ShieldCheck, Terminal } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function About() {
  const { data } = usePortfolio();
  const { about, profile } = data;
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="about"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-xs font-mono tracking-wide text-[#808080] mb-2">
            01 · Identity &amp; Background
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
            {about.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Abstract Non-Human Developer Workspace & Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="relative flex-1 min-h-[280px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
              {!imageError ? (
                <img
                  src={profile.aboutVisualImage}
                  alt="Minimalist monochrome architectural workspace with laptop and notebook"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover grayscale"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <Terminal className="w-12 h-12 text-[#808080] mb-3" />
                  <p className="font-display text-lg font-semibold text-black dark:text-white">
                    {profile.brandCode} · {profile.fullName}
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6">
                <p className="text-sm font-semibold text-white">{profile.college}</p>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {profile.location} · {profile.preferredWorkMode}
                </p>
              </div>
            </div>

            {/* Abstract Code & Security Telemetry Card (No Human Graphics) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#808080]">
                <span>Engineering Focus</span>
                <span>{profile.brandCode}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212]">
                  <ShieldCheck className="w-4 h-4 text-black dark:text-white mb-2" />
                  <p className="font-medium text-black dark:text-white">Security</p>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212]">
                  <Code2 className="w-4 h-4 text-black dark:text-white mb-2" />
                  <p className="font-medium text-black dark:text-white">Web Dev</p>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212]">
                  <Cpu className="w-4 h-4 text-black dark:text-white mb-2" />
                  <p className="font-medium text-black dark:text-white">Systems</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative Introduction & Focus Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-7 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <p className="font-display text-xl sm:text-2xl font-medium text-black dark:text-white leading-snug mb-6 text-balance">
                {about.lead}
              </p>

              <div className="space-y-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              {about.pillars.map((pillar) => (
                <div key={pillar.id} className="space-y-1.5">
                  <h3 className="font-display text-sm font-semibold text-black dark:text-white">
                    {pillar.label}
                  </h3>
                  <p className="text-sm text-[#808080] leading-relaxed">{pillar.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
