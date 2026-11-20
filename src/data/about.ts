import type { AboutData } from './types';

export const DEFAULT_ABOUT: AboutData = {
  heading: 'About Me',
  lead: 'Computer Engineering student and Cybersecurity Intern focused on practical building, team collaboration, and secure software engineering.',
  paragraphs: [
    'I am Akash Thakare, a Computer Engineering student at Bapurao Deshmukh Engineering College, Sewagram, and currently working as a Cybersecurity Intern.',
    'I am passionate about cybersecurity, software development, web development and emerging technologies.',
    'I have participated in 10+ hackathons and gained experience collaborating with teams to develop practical technology solutions for real-world challenges.',
    'I enjoy exploring new technologies, building projects, solving technical problems and continuously improving my development skills.',
    'My goal is to contribute to impactful technology projects while developing secure, scalable and user-focused software solutions.',
  ],
  pillars: [
    {
      id: 'pillar-security',
      label: 'Cybersecurity Focus',
      text: 'Building a strong foundation in ethical hacking principles, defensive thinking, and industry-relevant security practices.',
    },
    {
      id: 'pillar-engineering',
      label: 'Software & Web Craft',
      text: 'Practicing structured development across Python, C, C++, JavaScript, CSS, and mobile/web project workflows.',
    },
    {
      id: 'pillar-hackathons',
      label: '10+ Hackathons',
      text: 'Collaborating in fast-paced technical teams to turn ideas into working prototypes for real-world challenges.',
    },
    {
      id: 'pillar-growth',
      label: 'Continuous Growth',
      text: 'Actively expanding technical depth through GitHub projects, practical experimentation, and structured problem solving.',
    },
  ],
};
