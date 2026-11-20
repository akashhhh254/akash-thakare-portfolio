import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, Printer, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  const { data } = usePortfolio();
  const { profile, skills, experience, education, achievements, projects } = data;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleDownloadTxt = () => {
    const lines = [
      profile.fullName.toUpperCase(),
      `${profile.rolePrimary} · ${profile.roleSecondary}`,
      `${profile.college} · ${profile.location}`,
      '============================================================',
      `Mobile:   ${profile.mobile}`,
      `Email:    ${profile.email || 'Not configured yet'}`,
      `GitHub:   ${profile.githubUrl}`,
      `LinkedIn: ${profile.linkedinUrl}`,
      `Status:   ${profile.workStatus} (${profile.preferredWorkMode})`,
      '',
      'CAREER OBJECTIVE',
      '------------------------------------------------------------',
      profile.careerObjective,
      '',
      'SUMMARY',
      '------------------------------------------------------------',
      profile.resumeSummary,
      ...profile.resumeHighlights.map((h) => `* ${h}`),
      '',
      'EXPERIENCE',
      '------------------------------------------------------------',
      ...experience.map(
        (exp) =>
          `${exp.position} | ${exp.organization} (${exp.status})\n${exp.description}`
      ),
      '',
      'EDUCATION',
      '------------------------------------------------------------',
      ...education.map(
        (edu) =>
          `${edu.institution} — ${edu.course}${edu.degree ? ` (${edu.degree})` : ''}${
            edu.grades ? ` | Grades: ${edu.grades}` : ''
          }`
      ),
      '',
      'TECHNICAL SKILLS',
      '------------------------------------------------------------',
      ...skills.map((cat) => `${cat.title}: ${cat.skills.join(', ')}`),
      '',
      'FEATURED PROJECTS',
      '------------------------------------------------------------',
      ...projects
        .filter((p) => p.featured)
        .map((p) => `- ${p.title} (${p.techStack.join(', ')}): ${p.description}`),
      '',
      'HACKATHONS & ACHIEVEMENTS',
      '------------------------------------------------------------',
      ...achievements.map((a) => `- ${a.title}: ${a.description}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] text-black dark:text-white shadow-2xl overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-black">
              <div>
                <h2 id="resume-modal-title" className="font-display text-lg font-semibold">
                  Resume · {profile.fullName}
                </h2>
                <p className="text-xs text-[#808080]">
                  Synced directly from centralized portfolio data (editable in Admin)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume modal"
                  className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              id="printable-resume"
              className="p-6 sm:p-10 overflow-y-auto space-y-7 bg-white dark:bg-[#121212]"
            >
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <h3 className="font-display text-3xl font-bold tracking-tight">
                  {profile.fullName}
                </h3>
                <p className="text-sm font-medium mt-1">
                  {profile.rolePrimary} · {profile.roleSecondary}
                </p>
                <p className="text-xs text-[#808080] mt-1">
                  {profile.college} · {profile.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#808080]">
                  <span>{profile.mobile}</span>
                  {profile.email && (
                    <>
                      <span>·</span>
                      <span>{profile.email}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>github.com/{profile.githubUsername}</span>
                  <span>·</span>
                  <span>{profile.workStatus} ({profile.preferredWorkMode})</span>
                </div>
              </div>

              <div>
                <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2">
                  Career Objective
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {profile.careerObjective}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2.5">
                    Experience
                  </h4>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-3 text-sm">
                      <p className="font-semibold">{exp.position}</p>
                      <p className="text-xs text-[#808080]">
                        {exp.organization} · {exp.status}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2.5">
                    Education
                  </h4>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-3 text-sm">
                      <p className="font-semibold">{edu.institution}</p>
                      <p className="text-xs text-[#808080]">
                        {edu.course}
                        {edu.degree ? ` · ${edu.degree}` : ''}
                      </p>
                      {edu.grades && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Grades: {edu.grades}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2.5">
                  Technical Skills
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      <span className="font-semibold">{cat.title}: </span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {cat.skills.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2.5">
                  Featured Projects &amp; Hackathons
                </h4>
                <div className="space-y-2 text-xs">
                  {projects
                    .filter((p) => p.featured)
                    .map((p) => (
                      <p key={p.id}>
                        <span className="font-semibold">{p.title}</span> ({p.techStack.join(', ')}) —{' '}
                        <span className="text-neutral-600 dark:text-neutral-400">{p.description}</span>
                      </p>
                    ))}
                  {achievements.map((a) => (
                    <p key={a.id}>
                      <span className="font-semibold">{a.title}</span> —{' '}
                      <span className="text-neutral-600 dark:text-neutral-400">{a.description}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
