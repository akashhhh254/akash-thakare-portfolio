import { motion } from 'motion/react';
import { ArrowUpRight, Flame, Layers, Users } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Achievements() {
  const { data } = usePortfolio();

  return (
    <section
      id="achievements"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-xs font-mono tracking-wide text-[#808080] mb-2">
              05 · Competitive Collaboration
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
              Hackathons &amp; Achievements
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#808080] max-w-md leading-relaxed">
            Real-world problem solving, rapid prototyping, and teamwork across technical events—without unverified win claims.
          </p>
        </motion.div>

        {/* Highlight Banner for 10+ Hackathons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 pb-6 lg:pb-0 lg:pr-8">
            <p className="font-mono text-xs text-[#808080] mb-2">Verified Milestone</p>
            <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-white tabular-nums">
              10+ Hackathons
            </p>
            <p className="text-sm text-[#808080] mt-2">
              Participated across competitive technical events
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Users className="w-5 h-5 text-black dark:text-white" />
              <h3 className="font-display text-sm font-semibold text-black dark:text-white">
                Team Collaboration
              </h3>
              <p className="text-xs text-[#808080] leading-relaxed">
                Collaborated with engineering peers under tight event deadlines to ship functional ideas.
              </p>
            </div>
            <div className="space-y-2">
              <Layers className="w-5 h-5 text-black dark:text-white" />
              <h3 className="font-display text-sm font-semibold text-black dark:text-white">
                Practical Solutions
              </h3>
              <p className="text-xs text-[#808080] leading-relaxed">
                Developed technology solutions addressing real-world challenges across diverse domains.
              </p>
            </div>
            <div className="space-y-2">
              <Flame className="w-5 h-5 text-black dark:text-white" />
              <h3 className="font-display text-sm font-semibold text-black dark:text-white">
                Multi-Tool Execution
              </h3>
              <p className="text-xs text-[#808080] leading-relaxed">
                Worked on technical builds utilizing varied programming languages and developer tooling.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Individual Editable Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.achievements.map((ach, idx) => (
            <motion.article
              key={ach.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#808080] mb-2">
                  <span className="text-black dark:text-white font-medium">
                    {ach.achievementType}
                  </span>
                  {ach.date && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{ach.date}</span>
                    </>
                  )}
                </div>

                <h3 className="font-display text-xl font-semibold text-black dark:text-white mb-1">
                  {ach.title}
                </h3>

                <p className="text-xs font-medium text-[#808080] mb-3">
                  {ach.eventName}
                  {ach.organizer ? ` — ${ach.organizer}` : ''}
                </p>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {(ach.certificateOrEvidenceUrl || ach.attachmentUrl) && (
                <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-3">
                  {ach.certificateOrEvidenceUrl && (
                    <a
                      href={ach.certificateOrEvidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:underline underline-offset-4"
                    >
                      <span>View Evidence</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {ach.attachmentUrl && (
                    <a
                      href={ach.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:underline underline-offset-4"
                    >
                      <span>View Document</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
