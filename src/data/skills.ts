import type { SkillCategory } from './types';

export const DEFAULT_SKILLS: SkillCategory[] = [
  {
    id: 'cat-languages',
    title: 'Programming Languages',
    description: 'Core languages practiced across systems fundamentals, problem solving, and web interfaces.',
    skills: ['Python', 'C', 'C++', 'JavaScript', 'CSS'],
  },
  {
    id: 'cat-tools',
    title: 'Tools',
    description: 'Version control and collaborative repository workflows used in daily development.',
    skills: ['Git', 'GitHub'],
  },
  {
    id: 'cat-domains',
    title: 'Technical Domains',
    description: 'Primary engineering disciplines and areas of active study and practical implementation.',
    skills: ['Cybersecurity', 'Web Development', 'Software Development'],
  },
  {
    id: 'cat-professional',
    title: 'Professional Skills',
    description: 'Interpersonal and analytical habits strengthened across 10+ hackathons and team projects.',
    skills: ['Communication', 'Problem Solving', 'Team Collaboration', 'Analytical Thinking'],
  },
];
