import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Search,
  ArrowUpDown,
  Upload,
  AlertCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { ToolId } from '../types/seo';
import { RelatedToolsSection } from '../components/RelatedToolsSection';

interface BulkDomainItem {
  domain: string;
  dr: number;
  ur: number;
  referringDomains: number;
  backlinks: number;
  status: string;
}

interface BulkDomainViewProps {
  onSelectTool: (tool: ToolId) => void;
  onInspectDomain: (domain: string) => void;
}

export const BulkDomainView: React.FC<BulkDomainViewProps> = ({
  onSelectTool,
  onInspectDomain,
}) => {
  const [rawText, setRawText] = useState<string>(
    'stripe.com\nahrefs.com\nsemrush.com\nmoz.com\ncloudflare.com\nvercel.com\nshopify.com'
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkDomainItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [sortField, setSortField] = useState<'dr' | 'referringDomains' | 'domain'>('dr');
  const [sortAsc, setSortAsc] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunBulk = async () => {
    const domains = rawText
      .split('\n')
      .map((d) => d.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, ''))
      .filter((d) => d.length > 2);

    if (domains.length === 0) {
      setError('Please paste at least one valid domain.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bulk-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains }),
      });

      if (!res.ok) {
        throw new Error(`Failed to analyze domains (Status: ${res.status})`);
      }

      const data = await res.json();
      setResults(data.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bulk check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const lines = content
          .split(/[\r\n,]+/)
          .map((l) => l.trim())
          .filter((l) => l && !l.toLowerCase().includes('domain'));
        setRawText(lines.slice(0, 30).join('\n'));
      }
    };
    reader.readAsText(file);
  };

  const handleExportCsv = () => {
    if (results.length === 0) return;
    const header = 'Domain,Domain Rating (DR),URL Rating (UR),Referring Domains,Estimated Backlinks,Status\n';
    const rows = results
      .map(
        (r) =>
          `"${r.domain}",${r.dr},${r.ur},${r.referringDomains},${r.backlinks},"${r.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checkdr_bulk_domains_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    if (results.length === 0) return;
    const tsv = results
      .map((r) => `${r.domain}\t${r.dr}\t${r.referringDomains}\t${r.backlinks}`)
      .join('\n');
    navigator.clipboard.writeText(`Domain\tDR\tRef Domains\tBacklinks\n${tsv}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSort = (field: 'dr' | 'referringDomains' | 'domain') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredResults = results
    .filter((r) => r.domain.toLowerCase().includes(filterQuery.toLowerCase()))
    .sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <Layers className="h-4 w-4" />
          <span>Batch Processing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Bulk Domain Rating Checker
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Batch analyze up to 30 competitor or client domains simultaneously. Compare Domain Rating (DR), URL Rating (UR), and referring domains with instant CSV export.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Paste Domain List (One per line)
          </label>
          <div className="flex items-center gap-3 text-xs">
            <label className="cursor-pointer text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload CSV / TXT</span>
              <input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-mono">Max 30 domains</span>
          </div>
        </div>

        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="example1.com&#10;example2.org&#10;example3.co"
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            {rawText.split('\n').filter((l) => l.trim().length > 2).length} domains detected
          </div>
          <button
            onClick={handleRunBulk}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs sm:text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-sm shadow-emerald-500/20"
          >
            {loading ? 'Analyzing Batch...' : 'Check All Domains'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">
                Results ({filteredResults.length} domains)
              </span>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by domain..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy TSV'}</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* High Density Data Grid */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
                  <th
                    onClick={() => handleSort('domain')}
                    className="p-3.5 font-semibold cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Domain</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('dr')}
                    className="p-3.5 font-semibold text-right cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Domain Rating</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3.5 font-semibold text-right">URL Rating</th>
                  <th
                    onClick={() => handleSort('referringDomains')}
                    className="p-3.5 font-semibold text-right cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Referring Domains</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3.5 font-semibold text-right">Backlinks</th>
                  <th className="p-3.5 font-semibold text-center">Status</th>
                  <th className="p-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredResults.map((row) => (
                  <tr
                    key={row.domain}
                    className="hover:bg-slate-800/40 transition-colors text-slate-200"
                  >
                    <td className="p-3.5 font-medium font-mono text-white">
                      {row.domain}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold tabular-nums text-emerald-400">
                      {row.dr}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-300">
                      {row.ur}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-300">
                      {row.referringDomains.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-400">
                      {row.backlinks.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-[11px] font-medium text-emerald-400">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onInspectDomain(row.domain)}
                        className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guide & Related Tools */}
      <RelatedToolsSection currentTool="bulk-domain" onSelectTool={onSelectTool} />
    </div>
  );
};
