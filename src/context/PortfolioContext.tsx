import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_ABOUT } from '../data/about';
import { DEFAULT_ACHIEVEMENTS } from '../data/achievements';
import { DEFAULT_CERTIFICATES } from '../data/certificates';
import { DEFAULT_EDUCATION } from '../data/education';
import { DEFAULT_EXPERIENCE } from '../data/experience';
import { DEFAULT_PROFILE } from '../data/profile';
import { DEFAULT_PROJECTS } from '../data/projects';
import { DEFAULT_SKILLS } from '../data/skills';
import type { PortfolioState } from '../data/types';

const STORAGE_KEY = 'akash-thakare-portfolio-cms-v1';

export const DEFAULT_PORTFOLIO_STATE: PortfolioState = {
  profile: DEFAULT_PROFILE,
  about: DEFAULT_ABOUT,
  skills: DEFAULT_SKILLS,
  projects: DEFAULT_PROJECTS,
  experience: DEFAULT_EXPERIENCE,
  education: DEFAULT_EDUCATION,
  certificates: DEFAULT_CERTIFICATES,
  achievements: DEFAULT_ACHIEVEMENTS,
};

interface PortfolioContextValue {
  data: PortfolioState;
  hasCustomEdits: boolean;
  updateSection: <K extends keyof PortfolioState>(key: K, value: PortfolioState[K]) => void;
  importPortfolioJson: (jsonString: string) => { ok: boolean; error?: string };
  exportPortfolioJson: () => string;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function loadInitialState(): { state: PortfolioState; hasCustom: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: DEFAULT_PORTFOLIO_STATE, hasCustom: false };
    const parsed = JSON.parse(raw) as Partial<PortfolioState>;
    return {
      state: {
        profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
        about: { ...DEFAULT_ABOUT, ...(parsed.about || {}) },
        skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_SKILLS,
        projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS,
        experience: Array.isArray(parsed.experience) ? parsed.experience : DEFAULT_EXPERIENCE,
        education: Array.isArray(parsed.education) ? parsed.education : DEFAULT_EDUCATION,
        certificates: Array.isArray(parsed.certificates)
          ? parsed.certificates
          : DEFAULT_CERTIFICATES,
        achievements: Array.isArray(parsed.achievements)
          ? parsed.achievements
          : DEFAULT_ACHIEVEMENTS,
      },
      hasCustom: true,
    };
  } catch {
    return { state: DEFAULT_PORTFOLIO_STATE, hasCustom: false };
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [{ state, hasCustom }, setWrapped] = useState(loadInitialState);

  useEffect(() => {
    if (!hasCustom) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors gracefully
    }
  }, [state, hasCustom]);

  const updateSection = <K extends keyof PortfolioState>(
    key: K,
    value: PortfolioState[K]
  ) => {
    setWrapped((prev) => ({
      hasCustom: true,
      state: {
        ...prev.state,
        [key]: value,
      },
    }));
  };

  const exportPortfolioJson = () => JSON.stringify(state, null, 2);

  const importPortfolioJson = (jsonString: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString) as Partial<PortfolioState>;
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'Invalid JSON structure.' };
      }

      const nextState: PortfolioState = {
        profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
        about: { ...DEFAULT_ABOUT, ...(parsed.about || {}) },
        skills: Array.isArray(parsed.skills) ? parsed.skills : state.skills,
        projects: Array.isArray(parsed.projects) ? parsed.projects : state.projects,
        experience: Array.isArray(parsed.experience) ? parsed.experience : state.experience,
        education: Array.isArray(parsed.education) ? parsed.education : state.education,
        certificates: Array.isArray(parsed.certificates)
          ? parsed.certificates
          : state.certificates,
        achievements: Array.isArray(parsed.achievements)
          ? parsed.achievements
          : state.achievements,
      };

      setWrapped({ state: nextState, hasCustom: true });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not parse JSON file. Please verify formatting.' };
    }
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setWrapped({ state: DEFAULT_PORTFOLIO_STATE, hasCustom: false });
  };

  return (
    <PortfolioContext.Provider
      value={{
        data: state,
        hasCustomEdits: hasCustom,
        updateSection,
        importPortfolioJson,
        exportPortfolioJson,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used inside PortfolioProvider');
  }
  return ctx;
}
