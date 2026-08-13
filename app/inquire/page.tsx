import type { Metadata } from "next";
import { InquireSection } from "@/components/inquire/InquireSection";

export const metadata: Metadata = {
  title: "Inquire a Project | Imogen Inocentes",
  description: "Share your project details and get a clear next step for scope, timing, and fit.",
};

export default function InquirePage() {
  return (
    <main className="page overflow-x-clip pt-[64px] pb-[calc(80px+env(safe-area-inset-bottom,0px))] sm:pt-[88px] sm:pb-3">
      <InquireSection />
    </main>
  );
}
