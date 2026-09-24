import React, { useState, useEffect } from 'react';
import { ToolId } from './types/seo';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { DomainRatingView } from './views/DomainRatingView';
import { BulkDomainView } from './views/BulkDomainView';
import { WebsiteAuditView } from './views/WebsiteAuditView';
import { RedirectCheckerView } from './views/RedirectCheckerView';
import { RobotsCheckerView } from './views/RobotsCheckerView';
import { SitemapCheckerView } from './views/SitemapCheckerView';
import { BrokenLinksView } from './views/BrokenLinksView';
import { CanonicalCheckerView } from './views/CanonicalCheckerView';
import { MetaTagsView } from './views/MetaTagsView';
import { SchemaCheckerView } from './views/SchemaCheckerView';
import { CoreWebVitalsView } from './views/CoreWebVitalsView';

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolId>('home');
  const [targetDomain, setTargetDomain] = useState<string>('stripe.com');
  const [targetUrl, setTargetUrl] = useState<string>('https://stripe.com');

  // Sync with window.location.hash for shareable links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const validTools: ToolId[] = [
        'home',
        'domain-rating',
        'bulk-domain',
        'website-audit',
        'core-web-vitals',
        'redirect-checker',
        'robots-txt',
        'sitemap-checker',
        'broken-links',
        'canonical-checker',
        'meta-tags',
        'schema-checker',
      ];
      if (validTools.includes(hash as ToolId)) {
        setCurrentTool(hash as ToolId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTool = (tool: ToolId) => {
    setCurrentTool(tool);
    window.location.hash = tool === 'home' ? '' : tool;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunDomainCheck = (domain: string) => {
    setTargetDomain(domain);
    setCurrentTool('domain-rating');
    window.location.hash = 'domain-rating';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunAudit = (url: string) => {
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }
    setTargetUrl(cleanUrl);
    setCurrentTool('website-audit');
    window.location.hash = 'website-audit';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <Navbar
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        onQuickAudit={() => handleSelectTool('website-audit')}
      />

      <main className="flex-1">
        {currentTool === 'home' && (
          <HomeView
            onSelectTool={handleSelectTool}
            onRunDomainCheck={handleRunDomainCheck}
            onRunAudit={handleRunAudit}
          />
        )}

        {currentTool === 'domain-rating' && (
          <DomainRatingView
            initialDomain={targetDomain}
            onSelectTool={handleSelectTool}
            onRunAudit={handleRunAudit}
          />
        )}

        {currentTool === 'bulk-domain' && (
          <BulkDomainView
            onSelectTool={handleSelectTool}
            onInspectDomain={handleRunDomainCheck}
          />
        )}

        {currentTool === 'website-audit' && (
          <WebsiteAuditView
            initialUrl={targetUrl}
            onSelectTool={handleSelectTool}
          />
        )}

        {currentTool === 'core-web-vitals' && (
          <CoreWebVitalsView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'redirect-checker' && (
          <RedirectCheckerView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'robots-txt' && (
          <RobotsCheckerView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'sitemap-checker' && (
          <SitemapCheckerView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'broken-links' && (
          <BrokenLinksView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'canonical-checker' && (
          <CanonicalCheckerView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'meta-tags' && (
          <MetaTagsView onSelectTool={handleSelectTool} />
        )}

        {currentTool === 'schema-checker' && (
          <SchemaCheckerView onSelectTool={handleSelectTool} />
        )}
      </main>

      <Footer onSelectTool={handleSelectTool} />
    </div>
  );
}
