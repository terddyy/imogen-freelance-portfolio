import Link from "next/link";
import { Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import styles from "@/components/InquiryTrustPanel.module.css";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Your details stay private",
    body: "Contact info is used only to reply to your inquiry — never sold or added to a mailing list.",
  },
  {
    icon: Clock3,
    title: "Reply within 1–2 business days",
    body: "Imogen reviews each submission personally and follows up with clear next steps.",
  },
  {
    icon: MessageCircle,
    title: "No sales automation",
    body: "You hear directly from Imogen, not a chatbot or outsourced intake team.",
  },
] as const;

const nextSteps = [
  "Share your project type, scope, budget, and timeline.",
  "Imogen reviews fit and replies with an honest recommendation.",
  "If it is a match, you schedule a short call to align on scope.",
] as const;

type InquiryTrustPanelProps = {
  headingLevel?: "h1" | "h2";
};

export function InquiryTrustPanel({ headingLevel = "h2" }: InquiryTrustPanelProps) {
  const Heading = headingLevel;

  return (
    <aside className={styles.panel} aria-label="Why this inquiry is safe">
      <span className={styles.label}>Project inquiry</span>
      <Heading className={styles.title}>Tell me about your project — I&apos;ll reply personally.</Heading>
      <p className={styles.lead}>
        Five short steps, about two minutes. Enough context to understand fit — without a lengthy sales
        form or account signup.
      </p>

      <ul className={styles.trustList}>
        {trustPoints.map((point) => {
          const Icon = point.icon;

          return (
            <li key={point.title} className={styles.trustItem}>
              <span className={styles.trustIcon} aria-hidden="true">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span>
                <strong>{point.title}</strong>
                <span>{point.body}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className={styles.nextSteps}>
        <p className={styles.nextStepsTitle}>What happens next</p>
        <ol>
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <p className={styles.privacy}>
        Read how inquiries are handled in the{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer">
          privacy notice
        </Link>
        .
      </p>
    </aside>
  );
}
