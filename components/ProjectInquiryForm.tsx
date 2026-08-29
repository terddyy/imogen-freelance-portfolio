"use client";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  CircleAlert,
  LoaderCircle,
  PhoneCall,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { BudgetChoiceGroup } from "@/components/BudgetChoiceGroup";
import {
  TurnstileField,
  isTurnstileConfigured,
  type TurnstileStatus,
} from "@/components/TurnstileField";
import { grantInquirySecurityConsent } from "@/lib/inquiry-consent";
import { WhatsAppIcon } from "@/components/WhatsAppContact";
import {
  emptyInquiry,
  inquiryProjectTypes,
  inquirySteps,
  isBudgetSelectionValid,
  isEmail,
  isPhone,
  phoneContact,
  resolveBudgetValue,
  standardBudgets,
  teamSizes,
  thesisBudgets,
  timelines,
  whatsappContact,
  type Inquiry,
} from "@/lib/project-inquiry";
import styles from "@/components/ProjectInquiryForm.module.css";

const projectTypeIconPaths: Record<string, string> = {
  Website: "/icons/project-types/website.png",
  "Web app / SaaS": "/icons/project-types/webapp-saas.png",
  "Mobile app": "/icons/project-types/mobile-app.png",
  "Internal system": "/icons/project-types/internal-system.png",
  "Improve an existing product": "/icons/project-types/improve-product.png",
  "Thesis / capstone": "/icons/project-types/thesis-capstone.png",
  "Something else": "/icons/project-types/something-else.png",
};

type ProjectInquiryFormProps = {
  compact?: boolean;
};

