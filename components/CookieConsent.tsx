"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasCookieDecision, setCookieConsent } from "@/lib/cookie-consent";
import styles from "@/components/CookieConsent.module.css";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieDecision());
  }, []);

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
          This portfolio uses only necessary local storage — for your theme preference and this cookie
          choice. There are no analytics or advertising trackers. Reject all to browse without those.{" "}
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
