"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hasCookieDecision, setCookieConsent } from "@/lib/cookie-consent";
import styles from "@/components/CookieConsent.module.css";

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
    <aside className={styles.cookieConsent} role="dialog" aria-labelledby="cookie-consent-title" aria-live="polite">
      <div className={styles.cookieConsentContent}>
        <p id="cookie-consent-title" className={styles.cookieConsentTitle}>
          Cookies on this site
        </p>
        <p className={styles.cookieConsentText}>
          This portfolio uses only necessary cookies and local storage — for theme preference and bot
          protection on the inquiry form. There are no analytics or advertising trackers. Reject all to
          browse without those.{" "}
          <Link href="/privacy">Privacy notice</Link>
        </p>
      </div>
      <div className={styles.cookieConsentActions}>
        <button className={`secondaryButton ${styles.cookieConsentButton}`} type="button" onClick={() => decide("rejected")}>
          Reject all
        </button>
        <button className={`primaryButton ${styles.cookieConsentButton}`} type="button" onClick={() => decide("accepted")}>
          Accept necessary cookies
        </button>
      </div>
    </aside>
  );
}