export function ProjectInquiryForm({ compact = false }: ProjectInquiryFormProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [inquiry, setInquiry] = useState<Inquiry>(emptyInquiry);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaStatus, setCaptchaStatus] = useState<TurnstileStatus>("idle");
  const turnstileRequired = isTurnstileConfigured();

  const hasThesis = inquiry.projectTypes.includes("Thesis / capstone");
  const hasOtherProject = inquiry.projectTypes.some((type) => type !== "Thesis / capstone");
  const hasPhone = Boolean(inquiry.phone.trim());
  const hasEmail = Boolean(inquiry.email.trim());
  const hasValidContact =
    (hasPhone || hasEmail) &&
    (!hasPhone || isPhone(inquiry.phone)) &&
    (!hasEmail || isEmail(inquiry.email));
  const progressPercent = Math.round(((step + 1) / 5) * 100);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-inquiry-autofocus]")?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [step, status]);

  const validStep =
    step === 0
      ? inquiry.projectTypes.length > 0
      : step === 1
        ? Boolean(inquiry.teamSize)
        : step === 2
          ? (!hasOtherProject ||
              isBudgetSelectionValid(inquiry.budget, inquiry.customBudgetAmount, standardBudgets)) &&
            (!hasThesis ||
              isBudgetSelectionValid(
                inquiry.thesisBudget,
                inquiry.customThesisBudgetAmount,
                thesisBudgets,
              ))
          : step === 3
            ? Boolean(inquiry.timeline)
            : hasValidContact && consent &&
              (!turnstileRequired || Boolean(captchaToken));

  const submitHint =
    step !== 4 || status === "loading"
      ? null
      : !hasPhone && !hasEmail
        ? "Add a phone number, email address, or both."
        : hasPhone && !isPhone(inquiry.phone)
          ? "Enter a valid mobile number (e.g. +63 9XX XXX XXXX)."
          : hasEmail && !isEmail(inquiry.email)
            ? "Enter a valid email address."
            : !consent
              ? "Confirm the privacy notice below to continue."
              : turnstileRequired && !captchaToken
                ? captchaStatus === "error"
                  ? "Retry the security check above or contact me directly."
                  : "Wait for the security check to finish above."
                : null;

  function setConsentWithSecurity(value: boolean) {
    setConsent(value);
    if (value) {
      grantInquirySecurityConsent();
    } else {
      setCaptchaToken("");
      setCaptchaStatus("idle");
    }
    setError("");
  }

  function update(field: keyof Inquiry, value: string) {
    setInquiry((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function toggleProjectType(value: string) {
    setInquiry((current) => ({
      ...current,
      projectTypes: current.projectTypes.includes(value)
        ? current.projectTypes.filter((type) => type !== value)
        : [...current.projectTypes, value],
    }));
    setError("");
    (document.activeElement as HTMLElement | null)?.blur();
  }

  async function submit() {
    if (!consent || (turnstileRequired && !captchaToken)) {
      setStatus("error");
      setError("Please confirm the privacy notice and security check before sending.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiry,
          budget: resolveBudgetValue(inquiry.budget, inquiry.customBudgetAmount),
          thesisBudget: resolveBudgetValue(inquiry.thesisBudget, inquiry.customThesisBudgetAmount),
          consent: true,
          captchaToken,
        }),
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to send your inquiry right now.");
      }
      setStatus("success");
    } catch (reason) {
      setStatus("error");
      setError(reason instanceof Error ? reason.message : "Unable to send your inquiry right now.");
      setCaptchaToken("");
    }
  }

  function continueOrSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validStep || status === "loading") return;
    if (step < 4) {
      setStepDirection("forward");
      setStep((current) => current + 1);
      return;
    }
    void submit();
  }

  function continueOnEnter(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    if (event.target instanceof HTMLButtonElement) return;
    if (event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    if (!validStep || status === "loading") return;
    if (step < 4) {
      setStepDirection("forward");
      setStep((current) => current + 1);
      return;
    }
    void submit();
  }

  function goBack() {
    setStepDirection("back");
    setStep((current) => current - 1);
  }

return (
    <div
      ref={panelRef}
      className={clsx(
        styles.panel,
        compact && styles.panelViewport,
        compact && status === "success" && styles.panelSuccess,
      )}
    >
      {!compact ? (
        <aside className={styles.directContact} aria-label="Direct contact">
          <div>
            <span>Prefer to talk directly?</span>
            <strong>+63 960 250 6993</strong>
            <small>Skip the questions and call or WhatsApp me.</small>
          </div>
          <div className={styles.directLinks}>
            <a href={phoneContact?.href ?? "tel:+639602506993"} aria-label="Call Imogen">
              <PhoneCall size={16} aria-hidden="true" />
              Call
            </a>
            <a
              href={whatsappContact?.href ?? "https://wa.me/639602506993"}
              target="_blank"
              rel="noreferrer"
              aria-label="Message Imogen on WhatsApp"
            >
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </div>
        </aside>
      ) : null}

      {status === "success" ? (
        <section className={styles.success} aria-live="polite">
          <span className={styles.successIcon}>
            <Check size={25} aria-hidden="true" />
          </span>
          <p className={styles.step}>Project inquiry sent</p>
          <h2 id="inquiry-title" data-inquiry-autofocus tabIndex={-1}>
            Your project is on my radar.
          </h2>
          <p>
            {hasPhone && hasEmail
              ? "Thanks for sharing the details. I'll use your phone or email to follow up with the next steps."
              : hasEmail
                ? "Thanks for sharing the details. Check your inbox for the next steps."
                : "Thanks for sharing the details. I'll text you the next steps for scheduling a quick call."}
          </p>
          <Link className={clsx(styles.submit, styles.submitFull)} href="/">
            Back to portfolio
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <form onSubmit={continueOrSubmit} onKeyDown={continueOnEnter} className={styles.form} noValidate>
          <header className={styles.header}>
            <InquiryStepper currentStep={step} progressPercent={progressPercent} />
          </header>

          <div
            className={clsx(styles.question, step === 0 && styles.questionHero)}
            key={step}
            data-direction={stepDirection}
          >
            {step === 0 ? (
              <>
                <h2 id="inquiry-title">Let&apos;s work together.</h2>
                <ProjectTypeStep value={inquiry.projectTypes} onChange={toggleProjectType} />
              </>
            ) : null}

            {step === 1 ? (
              <>
                <h2 id="inquiry-title">What are you building?</h2>
                <label className={styles.field}>
                  <span className="srOnly">Project goals</span>
                  <textarea
                    data-inquiry-autofocus
                    rows={2}
                    value={inquiry.project}
                    onChange={(event) => update("project", event.target.value)}
                    placeholder="Describe what you want to achieve…"
                  />
                </label>
                <ChoiceStep
                  title="Team size"
                  description=""
                  name="team"
                  options={[...teamSizes]}
                  value={inquiry.teamSize}
                  onChange={(value) => update("teamSize", value)}
                />
              </>
            ) : null}

            {step === 2 ? (
              <BudgetStep
                hasOtherProject={hasOtherProject}
                hasThesis={hasThesis}
                budget={inquiry.budget}
                thesisBudget={inquiry.thesisBudget}
                customBudgetAmount={inquiry.customBudgetAmount}
                customThesisBudgetAmount={inquiry.customThesisBudgetAmount}
                onChange={update}
              />
            ) : null}

            {step === 3 ? (
              <ChoiceStep
                title="When do you need this?"
                description=""
                name="timeline"
                options={[...timelines]}
                value={inquiry.timeline}
                onChange={(value) => update("timeline", value)}
                asMainStep
              />
            ) : null}

            {step === 4 ? (
              <>
                <h2 id="inquiry-title">How should I reach you?</h2>
                <p>Share both if you can, or use whichever you prefer.</p>
                <div className={styles.contactFields}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone number <small>Optional</small></span>
                    <input
                      data-inquiry-autofocus
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={inquiry.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="+63 917 123 4567"
                      aria-invalid={hasPhone && !isPhone(inquiry.phone)}
                    />
                    {hasPhone && !isPhone(inquiry.phone) ? (
                      <span className={styles.validation}>Enter a valid phone number.</span>
                    ) : null}
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email address <small>Optional</small></span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={inquiry.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="you@company.com"
                      aria-invalid={hasEmail && !isEmail(inquiry.email)}
                    />
                    {hasEmail && !isEmail(inquiry.email) ? (
                      <span className={styles.validation}>Enter a valid email address.</span>
                    ) : null}
                  </label>
                </div>
                <InquiryPrivacyControls
                  consent={consent}
                  captchaStatus={captchaStatus}
                  onConsentChange={setConsentWithSecurity}
                  onCaptchaTokenChange={setCaptchaToken}
                  onCaptchaStatusChange={setCaptchaStatus}
                />
              </>
            ) : null}
          </div>

          <footer className={styles.actions}>
            {((submitHint && !validStep) || status === "error") ? (
              <div className={styles.actionFeedback}>
                {submitHint && !validStep ? (
                  <p className={styles.submitHint} role="status">{submitHint}</p>
                ) : null}
                {status === "error" ? (
                  <p className={styles.error} role="alert">
                    <CircleAlert size={17} aria-hidden="true" />
                    {error}
                  </p>
                ) : null}
              </div>
            ) : null}
            {step > 0 ? (
              <button className={styles.back} type="button" onClick={goBack}>
                <ChevronLeft size={17} aria-hidden="true" />
                Back
              </button>
            ) : null}
            <button className={clsx(styles.submit, styles.submitFull)} type="submit" disabled={!validStep || status === "loading"}>
              {status === "loading" ? (
                <>
                  <LoaderCircle className={styles.loader} size={17} aria-hidden="true" />
                  Sending…
                </>
              ) : step === 4 ? (
                <>
                  <span className={styles.submitShort}>Send meeting link</span>
                  <span className={styles.submitLong}>Send me the meeting link</span>
                </>
              ) : (
                "Continue"
              )}
            </button>
          </footer>
        </form>
      )}
    </div>
  );
}

function InquiryStepper({
  currentStep,
  progressPercent,
}: {
  currentStep: number;
  progressPercent: number;
}) {
  return (
    <div className={styles.stepper} aria-label={`Step ${currentStep + 1} of 5`}>
      <ol className={styles.stepperList}>
        {inquirySteps.map((label, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <li
              key={label}
              className={clsx(styles.stepperItem, active && styles.stepperItemActive, complete && styles.stepperItemComplete)}
              aria-current={active ? "step" : undefined}
            >
              <span className={styles.stepperNode}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.stepperLabel}>{label}</span>
            </li>
          );
        })}
      </ol>
      <div className={styles.progressBar} aria-hidden="true">
        <div className={styles.progressBarTrack}>
          <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <span className={styles.progressBarPercent}>{progressPercent}%</span>
      </div>
    </div>
  );
}

