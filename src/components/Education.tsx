import { motion } from 'motion/react';
import { GraduationCap, MapPin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Education() {
  const { data } = usePortfolio();

  return (
    <section
      id="education"
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
              07 · Academic Foundation
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
              Education
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#808080] max-w-md leading-relaxed">
            Verified institution and course details—academic dates, grades, and coursework can be updated anytime in Portfolio Admin.
          </p>
        </motion.div>

        <div className="space-y-6">
          {data.education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-7 sm:p-9"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212] flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-black dark:text-white">
                      {edu.institution}
                    </h3>
                    <p className="text-base font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                      {edu.course}
                      {edu.degree ? ` · ${edu.degree}` : ''}
                    </p>
                    {edu.location && (
                      <p className="inline-flex items-center gap-1.5 text-xs text-[#808080] mt-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{edu.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {(edu.academicYear || edu.startDate || edu.endDate) && (
                  <div className="text-xs font-mono text-[#808080] tabular-nums">
                    {edu.academicYear && <span>{edu.academicYear}</span>}
                    {edu.academicYear && (edu.startDate || edu.endDate) && <span> · </span>}
                    {(edu.startDate || edu.endDate) && (
                      <span>
                        {edu.startDate || 'Start'} — {edu.endDate || 'Present'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-sm">
                <div>
                  <p className="text-xs font-mono text-[#808080] mb-1">Grades / CGPA</p>
                  <p className="text-black dark:text-white font-medium">
                    {edu.grades || 'Editable in Admin'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono text-[#808080] mb-1">Relevant Coursework</p>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {edu.coursework.length > 0
                      ? edu.coursework.join(' · ')
                      : 'Computer Engineering core coursework (editable)'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono text-[#808080] mb-1">Academic Highlights</p>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {edu.achievements.length > 0
                      ? edu.achievements.join(' · ')
                      : 'Editable academic milestones'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
