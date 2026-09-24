import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldAlert,
  ArrowRight,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Globe,
  ExternalLink,
  ChevronDown,
  Layers,
  FileText,
  Presentation,
} from 'lucide-react';
import { CrawlResult, ToolId, SEOIssue } from '../types/seo';
import { AuditIssuesList } from '../components/AuditIssuesList';
import { RelatedToolsSection } from '../components/RelatedToolsSection';
import { PresentationModal } from '../components/PresentationModal';
import { PresentationData } from '../utils/presentationGenerator';

interface WebsiteAuditViewProps {
  initialUrl?: string;
  onSelectTool: (tool: ToolId) => void;
}

export const WebsiteAuditView: React.FC<WebsiteAuditViewProps> = ({
  initialUrl,
  onSelectTool,
}) => {
  const [urlInput, setUrlInput] = useState(initialUrl || 'https://stripe.com');
  const [maxPages, setMaxPages] = useState<number>(8);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [data, setData] = useState<CrawlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'issues' | 'pages'>('issues');
  const [presentationOpen, setPresentationOpen] = useState(false);

  const runAudit = async (target: string, pagesLimit: number) => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setProgressStep('Validating URL & SSRF security checks...');

    try {
      setTimeout(() => setProgressStep('Discovering URLs & parsing robots.txt...'), 800);
      setTimeout(() => setProgressStep('Checking HTTP status codes & redirect hops...'), 1800);
      setTimeout(() => setProgressStep('Auditing metadata, headings & images...'), 2800);
      setTimeout(() => setProgressStep('Synthesizing technical findings & recommendations...'), 3800);

      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.trim(), maxPages: pagesLimit }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Website crawl audit failed');
    } finally {
      setLoading(false);
      setProgressStep('');
    }
  };

  useEffect(() => {
    if (initialUrl) {
      setUrlInput(initialUrl);
      runAudit(initialUrl, 8);
    }
  }, [initialUrl]);

  const handleExportCsv = () => {
    if (!data) return;
    const header = 'Category,Severity,Problem,Why It Matters,Recommended Action,Affected URLs Count,First Affected URL,Evidence\n';
    const rows = data.aggregatedIssues
      .map((i) => {
        const safeProblem = `"${i.problem.replace(/"/g, '""')}"`;
        const safeWhy = `"${i.whyItMatters.replace(/"/g, '""')}"`;
        const safeAction = `"${i.recommendedAction.replace(/"/g, '""')}"`;
        const firstUrl = `"${(i.affectedUrls[0] || '').replace(/"/g, '""')}"`;
        const evidence = `"${(i.evidence || '').replace(/"/g, '""')}"`;
        return `${i.category},${i.severity},${safeProblem},${safeWhy},${safeAction},${i.affectedUrls.length},${firstUrl},${evidence}`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checkdr_audit_${data.domain}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <ShieldAlert className="h-4 w-4" />
          <span>Audit Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Website SEO Audit & Crawler
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive multi-page crawl analyzing technical indexability, redirect chains, canonical tags, heading hierarchies, schema markup, and performance bottlenecks.
        </p>
      </div>

      {/* Input box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runAudit(urlInput, maxPages);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value, 10))}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value={5}>5 Pages (Quick)</option>
              <option value={8}>8 Pages (Standard)</option>
              <option value={15}>15 Pages (Deep)</option>
              <option value={25}>25 Pages (Comprehensive)</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
            >
              {loading ? 'Crawling Site...' : 'Run SEO Audit'}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com', 'https://ahrefs.com', 'https://wikipedia.org'].map((u) => (
            <button
              key={u}
              onClick={() => {
                setUrlInput(u);
                runAudit(u, maxPages);
              }}
              className="text-slate-300 hover:text-emerald-400 underline underline-offset-2"
            >
              {u.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
          <div>
            <p className="text-sm font-semibold text-slate-200">{progressStep}</p>
            <p className="text-xs text-slate-500 mt-1">
              Crawler respects robots.txt directives and executes bounded internal link traversal
            </p>
          </div>
        </div>
      )}

      {/* Crawl Results */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-400">Target Domain:</span>
                <span className="text-base font-bold font-mono text-white">{data.domain}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Crawled <span className="font-mono tabular-nums text-slate-200">{data.totalPagesCrawled}</span> pages · Found{' '}
                <span className="font-mono tabular-nums text-emerald-400">{data.aggregatedIssues.length}</span> total diagnostic issues
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
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Report</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Tab controls */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'issues'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Categorized Issues ({data.aggregatedIssues.length})
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'pages'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crawled Pages ({data.pages.length})
            </button>
          </div>

          {activeTab === 'issues' ? (
            <AuditIssuesList issues={data.aggregatedIssues} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
                    <th className="p-3.5 font-semibold">Crawled URL</th>
                    <th className="p-3.5 font-semibold text-center">Status</th>
                    <th className="p-3.5 font-semibold">Title</th>
                    <th className="p-3.5 font-semibold text-right">Words</th>
                    <th className="p-3.5 font-semibold text-right">TTFB</th>
                    <th className="p-3.5 font-semibold text-right">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.pages.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 text-slate-200">
                      <td className="p-3.5 font-mono text-[11px] text-emerald-400 max-w-xs truncate">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <span className="truncate">{p.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            p.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {p.statusCode}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs truncate text-slate-300">
                        {p.title}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-400">
                        {p.wordCount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-400">
                        {p.ttfbMs}ms
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold tabular-nums text-amber-400">
                        {p.issuesCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Guide & Related Tools */}
      <RelatedToolsSection currentTool="website-audit" onSelectTool={onSelectTool} />

      {/* Presentation Deck Modal */}
      {data && (
        <PresentationModal
          isOpen={presentationOpen}
          onClose={() => setPresentationOpen(false)}
          initialData={{
            domain: data.domain,
            url: urlInput,
            auditDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            clientName: data.domain,
            preparedBy: 'CheckDR SEO Intelligence',
            totalPagesCrawled: data.totalPagesCrawled,
            criticalIssuesCount: data.aggregatedIssues.filter((i) => i.severity === 'Critical').length,
            warningsCount: data.aggregatedIssues.filter((i) => i.severity === 'High' || i.severity === 'Medium').length,
            topIssues: data.aggregatedIssues.map((i) => ({
              category: i.category,
              severity: i.severity,
              problem: i.problem,
              recommendedAction: i.recommendedAction,
            })),
          }}
        />
      )}
    </div>
  );
};
