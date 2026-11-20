export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface ProfileData {
  brandCode: string;
  fullName: string;
  rolePrimary: string;
  roleSecondary: string;
  college: string;
  location: string;
  workStatus: string;
  preferredWorkMode: string;
  mobile: string;
  email: string;
  githubUrl: string;
  githubUsername: string;
  linkedinUrl: string;
  tagline: string;
  careerObjective: string;
  typingSequence: string[];
  socialLinks: SocialLink[];
  resumeSummary: string;
  resumeHighlights: string[];
  heroVisualImage: string;
  aboutVisualImage: string;
}

export interface AboutPillar {
  id: string;
  label: string;
  text: string;
}

export interface AboutData {
  heading: string;
  lead: string;
  paragraphs: string[];
  pillars: AboutPillar[];
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export type ProjectCategory =
  | 'Web Development'
  | 'Software Development'
  | 'AI Projects'
  | 'Other Projects';

export interface ProjectOverride {
  id: string;
  title: string;
  matchTokens: string[];
  description: string;
  techStack: string[];
  category: ProjectCategory;
  featured: boolean;
  repoUrl?: string;
  liveDemoUrl?: string;
  visualType: 'ai' | 'web' | 'software' | 'security';
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
  fork: boolean;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  program: string;
  position: string;
  domain: string;
  duration: string;
  status: 'Ongoing' | 'Completed';
  description: string;
  responsibilities: string[];
  technologies: string[];
  learningOutcomes: string[];
  certificateUrl?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  course: string;
  location: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  grades: string;
  achievements: string[];
  coursework: string[];
}

export interface CertificateEntry {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  verificationUrl: string;
  documentUrl: string;
  description: string;
  relatedSkill: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  eventName: string;
  organizer: string;
  date: string;
  description: string;
  achievementType: 'Hackathon' | 'Competition' | 'Collaboration' | 'Technical Event';
  certificateOrEvidenceUrl: string;
  attachmentUrl: string;
  highlighted?: boolean;
}

export interface PortfolioState {
  profile: ProfileData;
  about: AboutData;
  skills: SkillCategory[];
  projects: ProjectOverride[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certificates: CertificateEntry[];
  achievements: AchievementEntry[];
}
