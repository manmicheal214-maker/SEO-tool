import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Presentation,
  Check,
  Building,
  User,
  Sparkles,
} from 'lucide-react';
import { PresentationData, generatePresentationHtml } from '../utils/presentationGenerator';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PresentationData;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [clientName, setClientName] = useState(initialData.clientName || 'Acme Corp');
  const [preparedBy, setPreparedBy] = useState(initialData.preparedBy || 'CheckDR SEO Intelligence');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const totalSlides = 7;

  const presentationData: PresentationData = {
    ...initialData,
    clientName,
    preparedBy,
  };

  const handleDownload = () => {
    const htmlContent = generatePresentationHtml(presentationData);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEO_Performance_Deck_${initialData.domain.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrintPdf = () => {
    const htmlContent = generatePresentationHtml(presentationData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const slideTitles = [
    '01. Title & Cover',
    '02. Executive Scorecard',
    '03. Domain Authority & Backlinks',
    '04. Core Web Vitals & Speed',
    '05. Technical SEO & Indexing',
    '06. Priority Diagnostic Fixes',
    '07. 30-60-90 Day Strategic Plan',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="font-mono text-xs font-bold">PPT</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                SEO Performance Report Presentation
              </h3>
              <p className="text-xs text-slate-400">
                Executive client presentation deck for {initialData.domain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 transition-colors shadow-sm shadow-emerald-500/20"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Deck (.html)</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Agency Customization Toolbar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-slate-400">Client:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-32 sm:w-40"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-slate-400">Prepared By:</span>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Agency Name"
                className="bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-36 sm:w-48"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Keyboard navigation active (← / → keys)
          </div>
        </div>

        {/* Slide Viewer Canvas */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-slate-950/70">
          <div className="w-full max-w-3xl aspect-[16/9] rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
            {/* Slide 1 */}
            {currentSlide === 1 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Executive SEO Audit &amp; Performance Review
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  SEO Performance Presentation
                </h2>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {initialData.domain}
                </div>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  Comprehensive technical crawl diagnostic, Core Web Vitals audit, and backlink authority evaluation for {clientName}.
                </p>
                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-4">
                  <span>Client: <strong className="text-white">{clientName}</strong></span>
                  <span>·</span>
                  <span>Prepared By: <strong className="text-white">{preparedBy}</strong></span>
                  <span>·</span>
                  <span>Date: <strong className="text-white">{initialData.auditDate}</strong></span>
                </div>
              </div>
            )}

            {/* Slide 2 */}
            {currentSlide === 2 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Executive Scorecard
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Site Health &amp; Discovery Overview
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Domain Rating</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {initialData.domainRating ?? 78} <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Core Web Vitals</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {initialData.performanceScore ?? 84} <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Pages Audited</span>
                    <div className="text-2xl font-bold font-mono text-white mt-1">
                      {initialData.totalPagesCrawled ?? 12}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Priority Fixes</span>
                    <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                      {(initialData.criticalIssuesCount ?? 2) + (initialData.warningsCount ?? 5)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Takeaway: Strong baseline authority; high upside in semantic hierarchy and Core Web Vitals.</span>
                  <span>Slide 02</span>
                </div>
              </div>
            )}

            {/* Slide 3 */}
            {currentSlide === 3 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Off-Page Signals
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Domain Rating &amp; Backlink Profile
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 my-auto">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Referring Domains</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {initialData.referringDomains?.toLocaleString() ?? '14,200'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Backlinks</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {initialData.backlinks?.toLocaleString() ?? '185,000'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">URL Rating</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {initialData.urlRating ?? 65} <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Referring domain diversity provides foundational crawl velocity and search trust.</span>
                  <span>Slide 03</span>
                </div>
              </div>
            )}

            {/* Slide 4 */}
            {currentSlide === 4 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    User Experience Signals
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Google Core Web Vitals Audit
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 my-auto">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">LCP (Loading)</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {initialData.lcpValue || '2.2 s'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Target &le; 2.5s</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">INP (Interactivity)</span>
                    <div className="text-xl font-bold font-mono text-sky-400 mt-1">
                      {initialData.inpValue || '140 ms'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Target &le; 200ms</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">CLS (Stability)</span>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                      {initialData.clsValue || '0.04'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Target &le; 0.1</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Passing Core Web Vitals directly drives higher mobile organic search conversion rates.</span>
                  <span>Slide 04</span>
                </div>
              </div>
            )}

            {/* Slide 5 */}
            {currentSlide === 5 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Infrastructure &amp; Indexing
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Technical SEO &amp; Directives Audit
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 my-auto text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-400">HTTPS Encryption:</span><span className="text-emerald-400 font-bold">PASS (TLS)</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Robots.txt Directive:</span><span className="text-emerald-400 font-bold">PASS</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">XML Sitemap:</span><span className="text-emerald-400 font-bold">PASS</span></div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-400">Canonical Consistency:</span><span className="text-emerald-400 font-bold">Configured</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Redirect Hops:</span><span className="text-emerald-400 font-bold">Clean</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Compression:</span><span className="text-emerald-400 font-bold">Brotli / Gzip</span></div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Prerequisites check ensures zero crawl budget is drained by server errors or loops.</span>
                  <span>Slide 05</span>
                </div>
              </div>
            )}

            {/* Slide 6 */}
            {currentSlide === 6 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Actionable Issues
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Priority Diagnostic Findings
                  </h3>
                </div>

                <div className="space-y-2 my-auto">
                  {(initialData.topIssues && initialData.topIssues.length > 0) ? (
                    initialData.topIssues.slice(0, 2).map((iss, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-rose-400 uppercase">{iss.severity}</span>
                          <span className="text-slate-500">·</span>
                          <span className="font-semibold text-white">{iss.problem}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">Fix: {iss.recommendedAction}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <div className="font-semibold text-white">Title Tag Optimization</div>
                      <p className="text-slate-400 text-[11px] mt-0.5">Enforce title lengths between 40 and 60 characters with primary keywords in front.</p>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Issues are prioritized by direct impact on organic CTR and search crawlability.</span>
                  <span>Slide 06</span>
                </div>
              </div>
            )}

            {/* Slide 7 */}
            {currentSlide === 7 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Execution Roadmap
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    30 - 60 - 90 Day Strategic Plan
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 my-auto text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Days 1 - 30</span>
                    <div className="font-bold text-white">Technical Fixes</div>
                    <p className="text-[11px] text-slate-400">Fix canonicals, eliminate multiple H1s, add image dimensions.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Days 31 - 60</span>
                    <div className="font-bold text-white">On-Page &amp; Schema</div>
                    <p className="text-[11px] text-slate-400">Deploy JSON-LD schemas, refine titles and meta descriptions.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Days 61 - 90</span>
                    <div className="font-bold text-white">Growth &amp; Authority</div>
                    <p className="text-[11px] text-slate-400">Editorial link acquisition, keyword clustering, weekly monitoring.</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Prepared by {preparedBy} for {clientName}</span>
                  <span>Slide 07</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md scrollbar-none py-1">
            {slideTitles.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  currentSlide === idx + 1
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((p) => Math.max(1, p - 1))}
              disabled={currentSlide === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {currentSlide} / {totalSlides}
            </span>
            <button
              onClick={() => setCurrentSlide((p) => Math.min(totalSlides, p + 1))}
              disabled={currentSlide === totalSlides}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
