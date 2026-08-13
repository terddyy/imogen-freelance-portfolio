import type { Metadata } from "next";
import { InquireSection } from "@/components/inquire/InquireSection";

export const metadata: Metadata = {
  title: "Inquire a Project | Imogen Inocentes",
  description: "Share your project details and get a clear next step for scope, timing, and fit.",
};

export default function InquirePage() {
  return (
    <main className="page overflow-x-clip pt-[88px] pb-3">
      <InquireSection />
    </main>
  );
}
