"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { hasCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void;
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

export function TurnstileField({ onTokenChange }: TurnstileFieldProps) {
  const elementId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    setConsentGranted(hasCookieConsent());
    return onCookieConsentChange(() => {
      setConsentGranted(hasCookieConsent());
    });
  }, []);

  useEffect(() => {
    if (!siteKey || !consentGranted) {
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
  }, [consentGranted, elementId]);

  if (!siteKey) return null;

  if (!consentGranted) {
    return (
      <p className="inquiryTurnstileNote">
        Accept necessary cookies on this site to load bot protection before submitting.
      </p>
    );
  }

  return (
    <div className="inquiryTurnstile">
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
