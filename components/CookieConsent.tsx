"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hasCookieDecision, setCookieConsent } from "@/lib/cookie-consent";

export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieDecision());
  }, []);

  if (pathname === "/inquire") return null;
  if (!visible) return null;

  function decide(status: "accepted" | "rejected") {
    setCookieConsent(status);
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
          protection on the inquiry form. There are no analytics or advertising trackers. Reject all to
          browse without those.{" "}
          <Link href="/privacy">Privacy notice</Link>
        </p>
      </div>
      <div className="cookieConsentActions">
        <button className="secondaryButton cookieConsentButton" type="button" onClick={() => decide("rejected")}>
          Reject all
        </button>
        <button className="primaryButton cookieConsentButton" type="button" onClick={() => decide("accepted")}>
          Accept necessary cookies
        </button>
      </div>
    </aside>
  );
}
