import React, { useState } from 'react';
import { Search, ShieldAlert, BarChart3, Globe, Layers, ArrowRight, Menu, X } from 'lucide-react';
import { ToolId } from '../types/seo';

interface NavbarProps {
  currentTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  onQuickAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTool, onSelectTool, onQuickAudit }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ id: ToolId; label: string }> = [
    { id: 'domain-rating', label: 'Domain Rating' },
    { id: 'bulk-domain', label: 'Bulk DR' },
    { id: 'website-audit', label: 'SEO Audit' },
    { id: 'core-web-vitals', label: 'Core Web Vitals' },
    { id: 'redirect-checker', label: 'Redirects' },
    { id: 'robots-txt', label: 'Robots.txt' },
    { id: 'sitemap-checker', label: 'Sitemap' },
    { id: 'meta-tags', label: 'Meta Tags' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectTool('home');
            setMobileMenuOpen(false);
          }}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 group-hover:bg-emerald-500/20 transition-all">
            <span className="font-mono text-sm font-bold">DR</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            CheckDR
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentTool === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTool(link.id)}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onSelectTool('website-audit')}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-sm shadow-emerald-500/10 whitespace-nowrap"
          >
            <span>Run SEO Audit</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTool(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentTool === link.id
                  ? 'bg-slate-900 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onSelectTool('website-audit');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950"
            >
              <span>Run Full SEO Audit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
