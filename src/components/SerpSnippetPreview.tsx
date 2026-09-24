import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface SerpSnippetPreviewProps {
  url: string;
  title: string;
  description: string;
}

export const SerpSnippetPreview: React.FC<SerpSnippetPreviewProps> = ({
  url,
  title,
  description,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  let domain = 'example.com';
  let path = '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    domain = parsed.hostname;
    path = parsed.pathname === '/' ? '' : parsed.pathname;
  } catch {
    domain = url || 'example.com';
  }

  const titleLength = title.length;
  // Google SERP desktop cutoff is ~60 chars or 580-600px
  const titleTruncated = titleLength > 60 ? `${title.slice(0, 58)}...` : title || 'Untitled Page';
  const descLength = description.length;
  const descTruncated =
    descLength > 160 ? `${description.slice(0, 155)}...` : description || 'No meta description provided.';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Google SERP Snippet Preview
          </h4>
          <p className="text-[11px] text-slate-400">
            How this page likely renders in organic search results
          </p>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              device === 'desktop'
                ? 'bg-slate-800 text-emerald-400 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              device === 'mobile'
                ? 'bg-slate-800 text-emerald-400 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Snippet Card */}
      <div
        className={`p-4 rounded-lg bg-white text-slate-900 transition-all ${
          device === 'mobile' ? 'max-w-md mx-auto shadow-md' : 'w-full shadow-sm'
        }`}
      >
        {/* Favicon & Breadcrumb */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
            {domain.charAt(0).toUpperCase()}
          </div>
          <div className="text-[12px] text-slate-700 leading-none truncate">
            <span className="font-medium text-slate-900">{domain}</span>
            {path && <span className="text-slate-500 font-normal"> › {path.replace(/^\//, '')}</span>}
          </div>
        </div>

        {/* Title */}
        <div className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug break-words mb-1">
          {titleTruncated}
        </div>

        {/* Description */}
        <div className="text-[13px] text-[#4d5156] leading-relaxed break-words">
          {descTruncated}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span>Title Length:</span>
            <span className="font-mono tabular-nums text-slate-200">{titleLength} / 60 chars</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                titleLength < 30
                  ? 'bg-amber-400 w-1/3'
                  : titleLength <= 60
                  ? 'bg-emerald-400 w-full'
                  : 'bg-rose-400 w-full'
              }`}
            />
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span>Description Length:</span>
            <span className="font-mono tabular-nums text-slate-200">
              {descLength} / 160 chars
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                descLength < 70
                  ? 'bg-amber-400 w-1/3'
                  : descLength <= 160
                  ? 'bg-emerald-400 w-full'
                  : 'bg-rose-400 w-full'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