function InquiryPrivacyControls({
  consent,
  captchaStatus,
  onConsentChange,
  onCaptchaTokenChange,
  onCaptchaStatusChange,
}: {
  consent: boolean;
  captchaStatus: TurnstileStatus;
  onConsentChange: (value: boolean) => void;
  onCaptchaTokenChange: (token: string) => void;
  onCaptchaStatusChange: (status: TurnstileStatus) => void;
}) {
  return (
    <div className={clsx(styles.privacy, styles.privacyPanel)}>
      <p className={styles.privacyNotice}>
        Contact details are only used to reply.{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer">
          Privacy notice
        </Link>
      </p>
      <label className={styles.consent}>
        <input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} />
        <span>I&apos;ve read the privacy notice and agree to share my contact details so Imogen can reply.</span>
      </label>
      <TurnstileField
        onTokenChange={onCaptchaTokenChange}
        onStatusChange={onCaptchaStatusChange}
        inquiryConsent={consent}
      />
      {captchaStatus === "error" ? (
        <div className={styles.securityFallback} aria-label="Direct contact alternatives">
          <span>Security check unavailable?</span>
          <a href={phoneContact?.href ?? "tel:+639602506993"}>
            <PhoneCall size={14} aria-hidden="true" />
            Call instead
          </a>
          <a
            href={whatsappContact?.href ?? "https://wa.me/639602506993"}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={14} />
            WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}

type ChoiceStepProps = {
  title: string;
  description: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  asMainStep?: boolean;
};

function ChoiceStep({ title, description, name, options, value, onChange, asMainStep = false }: ChoiceStepProps) {
  return (
    <fieldset className={styles.choices}>
      <legend id={asMainStep ? "inquiry-title" : undefined}>{title}</legend>
      {description ? <p>{description}</p> : null}
      <div>
        {options.map((option, index) => (
          <label className={styles.choice} key={option}>
            <input
              data-inquiry-autofocus={index === 0 ? true : undefined}
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type BudgetStepProps = {
  hasOtherProject: boolean;
  hasThesis: boolean;
  budget: string;
  thesisBudget: string;
  customBudgetAmount: string;
  customThesisBudgetAmount: string;
  onChange: (field: keyof Inquiry, value: string) => void;
};

function BudgetStep({
  hasOtherProject,
  hasThesis,
  budget,
  thesisBudget,
  customBudgetAmount,
  customThesisBudgetAmount,
  onChange,
}: BudgetStepProps) {
  return (
    <section className={styles.budgetStep} aria-labelledby="inquiry-title">
      <h2 id="inquiry-title">What budget range are you working with?</h2>
      <p>
        These ranges are initial estimates and may change based on your project&apos;s scope, timeline, and
        requirements. Not sure yet? Choose &quot;I&apos;m not sure.&quot;
      </p>
      {hasOtherProject ? (
        <BudgetChoiceGroup
          title="Project work"
          name="budget"
          options={standardBudgets}
          value={budget}
          customAmount={customBudgetAmount}
          onSelect={(value) => onChange("budget", value)}
          onCustomAmountChange={(value) => onChange("customBudgetAmount", value)}
        />
      ) : null}
      {hasThesis ? (
        <BudgetChoiceGroup
          title="Thesis / capstone"
          name="thesisBudget"
          options={thesisBudgets}
          value={thesisBudget}
          customAmount={customThesisBudgetAmount}
          onSelect={(value) => onChange("thesisBudget", value)}
          onCustomAmountChange={(value) => onChange("customThesisBudgetAmount", value)}
        />
      ) : null}
    </section>
  );
}

type ProjectTypeStepProps = {
  value: string[];
  onChange: (value: string) => void;
};

function ProjectTypeStep({ value, onChange }: ProjectTypeStepProps) {
  return (
    <fieldset className={clsx(styles.choices, styles.projectChoices)}>
      <legend className="srOnly">Project type</legend>
      <div>
        {inquiryProjectTypes.map(({ label, value: typeValue }) => {
          const selected = value.includes(typeValue);
          const iconSrc = projectTypeIconPaths[typeValue];
          const wide = typeValue === "Something else";

          return (
            <label className={clsx(styles.choice, wide && styles.projectChoiceWide)} key={typeValue}>
              <input
                type="checkbox"
                name="projectTypes"
                value={typeValue}
                checked={selected}
                onChange={() => onChange(typeValue)}
              />
              <span>
                {selected ? (
                  <span className={styles.projectChoiceCheck} aria-hidden="true">
                    <Check size={12} />
                  </span>
                ) : null}
                <span className={styles.projectChoiceIcon}>
                  {/* Plain <img> for tiny static PNG; Next/Image needs per-instance width/height and a loader config — overkill at 28px. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconSrc}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    decoding="async"
                    className={styles.projectChoiceImage}
                    aria-hidden="true"
                  />
                </span>
                <strong>{label}</strong>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
