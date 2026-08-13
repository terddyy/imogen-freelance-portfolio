"use client";

import Script from "next/script";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { grantInquirySecurityConsent } from "@/lib/inquiry-consent";
import { hasCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void;
  /** Inquiry privacy checkbox — enables security check without a separate cookie banner step. */
  inquiryConsent?: boolean;
};

type TurnstileApi = {
  render: (
    element: string | HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
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

export function TurnstileField({ onTokenChange, inquiryConsent = false }: TurnstileFieldProps) {
  const elementId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [cookieConsentGranted, setCookieConsentGranted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const canLoadSecurity = cookieConsentGranted || inquiryConsent;

  useEffect(() => {
    onTokenChangeRef.current = (token: string) => {
      setHasToken(Boolean(token));
      onTokenChange(token);
    };
  }, [onTokenChange]);

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
      setHasToken(false);
      onTokenChangeRef.current("");
      return;
    }

    let cancelled = false;

    function mountWidget() {
      if (cancelled || !window.turnstile || widgetIdRef.current) return;
      const host = document.getElementById(elementId);
      if (!host) return;

      widgetIdRef.current = window.turnstile.render(host, {
        sitekey: siteKey,
        theme: "auto",
        callback: (token) => onTokenChangeRef.current(token),
        "error-callback": () => onTokenChangeRef.current(""),
        "expired-callback": () => onTokenChangeRef.current(""),
        "timeout-callback": () => onTokenChangeRef.current(""),
      });
    }

    function onReady() {
      mountWidget();
    }

    if (window.turnstile) mountWidget();
    window.addEventListener("turnstile-script-ready", onReady);

    return () => {
      cancelled = true;
      window.removeEventListener("turnstile-script-ready", onReady);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [canLoadSecurity, elementId]);

  if (!siteKey) return null;

  if (!canLoadSecurity) {
    return (
      <div className="inquiryTurnstileGate">
        <ShieldCheck size={18} aria-hidden="true" className="inquiryTurnstileGateIcon" />
        <div>
          <p className="inquiryTurnstileGateTitle">Security check required</p>
          <p className="inquiryTurnstileGateText">
            Confirm the privacy notice above to load bot protection. No ads or analytics — only what&apos;s needed to
            send your inquiry safely.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="inquiryTurnstile">
      {!hasToken ? (
        <p className="inquiryTurnstileLoading">
          <LoaderCircle size={15} className="inquiryLoader" aria-hidden="true" />
          Loading security check…
        </p>
      ) : null}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          window.dispatchEvent(new Event("turnstile-script-ready"));
        }}
      />
      <div id={elementId} />
    </div>
  );
}
