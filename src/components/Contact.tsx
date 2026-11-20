import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ContactProps {
  onOpenResume: () => void;
  onOpenAdminContact: () => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact({ onOpenResume, onOpenAdminContact }: ContactProps) {
  const { data } = usePortfolio();
  const { profile } = data;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [preparedMailto, setPreparedMailto] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const hasEmailConfigured = Boolean(profile.email && profile.email.trim().length > 0);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailPattern.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!subject.trim() || subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a subject (at least 3 characters).';
    }
    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const targetEmail = hasEmailConfigured ? profile.email.trim() : '';
    const bodyText = `Hello ${profile.fullName},\n\n${message.trim()}\n\n---\nFrom: ${fullName.trim()}\nEmail: ${email.trim()}`;
    const mailtoUrl = `mailto:${encodeURIComponent(
      targetEmail
    )}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(bodyText)}`;

    setPreparedMailto(mailtoUrl);
    if (hasEmailConfigured) {
      window.location.href = mailtoUrl;
    }
  };

  const handleCopyEmail = async () => {
    if (!hasEmailConfigured) return;
    try {
      await navigator.clipboard.writeText(profile.email.trim());
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleCopyDraft = async () => {
    const draft = `To: ${profile.email || '(Configure email in Portfolio Admin)'}\nSubject: ${subject.trim()}\n\n${message.trim()}\n\nFrom: ${fullName.trim()} (${email.trim()})`;
    try {
      await navigator.clipboard.writeText(draft);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-xs font-mono tracking-wide text-[#808080] mb-2">
            09 · Contact &amp; Availability
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
            Let&apos;s Connect
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Direct Details & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-7 sm:p-9 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl font-semibold text-black dark:text-white">
                  {profile.fullName}
                </h3>
                <p className="text-sm text-[#808080] mt-1">
                  {profile.workStatus} · {profile.preferredWorkMode}
                </p>
                <p className="inline-flex items-center gap-1.5 text-xs text-[#808080] mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </p>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800 text-sm">
                <div className="py-3.5 flex items-center justify-between gap-3">
                  <span className="text-[#808080]">Mobile</span>
                  <a
                    href={`tel:${profile.mobile.replace(/\s+/g, '')}`}
                    className="font-medium text-black dark:text-white hover:underline underline-offset-4 tabular-nums"
                  >
                    {profile.mobile}
                  </a>
                </div>

                <div className="py-3.5 flex items-center justify-between gap-3">
                  <span className="text-[#808080]">Email</span>
                  {hasEmailConfigured ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <a
                        href={`mailto:${profile.email}`}
                        className="font-medium text-black dark:text-white truncate hover:underline underline-offset-4"
                      >
                        {profile.email}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy email address"
                        className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-[#808080] hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenAdminContact}
                      className="text-xs font-mono text-[#808080] hover:text-black dark:hover:text-white underline underline-offset-4 cursor-pointer"
                    >
                      Add email in Admin
                    </button>
                  )}
                </div>

                <div className="py-3.5 flex items-center justify-between gap-3">
                  <span className="text-[#808080]">GitHub</span>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-black dark:text-white hover:underline underline-offset-4"
                  >
                    @{profile.githubUsername}
                  </a>
                </div>

                <div className="py-3.5 flex items-center justify-between gap-3">
                  <span className="text-[#808080]">LinkedIn</span>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-black dark:text-white hover:underline underline-offset-4"
                  >
                    Akash Thakare
                  </a>
                </div>
              </div>
            </div>

            {/* Required Quick Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {hasEmailConfigured ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAdminContact}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Set Email</span>
                  </button>
                )}

                <a
                  href={`tel:${profile.mobile.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone</span>
                </a>

                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              <button
                type="button"
                onClick={onOpenResume}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Validated Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-7 sm:p-9"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-fullName"
                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
                    }}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212] text-sm text-black dark:text-white placeholder:text-[#808080] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs font-medium text-black dark:text-white">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212] text-sm text-black dark:text-white placeholder:text-[#808080] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-black dark:text-white">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
                  }}
                  placeholder="Internship opportunity, security project, or collaboration"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212] text-sm text-black dark:text-white placeholder:text-[#808080] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs font-medium text-black dark:text-white">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                  }}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5] dark:bg-[#121212] text-sm text-black dark:text-white placeholder:text-[#808080] focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-y"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs font-medium text-black dark:text-white">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                <span className="text-xs text-[#808080]">
                  {hasEmailConfigured
                    ? 'Uses your default email client (no fake form submission)'
                    : 'Configure recipient email in Portfolio Admin or copy your draft below'}
                </span>
              </div>

              {preparedMailto && (
                <div className="mt-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#F5F5F5] dark:bg-[#121212] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-neutral-700 dark:text-neutral-300">
                    <p className="font-semibold text-black dark:text-white">
                      {hasEmailConfigured
                        ? 'Email draft prepared'
                        : 'Message validated — recipient email not configured yet'}
                    </p>
                    <p className="mt-0.5">
                      {hasEmailConfigured
                        ? 'If your mail application did not open, click Open Mail App or copy the formatted message.'
                        : 'Copy your message below or set your email address inside Portfolio Admin.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {hasEmailConfigured && (
                      <a
                        href={preparedMailto}
                        className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-medium whitespace-nowrap"
                      >
                        Open Mail App
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-black dark:text-white whitespace-nowrap cursor-pointer"
                    >
                      {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDraft ? 'Copied' : 'Copy Draft'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
