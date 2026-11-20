import type { ProjectOverride } from './types';

export const DEFAULT_PROJECTS: ProjectOverride[] = [
  {
    id: 'proj-astra-ai',
    title: 'ASTRA AI',
    matchTokens: ['astra', 'astraai', 'astra-ai'],
    description:
      'A Kotlin-based Android AI super application. Repository description highlights AI chat, image generation, video generation, PDF analysis, resume building, document scanning, and productivity tools.',
    techStack: ['Kotlin', 'Android'],
    category: 'AI Projects',
    featured: true,
    visualType: 'ai',
  },
  {
    id: 'proj-amazon-project',
    title: 'Amazon Project',
    matchTokens: ['amazon-project', 'amazon_project', 'amazonproject'],
    description:
      'Frontend web storefront project structured around e-commerce navigation, product catalog layouts, and responsive styling.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Web Development',
    featured: true,
    visualType: 'web',
  },
  {
    id: 'proj-netflix-clone',
    title: 'Netflix Clone',
    matchTokens: ['netflix', 'netflix-clone', 'netflix_clone', 'netflixclone'],
    description:
      'Streaming platform interface study replicating media browse grids, dark visual hierarchy, and responsive layout structure.',
    techStack: ['HTML', 'CSS'],
    category: 'Web Development',
    featured: true,
    visualType: 'web',
  },
  {
    id: 'proj-amazon-website',
    title: 'Amazon Website',
    matchTokens: ['amazon-website', 'amazon_website', 'amazonwebsite', 'amazon'],
    description:
      'Web layout project focused on structured marketplace UI components, navigation bars, and multi-section styling.',
    techStack: ['HTML', 'CSS'],
    category: 'Web Development',
    featured: true,
    visualType: 'web',
  },
  {
    id: 'proj-tic-tac-toe',
    title: 'Tic Tac Toe Game',
    matchTokens: ['tic-tac-toe', 'tictactoe', 'tic_tac_toe'],
    description:
      'Interactive browser game implementing turn management, win-pattern evaluation, draw detection, and board reset logic.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Software Development',
    featured: true,
    visualType: 'software',
  },
  {
    id: 'proj-rock-paper-scissors',
    title: 'Rock Paper Scissors',
    matchTokens: ['rock-paper-scissors', 'rock_paper_scissors', 'rockpaperscissors', 'rps'],
    description:
      'Interactive game built with randomized opponent selection, round outcome evaluation, and real-time score tracking.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Software Development',
    featured: true,
    visualType: 'software',
  },
];
