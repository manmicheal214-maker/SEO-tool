import React, { useState } from 'react';
import { SEOIssue } from '../types/seo';
import { IssueBadge } from './IssueBadge';
import { ChevronDown, ChevronUp, Copy, Check, Filter, Search, ExternalLink } from 'lucide-react';

interface AuditIssuesListProps {
  issues: SEOIssue[];
}

export const AuditIssuesList: React.FC<AuditIssuesListProps> = ({ issues }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIssueIds, setExpandedIssueIds] = useState<Set<string>>(new Set(issues.slice(0, 3).map((i) => i.id)));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Technical SEO', 'On-Page SEO', 'Structured Data', 'Performance'];
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const toggleExpand = (id: string) => {
    setExpandedIssueIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyIssue = (issue: SEOIssue) => {
    const text = `CheckDR Issue: ${issue.problem}
Category: ${issue.category} | Severity: ${issue.severity}
Why it matters: ${issue.whyItMatters}
Recommended Action: ${issue.recommendedAction}
Affected URLs (${issue.affectedUrls.length}):
${issue.affectedUrls.join('\n')}
Evidence: ${issue.evidence || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(issue.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory !== 'All' && issue.category !== selectedCategory) return false;
    if (selectedSeverity !== 'All' && issue.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inProblem = issue.problem.toLowerCase().includes(q);
      const inAction = issue.recommendedAction.toLowerCase().includes(q);
      const inUrls = issue.affectedUrls.some((u) => u.toLowerCase().includes(q));
      if (!inProblem && !inAction && !inUrls) return false;
    }
    return true;
  });

  const criticalCount = issues.filter((i) => i.severity === 'Critical').length;
  const highCount = issues.filter((i) => i.severity === 'High').length;
  const mediumCount = issues.filter((i) => i.severity === 'Medium').length;
  const lowCount = issues.filter((i) => i.severity === 'Low' || i.severity === 'Informational').length;

  return (
    <div className="space-y-6">
      {/* Metric breakdown summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-rose-400 font-medium">Critical Issues</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immediate crawl/index blockers</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-orange-400 font-medium">High Priority</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            {highCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct technical & on-page deficits</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-amber-400 font-medium">Medium Warnings</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            {mediumCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Optimization opportunities</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-sky-400 font-medium">Low & Informational</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            {lowCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Non-critical hygiene items</div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Severity & Search */}
        <div className="flex items-center gap-3">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter issues or URLs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Issues Accordion */}
      {filteredIssues.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-400 text-sm">
          No diagnostic issues match the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const isExpanded = expandedIssueIds.has(issue.id);
            return (
              <div
                key={issue.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 transition-all hover:border-slate-700"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(issue.id)}
                  className="flex items-start sm:items-center justify-between p-4 cursor-pointer select-none gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    <div className="shrink-0">
                      <IssueBadge severity={issue.severity} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-100">{issue.problem}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{issue.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {issue.affectedUrls.length} affected URL
                          {issue.affectedUrls.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyIssue(issue);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Copy issue details"
                    >
                      {copiedId === issue.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 p-4 space-y-4 text-xs bg-slate-950/40">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Why It Matters
                      </div>
                      <p className="text-slate-300 leading-relaxed">{issue.whyItMatters}</p>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                        Recommended Action
                      </div>
                      <p className="text-slate-200 leading-relaxed">{issue.recommendedAction}</p>
                    </div>

                    {issue.evidence && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Diagnostic Evidence
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                          {issue.evidence}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Affected URLs ({issue.affectedUrls.length})
                      </div>
                      <div className="max-h-36 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                        {issue.affectedUrls.map((u, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-900 border border-slate-800/60 font-mono text-[11px] text-slate-300"
                          >
                            <span className="truncate">{u}</span>
                            <a
                              href={u}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-emerald-400 shrink-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
