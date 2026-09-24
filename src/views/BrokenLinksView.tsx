import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface BrokenLinksViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const BrokenLinksView: React.FC<BrokenLinksViewProps> = ({ onSelectTool }) => {
  const [urlInput, setUrlInput] = useState('https://stripe.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    pageUrl: string;
    totalLinksOnPage: number;
    testedSampleCount: number;
    brokenCount: number;
    links: Array<{
      url: string;
      status: number;
      isInternal: boolean;
      isBroken: boolean;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-broken-links', {
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
      setError(err instanceof Error ? err.message : 'Broken link check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <LinkIcon className="h-4 w-4" />
          <span>Link Hygiene</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Broken Link Checker
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Scan hyperlinks on any webpage to detect 404 dead ends, server errors, and broken outbound references that degrade user experience and waste crawl equity.
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
              placeholder="https://example.com/blog/my-post"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Checking Links...' : 'Scan Page Links'}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Page Links</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                {data.totalLinksOnPage}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Sample Tested</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-200 mt-1">
                {data.testedSampleCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Broken Links</span>
              <div
                className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
                  data.brokenCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {data.brokenCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Link Health</span>
              <div className="text-base font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
                {data.brokenCount === 0 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>EXCELLENT</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span className="text-rose-400">NEEDS REPAIR</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Links list */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tested Link Verifications
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
              {data.links.map((link, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono transition-colors ${
                    link.isBroken
                      ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        link.status === 200
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {link.status || 'ERR'}
                    </span>
                    <span className="truncate">{link.url}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-[11px] text-slate-500">
                      {link.isInternal ? 'Internal' : 'External'}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Broken Links Hurt SEO
          </h3>
          <p>
            When users click hyperlinks and encounter 404 &quot;Page Not Found&quot; errors, bounce rates escalate and brand trust is compromised. For search bots, repeated 404 links waste allocated crawl budget and disrupt PageRank distribution through your site architecture.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Internal vs. External Broken Links
          </h3>
          <p>
            Internal broken links represent code or CMS routing errors that should be fixed immediately with 301 redirects to replacement articles. External broken links occur when cited third-party resources change domains or unpublish content; update them with fresh active references.
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="broken-links" onSelectTool={onSelectTool} />
    </div>
  );
};
