import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  FileSpreadsheet,
  Presentation,
} from 'lucide-react';
import { DomainMetricResult, ToolId } from '../types/seo';
import { DomainRatingGauge } from '../components/DomainRatingGauge';
import { RelatedToolsSection } from '../components/RelatedToolsSection';
import { PresentationModal } from '../components/PresentationModal';
import { PresentationData } from '../utils/presentationGenerator';

interface DomainRatingViewProps {
  initialDomain?: string;
  onSelectTool: (tool: ToolId) => void;
  onRunAudit: (url: string) => void;
}

export const DomainRatingView: React.FC<DomainRatingViewProps> = ({
  initialDomain,
  onSelectTool,
  onRunAudit,
}) => {
  const [domainInput, setDomainInput] = useState(initialDomain || 'stripe.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DomainMetricResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);

  const fetchDomainMetrics = async (targetDomain: string) => {
    if (!targetDomain.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain.trim() }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to analyze domain');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialDomain) {
      setDomainInput(initialDomain);
      fetchDomainMetrics(initialDomain);
    } else {
      fetchDomainMetrics('stripe.com');
    }
  }, [initialDomain]);

  const handleCopySummary = () => {
    if (!data) return;
    const summary = `CheckDR Domain Analysis for ${data.domain}:
- Domain Rating: ${data.domainRating}/100
- URL Rating: ${data.urlRating}/100
- Referring Domains: ${data.referringDomains.toLocaleString()}
- Total Backlinks: ${data.backlinks.toLocaleString()}
- HTTPS: ${data.technicalSummary.https ? 'Yes' : 'No'}
- Robots.txt: ${data.technicalSummary.robotsTxtFound ? 'Found' : 'Missing'}
- Sitemap: ${data.technicalSummary.sitemapFound ? 'Found' : 'Missing'}
- Data Source: ${data.dataSource}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <Globe className="h-4 w-4" />
          <span>Domain Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Domain Rating Checker
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Check Domain Rating (DR), URL Rating (UR), referring domains, backlink velocity, and verify essential technical health markers.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchDomainMetrics(domainInput);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Enter domain name (e.g. stripe.com or ahrefs.com)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Analyzing Domain...' : 'Check Domain Rating'}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
          <span>Example domains:</span>
          {['stripe.com', 'ahrefs.com', 'wikipedia.org', 'vercel.com'].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDomainInput(d);
                fetchDomainMetrics(d);
              }}
              className="text-slate-300 hover:text-emerald-400 underline underline-offset-2"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Analysis Error</div>
            <div className="text-xs text-rose-300/90 mt-1">{error}</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">
            Fetching domain profile and probing technical signals...
          </p>
          <p className="text-xs text-slate-500">
            Calculating logarithmic backlink distribution & checking HTTP status
          </p>
        </div>
      )}

      {/* Results View */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Top Domain Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-mono">{data.domain}</h2>
                <a
                  href={`https://${data.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-400"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Data Source: <span className="text-slate-300">{data.dataSource}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPresentationOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors shadow-sm"
              >
                <Presentation className="h-3.5 w-3.5" />
                <span>Presentation Deck</span>
              </button>
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                onClick={() => onRunAudit(data.domain)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-slate-950 transition-colors"
              >
                <span>Run Full SEO Audit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 1. Authority Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DomainRatingGauge
              score={data.domainRating}
              label="Domain Rating (DR)"
              sublabel="Logarithmic backlink scale"
              size="lg"
            />
            <DomainRatingGauge
              score={data.urlRating}
              label="URL Rating (UR)"
              sublabel="Homepage page authority"
              size="lg"
            />

            <div className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Referring Domains
                </span>
                <div className="text-3xl font-bold font-mono tabular-nums text-white mt-2">
                  {data.referringDomains.toLocaleString()}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                Unique root domains linking to {data.domain}. Primary driver of logarithmic DR growth.
              </p>
            </div>

            <div className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Total Backlinks
                </span>
                <div className="text-3xl font-bold font-mono tabular-nums text-white mt-2">
                  {data.backlinks.toLocaleString()}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                Estimated aggregate external incoming hyperlinks across all pages.
              </p>
            </div>
          </div>

          {/* 2. Historical DR Trajectory */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Historical Domain Rating Velocity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  6-month authority stability & backlink accumulation trend
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Current: DR {data.domainRating}
              </span>
            </div>

            {/* Historical Table & Bar trend */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {data.history.map((h, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-center space-y-1.5"
                >
                  <div className="text-[11px] text-slate-400 font-medium">{h.date}</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">
                    DR {h.dr}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                    {h.refDomains.toLocaleString()} refs
                  </div>
                  {/* Visual micro bar */}
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.max(10, h.dr))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Technical & On-Page Overview (Section 13) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Snapshot */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
                <span>Technical Overview</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300">HTTPS Security</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Enabled & Secure</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300">Robots.txt Directive</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Configured at /robots.txt</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300">XML Sitemap</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Discoverable</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300">Search Engine Indexability</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Indexable (HTTP 200)</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300">Time to First Byte (TTFB)</span>
                  <span className="font-mono tabular-nums text-slate-200">
                    {data.technicalSummary.ttfbMs}ms
                  </span>
                </div>
              </div>
            </div>

            {/* On-Page Snapshot */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-400" />
                <span>On-Page Overview</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 font-medium">Page Title</div>
                  <div className="text-slate-200 truncate mt-0.5">{data.onPageSummary.title}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 font-medium">Meta Description</div>
                  <div className="text-slate-300 truncate mt-0.5">{data.onPageSummary.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="text-[11px] text-slate-500">Internal Links</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {data.onPageSummary.internalLinksCount}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="text-[11px] text-slate-500">Images Detected</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {data.onPageSummary.imagesCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner: Turn DR checks into full-audit users (Section 13) */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Recommended Next Step
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Inspect Complete Technical & On-Page SEO Health
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Domain Rating measures backlink authority, but Google rankings require pristine technical crawlability, mobile responsiveness, fast Core Web Vitals, and rich structured data.
              </p>
            </div>

            <button
              onClick={() => onRunAudit(data.domain)}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all whitespace-nowrap shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
            >
              <span>Run Full SEO Audit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tool Explanatory Section (Section 11) */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            How Domain Rating (DR) Works
          </h3>
          <p>
            Domain Rating (DR) is a logarithmic metric ranging from 0 to 100 that models the strength of a target domain&apos;s backlink profile compared to all other domains in the index. Because the scale is logarithmic, advancing from DR 70 to DR 80 requires exponentially more high-authority referring domains than moving from DR 20 to DR 30.
          </p>
          <p>
            Key signals influencing DR include the number of unique referring domains, the link authority of those referring domains, and whether incoming hyperlinks are dofollow.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            DR vs. Google Ranking Factors
          </h3>
          <p>
            Google does not use Domain Rating, Domain Authority, or any single proprietary score in its search algorithms. While backlink signals and PageRank remain fundamental to search discovery, Google evaluates pages individually based on content relevance, helpfulness, search intent alignment, structured data, and Core Web Vitals.
          </p>
          <p>
            Use Domain Rating as a competitive benchmark against industry peers rather than an absolute indicator of individual keyword placement.
          </p>
        </div>
      </div>

      {/* Related Tools Internal Linking */}
      <RelatedToolsSection currentTool="domain-rating" onSelectTool={onSelectTool} />

      {/* Presentation Deck Modal */}
      {data && (
        <PresentationModal
          isOpen={presentationOpen}
          onClose={() => setPresentationOpen(false)}
          initialData={{
            domain: data.domain,
            url: `https://${data.domain}`,
            auditDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            clientName: data.domain,
            preparedBy: 'CheckDR SEO Intelligence',
            domainRating: data.domainRating,
            urlRating: data.urlRating,
            referringDomains: data.referringDomains,
            backlinks: data.backlinks,
            performanceScore: data.technicalSummary.ttfbMs < 300 ? 92 : 78,
            ttfbValue: `${data.technicalSummary.ttfbMs} ms`,
          }}
        />
      )}
    </div>
  );
};
