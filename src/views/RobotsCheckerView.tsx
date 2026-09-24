import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface RobotsCheckerViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const RobotsCheckerView: React.FC<RobotsCheckerViewProps> = ({ onSelectTool }) => {
  const [domainInput, setDomainInput] = useState('https://stripe.com');
  const [testPath, setTestPath] = useState('/checkout');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    robotsUrl: string;
    found: boolean;
    statusCode: number;
    content: string;
    sitemaps: string[];
    disallowsCount: number;
    allowsCount: number;
    testedPath: string;
    isAllowedForTestedPath: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: domainInput.trim(), testPath: testPath.trim() }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Robots.txt check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <FileText className="h-4 w-4" />
          <span>Technical SEO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Robots.txt Checker & Tester
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Verify robots.txt configuration, discover declared XML sitemaps, and test whether specific URL paths are allowed or disallowed for search engine bots.
        </p>
      </div>

      {/* Input box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <input
              type="text"
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              placeholder="Test path (e.g. /cart)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Testing...' : 'Test Robots.txt'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com', 'https://github.com', 'https://wikipedia.org'].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setDomainInput(ex);
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
          {/* Status Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Status Code</span>
              <div
                className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
                  data.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {data.statusCode}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Path Access Test</span>
              <div
                className={`text-base font-bold font-mono mt-2 flex items-center gap-1.5 ${
                  data.isAllowedForTestedPath ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {data.isAllowedForTestedPath ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ALLOWED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>BLOCKED</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Disallow Rules</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                {data.disallowsCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Sitemaps Declared</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {data.sitemaps.length}
              </div>
            </div>
          </div>

          {/* Sitemaps declared */}
          {data.sitemaps.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sitemaps Found in Robots.txt
              </h3>
              <div className="space-y-1.5 pt-1">
                {data.sitemaps.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400"
                  >
                    <span className="truncate">{s}</span>
                    <a
                      href={s}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white shrink-0 ml-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw File Content */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Directives & Content ({data.robotsUrl})
              </h3>
              <a
                href={data.robotsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                <span>Raw File</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-80 leading-relaxed scrollbar-thin">
              {data.content || '// Empty robots.txt file'}
            </pre>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Robots.txt Matters
          </h3>
          <p>
            Robots.txt is the first file fetched by search engine crawlers (Googlebot, Bingbot, etc.) before visiting any page on your website. It controls crawl budget by instructing bots which directories (such as internal APIs, shopping carts, or search filters) should not be indexed.
          </p>
          <p>
            Always declare the exact location of your XML sitemap at the bottom of your robots.txt to ensure seamless sitemap discovery.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Crucial Distinction: Crawling vs. Indexing
          </h3>
          <p>
            Disallowing a URL in robots.txt only prevents Googlebot from downloading the page; it does not guarantee the URL will not appear in search results if other websites link to it. To completely prevent indexing, use the `noindex` meta robots directive in the page HTML head.
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="robots-txt" onSelectTool={onSelectTool} />
    </div>
  );
};
