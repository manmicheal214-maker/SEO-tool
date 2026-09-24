import React from 'react';
import { ArrowRight, Globe, Layers, Link as LinkIcon, ShieldCheck, FileCode2, Cpu } from 'lucide-react';
import { ToolId } from '../types/seo';

interface RelatedToolsSectionProps {
  currentTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}

interface ToolMeta {
  id: ToolId;
  title: string;
  desc: string;
  category: string;
}

export const RelatedToolsSection: React.FC<RelatedToolsSectionProps> = ({
  currentTool,
  onSelectTool,
}) => {
  const allTools: ToolMeta[] = [
    {
      id: 'domain-rating',
      title: 'Domain Rating Checker',
      desc: 'Analyze backlink authority and profile strength on a 0-100 logarithmic scale.',
      category: 'Domain Authority',
    },
    {
      id: 'bulk-domain',
      title: 'Bulk DR Checker',
      desc: 'Evaluate up to 30 domains simultaneously with CSV export.',
      category: 'Batch Tools',
    },
    {
      id: 'website-audit',
      title: 'Website SEO Crawler',
      desc: 'Deep multi-page site crawl discovering technical blockers and indexability bugs.',
      category: 'Audits',
    },
    {
      id: 'core-web-vitals',
      title: 'Core Web Vitals Checker',
      desc: 'Audit Google LCP, INP, and CLS performance metrics using PageSpeed Insights standards.',
      category: 'Performance',
    },
    {
      id: 'redirect-checker',
      title: 'Redirect & Chain Checker',
      desc: 'Inspect HTTP 301/302 hops, redirect latency, and loop vulnerabilities.',
      category: 'Technical SEO',
    },
    {
      id: 'robots-txt',
      title: 'Robots.txt Parser & Tester',
      desc: 'Test crawler access rules, user-agent directives, and XML sitemap references.',
      category: 'Technical SEO',
    },
    {
      id: 'sitemap-checker',
      title: 'XML Sitemap Checker',
      desc: 'Verify sitemap syntax, total URL discovery, and HTTP status codes.',
      category: 'Technical SEO',
    },
    {
      id: 'broken-links',
      title: 'Broken Link Checker',
      desc: 'Scan page hyperlinks for 404 dead links and 500 server errors.',
      category: 'Links',
    },
    {
      id: 'canonical-checker',
      title: 'Canonical Tag Checker',
      desc: 'Detect self-referencing canonicals, duplicate variants, and cross-domain references.',
      category: 'Technical SEO',
    },
    {
      id: 'meta-tags',
      title: 'Meta Tag & Heading Analyzer',
      desc: 'Check title lengths, meta descriptions, and H1/H2 heading hierarchy.',
      category: 'On-Page SEO',
    },
    {
      id: 'schema-checker',
      title: 'Schema JSON-LD Validator',
      desc: 'Extract structured data types and test OpenGraph social preview cards.',
      category: 'Structured Data',
    },
  ];

  // Filter out current tool and pick 3-4 highly relevant tools
  const related = allTools.filter((t) => t.id !== currentTool).slice(0, 4);

  return (
    <div className="mt-16 pt-10 border-t border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100">Related SEO Diagnostic Tools</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Continue investigating related technical, on-page, and authority signals.
          </p>
        </div>
        <button
          onClick={() => onSelectTool('home')}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View all tools</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group cursor-pointer p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-medium text-emerald-400">
                {tool.category}
              </span>
              <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white mt-1">
                {tool.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                {tool.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 group-hover:text-emerald-400">
              <span className="font-medium">Launch tool</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
