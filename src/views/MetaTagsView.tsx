import React, { useState } from 'react';
import {
  FileSearch,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Heading,
  Eye,
} from 'lucide-react';
import { SingleUrlAuditResult, ToolId } from '../types/seo';
import { SerpSnippetPreview } from '../components/SerpSnippetPreview';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface MetaTagsViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const MetaTagsView: React.FC<MetaTagsViewProps> = ({ onSelectTool }) => {
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
      setError(err instanceof Error ? err.message : 'Meta tag check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <FileSearch className="h-4 w-4" />
          <span>On-Page SEO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Meta Tag & Heading Analyzer
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Inspect title tags, meta descriptions, and H1/H2 heading hierarchy. Test pixel width truncation and simulate live Google SERP desktop and mobile snippets.
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
            {loading ? 'Inspecting Tags...' : 'Analyze Meta Tags'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com', 'https://ahrefs.com', 'https://wikipedia.org'].map((ex) => (
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
        <div className="space-y-8">
          {/* SERP Preview */}
          <SerpSnippetPreview
            url={data.finalUrl}
            title={data.onPage.title.text}
            description={data.onPage.description.text}
          />

          {/* Heading Structure Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Heading className="h-4 w-4 text-emerald-400" />
                <span>Heading Hierarchy Analysis</span>
              </h3>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  data.onPage.headings.structureStatus === 'optimal'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {data.onPage.headings.structureStatus === 'optimal'
                  ? 'Optimal Hierarchy'
                  : data.onPage.headings.structureStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">H1 Elements</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {data.onPage.headings.h1.length}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">H2 Headings</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {data.onPage.headings.h2Count}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">H3 Subheadings</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {data.onPage.headings.h3Count}
                </div>
              </div>
            </div>

            {/* H1 Texts */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-400">Detected H1 Content:</div>
              {data.onPage.headings.h1.length === 0 ? (
                <div className="text-xs text-rose-400 font-mono">
                  No &lt;h1&gt; tags found on page
                </div>
              ) : (
                data.onPage.headings.h1.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300"
                  >
                    &lt;h1&gt; {h} &lt;/h1&gt;
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Keyword Density & Content Volume */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Top Keyword Prominence
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from {data.onPage.content.wordCount.toLocaleString()} total words (~{data.onPage.content.readingTimeMinutes} min read)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Keyword</th>
                    <th className="pb-2 font-semibold text-right">Frequency</th>
                    <th className="pb-2 font-semibold text-right">Density</th>
                    <th className="pb-2 font-semibold text-center">In Title</th>
                    <th className="pb-2 font-semibold text-center">In H1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.onPage.content.topKeywords.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 text-slate-200">
                      <td className="py-2.5 font-mono font-medium">{kw.word}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{kw.count}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{kw.density}%</td>
                      <td className="py-2.5 text-center">
                        {kw.inTitle ? (
                          <span className="text-emerald-400 font-semibold">Yes</span>
                        ) : (
                          <span className="text-slate-600">No</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center">
                        {kw.inH1 ? (
                          <span className="text-emerald-400 font-semibold">Yes</span>
                        ) : (
                          <span className="text-slate-600">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Title Tag Optimization
          </h3>
          <p>
            Your &lt;title&gt; tag remains the primary text preview shown in Google SERPs. Keep lengths between 40 and 60 characters (under 580px wide) to prevent abrupt ellipsis truncation. Place your primary target keyword toward the beginning of the title.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Heading Hierarchy (H1, H2, H3)
          </h3>
          <p>
            Every URL should feature exactly one authoritative &lt;h1&gt; describing the page topic. Use &lt;h2&gt; and &lt;h3&gt; tags in logical descendant order to organize sections for both users and assistive screen readers.
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="meta-tags" onSelectTool={onSelectTool} />
    </div>
  );
};
