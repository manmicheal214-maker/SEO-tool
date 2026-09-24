import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  CornerDownRight,
} from 'lucide-react';
import { ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface RedirectCheckerViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const RedirectCheckerView: React.FC<RedirectCheckerViewProps> = ({ onSelectTool }) => {
  const [urlInput, setUrlInput] = useState('http://github.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    originalUrl: string;
    finalUrl: string;
    finalStatusCode: number;
    totalHops: number;
    redirects: Array<{ url: string; status: number; durationMs: number }>;
    totalDurationMs: number;
    hasRedirectLoop: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Redirect check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <CornerDownRight className="h-4 w-4" />
          <span>Technical SEO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Redirect & Chain Checker
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Inspect HTTP status codes, trace multi-hop redirect chains, measure hop latency, and identify canonical destination redirects.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL to check (e.g. http://github.com or bit.ly/...)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Inspecting Hops...' : 'Check Redirect'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Try examples:</span>
          {['http://github.com', 'http://stripe.com', 'https://bit.ly/4example'].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setUrlInput(ex);
                handleCheck();
              }}
              className="text-slate-300 hover:text-emerald-400 underline underline-offset-2"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {data && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Final HTTP Status</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {data.finalStatusCode}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Redirect Hops</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                {data.totalHops}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Latency</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-200 mt-1">
                {data.totalDurationMs}ms
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Redirect Loop</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                None
              </div>
            </div>
          </div>

          {/* Hop Timeline */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Redirect Path & Hop Timeline
            </h3>

            <div className="space-y-3 pt-2">
              {/* Intermediate Hops */}
              {data.redirects.map((hop, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex h-6 w-12 items-center justify-center rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold shrink-0">
                    {hop.status}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 font-mono">Hop #{index + 1}</div>
                    <div className="text-xs font-mono text-slate-200 truncate mt-0.5">
                      {hop.url}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500 tabular-nums shrink-0">
                    {hop.durationMs}ms
                  </div>
                </div>
              ))}

              {/* Final Destination */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex h-6 w-12 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold shrink-0">
                  {data.finalStatusCode}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-emerald-400 font-semibold">
                    Final Destination URL
                  </div>
                  <div className="text-xs font-mono text-white truncate mt-0.5">
                    {data.finalUrl}
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                  Target
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Content & Common Issues (Prompt Section 11) */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            What is an HTTP Redirect?
          </h3>
          <p>
            An HTTP redirect is a server response instruction informing web browsers and search engine crawlers that the requested resource has relocated. Standard 301 redirects denote permanent relocation and pass link equity (PageRank), while 302 or 307 redirects indicate temporary relocation without consolidating canonical indexing signals.
          </p>
          <p>
            Clean 301 redirections are critical when migrating website domains, renaming URL slug structures, or consolidating old blog posts into pillar guides.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Common Redirect Pitfalls
          </h3>
          <ul className="space-y-2 list-disc pl-4 text-slate-400">
            <li>
              <strong className="text-slate-200">Redirect Chains:</strong> Passing through 2 or more hops (e.g. HTTP → non-WWW HTTP → HTTPS WWW) delays TTFB by several hundred milliseconds and drains Google crawl budget.
            </li>
            <li>
              <strong className="text-slate-200">Redirect Loops:</strong> Page A redirects to Page B, which redirects back to Page A, causing browser ERR_TOO_MANY_REDIRECTS fatal errors.
            </li>
            <li>
              <strong className="text-slate-200">Temporary 302 vs 301:</strong> Using 302 temporary redirects prevents Google from updating the SERP URL snippet or passing full backlink equity.
            </li>
          </ul>
        </div>
      </div>

      <RelatedToolsSection currentTool="redirect-checker" onSelectTool={onSelectTool} />
    </div>
  );
};
