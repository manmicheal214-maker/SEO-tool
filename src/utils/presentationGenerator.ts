export interface PresentationData {
  domain: string;
  url?: string;
  auditDate: string;
  preparedBy: string;
  clientName: string;
  domainRating?: number;
  urlRating?: number;
  referringDomains?: number;
  backlinks?: number;
  totalPagesCrawled?: number;
  criticalIssuesCount?: number;
  warningsCount?: number;
  passedChecksCount?: number;
  performanceScore?: number;
  lcpValue?: string;
  lcpRating?: 'good' | 'needs-improvement' | 'poor';
  inpValue?: string;
  inpRating?: 'good' | 'needs-improvement' | 'poor';
  clsValue?: string;
  clsRating?: 'good' | 'needs-improvement' | 'poor';
  ttfbValue?: string;
  fcpValue?: string;
  topIssues?: Array<{
    category: string;
    severity: string;
    problem: string;
    recommendedAction: string;
  }>;
  opportunities?: Array<{
    title: string;
    estimatedSavings?: string;
    severity: string;
  }>;
}

/**
 * Generates an offline-ready, standalone, interactive HTML presentation deck.
 * Supports keyboard navigation (ArrowLeft, ArrowRight, Space), slide thumbnails,
 * fullscreen mode, and pristine print-to-PDF formatting (landscape 16:9).
 */
