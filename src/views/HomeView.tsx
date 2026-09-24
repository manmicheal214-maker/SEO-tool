import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Link as LinkIcon,
  FileCode2,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ToolId } from '../types/seo';

interface HomeViewProps {
  onSelectTool: (tool: ToolId) => void;
  onRunDomainCheck: (domain: string) => void;
  onRunAudit: (url: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTool,
  onRunDomainCheck,
  onRunAudit,
}) => {
  const [inputVal, setInputVal] = useState('stripe.com');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const presets = ['stripe.com', 'ahrefs.com', 'wikipedia.org', 'vercel.com', 'shopify.com'];

  const handleSubmit = (action: 'domain' | 'audit') => {
    if (!inputVal.trim()) return;
    if (action === 'domain') {
      onRunDomainCheck(inputVal.trim());
    } else {
      onRunAudit(inputVal.trim());
    }
  };

  const popularTools: Array<{ id: ToolId; title: string; desc: string; category: string }> = [
    {
      id: 'domain-rating',
      title: 'Domain Rating Checker',
      desc: 'Instant backlink authority estimation & historical DR trajectory.',
      category: 'Domain',
    },
    {
      id: 'bulk-domain',
      title: 'Bulk DR Checker',
      desc: 'Analyze up to 30 domains at once with instant CSV spreadsheet export.',
      category: 'Bulk Batch',
    },
    {
      id: 'website-audit',
      title: 'Website SEO Crawler',
      desc: 'Multi-page BFS crawl inspecting technical bugs, status codes, and headings.',
      category: 'Audits',
    },
    {
      id: 'core-web-vitals',
      title: 'Core Web Vitals Checker',
      desc: 'Analyze Google LCP, INP, and CLS performance metrics via PageSpeed Insights.',
      category: 'Performance',
    },
    {
      id: 'redirect-checker',
      title: 'Redirect Chain Checker',
      desc: 'Trace 301/302 hops, hop latency, and potential redirect loops.',
      category: 'Technical',
    },
    {
      id: 'broken-links',
      title: 'Broken Link Checker',
      desc: 'Verify internal & external hyperlinks to eliminate 404 dead links.',
      category: 'Links',
    },
    {
      id: 'robots-txt',
      title: 'Robots.txt Parser & Tester',
      desc: 'Test crawler access rules and test specific directory allow/disallow paths.',
      category: 'Technical',
    },
    {
      id: 'sitemap-checker',
      title: 'XML Sitemap Checker',
      desc: 'Validate sitemap XML syntax and count discoverable indexed URLs.',
      category: 'Technical',
    },
    {
      id: 'meta-tags',
      title: 'Meta Tag & SERP Checker',
      desc: 'Simulate Google desktop/mobile snippets with title & description meters.',
      category: 'On-Page',
    },
  ];

  const faqs = [
    {
      q: 'What is Domain Rating (DR) and how is it calculated?',
      a: 'Domain Rating is a third-party logarithmic metric (scaled 0 to 100) that estimates a website backlink profile strength. CheckDR models this logarithmic distribution based on referring root domains, backlink velocity, and authority signals. While DR is an industry benchmark for competitor comparison, it is not an internal Google ranking algorithm.',
    },
    {
      q: 'How does CheckDR distinguish Google signals from third-party metrics?',
      a: 'CheckDR explicitly separates third-party backlink metrics (DR, UR) from Google-documented webmaster guidelines. Factors like HTTPS encryption, robots.txt directives, valid canonical tags, indexability headers, and Core Web Vitals are verified directly against standards rather than lumped into a black-box score.',
    },
    {
      q: 'Does the website audit crawl JavaScript single-page apps (SPAs)?',
      a: 'CheckDR crawler inspects the delivered HTML payload, server response headers, link graph, meta tags, and structured data schemas. For heavy client-rendered apps, it highlights whether critical SEO elements are rendered in initial server HTML.',
    },
    {
      q: 'Can I export audit and bulk domain results to CSV?',
      a: 'Yes. Bulk Domain Rating and Website SEO Crawl results include one-click CSV export, allowing you to import findings directly into Google Sheets, Excel, or client reports.',
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4">
        {/* Subtle status tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Practical, transparent SEO diagnostics — No black-box scores</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto [text-wrap:balance]">
          Free SEO Tools for Websites & Domains
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Check Domain Rating, technical SEO, backlinks, performance, metadata, redirects, and run comprehensive website crawls with actionable recommendations.
        </p>

        {/* Primary Input Container */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-emerald-950/20">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit('domain');
                }}
                placeholder="Enter domain or URL (e.g. stripe.com)"
                className="w-full bg-transparent pl-11 pr-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSubmit('domain')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 text-xs sm:text-sm font-semibold text-white hover:bg-slate-700 hover:text-emerald-400 transition-all border border-slate-700 whitespace-nowrap"
              >
                Check Domain
              </button>
              <button
                onClick={() => handleSubmit('audit')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-500 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
              >
                Run SEO Audit
              </button>
            </div>
          </div>

          {/* Quick Domain Presets */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500">Quick tests:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setInputVal(preset);
                  onRunDomainCheck(preset);
                }}
                className="hover:text-emerald-400 transition-colors underline underline-offset-2 decoration-slate-700 hover:decoration-emerald-500"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Snapshot Showcase Card with Generated Asset */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 overflow-hidden shadow-xl text-left max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Engineered for Deep Verification</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Comprehensive Diagnostic Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than calculating an arbitrary percentage, CheckDR performs multi-phase crawl analysis: validating HTTP status codes, canonical loops, robots.txt disallow rules, heading hierarchies, schema markup, and time-to-first-byte.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  SSRF-Protected Crawl Engine
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Direct Actionable Recommendations
                </span>
              </div>
            </div>

            {/* Generated Image Container with Zero-Broken-Image Fallback */}
            <div className="w-full md:w-80 h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative shrink-0">
              <img
                src="/src/assets/images/seo_audit_network_preview_1790267926074.jpg"
                alt="CheckDR SEO diagnostic crawl engine network visualization"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="img-fallback hidden absolute inset-0 bg-slate-900 flex-col items-center justify-center p-4 text-center">
                <BarChart3 className="h-8 w-8 text-emerald-400 mb-2" />
                <span className="text-xs font-semibold text-slate-300">SEO Audit Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular SEO Tools</h2>
            <p className="text-sm text-slate-400 mt-1">
              Essential utilities for webmasters, technical SEOs, and growth teams.
            </p>
          </div>
          <button
            onClick={() => onSelectTool('bulk-domain')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Launch Bulk Analysis</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-medium text-emerald-400">
                  {tool.category}
                </span>
                <h3 className="text-base font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors mt-1.5">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 group-hover:text-emerald-400">
                <span className="font-medium">Open tool</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Categories Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-2">Complete Toolkit Architecture</h2>
        <p className="text-sm text-slate-400 mb-8">
          Organized into targeted disciplines for systematic site investigation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Domain & Backlinks */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Globe className="h-5 w-5" />
              <h3 className="text-base font-semibold text-white">Domain & Backlinks</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logarithmic authority estimation, URL rating, referring domains, backlink counts, and historical velocity monitoring.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li>
                <button
                  onClick={() => onSelectTool('domain-rating')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Domain Rating Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('bulk-domain')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Bulk Domain Rating (CSV/Paste)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('domain-rating')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → URL Rating (UR) & History
                </button>
              </li>
            </ul>
          </div>

          {/* Card 2: Technical SEO */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <Cpu className="h-5 w-5" />
              <h3 className="text-base font-semibold text-white">Technical Crawl & Directives</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify redirect chains, indexability flags, canonical links, robots.txt directives, and XML sitemaps.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li>
                <button
                  onClick={() => onSelectTool('redirect-checker')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Redirect & Hop Latency Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('robots-txt')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Robots.txt Parser & Path Tester
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('sitemap-checker')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → XML Sitemap Validator & URL Count
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('canonical-checker')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Canonical Tag Validation
                </button>
              </li>
            </ul>
          </div>

          {/* Card 3: Audits & Content */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Layers className="h-5 w-5" />
              <h3 className="text-base font-semibold text-white">Auditing & On-Page SEO</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-page BFS crawling, heading structure audits, title snippet meters, image alt attributes, and JSON-LD schema.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li>
                <button
                  onClick={() => onSelectTool('website-audit')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Website SEO Crawler & Site Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('meta-tags')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Meta Tag & SERP Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('schema-checker')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Schema JSON-LD & OG Card Extractor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('broken-links')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  → Broken Link Scanner
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why CheckDR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why CheckDR? Built for Actionable Accuracy
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Most online SEO tools produce arbitrary 85/100 scores without explaining the underlying issues. CheckDR is designed around diagnostic clarity:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-emerald-400">1. Problem, Impact & Action</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every diagnostic issue includes a clear description of the problem, why search engines care, which specific URLs are affected, and the exact code modification needed.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-emerald-400">2. Hardened SSRF Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enterprise-grade outbound safety: every crawl request validates DNS, blocks RFC1918 private subnets, prohibits localhost or cloud metadata, and bounds memory usage.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-emerald-400">3. High Performance Batching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze dozens of competitor domains or crawl entire directories with instant spreadsheet-ready CSV downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
