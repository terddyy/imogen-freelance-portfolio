"use client";

import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from "react";
import { InquiryContext, prefetchInquiryModule } from "@/components/project-inquiry-context";

const ProjectInquiryDialog = lazy(() =>
  import("@/components/ProjectInquiry").then((module) => ({
    default: module.ProjectInquiryDialog,
  })),
);

type ProjectInquiryRootProps = {
  children: ReactNode;
};

export function ProjectInquiryRoot({ children }: ProjectInquiryRootProps) {
  const [open, setOpen] = useState(false);
  const [activated, setActivated] = useState(false);

  const openInquiry = useCallback(() => {
    void prefetchInquiryModule();
    setActivated(true);
    setOpen(true);
  }, []);

  const prefetchInquiry = useCallback(() => {
    void prefetchInquiryModule();
  }, []);

  const value = useMemo(
    () => ({
      openInquiry,
      prefetchInquiry,
    }),
    [openInquiry, prefetchInquiry],
  );

  return (
    <InquiryContext.Provider value={value}>
      {children}
      {activated ? (
        <Suspense fallback={null}>
          <ProjectInquiryDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      ) : null}
    </InquiryContext.Provider>
  );
}
