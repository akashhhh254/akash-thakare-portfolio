import type { ProfileData } from './types';

export const DEFAULT_PROFILE: ProfileData = {
  brandCode: 'AT',
  fullName: 'Akash Thakare',
  rolePrimary: 'Computer Engineering Student',
  roleSecondary: 'Cybersecurity Intern',
  college: 'Bapurao Deshmukh Engineering College, Sewagram',
  location: 'Wardha, Maharashtra, India',
  workStatus: 'Open to Work',
  preferredWorkMode: 'On-site | Hybrid',
  mobile: '+91 8830863787',
  // Editable field — leave empty or update via Admin CMS without inventing an email
  email: '',
  githubUrl: 'https://github.com/akashhhh254',
  githubUsername: 'akashhhh254',
  linkedinUrl: 'https://www.linkedin.com/in/akash-thakare-a5ab55392/',
  tagline: 'Exploring Technology. Building Solutions. Securing the Future.',
  careerObjective:
    'To contribute to impactful technology projects while growing professionally in cybersecurity and software engineering, with a focus on developing secure, scalable, and user-focused software solutions.',
  typingSequence: [
    'Cybersecurity Intern',
    'Software Development Enthusiast',
    'Web Development Enthusiast',
    'Computer Engineering Student',
    'Technology Explorer',
  ],
  socialLinks: [
    {
      id: 'social-github',
      label: 'GitHub',
      url: 'https://github.com/akashhhh254',
    },
    {
      id: 'social-linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/akash-thakare-a5ab55392/',
    },
  ],
  resumeSummary:
    'Computer Engineering student at Bapurao Deshmukh Engineering College, Sewagram and Cybersecurity Intern focused on building secure, scalable, and user-focused software solutions.',
  resumeHighlights: [
    'Currently participating in the Internzvalley Upskillment & Internship Program in Cybersecurity & Ethical Hacking',
    'Participated in 10+ hackathons collaborating with teams to build practical technology solutions',
    'Active GitHub builder across web applications, interactive browser tools, and Kotlin Android exploration',
  ],
  heroVisualImage: '/src/assets/images/cybersecurity_network_abstract_1795193276347.jpg',
  aboutVisualImage: '/src/assets/images/workspace_monochrome_minimal_1795191941695.jpg',
};
