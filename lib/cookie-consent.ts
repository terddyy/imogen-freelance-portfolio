export const COOKIE_CONSENT_KEY = "imogen-cookie-consent";
export const COOKIE_CONSENT_VERSION = "1";
export const COOKIE_CONSENT_EVENT = "imogen-cookie-consent-change";

export type CookieConsentStatus = "accepted" | "rejected";

export type CookieConsentRecord = {
  version: string;
  status: CookieConsentStatus;
  decidedAt: string;
};

type StoredConsentRecord = Partial<CookieConsentRecord> & {
  acceptedAt?: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function parseConsentRecord(raw: unknown): CookieConsentRecord | null {
  if (!raw || typeof raw !== "object") return null;

  const value = raw as StoredConsentRecord;
  if (value.version !== COOKIE_CONSENT_VERSION) return null;

  if (value.status === "accepted" || value.status === "rejected") {
    return {
      version: COOKIE_CONSENT_VERSION,
      status: value.status,
      decidedAt: typeof value.decidedAt === "string" ? value.decidedAt : new Date().toISOString(),
    };
  }

  // Legacy records only stored an accept timestamp.
  if (typeof value.acceptedAt === "string") {
    return {
      version: COOKIE_CONSENT_VERSION,
      status: "accepted",
      decidedAt: value.acceptedAt,
    };
  }

  return null;
}

export function getCookieConsent(): CookieConsentRecord | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return parseConsentRecord(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** True after the visitor has accepted or rejected — used to hide the banner. */
export function hasCookieDecision(): boolean {
  return getCookieConsent() !== null;
}

/** True only when the visitor accepted necessary cookies. */
export function hasCookieConsent(): boolean {
  return getCookieConsent()?.status === "accepted";
}

export function setCookieConsent(status: CookieConsentStatus = "accepted"): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: COOKIE_CONSENT_VERSION,
    status,
    decidedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));

  return record;
}

export function onCookieConsentChange(listener: () => void): () => void {
  if (!isBrowser()) return () => undefined;

  window.addEventListener(COOKIE_CONSENT_EVENT, listener);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, listener);
}
