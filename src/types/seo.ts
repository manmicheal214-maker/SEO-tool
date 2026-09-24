export interface SEOIssue {
  id: string;
  category: 'Technical SEO' | 'On-Page SEO' | 'Structured Data' | 'Performance';
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  problem: string;
  whyItMatters: string;
  affectedUrls: string[];
  recommendedAction: string;
  evidence?: string;
}

export interface DomainMetricResult {
  domain: string;
  domainRating: number;
  urlRating: number;
  referringDomains: number;
  backlinks: number;
  isMockOrEstimated: boolean;
  dataSource: string;
  history: Array<{ date: string; dr: number; backlinks: number; refDomains: number }>;
  technicalSummary: {
    https: boolean;
    hsts: boolean;
    robotsTxtFound: boolean;
    sitemapFound: boolean;
    indexable: boolean;
    ttfbMs: number;
    statusCode: number;
  };
  onPageSummary: {
    title: string;
    description: string;
    h1: string;
    imagesCount: number;
    internalLinksCount: number;
    externalLinksCount: number;
  };
}

export interface SingleUrlAuditResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  ttfbMs: number;
  durationMs: number;
  contentLengthBytes: number;
  technical: {
    https: boolean;
    hsts: boolean;
    canonicalUrl: string | null;
    isCanonicalSelfReferencing: boolean;
    robotsTxt: {
      found: boolean;
      url: string;
      allowed: boolean;
      sitemapsFound: string[];
      rawExcerpt?: string;
    };
    sitemap: {
      found: boolean;
      url?: string;
      urlCount?: number;
      type?: 'xml' | 'sitemapindex' | 'not_found';
    };
    indexability: {
      isIndexable: boolean;
      reasons: string[];
      metaRobots: string | null;
      xRobotsTag: string | null;
    };
    compression: string;
    cacheControl: string | null;
    redirectChain: Array<{ url: string; status: number; durationMs: number }>;
  };
  onPage: {
    title: {
      text: string;
      length: number;
      pixelWidthEstimate: number;
      status: 'optimal' | 'too_short' | 'too_long' | 'missing';
    };
    description: {
      text: string;
      length: number;
      status: 'optimal' | 'too_short' | 'too_long' | 'missing';
    };
    headings: {
      h1: string[];
      h2Count: number;
      h3Count: number;
      structureStatus: 'optimal' | 'missing_h1' | 'multiple_h1' | 'no_headings';
    };
    content: {
      wordCount: number;
      readingTimeMinutes: number;
      topKeywords: Array<{ word: string; count: number; density: number; inTitle: boolean; inH1: boolean }>;
    };
    images: {
      total: number;
      withAlt: number;
      missingAlt: number;
      missingAltSamples: string[];
    };
    links: {
      internalCount: number;
      externalCount: number;
      brokenCount: number;
      internalSample: Array<{ href: string; anchor: string; nofollow: boolean }>;
      externalSample: Array<{ href: string; anchor: string; nofollow: boolean }>;
    };
  };
  structuredData: {
    hasJsonLd: boolean;
    jsonLdTypes: string[];
    hasMicrodata: boolean;
    openGraph: {
      title?: string;
      description?: string;
      image?: string;
      type?: string;
    };
    twitterCard: {
      card?: string;
      title?: string;
      description?: string;
    };
  };
  performance: {
    ttfbMs: number;
    estimatedFcpMs: number;
    estimatedLcpMs: number;
    estimatedCls: number;
    domElementCount: number;
    scriptsCount: number;
    stylesheetsCount: number;
  };
  issues: SEOIssue[];
}

export interface CrawlResult {
  domain: string;
  totalPagesCrawled: number;
  pages: Array<{
    url: string;
    statusCode: number;
    title: string;
    wordCount: number;
    issuesCount: number;
    ttfbMs: number;
  }>;
  aggregatedIssues: SEOIssue[];
}

export interface WebVitalMetric {
  name: string;
  acronym: string;
  value: number;
  displayValue: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
  targetThreshold: string;
}

export interface OptimizationOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedSavings?: string;
  severity: 'high' | 'medium' | 'low';
}

export interface CoreWebVitalsResult {
  url: string;
  strategy: 'mobile' | 'desktop';
  overallScore: number;
  dataSource: string;
  lcp: WebVitalMetric;
  inp: WebVitalMetric;
  cls: WebVitalMetric;
  fcp: WebVitalMetric;
  ttfb: WebVitalMetric;
  tbt: WebVitalMetric;
  opportunities: OptimizationOpportunity[];
  diagnostics: Array<{ label: string; value: string }>;
  cruxFieldDataAvailable: boolean;
}

export type ToolId =
  | 'home'
  | 'domain-rating'
  | 'bulk-domain'
  | 'website-audit'
  | 'single-url-audit'
  | 'core-web-vitals'
  | 'redirect-checker'
  | 'robots-txt'
  | 'sitemap-checker'
  | 'broken-links'
  | 'canonical-checker'
  | 'meta-tags'
  | 'schema-checker';

