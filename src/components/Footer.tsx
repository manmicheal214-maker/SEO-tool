import React from 'react';
import { ToolId } from '../types/seo';

interface FooterProps {
  onSelectTool: (tool: ToolId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool }) => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Domain Intelligence
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTool('domain-rating')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Domain Rating Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('bulk-domain')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Bulk Domain Rating
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('domain-rating')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  URL Rating (UR) Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('domain-rating')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Historical DR Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Technical SEO
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTool('redirect-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Redirect & Chain Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('robots-txt')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Robots.txt Parser & Tester
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('sitemap-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  XML Sitemap Validator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('broken-links')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Broken Link Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('canonical-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Canonical Tag Validator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              On-Page & Schema
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTool('meta-tags')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Meta Tag & Title Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('meta-tags')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  H1/H2 Heading Inspector
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('schema-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Schema JSON-LD Validator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('schema-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Open Graph & Social Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Audits & Monitoring
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTool('core-web-vitals')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Core Web Vitals Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('website-audit')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Website SEO Crawler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('single-url-audit')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Single URL Diagnostic Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('bulk-domain')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Bulk Batch Export
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Transparency Notice */}
        <div className="border-t border-slate-900 pt-6 text-xs text-slate-500 space-y-2">
          <p>
            <strong className="text-slate-400">Diagnostic Transparency:</strong> Domain Rating (DR) and URL Rating (UR) represent estimated third-party logarithmic backlink authority metrics and are not official Google search ranking scores. CheckDR distinguishes between Google-documented signals (HTTPS, mobile responsiveness, canonical directives, Core Web Vitals) and proprietary backlink heuristic calculations.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-900/60">
            <p>© {new Date().getFullYear()} CheckDR Platform. All diagnostic tools designed for high-performance SEO auditing.</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="font-mono text-[11px] tabular-nums">SSRF-Protected Sandbox</span>
              <span>·</span>
              <span className="font-mono text-[11px] tabular-nums">Edge Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
