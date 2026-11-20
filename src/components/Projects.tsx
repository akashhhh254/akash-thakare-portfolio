import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Code2,
  Cpu,
  ExternalLink,
  FolderGit2,
  GitFork,
  Globe,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { GitHubRepo, ProjectCategory } from '../data/types';

type TabFilter = 'Featured Projects' | 'All Projects' | ProjectCategory;

const TABS: TabFilter[] = [
  'Featured Projects',
  'All Projects',
  'Web Development',
  'Software Development',
  'AI Projects',
  'Other Projects',
];

interface ResolvedProject {
  id: string;
  title: string;
  rawRepoName?: string;
  description: string;
  techStack: string[];
  category: ProjectCategory;
  featured: boolean;
  repoUrl: string;
  liveDemoUrl?: string;
  updatedAt: string | null;
  stars: number;
  forks: number;
  topics: string[];
  visualType: 'ai' | 'web' | 'software' | 'security';
  isFromApi: boolean;
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function formatDate(isoDate: string | null): string {
  if (!isoDate) return 'GitHub Repository';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return 'Updated recently';
  }
}

function inferCategory(repo: GitHubRepo): ProjectCategory {
  const hay = `${repo.name} ${repo.description || ''} ${repo.language || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  if (hay.includes('astra') || hay.includes('ai') || hay.includes('gemini') || hay.includes('ml')) {
    return 'AI Projects';
  }
  if (
    hay.includes('html') ||
    hay.includes('css') ||
    hay.includes('web') ||
    hay.includes('netflix') ||
    hay.includes('amazon') ||
    hay.includes('react') ||
    hay.includes('portfolio')
  ) {
    return 'Web Development';
  }
  if (
    hay.includes('game') ||
    hay.includes('python') ||
    hay.includes('kotlin') ||
    hay.includes('c++') ||
    hay.includes('javascript') ||
    hay.includes('app') ||
    hay.includes('tic') ||
    hay.includes('rock')
  ) {
    return 'Software Development';
  }
  return 'Other Projects';
}

function inferVisualType(category: ProjectCategory, title: string): ResolvedProject['visualType'] {
  const lower = title.toLowerCase();
  if (lower.includes('cyber') || lower.includes('security')) return 'security';
  if (category === 'AI Projects') return 'ai';
  if (category === 'Web Development') return 'web';
  return 'software';
}

function ProjectVisualIllustration({
  type,
  title,
  techStack,
}: {
  type: ResolvedProject['visualType'];
  title: string;
  techStack: string[];
}) {
  const Icon =
    type === 'ai'
      ? Sparkles
      : type === 'web'
      ? Globe
      : type === 'security'
      ? Shield
      : Cpu;

  return (
    <div className="relative h-44 w-full overflow-hidden bg-[#121212] border-b border-neutral-200 dark:border-neutral-800 flex flex-col justify-between p-5 select-none">
      {/* CSS Architectural Geometric Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Abstract Circuit Accent Ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 w-36 h-36 rounded-full border border-white/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 w-24 h-24 rounded-full border border-white/10"
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl border border-white/20 bg-black/70 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="font-mono text-[11px] text-neutral-400">
          {techStack[0] || 'Code'}
        </span>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-3">
        <p className="font-display text-base font-semibold text-white truncate">
          {title}
        </p>
        <Code2 className="w-4 h-4 text-neutral-500 shrink-0" />
      </div>
    </div>
  );
}

export default function Projects() {
  const { data } = usePortfolio();
  const { profile, projects: projectOverrides } = data;

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabFilter>('Featured Projects');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [readmeCache, setReadmeCache] = useState<Record<string, string>>({});
  const [readmeLoading, setReadmeLoading] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<ResolvedProject | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(
        `https://api.github.com/users/${profile.githubUsername}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const payload: GitHubRepo[] = await response.json();
      setRepos(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to GitHub API at the moment.'
      );
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [profile.githubUsername]);

  const fetchReadme = async (repoName: string) => {
    if (!repoName || readmeCache[repoName] !== undefined || readmeLoading[repoName]) return;

    setReadmeLoading((prev) => ({ ...prev, [repoName]: true }));
    try {
      const res = await fetch(
        `https://api.github.com/repos/${profile.githubUsername}/${encodeURIComponent(repoName)}/readme`,
        {
          headers: {
            Accept: 'application/vnd.github.raw+json',
          },
        }
      );
      if (!res.ok) {
        setReadmeCache((prev) => ({
          ...prev,
          [repoName]: 'No README.md found in this repository.',
        }));
      } else {
        const text = await res.text();
        setReadmeCache((prev) => ({
          ...prev,
          [repoName]: text.slice(0, 1800) || 'README.md is empty.',
        }));
      }
    } catch {
      setReadmeCache((prev) => ({
        ...prev,
        [repoName]: 'Could not fetch README content right now.',
      }));
    } finally {
      setReadmeLoading((prev) => ({ ...prev, [repoName]: false }));
    }
  };

  useEffect(() => {
    if (!selectedProject) return;
    if (selectedProject.rawRepoName) {
      fetchReadme(selectedProject.rawRepoName);
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  // Merge live GitHub API repositories with curated CMS overrides
  const resolvedProjects = useMemo<ResolvedProject[]>(() => {
    const usedRepoIds = new Set<number>();

    const curatedList: ResolvedProject[] = projectOverrides.map((override) => {
      const normalizedTokens = override.matchTokens.map(normalizeToken);
      const matched = repos.find((repo) => {
        if (usedRepoIds.has(repo.id)) return false;
        const normRepo = normalizeToken(repo.name);
        return normalizedTokens.some(
          (tok) => tok && (normRepo === tok || normRepo.includes(tok) || tok.includes(normRepo))
        );
      });

      if (matched) {
        usedRepoIds.add(matched.id);
        const tech = Array.from(
          new Set([
            ...(matched.language ? [matched.language] : []),
            ...override.techStack,
          ])
        );
        const verifiedDemo =
          override.liveDemoUrl?.trim() ||
          (matched.homepage && /^https?:\/\//i.test(matched.homepage.trim())
            ? matched.homepage.trim()
            : undefined);

        return {
          id: override.id,
          title: override.title,
          rawRepoName: matched.name,
          description: matched.description?.trim() || override.description,
          techStack: tech.length > 0 ? tech : ['Code'],
          category: override.category,
          featured: override.featured,
          repoUrl: override.repoUrl?.trim() || matched.html_url,
          liveDemoUrl: verifiedDemo,
          updatedAt: matched.updated_at,
          stars: matched.stargazers_count,
          forks: matched.forks_count,
          topics: matched.topics || [],
          visualType: override.visualType,
          isFromApi: true,
        };
      }

      return {
        id: override.id,
        title: override.title,
        description: override.description,
        techStack: override.techStack.length > 0 ? override.techStack : ['Code'],
        category: override.category,
        featured: override.featured,
        repoUrl:
          override.repoUrl?.trim() ||
          `${profile.githubUrl}?tab=repositories&q=${encodeURIComponent(
            override.title.split(' ')[0]
          )}`,
        liveDemoUrl: override.liveDemoUrl?.trim() || undefined,
        updatedAt: null,
        stars: 0,
        forks: 0,
        topics: [],
        visualType: override.visualType,
        isFromApi: false,
      };
    });

    const extraRepos: ResolvedProject[] = repos
      .filter((repo) => !usedRepoIds.has(repo.id))
      .map((repo) => {
        const category = inferCategory(repo);
        const stack = Array.from(
          new Set([
            ...(repo.language ? [repo.language] : []),
            ...(repo.topics || []).slice(0, 3),
          ])
        );

        const verifiedHomepage =
          repo.homepage && /^https?:\/\//i.test(repo.homepage.trim())
            ? repo.homepage.trim()
            : undefined;

        return {
          id: `gh-${repo.id}`,
          title: repo.name.replace(/[-_]+/g, ' '),
          rawRepoName: repo.name,
          description:
            repo.description?.trim() ||
            `Public GitHub repository (${repo.language || 'Source Code'}) maintained by ${profile.fullName}.`,
          techStack: stack.length > 0 ? stack : ['Code'],
          category,
          featured: false,
          repoUrl: repo.html_url,
          liveDemoUrl: verifiedHomepage,
          updatedAt: repo.updated_at,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics || [],
          visualType: inferVisualType(category, repo.name),
          isFromApi: true,
        };
      });

    return [...curatedList, ...extraRepos];
  }, [repos, projectOverrides, profile.githubUrl, profile.fullName]);

  const techFilters = useMemo(() => {
    const set = new Set<string>(['All']);
    resolvedProjects.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [resolvedProjects]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resolvedProjects.filter((proj) => {
      if (activeTab === 'Featured Projects' && !proj.featured) return false;
      if (
        activeTab !== 'Featured Projects' &&
        activeTab !== 'All Projects' &&
        proj.category !== activeTab
      ) {
        return false;
      }
      if (selectedTech !== 'All' && !proj.techStack.includes(selectedTech)) {
        return false;
      }
      if (q) {
        const hay = `${proj.title} ${proj.rawRepoName || ''} ${proj.description} ${proj.techStack.join(' ')} ${proj.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [resolvedProjects, activeTab, selectedTech, searchQuery]);

  const toggleExpandCard = (project: ResolvedProject) => {
    const next = !expandedCards[project.id];
    setExpandedCards((prev) => ({ ...prev, [project.id]: next }));
    if (next && project.rawRepoName) {
      fetchReadme(project.rawRepoName);
    }
  };

  return (
    <section
      id="projects"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-xs font-mono tracking-wide text-[#808080] mb-2">
              03 · Explore My Work
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
              GitHub Repositories &amp; Projects
            </h2>
          </div>

          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-sm font-medium text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>github.com/{profile.githubUsername}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Category Tabs & Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
              {TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-[#808080] hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full xl:w-72">
              <Search className="w-4 h-4 text-[#808080] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories..."
                aria-label="Search GitHub projects"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-[#808080] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Technology Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#808080] mr-1">Technology:</span>
            {techFilters.map((tech) => {
              const active = selectedTech === tech;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    active
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'bg-transparent text-[#808080] border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* API Error Graceful Fallback */}
        {apiError && (
          <div className="mb-8 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-black dark:text-white shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  GitHub API sync temporarily unavailable
                </p>
                <p className="text-xs text-[#808080] mt-0.5">
                  Displaying curated verified project entries. Visit GitHub directly to inspect all repositories.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={fetchRepos}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
              >
                <span>Open GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-neutral-200 dark:bg-neutral-900" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-12 text-center">
            <p className="font-display text-lg font-semibold text-black dark:text-white">
              No projects match these filters
            </p>
            <p className="text-sm text-[#808080] mt-1 mb-6">
              Try switching categories, clearing the technology filter, or resetting your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('All Projects');
                setSelectedTech('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium cursor-pointer"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const isExpanded = Boolean(expandedCards[project.id]);
              const readmeText = project.rawRepoName
                ? readmeCache[project.rawRepoName]
                : undefined;
              const isFetchingReadme = project.rawRepoName
                ? Boolean(readmeLoading[project.rawRepoName])
                : false;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.05, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-neutral-400 dark:hover:border-neutral-600"
                >
                  <div>
                    <ProjectVisualIllustration
                      type={project.visualType}
                      title={project.title}
                      techStack={project.techStack}
                    />

                    <div className="p-6">
                      {/* Zero-pill clean metadata */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#808080] mb-2 tabular-nums">
                        <span className="font-medium text-black dark:text-white">
                          {project.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{project.techStack.join(' / ')}</span>
                      </div>

                      <h3 className="font-display text-xl font-semibold text-black dark:text-white tracking-tight mb-2">
                        {project.title}
                      </h3>

                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Repo Telemetry Line when available from GitHub API */}
                      {project.isFromApi && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#808080] tabular-nums">
                          <span>Updated {formatDate(project.updatedAt)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3 h-3" /> {project.stars}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <GitFork className="w-3 h-3" /> {project.forks}
                          </span>
                        </div>
                      )}

                      {/* Inline Expandable Details + README Excerpt */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5 text-xs">
                              {project.rawRepoName && (
                                <p className="font-mono text-[#808080]">
                                  Repo: {profile.githubUsername}/{project.rawRepoName}
                                </p>
                              )}
                              {project.topics.length > 0 && (
                                <p className="text-[#808080]">
                                  Topics: {project.topics.join(' · ')}
                                </p>
                              )}
                              <div className="rounded-lg bg-[#F5F5F5] dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-3 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
                                {isFetchingReadme
                                  ? 'Loading README.md from GitHub...'
                                  : readmeText ||
                                    'Click "Inspect Modal" or visit GitHub to view repository source and documentation.'}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Card Footer Buttons */}
                  <div className="px-6 pb-6 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold whitespace-nowrap hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                      >
                        <span>View on GitHub</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      {/* Live Demo ONLY rendered when verified deployment URL exists */}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-black dark:text-white whitespace-nowrap hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleExpandCard(project)}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-[#808080] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="px-2.5 py-2 rounded-lg text-xs font-medium text-[#808080] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                      >
                        README
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Modal with Live GitHub README Viewer */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="repo-detail-title"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] text-black dark:text-white shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-[#F5F5F5] dark:bg-black">
                <div>
                  <p className="text-xs font-mono text-[#808080]">
                    {selectedProject.category} · {selectedProject.techStack.join(' / ')}
                  </p>
                  <h3 id="repo-detail-title" className="font-display text-xl font-bold">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close project detail modal"
                  className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:bg-neutral-200/60 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedProject.description}
                </p>

                {selectedProject.isFromApi && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#808080] tabular-nums">
                    <span>Updated {formatDate(selectedProject.updatedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedProject.stars} Stars</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedProject.forks} Forks</span>
                  </div>
                )}

                <div>
                  <h4 className="font-display text-sm font-semibold mb-2">
                    Repository README Preview
                  </h4>
                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-black p-4 font-mono text-xs text-neutral-700 dark:text-neutral-300 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedProject.rawRepoName
                      ? readmeLoading[selectedProject.rawRepoName]
                        ? 'Fetching README.md from GitHub API...'
                        : readmeCache[selectedProject.rawRepoName] || 'No README loaded.'
                      : 'Open the repository on GitHub to view full code and README documentation.'}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-[#F5F5F5] dark:bg-black">
                <div className="flex items-center gap-2">
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
                  >
                    <span>View on GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  {selectedProject.liveDemoUrl && (
                    <a
                      href={selectedProject.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#808080] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
