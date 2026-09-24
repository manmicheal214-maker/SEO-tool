import React, { useState } from 'react';
import {
  FileCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Clock,
  HardDrive,
} from 'lucide-react';
import { ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface SitemapCheckerViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const SitemapCheckerView: React.FC<SitemapCheckerViewProps> = ({ onSelectTool }) => {
  const [sitemapUrl, setSitemapUrl] = useState('https://stripe.com/sitemap.xml');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    sitemapUrl: string;
    statusCode: number;
    isValidXml: boolean;
    isSitemapIndex: boolean;
    totalUrlsDetected: number;
    sampleUrls: string[];
    responseSizeKb: number;
    durationMs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sitemapUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sitemapUrl.trim() }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sitemap check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <FileCode className="h-4 w-4" />
          <span>Technical SEO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          XML Sitemap Checker & Validator
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Validate XML sitemap syntax, verify HTTP status, inspect sitemap index structures, and count discoverable page URLs.
        </p>
      </div>

      {/* Input box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Inspecting XML...' : 'Validate Sitemap'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com/sitemap.xml', 'https://vercel.com/sitemap.xml'].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setSitemapUrl(ex);
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
              <span className="text-xs text-slate-400">HTTP Status</span>
              <div
                className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
                  data.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {data.statusCode}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">XML Format</span>
              <div className="text-base font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{data.isValidXml ? 'VALID XML' : 'MALFORMED'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">
                {data.isSitemapIndex ? 'Sub-Sitemaps Found' : 'URLs Detected'}
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                {data.totalUrlsDetected.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Payload Size</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-200 mt-1">
                {data.responseSizeKb} KB
              </div>
            </div>
          </div>

          {/* Sample Discovered URLs */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Discovered Location Tags ({data.sampleUrls.length} shown)
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {data.isSitemapIndex ? 'Sitemap Index' : 'Standard URLSet'}
              </span>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
              {data.sampleUrls.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200"
                >
                  <span className="truncate">{u}</span>
                  <a
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-emerald-400 shrink-0 ml-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
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
            Sitemap Best Practices
          </h3>
          <p>
            An XML sitemap acts as a roadmap for search engine crawlers, pointing directly to high-priority canonical URLs. Follow Google official sitemap specifications:
          </p>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
            <li>Never exceed 50,000 URLs per individual sitemap file.</li>
            <li>Keep uncompressed file size below 50 MB (use gzip compression).</li>
            <li>Only include canonical HTTP 200 URLs (never include 301 redirects, 404s, or noindex pages).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Sitemap Index Files
          </h3>
          <p>
            For websites with more than 50,000 pages or distinct multilingual sections, use a &lt;sitemapindex&gt; file that references specialized sub-sitemaps (e.g. sitemap-products.xml, sitemap-blog.xml).
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="sitemap-checker" onSelectTool={onSelectTool} />
    </div>
  );
};
