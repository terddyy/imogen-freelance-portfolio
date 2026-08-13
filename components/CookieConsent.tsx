"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasCookieConsent, setCookieConsent } from "@/lib/cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsent());
  }, []);

  if (!visible) return null;

  function acceptNecessaryCookies() {
    setCookieConsent();
    setVisible(false);
  }

  return (
    <aside className="cookieConsent" role="dialog" aria-labelledby="cookie-consent-title" aria-live="polite">
      <div className="cookieConsentContent">
        <p id="cookie-consent-title" className="cookieConsentTitle">
          Cookies on this site
        </p>
        <p className="cookieConsentText">
          This portfolio uses only necessary cookies and local storage — for theme preference and bot
          protection on the inquiry form. There are no analytics or advertising trackers.{" "}
          <Link href="/privacy">Privacy notice</Link>
        </p>
      </div>
      <button className="primaryButton cookieConsentButton" type="button" onClick={acceptNecessaryCookies}>
        Accept necessary cookies
      </button>
    </aside>
  );
}
