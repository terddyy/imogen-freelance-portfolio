import { InquirySection } from "@/components/InquirySection";

export const metadata = {
  title: "Inquire a Project | Imogen Inocentes",
  description: "Start a project inquiry with Imogen Inocentes — clear scope, budget, and timeline in five steps.",
};

export default function InquirePage() {
  return (
    <main className="page overflow-x-clip">
      <InquirySection />
    </main>
  );
}
