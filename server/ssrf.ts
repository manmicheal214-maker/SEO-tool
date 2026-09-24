import dns from 'node:dns/promises';
import { URL } from 'node:url';

/**
 * SSRF Protection Validator
 * Rejects local, loopback, private RFC1918, RFC4193, cloud metadata (169.254.169.254),
 * and invalid protocols before making outbound HTTP requests.
 */

function isPrivateIp(ip: string): boolean {
  // IPv4 Loopback (127.0.0.0/8)
  if (/^127\./.test(ip)) return true;
  // IPv4 Localhost / 0.0.0.0/8
  if (/^0\./.test(ip)) return true;
  // IPv4 RFC1918 10.0.0.0/8
  if (/^10\./.test(ip)) return true;
  // IPv4 RFC1918 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
  // IPv4 RFC1918 192.168.0.0/16
  if (/^192\.168\./.test(ip)) return true;
  // IPv4 Link-Local & AWS/GCP Metadata 169.254.0.0/16
  if (/^169\.254\./.test(ip)) return true;
  // IPv4 Carrier-grade NAT 100.64.0.0/10
  if (/^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(ip)) return true;
  // IPv4 Multicast 224.0.0.0/4 & Reserved 240.0.0.0/4
  if (/^(22[4-9]|23[0-9]|24[0-9]|25[0-5])\./.test(ip)) return true;

  // IPv6 checks
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  // IPv6 Unique local fc00::/7
  if (/^f[cd][0-9a-f]{2}:/i.test(lower)) return true;
  // IPv6 Link-local fe80::/10
  if (/^fe[89ab][0-9a-f]:/i.test(lower)) return true;
  // IPv6 mapped IPv4 ::ffff:127.0.0.1
  if (lower.startsWith('::ffff:')) {
    const v4 = lower.replace('::ffff:', '');
    return isPrivateIp(v4);
  }

  return false;
}

export async function validateSafeUrl(rawUrl: string): Promise<URL> {
  let target = rawUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are allowed');
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost, internal keywords, and cloud metadata names directly
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    throw new Error(`Access to private host "${hostname}" is prohibited for security`);
  }

  // Resolve DNS to verify IP addresses
  try {
    const lookupResults = await dns.lookup(hostname, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      throw new Error(`Domain "${hostname}" could not be resolved`);
    }

    for (const record of lookupResults) {
      if (isPrivateIp(record.address)) {
        throw new Error(`Target resolved to prohibited private IP (${record.address})`);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'DNS lookup failed';
    throw new Error(`DNS verification failed for "${hostname}": ${msg}`);
  }

  return parsed;
}

export async function safeFetch(
  rawUrl: string,
  options: {
    timeoutMs?: number;
    maxRedirects?: number;
    maxBytes?: number;
    headers?: Record<string, string>;
  } = {}
): Promise<{
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  redirects: Array<{ url: string; status: number; durationMs: number }>;
  durationMs: number;
}> {
  const timeoutMs = options.timeoutMs ?? 10000;
  const maxRedirects = options.maxRedirects ?? 6;
  const maxBytes = options.maxBytes ?? 3 * 1024 * 1024; // 3MB limit

  let currentUrl = (await validateSafeUrl(rawUrl)).toString();
  const redirects: Array<{ url: string; status: number; durationMs: number }> = [];
  const startOverall = Date.now();

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const hopStart = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual', // Manual handling to inspect each redirect for SSRF
        headers: {
          'User-Agent':
            'CheckDR-Bot/1.0 (+https://checkdr.dev/bot; fast practical SEO diagnostic crawler)',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const hopDuration = Date.now() - hopStart;
      const status = response.status;

      // Handle Redirects (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(status)) {
        redirects.push({
          url: currentUrl,
          status,
          durationMs: hopDuration,
        });

        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirect with status ${status} missing Location header`);
        }

        const nextUrl = new URL(location, currentUrl).toString();
        // Re-validate next redirect destination against SSRF
        await validateSafeUrl(nextUrl);
        currentUrl = nextUrl;
        continue;
      }

      // Final response reached
      const headersObj: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        headersObj[key.toLowerCase()] = val;
      });

      // Stream text with byte limit protection
      let bodyText = '';
      if (response.body) {
        const reader = response.body.getReader();
        let receivedBytes = 0;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          receivedBytes += value.length;
          if (receivedBytes > maxBytes) {
            reader.cancel();
            throw new Error(`Response size exceeded safe limit of ${Math.round(maxBytes / 1024)}KB`);
          }
          bodyText += decoder.decode(value, { stream: true });
        }
        bodyText += decoder.decode();
      }

      return {
        url: rawUrl,
        finalUrl: currentUrl,
        statusCode: status,
        statusText: response.statusText,
        headers: headersObj,
        body: bodyText,
        redirects,
        durationMs: Date.now() - startOverall,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms while fetching ${currentUrl}`);
      }
      throw err;
    }
  }

  throw new Error(`Too many redirects (exceeded limit of ${maxRedirects})`);
}