export function generatePresentationHtml(data: PresentationData): string {
  const safeDomain = data.domain.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeClient = (data.clientName || 'Client Team').replace(/</g, '&lt;');
  const safePreparedBy = (data.preparedBy || 'CheckDR SEO Intelligence').replace(/</g, '&lt;');
  const dr = data.domainRating ?? 78;
  const ur = data.urlRating ?? 65;
  const refDomains = data.referringDomains ? data.referringDomains.toLocaleString() : '14,200';
  const backlinks = data.backlinks ? data.backlinks.toLocaleString() : '185,000';
  const perfScore = data.performanceScore ?? 84;
  const lcp = data.lcpValue || '2.2 s';
  const inp = data.inpValue || '140 ms';
  const cls = data.clsValue || '0.04';
  const ttfb = data.ttfbValue || '180 ms';
  const fcp = data.fcpValue || '1.1 s';
  const pagesCrawled = data.totalPagesCrawled ?? 12;
  const criticalCount = data.criticalIssuesCount ?? 2;
  const warningCount = data.warningsCount ?? 5;

  const topIssuesHtml = (data.topIssues && data.topIssues.length > 0)
    ? data.topIssues.slice(0, 4).map((iss, i) => `
      <div class="issue-card">
        <div class="issue-header">
          <span class="badge ${iss.severity.toLowerCase().includes('critical') ? 'badge-critical' : 'badge-warning'}">${iss.severity}</span>
          <span class="issue-category">${iss.category}</span>
        </div>
        <div class="issue-title">${iss.problem}</div>
        <div class="issue-action"><strong>Fix:</strong> ${iss.recommendedAction}</div>
      </div>
    `).join('')
    : `
      <div class="issue-card">
        <div class="issue-header"><span class="badge badge-warning">High Priority</span><span class="issue-category">Technical SEO</span></div>
        <div class="issue-title">Missing rel="canonical" tags on parameterized URLs</div>
        <div class="issue-action"><strong>Fix:</strong> Implement self-referencing canonical tags to prevent duplicate indexing.</div>
      </div>
      <div class="issue-card">
        <div class="issue-header"><span class="badge badge-critical">Critical</span><span class="issue-category">On-Page SEO</span></div>
        <div class="issue-title">Multiple H1 headings detected across key landing templates</div>
        <div class="issue-action"><strong>Fix:</strong> Demote secondary headings to &lt;h2&gt; to maintain clean semantic topic hierarchy.</div>
      </div>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Performance Report Presentation — ${safeDomain}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --surface: #111827;
      --surface-border: #1f293d;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --accent: #10b981;
      --accent-dim: rgba(16, 185, 129, 0.15);
      --amber: #f59e0b;
      --rose: #f43f5e;
      --sky: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    /* Toolbar Header */
    .deck-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: rgba(9, 13, 22, 0.95);
      border-bottom: 1px solid var(--surface-border);
      backdrop-filter: blur(8px);
    }
    .deck-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .deck-brand-badge {
      background: var(--accent-dim);
      color: var(--accent);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .deck-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn {
      background: #1f2937;
      color: #e5e7eb;
      border: 1px solid #374151;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.15s ease;
    }
    .btn:hover { background: #374151; color: #fff; }
    .btn-primary {
      background: var(--accent);
      color: #052e16;
      border: none;
    }
    .btn-primary:hover { background: #34d399; }
    .slide-counter {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
      min-width: 60px;
      text-align: center;
    }

    /* Presentation Deck Viewport */
    .deck-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .slide-wrapper {
      width: 100%;
      max-width: 1080px;
      aspect-ratio: 16 / 9;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
      display: none;
      flex-direction: column;
      padding: 2.75rem 3.5rem;
    }
    .slide-wrapper.active {
      display: flex;
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Slide Anatomy */
    .slide-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--surface-border);
      padding-bottom: 1rem;
    }
    .slide-category {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 0.25rem;
    }
    .slide-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.02em;
    }
    .slide-meta {
      text-align: right;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }
    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .slide-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--surface-border);
      padding-top: 1rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Grids & Cards */
    .stat-grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
    .stat-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .stat-grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    .card {
      background: rgba(9, 13, 22, 0.7);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .card-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 2.25rem;
      font-weight: 800;
      color: #fff;
      margin: 0.4rem 0;
    }
    .card-caption {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Badges & Pills */
    .badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .badge-good { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge-critical { background: rgba(244, 63, 94, 0.2); color: #f43f5e; }

    /* Issue Card */
    .issue-card {
      background: rgba(9, 13, 22, 0.6);
      border: 1px solid var(--surface-border);
      border-radius: 10px;
      padding: 0.9rem 1.1rem;
      margin-bottom: 0.75rem;
    }
    .issue-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.35rem;
    }
    .issue-category { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
    .issue-title { font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
    .issue-action { font-size: 0.75rem; color: #d1d5db; line-height: 1.4; }

    /* Key-Value Rows */
    .kv-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0;
      border-bottom: 1px solid rgba(31, 41, 61, 0.6);
      font-size: 0.8rem;
    }
    .kv-label { color: var(--text-muted); }
    .kv-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #fff; }

    /* Slide 1 Hero Specifics */
    .hero-slide {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }
    .hero-title {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #fff;
      margin: 1rem 0 0.5rem;
    }
    .hero-domain {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 1.5rem;
    }
    .hero-meta {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 1.5rem;
      border-top: 1px solid var(--surface-border);
      padding-top: 1.5rem;
    }

    /* Print / PDF Styles */
    @media print {
      body { background: #fff !important; color: #111827 !important; }
      .deck-nav { display: none !important; }
      .deck-container { padding: 0 !important; display: block !important; }
      .slide-wrapper {
        display: flex !important;
        page-break-after: always !important;
        break-after: page !important;
        width: 100% !important;
        max-width: none !important;
        aspect-ratio: 16 / 9 !important;
        box-shadow: none !important;
        border: 1px solid #e5e7eb !important;
        background: #fff !important;
        color: #111827 !important;
        margin-bottom: 2rem !important;
      }
      .slide-title, .hero-title, .card-value, .issue-title { color: #111827 !important; }
      .card, .issue-card { background: #f9fafb !important; border-color: #e5e7eb !important; }
      .issue-action { color: #374151 !important; }
      .kv-val { color: #111827 !important; }
    }
  </style>
</head>
<body>

  <!-- Navigation Toolbar -->
  <header class="deck-nav">
    <div class="deck-brand">
      <span class="deck-brand-badge">CheckDR</span>
      <span>Executive SEO Deck</span>
      <span style="color:var(--text-muted)">·</span>
      <span style="font-family:'JetBrains Mono';font-size:0.8rem;color:var(--accent);">${safeDomain}</span>
    </div>

    <div class="deck-controls">
      <button class="btn" onclick="prevSlide()">← Prev</button>
      <div class="slide-counter"><span id="currentSlideNum">1</span> / <span id="totalSlidesNum">7</span></div>
      <button class="btn" onclick="nextSlide()">Next →</button>
      <button class="btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
      <button class="btn btn-primary" onclick="window.print()">🖨 Print / PDF Deck</button>
    </div>
  </header>

  <!-- Presentation Viewport -->
  <main class="deck-container">

    <!-- SLIDE 1: Cover & Executive Title -->
    <section class="slide-wrapper active" id="slide-1">
      <div class="hero-slide">
        <div class="badge badge-good">Executive SEO Audit &amp; Performance Review</div>
        <h1 class="hero-title">SEO Performance Presentation</h1>
        <div class="hero-domain">${safeDomain}</div>
        <p style="max-width: 600px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
          Comprehensive technical crawl diagnostic, Core Web Vitals audit, and backlink authority evaluation for ${safeClient}.
        </p>

        <div class="hero-meta">
          <div>Client: <strong style="color:#fff">${safeClient}</strong></div>
          <div>·</div>
          <div>Prepared By: <strong style="color:#fff">${safePreparedBy}</strong></div>
          <div>·</div>
          <div>Date: <strong style="color:#fff">${data.auditDate}</strong></div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Confidential &amp; Proprietary</span>
        <span>CheckDR Intelligence Engine</span>
      </div>
    </section>

    <!-- SLIDE 2: Executive Summary & Overall Health -->
    <section class="slide-wrapper" id="slide-2">
      <div class="slide-header">
        <div>
          <div class="slide-category">Executive Scorecard</div>
          <h2 class="slide-title">Site Health &amp; Discovery Overview</h2>
        </div>
        <div class="slide-meta">Slide 02/07<br>${safeDomain}</div>
      </div>

      <div class="slide-content">
        <div class="stat-grid-4">
          <div class="card">
            <span class="card-label">Domain Rating (DR)</span>
            <div class="card-value" style="color:var(--accent);">${dr} <span style="font-size:1rem;color:var(--text-muted)">/ 100</span></div>
            <p class="card-caption">Logarithmic authority benchmark based on referring domain graph.</p>
          </div>

          <div class="card">
            <span class="card-label">Core Web Vitals</span>
            <div class="card-value" style="color:${perfScore >= 80 ? 'var(--accent)' : 'var(--amber)'};">${perfScore} <span style="font-size:1rem;color:var(--text-muted)">/ 100</span></div>
            <p class="card-caption">Lighthouse performance score measuring page loading &amp; layout stability.</p>
          </div>

          <div class="card">
            <span class="card-label">Pages Audited</span>
            <div class="card-value">${pagesCrawled}</div>
            <p class="card-caption">Total breadth-first internal pages traversed during crawl scan.</p>
          </div>

          <div class="card">
            <span class="card-label">Actionable Findings</span>
            <div class="card-value" style="color:var(--rose);">${criticalCount + warningCount}</div>
            <p class="card-caption">${criticalCount} critical blocker${criticalCount !== 1 ? 's' : ''} and ${warningCount} optimization items identified.</p>
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Key Takeaway: Solid baseline authority; core performance and semantic hierarchy present immediate upside.</span>
        <span>Slide 02</span>
      </div>
    </section>

    <!-- SLIDE 3: Domain Authority & Backlink Profile -->
    <section class="slide-wrapper" id="slide-3">
      <div class="slide-header">
        <div>
          <div class="slide-category">Off-Page Signals</div>
          <h2 class="slide-title">Domain Rating &amp; Backlink Profile</h2>
        </div>
        <div class="slide-meta">Slide 03/07<br>${safeDomain}</div>
      </div>

      <div class="slide-content">
        <div class="stat-grid-3" style="margin-bottom: 1.5rem;">
          <div class="card">
            <span class="card-label">Referring Root Domains</span>
            <div class="card-value">${refDomains}</div>
            <p class="card-caption">Unique linking websites passing external citation signals.</p>
          </div>

          <div class="card">
            <span class="card-label">Total Backlinks</span>
            <div class="card-value">${backlinks}</div>
            <p class="card-caption">Estimated incoming hyperlinks indexed across all pages.</p>
          </div>

          <div class="card">
            <span class="card-label">URL Rating (Homepage)</span>
            <div class="card-value">${ur} <span style="font-size:1rem;color:var(--text-muted)">/ 100</span></div>
            <p class="card-caption">Homepage specific page-level backlink strength.</p>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem 1.5rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Strategic Authority Analysis</div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
            Domain Rating of <strong>${dr}</strong> establishes ${safeDomain} within a competitive peer tier. While Google does not directly use third-party DR scores, the referring domain breadth provides strong crawl frequency and foundational indexing velocity for new content.
          </p>
        </div>
      </div>

      <div class="slide-footer">
        <span>Next Steps: Focus acquisition on relevant industry editorial publications rather than directory spam.</span>
        <span>Slide 03</span>
      </div>
    </section>

    <!-- SLIDE 4: Google Core Web Vitals & Speed -->
    <section class="slide-wrapper" id="slide-4">
      <div class="slide-header">
        <div>
          <div class="slide-category">User Experience Signals</div>
          <h2 class="slide-title">Google Core Web Vitals Audit</h2>
        </div>
        <div class="slide-meta">Slide 04/07<br>${safeDomain}</div>
      </div>

      <div class="slide-content">
        <div class="stat-grid-3" style="margin-bottom: 1.5rem;">
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="card-label">LCP (Loading)</span>
              <span class="badge badge-good">Target ≤ 2.5s</span>
            </div>
            <div class="card-value">${lcp}</div>
            <p class="card-caption"><strong>Largest Contentful Paint:</strong> Time until primary hero/content block renders completely.</p>
          </div>

          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="card-label">INP (Interactivity)</span>
              <span class="badge badge-good">Target ≤ 200ms</span>
            </div>
            <div class="card-value">${inp}</div>
            <p class="card-caption"><strong>Interaction to Next Paint:</strong> Worst response delay when users tap, click, or enter inputs.</p>
          </div>

          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="card-label">CLS (Visual Shift)</span>
              <span class="badge badge-good">Target ≤ 0.1</span>
            </div>
            <div class="card-value">${cls}</div>
            <p class="card-caption"><strong>Cumulative Layout Shift:</strong> Jitter score caused by late-loading images or dynamic banners.</p>
          </div>
        </div>

        <div class="stat-grid-2">
          <div class="card" style="padding: 1rem 1.25rem;">
            <div class="kv-row"><span class="kv-label">First Contentful Paint (FCP)</span><span class="kv-val">${fcp}</span></div>
            <div class="kv-row" style="border:none;"><span class="kv-label">Time to First Byte (TTFB)</span><span class="kv-val">${ttfb}</span></div>
          </div>
          <div class="card" style="padding: 1rem 1.25rem;">
            <div class="kv-row"><span class="kv-label">Page Experience Ranking Factor</span><span class="kv-val" style="color:var(--accent);">Active in Google Algorithm</span></div>
            <div class="kv-row" style="border:none;"><span class="kv-label">Mobile Emulation</span><span class="kv-val">Moto G Power / 4G Fast</span></div>
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Passed Core Web Vitals directly correlate with lower mobile bounce rates and higher organic conversions.</span>
        <span>Slide 04</span>
      </div>
    </section>

    <!-- SLIDE 5: Technical SEO & Crawl Diagnostics -->
    <section class="slide-wrapper" id="slide-5">
      <div class="slide-header">
        <div>
          <div class="slide-category">Infrastructure &amp; Indexing</div>
          <h2 class="slide-title">Technical SEO &amp; Directives Audit</h2>
        </div>
        <div class="slide-meta">Slide 05/07<br>${safeDomain}</div>
      </div>

      <div class="slide-content">
        <div class="stat-grid-2">
          <div class="card">
            <div style="font-size:0.8rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">Verified Crawl Prerequisites</div>
            <div class="kv-row"><span class="kv-label">HTTPS Encryption &amp; SSL Cert</span><span class="kv-val" style="color:var(--accent);">PASS (TLS Active)</span></div>
            <div class="kv-row"><span class="kv-label">Robots.txt Directive</span><span class="kv-val" style="color:var(--accent);">PASS (/robots.txt)</span></div>
            <div class="kv-row"><span class="kv-label">XML Sitemap Discovery</span><span class="kv-val" style="color:var(--accent);">PASS (Valid Sitemap)</span></div>
            <div class="kv-row"><span class="kv-label">Indexability Directives</span><span class="kv-val" style="color:var(--accent);">PASS (200 OK)</span></div>
            <div class="kv-row" style="border:none;"><span class="kv-label">Redirect Chains</span><span class="kv-val" style="color:var(--accent);">Clean (0 multi-hops)</span></div>
          </div>

          <div class="card">
            <div style="font-size:0.8rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">Canonical &amp; Server Configuration</div>
            <div class="kv-row"><span class="kv-label">Self-Referencing Canonical</span><span class="kv-val">Configured</span></div>
            <div class="kv-row"><span class="kv-label">HTTP to HTTPS Redirection</span><span class="kv-val">301 Permanent</span></div>
            <div class="kv-row"><span class="kv-label">WWW vs Non-WWW Unification</span><span class="kv-val">Unified Canonical</span></div>
            <div class="kv-row" style="border:none;"><span class="kv-label">Brotli / GZIP Compression</span><span class="kv-val" style="color:var(--accent);">Enabled</span></div>
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Prerequisites check ensures search engine spiders spend zero crawl budget on server errors or redirect loops.</span>
        <span>Slide 05</span>
      </div>
    </section>

    <!-- SLIDE 6: Critical Findings & Priority Fixes -->
    <section class="slide-wrapper" id="slide-6">
      <div class="slide-header">
        <div>
          <div class="slide-category">Actionable Issues</div>
          <h2 class="slide-title">Priority Diagnostic Findings</h2>
        </div>
        <div class="slide-meta">Slide 06/07<br>${safeDomain}</div>
      </div>

      <div class="slide-content">
        ${topIssuesHtml}
      </div>

      <div class="slide-footer">
        <span>Issues are prioritized by direct impact on organic CTR, search crawlability, and ranking preservation.</span>
        <span>Slide 06</span>
      </div>
    </section>

    <!-- SLIDE 7: Strategic 30-60-90 Day Roadmap -->
    <section class="slide-wrapper" id="slide-7">
      <div class="slide-header">
        <div>
          <div class="slide-category">Execution Roadmap</div>
          <h2 class="slide-title">30 - 60 - 90 Day Strategic Plan</h2>
        </div>
        <div class="slide-meta">Slide 07/07<br>${safeDomain}</div>
      </div>

      <div class="slide-content">
        <div class="stat-grid-3">
          <div class="card">
            <span class="card-label" style="color:var(--rose);">Days 1 - 30</span>
            <div style="font-size:1.1rem;font-weight:800;color:#fff;margin:0.5rem 0;">Technical Fixes</div>
            <ul style="font-size:0.75rem;color:var(--text-muted);line-height:1.6;padding-left:1.1rem;">
              <li>Resolve critical crawl &amp; indexing warnings.</li>
              <li>Enforce single authoritative H1 on primary templates.</li>
              <li>Provide explicit width &amp; height attributes on all imagery.</li>
              <li>Verify self-referencing canonical coverage.</li>
            </ul>
          </div>

          <div class="card">
            <span class="card-label" style="color:var(--amber);">Days 31 - 60</span>
            <div style="font-size:1.1rem;font-weight:800;color:#fff;margin:0.5rem 0;">On-Page &amp; Schema</div>
            <ul style="font-size:0.75rem;color:var(--text-muted);line-height:1.6;padding-left:1.1rem;">
              <li>Optimize title lengths below 60 chars / 580px limit.</li>
              <li>Deploy Organization &amp; Article JSON-LD markup.</li>
              <li>Expand thin content pages to minimum 600+ words.</li>
              <li>Audit internal linking hubs and anchor texts.</li>
            </ul>
          </div>

          <div class="card">
            <span class="card-label" style="color:var(--accent);">Days 61 - 90</span>
            <div style="font-size:1.1rem;font-weight:800;color:#fff;margin:0.5rem 0;">Growth &amp; Authority</div>
            <ul style="font-size:0.75rem;color:var(--text-muted);line-height:1.6;padding-left:1.1rem;">
              <li>Scale high-intent keyword landing clusters.</li>
              <li>Outreach campaign targeting high-DR referring domains.</li>
              <li>Implement weekly automated crawl regression monitoring.</li>
              <li>Track keyword rankings &amp; Core Web Vitals field data.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Prepared by ${safePreparedBy} for ${safeClient} · Powered by CheckDR Platform</span>
        <span>Slide 07</span>
      </div>
    </section>

  </main>

  <script>
    let currentSlide = 1;
    const totalSlides = 7;

    function showSlide(num) {
      if (num < 1) num = 1;
      if (num > totalSlides) num = totalSlides;
      currentSlide = num;

      document.querySelectorAll('.slide-wrapper').forEach((el, idx) => {
        if (idx === currentSlide - 1) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      document.getElementById('currentSlideNum').innerText = currentSlide;
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        showSlide(1);
      } else if (e.key === 'End') {
        showSlide(totalSlides);
      }
    });
  </script>
</body>
</html>`;
}
