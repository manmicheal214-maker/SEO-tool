import React, { useState } from 'react';
import {
  Code,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface SchemaCheckerViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const SchemaCheckerView: React.FC<SchemaCheckerViewProps> = ({ onSelectTool }) => {
  const [urlInput, setUrlInput] = useState('https://stripe.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    url: string;
    jsonLdCount: number;
    jsonLdBlocks: Array<{ type: string; raw: string; isValidJson: boolean }>;
    openGraph: Record<string, string>;
    twitter: Record<string, string>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-schema', {
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
      setError(err instanceof Error ? err.message : 'Schema check failed');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <Code className="h-4 w-4" />
          <span>Structured Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Schema & JSON-LD Validator
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Extract Schema.org structured data, validate JSON-LD syntax, inspect detected schema types, and verify Open Graph and Twitter social card tags.
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
              placeholder="https://example.com/product"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Extracting Schemas...' : 'Inspect Schema'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com', 'https://github.com'].map((ex) => (
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
          {/* Summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">JSON-LD Blocks</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                {data.jsonLdCount}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Open Graph Tags</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {Object.keys(data.openGraph).length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Twitter Card Tags</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-sky-400 mt-1">
                {Object.keys(data.twitter).length}
              </div>
            </div>
          </div>

          {/* JSON-LD Blocks */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">
              Detected Schema.org JSON-LD Blocks
            </h3>

            {data.jsonLdBlocks.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No &lt;script type=&quot;application/ld+json&quot;&gt; tags found on this URL.
              </div>
            ) : (
              data.jsonLdBlocks.map((b, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-400 font-mono">
                        @type: {b.type}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span
                        className={`font-semibold ${
                          b.isValidJson ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {b.isValidJson ? 'Valid JSON' : 'Syntax Error'}
                      </span>
                    </div>

                    <button
                      onClick={() => copyCode(b.raw, idx)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      {copiedIdx === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <pre className="p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64 leading-relaxed scrollbar-thin">
                    {b.raw}
                  </pre>
                </div>
              ))
            )}
          </div>

          {/* Social Meta Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Open Graph Tags
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto text-xs font-mono pr-2 scrollbar-thin">
                {Object.entries(data.openGraph).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">{key}:</span>{' '}
                    <span className="text-emerald-300 truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Twitter Card Tags
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto text-xs font-mono pr-2 scrollbar-thin">
                {Object.entries(data.twitter).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">{key}:</span>{' '}
                    <span className="text-sky-300 truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Structured Data Matters
          </h3>
          <p>
            Schema.org structured data (using JSON-LD) provides explicit semantic clues about the meaning of a webpage to search engines. It unlocks Google rich snippets including breadcrumb trails, product review star ratings, FAQ accordions, and sitelinks search boxes.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            JSON-LD vs. Microdata
          </h3>
          <p>
            Google explicitly recommends JSON-LD over Microdata or RDFa because JSON-LD script blocks are decoupled from UI templates, making maintenance cleaner and less prone to broken HTML tags during website redesigns.
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="schema-checker" onSelectTool={onSelectTool} />
    </div>
  );
};
