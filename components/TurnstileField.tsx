"use client";

import Script from "next/script";
import { CircleAlert, LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { grantInquirySecurityConsent } from "@/lib/inquiry-consent";
import { hasCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";
import styles from "@/components/ProjectInquiryForm.module.css";

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void;
  onStatusChange?: (status: TurnstileStatus) => void;
  /** Inquiry privacy checkbox — enables security check without a separate cookie banner step. */
  inquiryConsent?: boolean;
};

export type TurnstileStatus = "idle" | "loading" | "verified" | "error";

type TurnstileApi = {
  render: (
    element: string | HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      theme?: "light" | "dark" | "auto";
      callback?: (token: string) => void;
      "error-callback"?: (errorCode: string) => boolean | void;
      "expired-callback"?: () => void;
      "timeout-callback"?: () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export function isTurnstileConfigured() {
  return Boolean(siteKey);
}

export function TurnstileField({ onTokenChange, onStatusChange, inquiryConsent = false }: TurnstileFieldProps) {
  const elementId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const onStatusChangeRef = useRef(onStatusChange);
  const [cookieConsentGranted, setCookieConsentGranted] = useState(false);
  const [status, setStatus] = useState<TurnstileStatus>("idle");
  const [errorCode, setErrorCode] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const canLoadSecurity = cookieConsentGranted || inquiryConsent;

  useEffect(() => {
    onTokenChangeRef.current = (token: string) => {
      setStatus(token ? "verified" : "loading");
      onTokenChange(token);
    };
  }, [onTokenChange]);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    onStatusChangeRef.current?.(canLoadSecurity ? status : "idle");
  }, [canLoadSecurity, status]);

  useEffect(() => {
    const sync = () => setCookieConsentGranted(hasCookieConsent());
    sync();
    return onCookieConsentChange(sync);
  }, []);

  useEffect(() => {
    if (inquiryConsent) {
      grantInquirySecurityConsent();
    }
  }, [inquiryConsent]);

  useEffect(() => {
    if (!siteKey || !canLoadSecurity) {
      return;
    }

    let cancelled = false;
    let watchdog: number | undefined;

    function mountWidget() {
      if (cancelled || !window.turnstile || widgetIdRef.current) return;
      const host = document.getElementById(elementId);
      if (!host) return;

      setStatus("loading");
      setErrorCode("");
      widgetIdRef.current = window.turnstile.render(host, {
        sitekey: siteKey,
        action: "project-inquiry",
        theme: "auto",
        callback: (token) => {
          if (watchdog) window.clearTimeout(watchdog);
          onTokenChangeRef.current(token);
        },
        "error-callback": (code) => {
          if (watchdog) window.clearTimeout(watchdog);
          onTokenChangeRef.current("");
          setErrorCode(code);
          setStatus("error");
          return true;
        },
        "expired-callback": () => {
          onTokenChangeRef.current("");
          setErrorCode("expired");
          setStatus("error");
        },
        "timeout-callback": () => {
          onTokenChangeRef.current("");
          setErrorCode("timeout");
          setStatus("error");
        },
      });

      watchdog = window.setTimeout(() => {
        if (cancelled) return;
        onTokenChangeRef.current("");
        setErrorCode("unavailable");
        setStatus("error");
      }, 20_000);
    }

    if (window.turnstile || scriptReady) mountWidget();

    return () => {
      cancelled = true;
      if (watchdog) window.clearTimeout(watchdog);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [canLoadSecurity, elementId, retryKey, scriptReady]);

  const retrySecurityCheck = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }
    document.getElementById(elementId)?.replaceChildren();
    onTokenChangeRef.current("");
    setErrorCode("");
    setStatus("loading");
    setRetryKey((current) => current + 1);
  }, [elementId]);

  const visibleStatus = canLoadSecurity ? status : "idle";

  if (!siteKey) return null;

  if (!canLoadSecurity) {
    return (
      <div className={styles.turnstileGate}>
        <ShieldCheck size={18} aria-hidden="true" className={styles.turnstileGateIcon} />
        <div>
          <p className={styles.turnstileGateTitle}>Security check required</p>
          <p className={styles.turnstileGateText}>
            Confirm the privacy notice above to load bot protection. No ads or analytics — only what&apos;s needed to
            send your inquiry safely.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.turnstile}>
      {visibleStatus === "loading" || visibleStatus === "idle" ? (
        <p className={styles.turnstileLoading}>
          <LoaderCircle size={15} className={styles.loader} aria-hidden="true" />
          Loading security check…
        </p>
      ) : null}
      {visibleStatus === "error" ? (
        <div className={styles.turnstileError} role="alert">
          <CircleAlert size={17} aria-hidden="true" />
          <div>
            <p className={styles.turnstileErrorTitle}>Security check couldn&apos;t finish.</p>
            <p className={styles.turnstileErrorText}>
              {errorCode.startsWith("110")
                ? "This site is not authorized for the current security key."
                : "Check your connection or content blocker, then try again."}
            </p>
            <button type="button" className={styles.turnstileRetry} onClick={retrySecurityCheck}>
              <RefreshCw size={14} aria-hidden="true" />
              Retry security check
            </button>
          </div>
        </div>
      ) : null}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setScriptReady(true);
        }}
        onError={() => {
          onTokenChangeRef.current("");
          setErrorCode("script");
          setStatus("error");
        }}
      />
      <div id={elementId} />
    </div>
  );
}
