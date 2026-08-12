"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";

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

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    if (!siteKey) {
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
  }, [elementId]);

  if (!siteKey) return null;

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
