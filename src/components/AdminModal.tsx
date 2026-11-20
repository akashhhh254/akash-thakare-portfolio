import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Download,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type {
  AchievementEntry,
  CertificateEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectCategory,
  ProjectOverride,
} from '../data/types';

export type AdminModule =
  | 'profile'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'certificates'
  | 'achievements'
  | 'objective'
  | 'contact'
  | 'resume'
  | 'social';

const MODULES: { id: AdminModule; label: string }[] = [
  { id: 'profile', label: '1. Profile' },
  { id: 'about', label: '2. About Me' },
  { id: 'skills', label: '3. Skills' },
  { id: 'projects', label: '4. Projects' },
  { id: 'experience', label: '5. Experience' },
  { id: 'education', label: '6. Education' },
  { id: 'certificates', label: '7. Certificates' },
  { id: 'achievements', label: '8. Achievements' },
  { id: 'objective', label: '9. Objective' },
  { id: 'contact', label: '10. Contact' },
  { id: 'resume', label: '11. Resume' },
  { id: 'social', label: '12. Social Links' },
];

interface AdminModalProps {
  open: boolean;
  initialTab?: AdminModule;
  onClose: () => void;
}

export default function AdminModal({
  open,
  initialTab = 'profile',
  onClose,
}: AdminModalProps) {
  const {
    data,
    hasCustomEdits,
    updateSection,
    exportPortfolioJson,
    importPortfolioJson,
    resetToDefaults,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminModule>(initialTab);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [newSkillText, setNewSkillText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 2600);
  };

  const handleExportJson = () => {
    const json = exportPortfolioJson();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akash-thakare-portfolio-backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('Portfolio JSON exported.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importPortfolioJson(String(reader.result || ''));
      if (result.ok) {
        setImportError(null);
        notify('Portfolio JSON imported and applied.');
      } else {
        setImportError(result.error || 'Import failed.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUploadDataUrl = (
    file: File | undefined,
    onLoaded: (dataUrl: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-black text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white';

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-cms-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl h-[90vh] flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] text-black dark:text-white shadow-2xl overflow-hidden"
          >
            {/* Admin Top Bar */}
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-black flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="admin-cms-title" className="font-display text-lg font-bold">
                  Portfolio Content Manager (Admin / Edit Mode)
                </h2>
                <p className="text-xs text-[#808080]">
                  Edits save automatically to this browser&apos;s localStorage. Export JSON for portable backups.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium hover:bg-white dark:hover:bg-[#121212] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium hover:bg-white dark:hover:bg-[#121212] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                {hasCustomEdits && (
                  <button
                    type="button"
                    onClick={() => {
                      resetToDefaults();
                      notify('Restored default portfolio data.');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium hover:bg-white dark:hover:bg-[#121212] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Admin Editor"
                  className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="px-5 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] flex flex-wrap items-center justify-between gap-2 text-xs text-[#808080]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>
                  Local browser storage mode (not server authentication). Do not store private secrets here. Never upload human photographs.
                </span>
              </span>
              {statusMessage && (
                <span className="inline-flex items-center gap-1 text-black dark:text-white font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {statusMessage}
                </span>
              )}
              {importError && (
                <span className="text-black dark:text-white font-semibold">{importError}</span>
              )}
            </div>

            {/* Sidebar + Editor Canvas */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <aside className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5]/60 dark:bg-black p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1">
                {MODULES.map((mod) => {
                  const active = activeTab === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setActiveTab(mod.id)}
                      className={`px-3 py-2 rounded-lg text-left text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-[#808080] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {mod.label}
                    </button>
                  );
                })}
              </aside>

              <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6">
                {/* 1. PROFILE */}
                {activeTab === 'profile' && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="font-display text-xl font-semibold">Edit Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Brand Monogram</label>
                        <input
                          className={inputCls}
                          value={data.profile.brandCode}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, brandCode: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Full Name</label>
                        <input
                          className={inputCls}
                          value={data.profile.fullName}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, fullName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Primary Role</label>
                        <input
                          className={inputCls}
                          value={data.profile.rolePrimary}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, rolePrimary: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Secondary Role</label>
                        <input
                          className={inputCls}
                          value={data.profile.roleSecondary}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, roleSecondary: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">College</label>
                        <input
                          className={inputCls}
                          value={data.profile.college}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, college: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Location</label>
                        <input
                          className={inputCls}
                          value={data.profile.location}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, location: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Work Status</label>
                        <input
                          className={inputCls}
                          value={data.profile.workStatus}
                          onChange={(e) =>
                            updateSection('profile', { ...data.profile, workStatus: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#808080] mb-1">Preferred Work Mode</label>
                        <input
                          className={inputCls}
                          value={data.profile.preferredWorkMode}
                          onChange={(e) =>
                            updateSection('profile', {
                              ...data.profile,
                              preferredWorkMode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#808080] mb-1">Tagline</label>
                      <input
                        className={inputCls}
                        value={data.profile.tagline}
                        onChange={(e) =>
                          updateSection('profile', { ...data.profile, tagline: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#808080] mb-1">
                        Hero Typing Sequence (one phrase per line)
                      </label>
                      <textarea
                        rows={4}
                        className={inputCls}
                        value={data.profile.typingSequence.join('\n')}
                        onChange={(e) =>
                          updateSection('profile', {
                            ...data.profile,
                            typingSequence: e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* 2. ABOUT ME */}
                {activeTab === 'about' && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="font-display text-xl font-semibold">Edit About Me</h3>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">Heading</label>
                      <input
                        className={inputCls}
                        value={data.about.heading}
                        onChange={(e) =>
                          updateSection('about', { ...data.about, heading: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">Lead Summary</label>
                      <textarea
                        rows={2}
                        className={inputCls}
                        value={data.about.lead}
                        onChange={(e) =>
                          updateSection('about', { ...data.about, lead: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">
                        Introduction Paragraphs (separate paragraphs by blank line)
                      </label>
                      <textarea
                        rows={8}
                        className={inputCls}
                        value={data.about.paragraphs.join('\n\n')}
                        onChange={(e) =>
                          updateSection('about', {
                            ...data.about,
                            paragraphs: e.target.value
                              .split(/\n\s*\n/)
                              .map((p) => p.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* 3. SKILLS */}
                {activeTab === 'skills' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Manage Skills</h3>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection('skills', [
                            ...data.skills,
                            {
                              id: `cat-${Date.now()}`,
                              title: 'New Skill Category',
                              description: 'Describe this skill group.',
                              skills: ['New Skill'],
                            },
                          ])
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </div>

                    {data.skills.map((cat, cIdx) => (
                      <div
                        key={cat.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            className={inputCls}
                            value={cat.title}
                            onChange={(e) => {
                              const next = [...data.skills];
                              next[cIdx] = { ...cat, title: e.target.value };
                              updateSection('skills', next);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(
                                'skills',
                                data.skills.filter((s) => s.id !== cat.id)
                              )
                            }
                            aria-label="Delete skill category"
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          className={inputCls}
                          value={cat.description}
                          onChange={(e) => {
                            const next = [...data.skills];
                            next[cIdx] = { ...cat, description: e.target.value };
                            updateSection('skills', next);
                          }}
                        />

                        <div className="flex flex-wrap gap-2 pt-1">
                          {cat.skills.map((skill, sIdx) => (
                            <span
                              key={`${cat.id}-${sIdx}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                aria-label={`Remove ${skill}`}
                                onClick={() => {
                                  const next = [...data.skills];
                                  next[cIdx] = {
                                    ...cat,
                                    skills: cat.skills.filter((_, i) => i !== sIdx),
                                  };
                                  updateSection('skills', next);
                                }}
                                className="text-[#808080] hover:text-black dark:hover:text-white cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            className={inputCls}
                            placeholder="Add new skill..."
                            value={newSkillText[cat.id] || ''}
                            onChange={(e) =>
                              setNewSkillText((p) => ({ ...p, [cat.id]: e.target.value }))
                            }
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = (newSkillText[cat.id] || '').trim();
                              if (!val) return;
                              const next = [...data.skills];
                              next[cIdx] = { ...cat, skills: [...cat.skills, val] };
                              updateSection('skills', next);
                              setNewSkillText((p) => ({ ...p, [cat.id]: '' }));
                            }}
                            className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shrink-0 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. PROJECTS */}
                {activeTab === 'projects' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Manage Curated Projects</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const entry: ProjectOverride = {
                            id: `proj-${Date.now()}`,
                            title: 'New Project',
                            matchTokens: [],
                            description: 'Verified project description.',
                            techStack: ['JavaScript'],
                            category: 'Software Development',
                            featured: true,
                            repoUrl: data.profile.githubUrl,
                            liveDemoUrl: '',
                            visualType: 'software',
                          };
                          updateSection('projects', [entry, ...data.projects]);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    {data.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            className={inputCls}
                            value={proj.title}
                            placeholder="Project Title"
                            onChange={(e) => {
                              const next = [...data.projects];
                              next[idx] = { ...proj, title: e.target.value };
                              updateSection('projects', next);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(
                                'projects',
                                data.projects.filter((p) => p.id !== proj.id)
                              )
                            }
                            aria-label="Delete project"
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          className={inputCls}
                          value={proj.description}
                          placeholder="Project description"
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[idx] = { ...proj, description: e.target.value };
                            updateSection('projects', next);
                          }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <select
                            className={inputCls}
                            value={proj.category}
                            onChange={(e) => {
                              const next = [...data.projects];
                              next[idx] = {
                                ...proj,
                                category: e.target.value as ProjectCategory,
                              };
                              updateSection('projects', next);
                            }}
                          >
                            <option value="Web Development">Web Development</option>
                            <option value="Software Development">Software Development</option>
                            <option value="AI Projects">AI Projects</option>
                            <option value="Other Projects">Other Projects</option>
                          </select>

                          <input
                            className={inputCls}
                            placeholder="Tech stack (comma separated)"
                            value={proj.techStack.join(', ')}
                            onChange={(e) => {
                              const next = [...data.projects];
                              next[idx] = {
                                ...proj,
                                techStack: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              };
                              updateSection('projects', next);
                            }}
                          />

                          <label className="flex items-center gap-2 text-xs font-medium px-2">
                            <input
                              type="checkbox"
                              checked={proj.featured}
                              onChange={(e) => {
                                const next = [...data.projects];
                                next[idx] = { ...proj, featured: e.target.checked };
                                updateSection('projects', next);
                              }}
                            />
                            <span>Featured Project</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            className={inputCls}
                            placeholder="GitHub Repository URL (optional override)"
                            value={proj.repoUrl || ''}
                            onChange={(e) => {
                              const next = [...data.projects];
                              next[idx] = { ...proj, repoUrl: e.target.value };
                              updateSection('projects', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Verified Live Demo URL (leave blank if none)"
                            value={proj.liveDemoUrl || ''}
                            onChange={(e) => {
                              const next = [...data.projects];
                              next[idx] = { ...proj, liveDemoUrl: e.target.value };
                              updateSection('projects', next);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. EXPERIENCE */}
                {activeTab === 'experience' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Manage Experience</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const nextExp: ExperienceEntry = {
                            id: `exp-${Date.now()}`,
                            organization: 'Organization Name',
                            program: 'Program / Team',
                            position: 'Role Title',
                            domain: 'Domain',
                            duration: '',
                            status: 'Ongoing',
                            description: 'Role description.',
                            responsibilities: [],
                            technologies: [],
                            learningOutcomes: [],
                            certificateUrl: '',
                          };
                          updateSection('experience', [...data.experience, nextExp]);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Experience</span>
                      </button>
                    </div>

                    {data.experience.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            className={inputCls}
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = { ...exp, position: e.target.value };
                              updateSection('experience', next);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(
                                'experience',
                                data.experience.filter((x) => x.id !== exp.id)
                              )
                            }
                            aria-label="Delete experience"
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            className={inputCls}
                            placeholder="Organization / Program"
                            value={exp.organization}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = { ...exp, organization: e.target.value };
                              updateSection('experience', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Duration"
                            value={exp.duration}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = { ...exp, duration: e.target.value };
                              updateSection('experience', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Domain"
                            value={exp.domain}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = { ...exp, domain: e.target.value };
                              updateSection('experience', next);
                            }}
                          />
                          <select
                            className={inputCls}
                            value={exp.status}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = {
                                ...exp,
                                status: e.target.value as 'Ongoing' | 'Completed',
                              };
                              updateSection('experience', next);
                            }}
                          >
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <textarea
                          rows={3}
                          className={inputCls}
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[idx] = { ...exp, description: e.target.value };
                            updateSection('experience', next);
                          }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            className={inputCls}
                            placeholder="Technologies (comma separated)"
                            value={exp.technologies.join(', ')}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = {
                                ...exp,
                                technologies: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              };
                              updateSection('experience', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Certificate URL"
                            value={exp.certificateUrl || ''}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[idx] = { ...exp, certificateUrl: e.target.value };
                              updateSection('experience', next);
                            }}
                          />
                        </div>

                        <textarea
                          rows={2}
                          className={inputCls}
                          placeholder="Responsibilities (one per line)"
                          value={exp.responsibilities.join('\n')}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[idx] = {
                              ...exp,
                              responsibilities: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            updateSection('experience', next);
                          }}
                        />

                        <textarea
                          rows={2}
                          className={inputCls}
                          placeholder="Learning outcomes (one per line)"
                          value={exp.learningOutcomes.join('\n')}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[idx] = {
                              ...exp,
                              learningOutcomes: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            updateSection('experience', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. EDUCATION */}
                {activeTab === 'education' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Manage Education</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const entry: EducationEntry = {
                            id: `edu-${Date.now()}`,
                            institution: 'Institution Name',
                            degree: '',
                            course: 'Course / Stream',
                            location: '',
                            academicYear: '',
                            startDate: '',
                            endDate: '',
                            grades: '',
                            achievements: [],
                            coursework: [],
                          };
                          updateSection('education', [...data.education, entry]);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Education</span>
                      </button>
                    </div>

                    {data.education.map((edu, idx) => (
                      <div
                        key={edu.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            className={inputCls}
                            placeholder="College / Institution"
                            value={edu.institution}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, institution: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(
                                'education',
                                data.education.filter((x) => x.id !== edu.id)
                              )
                            }
                            aria-label="Delete education entry"
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            className={inputCls}
                            placeholder="Course (e.g. Computer Engineering)"
                            value={edu.course}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, course: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Degree (e.g. B.Tech / B.E.)"
                            value={edu.degree}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, degree: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Academic Year (e.g. Third Year)"
                            value={edu.academicYear}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, academicYear: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Grades / CGPA"
                            value={edu.grades}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, grades: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, startDate: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, endDate: e.target.value };
                              updateSection('education', next);
                            }}
                          />
                        </div>

                        <input
                          className={inputCls}
                          placeholder="Relevant coursework (comma separated)"
                          value={edu.coursework.join(', ')}
                          onChange={(e) => {
                            const next = [...data.education];
                            next[idx] = {
                              ...edu,
                              coursework: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            updateSection('education', next);
                          }}
                        />

                        <input
                          className={inputCls}
                          placeholder="Academic achievements (comma separated)"
                          value={edu.achievements.join(', ')}
                          onChange={(e) => {
                            const next = [...data.education];
                            next[idx] = {
                              ...edu,
                              achievements: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            updateSection('education', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. CERTIFICATES */}
                {activeTab === 'certificates' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Manage Certificates</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const cert: CertificateEntry = {
                            id: `cert-${Date.now()}`,
                            title: 'Certificate Title',
                            issuer: 'Issuing Organization',
                            issueDate: '',
                            credentialId: '',
                            verificationUrl: '',
                            documentUrl: '',
                            description: '',
                            relatedSkill: '',
                          };
                          updateSection('certificates', [cert, ...data.certificates]);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certificate</span>
                      </button>
                    </div>

                    {data.certificates.length === 0 ? (
                      <p className="text-sm text-[#808080]">
                        No certificates added yet. Click &ldquo;Add Certificate&rdquo; to attach a verified certificate. Avoid uploading documents containing human photographs.
                      </p>
                    ) : (
                      data.certificates.map((cert, idx) => (
                        <div
                          key={cert.id}
                          className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <input
                              className={inputCls}
                              placeholder="Certificate Title"
                              value={cert.title}
                              onChange={(e) => {
                                const next = [...data.certificates];
                                next[idx] = { ...cert, title: e.target.value };
                                updateSection('certificates', next);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateSection(
                                  'certificates',
                                  data.certificates.filter((c) => c.id !== cert.id)
                                )
                              }
                              aria-label="Delete certificate"
                              className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              className={inputCls}
                              placeholder="Issuing Organization"
                              value={cert.issuer}
                              onChange={(e) => {
                                const next = [...data.certificates];
                                next[idx] = { ...cert, issuer: e.target.value };
                                updateSection('certificates', next);
                              }}
                            />
                            <input
                              className={inputCls}
                              placeholder="Issue Date"
                              value={cert.issueDate}
                              onChange={(e) => {
                                const next = [...data.certificates];
                                next[idx] = { ...cert, issueDate: e.target.value };
                                updateSection('certificates', next);
                              }}
                            />
                            <input
                              className={inputCls}
                              placeholder="Credential ID"
                              value={cert.credentialId}
                              onChange={(e) => {
                                const next = [...data.certificates];
                                next[idx] = { ...cert, credentialId: e.target.value };
                                updateSection('certificates', next);
                              }}
                            />
                            <input
                              className={inputCls}
                              placeholder="Related Skill"
                              value={cert.relatedSkill}
                              onChange={(e) => {
                                const next = [...data.certificates];
                                next[idx] = { ...cert, relatedSkill: e.target.value };
                                updateSection('certificates', next);
                              }}
                            />
                          </div>

                          <input
                            className={inputCls}
                            placeholder="Verification URL"
                            value={cert.verificationUrl}
                            onChange={(e) => {
                              const next = [...data.certificates];
                              next[idx] = { ...cert, verificationUrl: e.target.value };
                              updateSection('certificates', next);
                            }}
                          />

                          <textarea
                            rows={2}
                            className={inputCls}
                            placeholder="Description"
                            value={cert.description}
                            onChange={(e) => {
                              const next = [...data.certificates];
                              next[idx] = { ...cert, description: e.target.value };
                              updateSection('certificates', next);
                            }}
                          />

                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Document / Image (No Human Photos)</span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) =>
                                  handleUploadDataUrl(e.target.files?.[0], (url) => {
                                    const next = [...data.certificates];
                                    next[idx] = { ...cert, documentUrl: url };
                                    updateSection('certificates', next);
                                  })
                                }
                              />
                            </label>
                            {cert.documentUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = [...data.certificates];
                                  next[idx] = { ...cert, documentUrl: '' };
                                  updateSection('certificates', next);
                                }}
                                className="text-xs text-[#808080] hover:text-black dark:hover:text-white cursor-pointer"
                              >
                                Remove Attachment
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 8. ACHIEVEMENTS */}
                {activeTab === 'achievements' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Manage Achievements</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const item: AchievementEntry = {
                            id: `ach-${Date.now()}`,
                            title: 'New Achievement',
                            eventName: 'Event Name',
                            organizer: 'Organizer',
                            date: '',
                            description: 'Describe your verified contribution or participation.',
                            achievementType: 'Hackathon',
                            certificateOrEvidenceUrl: '',
                            attachmentUrl: '',
                          };
                          updateSection('achievements', [...data.achievements, item]);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Achievement</span>
                      </button>
                    </div>

                    {data.achievements.map((ach, idx) => (
                      <div
                        key={ach.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            className={inputCls}
                            placeholder="Achievement Title"
                            value={ach.title}
                            onChange={(e) => {
                              const next = [...data.achievements];
                              next[idx] = { ...ach, title: e.target.value };
                              updateSection('achievements', next);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(
                                'achievements',
                                data.achievements.filter((a) => a.id !== ach.id)
                              )
                            }
                            aria-label="Delete achievement"
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            className={inputCls}
                            placeholder="Event Name"
                            value={ach.eventName}
                            onChange={(e) => {
                              const next = [...data.achievements];
                              next[idx] = { ...ach, eventName: e.target.value };
                              updateSection('achievements', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Organizer"
                            value={ach.organizer}
                            onChange={(e) => {
                              const next = [...data.achievements];
                              next[idx] = { ...ach, organizer: e.target.value };
                              updateSection('achievements', next);
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Date"
                            value={ach.date}
                            onChange={(e) => {
                              const next = [...data.achievements];
                              next[idx] = { ...ach, date: e.target.value };
                              updateSection('achievements', next);
                            }}
                          />
                          <select
                            className={inputCls}
                            value={ach.achievementType}
                            onChange={(e) => {
                              const next = [...data.achievements];
                              next[idx] = {
                                ...ach,
                                achievementType: e.target.value as AchievementEntry['achievementType'],
                              };
                              updateSection('achievements', next);
                            }}
                          >
                            <option value="Hackathon">Hackathon</option>
                            <option value="Competition">Competition</option>
                            <option value="Collaboration">Collaboration</option>
                            <option value="Technical Event">Technical Event</option>
                          </select>
                        </div>

                        <textarea
                          rows={2}
                          className={inputCls}
                          placeholder="Description"
                          value={ach.description}
                          onChange={(e) => {
                            const next = [...data.achievements];
                            next[idx] = { ...ach, description: e.target.value };
                            updateSection('achievements', next);
                          }}
                        />

                        <input
                          className={inputCls}
                          placeholder="Certificate or Evidence URL"
                          value={ach.certificateOrEvidenceUrl}
                          onChange={(e) => {
                            const next = [...data.achievements];
                            next[idx] = { ...ach, certificateOrEvidenceUrl: e.target.value };
                            updateSection('achievements', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 9. CAREER OBJECTIVE */}
                {activeTab === 'objective' && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="font-display text-xl font-semibold">Edit Career Objective</h3>
                    <textarea
                      rows={5}
                      className={inputCls}
                      value={data.profile.careerObjective}
                      onChange={(e) =>
                        updateSection('profile', {
                          ...data.profile,
                          careerObjective: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {/* 10. CONTACT */}
                {activeTab === 'contact' && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="font-display text-xl font-semibold">Edit Contact Information</h3>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">
                        Email Address (left blank by default — do not invent)
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        placeholder="Enter your verified email address"
                        value={data.profile.email}
                        onChange={(e) =>
                          updateSection('profile', { ...data.profile, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">Mobile Number</label>
                      <input
                        className={inputCls}
                        value={data.profile.mobile}
                        onChange={(e) =>
                          updateSection('profile', { ...data.profile, mobile: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* 11. RESUME */}
                {activeTab === 'resume' && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="font-display text-xl font-semibold">Edit Resume Content</h3>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">Resume Summary</label>
                      <textarea
                        rows={3}
                        className={inputCls}
                        value={data.profile.resumeSummary}
                        onChange={(e) =>
                          updateSection('profile', {
                            ...data.profile,
                            resumeSummary: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">
                        Resume Highlights (one per line)
                      </label>
                      <textarea
                        rows={4}
                        className={inputCls}
                        value={data.profile.resumeHighlights.join('\n')}
                        onChange={(e) =>
                          updateSection('profile', {
                            ...data.profile,
                            resumeHighlights: e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* 12. SOCIAL LINKS */}
                {activeTab === 'social' && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="font-display text-xl font-semibold">Manage Social Links</h3>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">GitHub Username</label>
                      <input
                        className={inputCls}
                        value={data.profile.githubUsername}
                        onChange={(e) =>
                          updateSection('profile', {
                            ...data.profile,
                            githubUsername: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">GitHub URL</label>
                      <input
                        className={inputCls}
                        value={data.profile.githubUrl}
                        onChange={(e) =>
                          updateSection('profile', { ...data.profile, githubUrl: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#808080] mb-1">LinkedIn URL</label>
                      <input
                        className={inputCls}
                        value={data.profile.linkedinUrl}
                        onChange={(e) =>
                          updateSection('profile', {
                            ...data.profile,
                            linkedinUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
