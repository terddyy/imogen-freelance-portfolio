"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { hasCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";

type Theme = "dark" | "light";
const THEME_STORAGE_KEY = "imogen-theme";

function readStoredTheme(): Theme {
  if (typeof window === "undefined" || !hasCookieConsent()) {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function persistCurrentThemeIfNeeded() {
  if (!hasCookieConsent() || window.localStorage.getItem(THEME_STORAGE_KEY)) {
    return;
  }

  const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readStoredTheme());
    return onCookieConsentChange(() => {
      persistCurrentThemeIfNeeded();
      setTheme(readStoredTheme());
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (hasCookieConsent()) {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <button
      className="iconButton"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
