import React, { useState } from 'react';
import {
  Link2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { SingleUrlAuditResult, ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface CanonicalCheckerViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const CanonicalCheckerView: React.FC<CanonicalCheckerViewProps> = ({ onSelectTool }) => {
  const [urlInput, setUrlInput] = useState('https://stripe.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SingleUrlAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit-url', {
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
      setError(err instanceof Error ? err.message : 'Canonical check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <Link2 className="h-4 w-4" />
          <span>Technical SEO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Canonical Tag Checker
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Verify whether pages specify self-referencing canonical tags, identify cross-domain pointers, and eliminate duplicate content indexing hazards.
        </p>
      </div>

      {/* Input box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/page"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Inspecting Canonical...' : 'Check Canonical'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com', 'https://wikipedia.org'].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setUrlInput(ex);
                handleCheck();
              }}
              className="text-slate-300 hover:text-emerald-400 underline underline-offset-2"
            >
              {ex.replace('https://', '')}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Canonical Tag Detected</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                {data.technical.canonicalUrl ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>FOUND</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-rose-400">MISSING</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Self-Referencing</span>
              <div className="text-lg font-bold font-mono mt-1 flex items-center gap-1.5">
                {data.technical.isCanonicalSelfReferencing ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">YES (OPTIMAL)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400">POINTS ELSEWHERE</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">HTTP Status</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {data.statusCode}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Canonical URL Mapping
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-500">Requested URL:</span>
                <div className="text-slate-200 mt-0.5 truncate">{data.finalUrl}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-emerald-400 font-semibold">Canonical Destination:</span>
                <div className="text-emerald-300 mt-0.5 truncate">
                  {data.technical.canonicalUrl || 'No <link rel="canonical"> specified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Self-Referencing Canonicals Are Best Practice
          </h3>
          <p>
            A self-referencing canonical tag (&lt;link rel=&quot;canonical&quot; href=&quot;https://example.com/page&quot;&gt;) instructs Google that this URL is the single master version. It prevents query parameters (e.g. ?utm_source=twitter or ?ref=affiliate) from being indexed as duplicate standalone pages.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Cross-Domain Canonicals
          </h3>
          <p>
            When syndicating content across Medium, Substack, or partner blogs, cross-domain canonicals ensure Google credits the original publisher as the definitive author and ranking target.
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="canonical-checker" onSelectTool={onSelectTool} />
    </div>
  );
};
