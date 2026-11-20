import { motion } from 'motion/react';
import { Code2, Shield, Terminal, Users, Wrench } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

function getCategoryIcon(title: string) {
  const lower = title.toLowerCase();
  const cls = 'w-4 h-4 text-black dark:text-white';
  if (lower.includes('language')) return <Code2 className={cls} />;
  if (lower.includes('tool')) return <Wrench className={cls} />;
  if (lower.includes('domain') || lower.includes('security')) return <Shield className={cls} />;
  if (lower.includes('professional')) return <Users className={cls} />;
  return <Terminal className={cls} />;
}

export default function Skills() {
  const { data } = usePortfolio();

  return (
    <section
      id="skills"
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
              02 · Core Capabilities
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
              Technical Skills
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#808080] max-w-md leading-relaxed">
            Editable inventory of languages, tools, domains, and collaborative skills—presented cleanly without fabricated proficiency scores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.skills.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.45,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5]/60 dark:bg-[#121212] p-7 sm:p-8 transition-colors duration-200 hover:border-neutral-400 dark:hover:border-neutral-600"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center justify-center">
                  {getCategoryIcon(category.title)}
                </div>
                <h3 className="font-display text-xl font-semibold text-black dark:text-white">
                  {category.title}
                </h3>
              </div>

              <p className="text-sm text-[#808080] leading-relaxed mb-6">
                {category.description}
              </p>

              <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
                {category.skills.map((skill, sIdx) => (
                  <li
                    key={`${category.id}-${skill}-${sIdx}`}
                    className="py-3 flex items-center justify-between text-sm font-medium text-black dark:text-white transition-transform duration-150 hover:translate-x-1"
                  >
                    <span>{skill}</span>
                    <span className="font-mono text-xs text-[#808080] tabular-nums">
                      {String(sIdx + 1).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
