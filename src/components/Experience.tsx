import { motion } from 'motion/react';
import { ArrowUpRight, Shield } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Experience() {
  const { data } = usePortfolio();

  return (
    <section
      id="experience"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-900"
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
              04 · Practical Exposure
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
              Experience
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#808080] max-w-md leading-relaxed">
            Verified internship participation and hands-on technical learning milestones.
          </p>
        </motion.div>

        {data.experience.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212] p-10 text-center">
            <p className="font-display text-lg font-semibold text-black dark:text-white">
              No experience entries added yet
            </p>
            <p className="text-sm text-[#808080] mt-1">
              Add verified internship or work history through the Portfolio Admin editor.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-10 border-l border-neutral-300 dark:border-neutral-800 space-y-8">
            {data.experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="relative"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] sm:-left-[47px] top-8 w-3 h-3 rounded-full bg-black dark:bg-white ring-4 ring-white dark:ring-black"
                />

                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5]/60 dark:bg-[#121212] p-7 sm:p-9 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#808080] mb-1">
                          <span>{exp.status}</span>
                          <span aria-hidden="true">·</span>
                          <span>{exp.domain}</span>
                          {exp.duration && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{exp.duration}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-black dark:text-white">
                          {exp.position}
                        </h3>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                          {exp.organization}
                        </p>
                      </div>
                    </div>

                    {exp.certificateUrl && (
                      <a
                        href={exp.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-black dark:text-white hover:bg-white dark:hover:bg-black transition-colors self-start"
                      >
                        <span>Certificate</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    {exp.responsibilities.length > 0 && (
                      <div>
                        <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2">
                          Focus &amp; Responsibilities
                        </h4>
                        <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                          {exp.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span aria-hidden="true" className="text-[#808080]">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-4">
                      {exp.learningOutcomes.length > 0 && (
                        <div>
                          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2">
                            Learning Outcomes
                          </h4>
                          <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                            {exp.learningOutcomes.map((out, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span aria-hidden="true" className="text-[#808080]">—</span>
                                <span>{out}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies.length > 0 && (
                        <p className="text-xs font-mono text-[#808080]">
                          Domains / Tools: {exp.technologies.join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
