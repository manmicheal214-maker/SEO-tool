import React, { useState } from 'react';
import {
  Zap,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Presentation,
} from 'lucide-react';
import { CoreWebVitalsResult, ToolId, WebVitalMetric } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';
import { PresentationModal } from '../components/PresentationModal';
import { PresentationData } from '../utils/presentationGenerator';

interface CoreWebVitalsViewProps {
  onSelectTool: (tool: ToolId) => void;
}

export const CoreWebVitalsView: React.FC<CoreWebVitalsViewProps> = ({ onSelectTool }) => {
  const [urlInput, setUrlInput] = useState('https://stripe.com');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CoreWebVitalsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [presentationOpen, setPresentationOpen] = useState(false);

  const handleCheck = async (e?: React.FormEvent, customStrategy?: 'mobile' | 'desktop') => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    const currentStrategy = customStrategy || strategy;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/check-core-web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim(), strategy: currentStrategy }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Core Web Vitals check failed');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingBadge = (rating: WebVitalMetric['rating']) => {
    switch (rating) {
      case 'good':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Good (Pass)</span>
          </span>
        );
      case 'needs-improvement':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Needs Improvement</span>
          </span>
        );
      case 'poor':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
            <span>Poor (Fail)</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <Activity className="h-4 w-4" />
          <span>Google Page Experience</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Core Web Vitals Checker
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Analyze Google official Core Web Vitals signals: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) powered by Google PageSpeed Insights &amp; Lighthouse diagnostics.
        </p>
      </div>

      {/* Input box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-stretch gap-3">
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

          {/* Strategy segmented control */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-700/80 shrink-0">
            <button
              type="button"
              onClick={() => {
                setStrategy('mobile');
                if (data) handleCheck(undefined, 'mobile');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                strategy === 'mobile'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStrategy('desktop');
                if (data) handleCheck(undefined, 'desktop');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                strategy === 'desktop'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Testing Performance...' : 'Analyze Vitals'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Test examples:</span>
          {['https://stripe.com', 'https://github.com', 'https://wikipedia.org'].map((ex) => (
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

      {loading && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">
            Running PageSpeed Insights audit &amp; simulating browser layout shifts...
          </p>
          <p className="text-xs text-slate-500">
            Analyzing LCP, INP, CLS, and main thread execution time
          </p>
        </div>
      )}

      {/* Results View */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Top Bar Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-900/80 border border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Target URL:
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-white truncate max-w-md">
                  {data.url}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Data Source: <span className="text-slate-200">{data.dataSource}</span> · Strategy:{' '}
                <span className="font-semibold text-emerald-400 uppercase">{data.strategy}</span>
              </p>
            </div>

            {/* Actions & Score */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setPresentationOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors shadow-sm"
              >
                <Presentation className="h-3.5 w-3.5" />
                <span>Presentation Deck</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Performance Score</div>
                  <div
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      data.overallScore >= 90
                        ? 'text-emerald-400'
                        : data.overallScore >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {data.overallScore} / 100
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg ${
                    data.overallScore >= 90
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : data.overallScore >= 50
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {data.overallScore >= 90 ? 'A' : data.overallScore >= 50 ? 'B' : 'C'}
                </div>
              </div>
            </div>
          </div>

          {/* Three Primary Core Web Vitals Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-400" />
                <span>Google Core Web Vitals Status</span>
              </h2>
              <span className="text-xs text-slate-400">
                Passing requires Good scores across all 3 vitals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. LCP Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {data.lcp.acronym}
                    </span>
                    {renderRatingBadge(data.lcp.rating)}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-200 mt-2">
                    {data.lcp.name}
                  </h3>

                  <div className="text-3xl font-extrabold font-mono tabular-nums text-white mt-2">
                    {data.lcp.displayValue}
                  </div>

                  {/* Threshold bar */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
                      <div className="bg-emerald-500 h-full w-[41%]" title="Good <= 2.5s" />
                      <div className="bg-amber-500 h-full w-[25%]" title="Needs Improvement 2.5-4s" />
                      <div className="bg-rose-500 h-full w-[34%]" title="Poor > 4s" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                      <span>0s</span>
                      <span className="text-emerald-400">2.5s</span>
                      <span className="text-amber-400">4.0s</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {data.lcp.description}
                </p>
              </div>

              {/* 2. INP Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-sky-400">
                      {data.inp.acronym}
                    </span>
                    {renderRatingBadge(data.inp.rating)}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-200 mt-2">
                    {data.inp.name}
                  </h3>

                  <div className="text-3xl font-extrabold font-mono tabular-nums text-white mt-2">
                    {data.inp.displayValue}
                  </div>

                  {/* Threshold bar */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
                      <div className="bg-emerald-500 h-full w-[33%]" title="Good <= 200ms" />
                      <div className="bg-amber-500 h-full w-[50%]" title="Needs Improvement 200-500ms" />
                      <div className="bg-rose-500 h-full w-[17%]" title="Poor > 500ms" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                      <span>0ms</span>
                      <span className="text-emerald-400">200ms</span>
                      <span className="text-amber-400">500ms</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {data.inp.description}
                </p>
              </div>

              {/* 3. CLS Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-amber-400">
                      {data.cls.acronym}
                    </span>
                    {renderRatingBadge(data.cls.rating)}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-200 mt-2">
                    {data.cls.name}
                  </h3>

                  <div className="text-3xl font-extrabold font-mono tabular-nums text-white mt-2">
                    {data.cls.displayValue}
                  </div>

                  {/* Threshold bar */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
                      <div className="bg-emerald-500 h-full w-[25%]" title="Good <= 0.1" />
                      <div className="bg-amber-500 h-full w-[37%]" title="Needs Improvement 0.1-0.25" />
                      <div className="bg-rose-500 h-full w-[38%]" title="Poor > 0.25" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                      <span>0.0</span>
                      <span className="text-emerald-400">0.1</span>
                      <span className="text-amber-400">0.25</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {data.cls.description}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Diagnostic Timings */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Secondary Page Performance Diagnostics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>First Contentful Paint (FCP)</span>
                  <span className="font-mono text-emerald-400">Target &le; 1.8s</span>
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {data.fcp.displayValue}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{data.fcp.description}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Time to First Byte (TTFB)</span>
                  <span className="font-mono text-emerald-400">Target &le; 800ms</span>
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {data.ttfb.displayValue}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{data.ttfb.description}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Blocking Time (TBT)</span>
                  <span className="font-mono text-emerald-400">Target &le; 200ms</span>
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {data.tbt.displayValue}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{data.tbt.description}</div>
              </div>
            </div>
          </div>

          {/* Actionable Optimization Opportunities */}
          {data.opportunities.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span>Top Opportunities for Speed Improvements</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estimated savings directly improving LCP, INP, and page load latency
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {data.opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                          {opp.title}
                        </span>
                        {opp.severity === 'high' ? (
                          <span className="text-[10px] font-semibold text-rose-400">
                            High Impact
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-400">
                            Medium Impact
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        {opp.description}
                      </p>
                    </div>

                    {opp.estimatedSavings && (
                      <div className="sm:text-right shrink-0">
                        <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                          {opp.estimatedSavings}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnostic Context Table */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Audit Environment &amp; Hardware Diagnostics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {data.diagnostics.map((d, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500">{d.label}</div>
                  <div className="text-slate-200 font-mono mt-0.5 truncate">{d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Educational Guide (Section 11) */}
      <div className="border-t border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Google Uses Core Web Vitals
          </h3>
          <p>
            Google incorporates Core Web Vitals into its Page Experience ranking signals alongside HTTPS and mobile-friendliness. Rather than evaluating raw server horsepower, Core Web Vitals measure the perceived real-world experience of actual visitors: how quickly the main content renders (LCP), how fast buttons respond to touch (INP), and whether elements violently jump around on screen (CLS).
          </p>
          <p>
            Websites that pass all three Core Web Vitals thresholds experience measurable reductions in bounce rates and higher organic engagement.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why INP Replaced FID in March 2024
          </h3>
          <p>
            First Input Delay (FID) only recorded the initial user interaction on page load. In March 2024, Google officially promoted Interaction to Next Paint (INP) to a Core Web Vital. INP monitors every click, tap, and keystroke across the entire session duration, reporting the worst latency observed.
          </p>
          <p>
            To optimize INP, break up long tasks exceeding 50ms, avoid heavy JavaScript execution during render cycles, and use CSS transforms instead of layout-triggering properties.
          </p>
        </div>
      </div>

      <RelatedToolsSection currentTool="core-web-vitals" onSelectTool={onSelectTool} />

      {/* Presentation Deck Modal */}
      {data && (
        <PresentationModal
          isOpen={presentationOpen}
          onClose={() => setPresentationOpen(false)}
          initialData={{
            domain: new URL(data.url).hostname,
            url: data.url,
            auditDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            clientName: new URL(data.url).hostname,
            preparedBy: 'CheckDR SEO Intelligence',
            performanceScore: data.overallScore,
            lcpValue: data.lcp.displayValue,
            lcpRating: data.lcp.rating,
            inpValue: data.inp.displayValue,
            inpRating: data.inp.rating,
            clsValue: data.cls.displayValue,
            clsRating: data.cls.rating,
            fcpValue: data.fcp.displayValue,
            ttfbValue: data.ttfb.displayValue,
            opportunities: data.opportunities.map((o) => ({
              title: o.title,
              estimatedSavings: o.estimatedSavings,
              severity: o.severity,
            })),
          }}
        />
      )}
    </div>
  );
};
