import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Award, Eye, EyeOff, FileCheck2, Plus } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface CertificationsProps {
  onOpenAdminCertificates: () => void;
}

export default function Certifications({ onOpenAdminCertificates }: CertificationsProps) {
  const { data } = usePortfolio();
  const [hideImageMap, setHideImageMap] = useState<Record<string, boolean>>({});

  return (
    <section
      id="certificates"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-xs font-mono tracking-wide text-[#808080] mb-2">
              06 · Verified Credentials
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white text-balance">
              Certificates
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenAdminCertificates}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm font-medium text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-colors self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Certificates</span>
          </button>
        </motion.div>

        {data.certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5]/60 dark:bg-[#121212] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center justify-center">
                <Award className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-black dark:text-white">
                Certificate Records Ready for Upload
              </h3>
              <p className="text-sm sm:text-base text-[#808080] leading-relaxed">
                No fabricated or placeholder certificates are displayed here. Verified certificates, credential IDs, verification URLs, and non-human document previews can be added, edited, or deleted anytime through the Portfolio Admin editor.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAdminCertificates}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certificate</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.certificates.map((cert, idx) => {
              const showDocument =
                Boolean(cert.documentUrl) && !hideImageMap[cert.id] && cert.documentUrl.startsWith('data:image/');

              return (
                <motion.article
                  key={cert.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F5]/60 dark:bg-[#121212] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {showDocument && (
                      <div className="relative aspect-[4/3] bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <img
                          src={cert.documentUrl}
                          alt={`${cert.title} certificate document`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain p-2 grayscale"
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#808080]">
                        <span>{cert.issueDate || 'Verified Credential'}</span>
                        {cert.relatedSkill && <span>{cert.relatedSkill}</span>}
                      </div>

                      <h3 className="font-display text-xl font-semibold text-black dark:text-white">
                        {cert.title}
                      </h3>

                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {cert.issuer}
                        {cert.credentialId ? ` · ID: ${cert.credentialId}` : ''}
                      </p>

                      {cert.description && (
                        <p className="text-sm text-[#808080] leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {cert.verificationUrl && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:underline underline-offset-4"
                        >
                          <span>Verify</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {cert.documentUrl && !cert.documentUrl.startsWith('data:image/') && (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:underline underline-offset-4"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Document</span>
                        </a>
                      )}
                    </div>

                    {cert.documentUrl && cert.documentUrl.startsWith('data:image/') && (
                      <button
                        type="button"
                        onClick={() =>
                          setHideImageMap((prev) => ({
                            ...prev,
                            [cert.id]: !prev[cert.id],
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs text-[#808080] hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        {hideImageMap[cert.id] ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show Document</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Text-Only</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
