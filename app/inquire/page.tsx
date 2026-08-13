import type { Metadata } from "next";
import { InquirySection } from "@/components/InquirySection";

export const metadata: Metadata = {
  title: "Inquire a Project | Imogen Inocentes",
  description: "Share your project details and get a clear next step for scope, timing, and fit.",
};

export default function InquirePage() {
  return (
    <main className="page inquiryPage inquiryPage--viewport">
      <InquirySection page />
    </main>
  );
}
