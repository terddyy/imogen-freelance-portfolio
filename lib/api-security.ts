const PRODUCTION_SITE_ORIGIN = "https://www.imogen.dev";

function addOriginPair(origins: Set<string>, origin: string) {
  try {
    const url = new URL(origin);
    origins.add(url.origin);

    const host = url.hostname;
    if (host.startsWith("www.")) {
      origins.add(`${url.protocol}//${host.slice(4)}`);
    } else if (host.includes(".")) {
      origins.add(`${url.protocol}//www.${host}`);
    }
  } catch {
    /* ignore invalid origin */
  }
}

export function getAllowedOrigins(requestUrl: string): Set<string> {
  const allowed = new Set<string>();

  const configured = process.env.PUBLIC_SITE_ORIGIN?.trim();
  if (configured) {
    addOriginPair(allowed, configured);
  } else if (process.env.NODE_ENV === "production") {
    addOriginPair(allowed, PRODUCTION_SITE_ORIGIN);
  }

  try {
    allowed.add(new URL(requestUrl).origin);
  } catch {
    /* ignore */
  }

  return allowed;
}

export function hasAllowedOrigin(headers: Headers, requestUrl: string) {
  const origin = headers.get("origin");
  if (!origin) return false;

  try {
    return getAllowedOrigins(requestUrl).has(new URL(origin).origin);
  } catch {
    return false;
  }
}

export function hasAllowedRequestSource(headers: Headers, requestUrl: string) {
  const secFetchSite = headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (secFetchSite === "cross-site") return false;

  if (process.env.NODE_ENV === "production") {
    return hasAllowedOrigin(headers, requestUrl);
  }

  const origin = headers.get("origin");
  if (!origin) return true;
  return hasAllowedOrigin(headers, requestUrl);
}
