export const COOKIE_CONSENT_KEY = "imogen-cookie-consent";
export const COOKIE_CONSENT_VERSION = "1";
export const COOKIE_CONSENT_EVENT = "imogen-cookie-consent-change";

export type CookieConsentRecord = {
  version: string;
  acceptedAt: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCookieConsent(): CookieConsentRecord | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null;
}

export function setCookieConsent(): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: COOKIE_CONSENT_VERSION,
    acceptedAt: new Date().toISOString(),
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
