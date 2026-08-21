import { InquirySection } from "@/components/InquirySection";

export const metadata = {
  title: "Inquire a Project | Imogen Inocentes",
  description: "Start a project inquiry with Imogen Inocentes — clear scope, budget, and timeline in five steps.",
};

export default function InquirePage() {
  return (
    <main className="page overflow-x-clip pt-[64px] sm:pt-[88px]">
      <InquirySection page id="inquire-page" />
    </main>
  );
}
