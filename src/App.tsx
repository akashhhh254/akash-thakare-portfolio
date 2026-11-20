import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Education from './components/Education';
import CareerObjective from './components/CareerObjective';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';
import AdminModal, { type AdminModule } from './components/AdminModal';

const THEME_STORAGE_KEY = 'akash-portfolio-theme';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return 'dark';
  });

  const [resumeOpen, setResumeOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminModule>('profile');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const openAdminAt = (tab: AdminModule) => {
    setAdminTab(tab);
    setAdminOpen(true);
  };

  return (
    <PortfolioProvider>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-200 overflow-x-hidden">
          <Navbar
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          />

          <main>
            <Hero onOpenResume={() => setResumeOpen(true)} />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <Certifications onOpenAdminCertificates={() => openAdminAt('certificates')} />
            <Education />
            <CareerObjective />
            <Contact
              onOpenResume={() => setResumeOpen(true)}
              onOpenAdminContact={() => openAdminAt('contact')}
            />
          </main>

          <Footer onOpenAdmin={() => openAdminAt('profile')} />

          <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
          <AdminModal
            open={adminOpen}
            initialTab={adminTab}
            onClose={() => setAdminOpen(false)}
          />
        </div>
      </MotionConfig>
    </PortfolioProvider>
  );
}
