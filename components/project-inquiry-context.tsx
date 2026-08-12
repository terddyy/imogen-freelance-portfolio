"use client";

import { createContext, useContext } from "react";

export type InquiryContextValue = {
  openInquiry: () => void;
  prefetchInquiry: () => void;
};

export const InquiryContext = createContext<InquiryContextValue | null>(null);

export function useInquiryContext() {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error("Inquiry hooks must be used within ProjectInquiryRoot.");
  }
  return context;
}

let prefetchPromise: Promise<unknown> | null = null;

export function prefetchInquiryModule() {
  prefetchPromise ??= import("@/components/ProjectInquiry");
  return prefetchPromise;
}
