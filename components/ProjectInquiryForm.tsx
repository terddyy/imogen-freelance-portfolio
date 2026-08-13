"use client";

import {
  ArrowRight,
  Boxes,
  Check,
  ChevronLeft,
  CircleAlert,
  Ellipsis,
  Globe2,
  GraduationCap,
  LoaderCircle,
  MonitorSmartphone,
  PhoneCall,
  TrendingUp,
  type LucideProps,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { TurnstileField, isTurnstileConfigured } from "@/components/TurnstileField";
import { grantInquirySecurityConsent } from "@/lib/inquiry-consent";
import { WhatsAppIcon } from "@/components/WhatsAppContact";
import {
  emptyInquiry,
  inquiryProjectTypes,
  inquirySteps,
  isEmail,
  isPhone,
  phoneContact,
  standardBudgets,
  teamSizes,
  thesisBudgets,
  timelines,
  whatsappContact,
  type Inquiry,
} from "@/lib/project-inquiry";

function MobileAppIcon({ size = 24, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="10" height="16" x="7" y="4" rx="2" ry="2" />
    </svg>
  );
}

const projectTypeIcons = {
  Website: Globe2,
  "Web app / SaaS": MonitorSmartphone,
  "Mobile app": MobileAppIcon,
  "Internal system": Boxes,
  "Improve an existing product": TrendingUp,
  "Thesis / capstone": GraduationCap,
  "Something else": Ellipsis,
} as const;

type ProjectInquiryFormProps = {
  compact?: boolean;
};

export function ProjectInquiryForm({ compact = false }: ProjectInquiryFormProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [inquiry, setInquiry] = useState<Inquiry>(emptyInquiry);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [useEmailInstead, setUseEmailInstead] = useState(false);
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRequired = isTurnstileConfigured();

  const hasThesis = inquiry.projectTypes.includes("Thesis / capstone");
  const hasOtherProject = inquiry.projectTypes.some((type) => type !== "Thesis / capstone");
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
          ? (!hasOtherProject || Boolean(inquiry.budget)) && (!hasThesis || Boolean(inquiry.thesisBudget))
          : step === 3
            ? Boolean(inquiry.timeline)
            : (useEmailInstead ? isEmail(inquiry.email) : isPhone(inquiry.phone)) &&
              consent &&
              (!turnstileRequired || Boolean(captchaToken));

  const submitHint =
    step !== 4 || status === "loading"
      ? null
      : useEmailInstead
        ? !inquiry.email
          ? "Add your email to receive the meeting link."
          : !isEmail(inquiry.email)
            ? "Enter a valid email address."
            : !consent
              ? "Confirm the privacy notice below to continue."
              : turnstileRequired && !captchaToken
                ? "Wait for the security check to finish above."
                : null
        : !inquiry.phone
          ? "Add your phone number so we can reach you."
          : !isPhone(inquiry.phone)
            ? "Enter a valid mobile number (e.g. +63 9XX XXX XXXX)."
            : !consent
              ? "Confirm the privacy notice below to continue."
              : turnstileRequired && !captchaToken
                ? "Wait for the security check to finish above."
                : null;

  function setConsentWithSecurity(value: boolean) {
    setConsent(value);
    if (value) {
      grantInquirySecurityConsent();
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
        body: JSON.stringify({ ...inquiry, consent: true, captchaToken }),
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
    <div ref={panelRef} className={`inquiryPanel${compact ? " inquiryPanel--viewport" : ""}`}>
      {!compact ? (
        <aside className="inquiryDirectContact" aria-label="Direct contact">
          <div>
            <span>Prefer to talk directly?</span>
            <strong>+63 960 250 6993</strong>
            <small>Skip the questions and call or WhatsApp me.</small>
          </div>
          <div className="inquiryDirectLinks">
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
        <section className="inquirySuccess" aria-live="polite">
          <span className="inquirySuccessIcon">
            <Check size={25} aria-hidden="true" />
          </span>
          <p className="inquiryStep">Project inquiry sent</p>
          <h2 id="inquiry-title" data-inquiry-autofocus tabIndex={-1}>
            Your project is on my radar.
          </h2>
          <p>
            {useEmailInstead
              ? "Thanks for sharing the details. Check your inbox for the meeting link, and let's discuss how we can bring this to life."
              : "Thanks for sharing the details. I'll text you the next steps for scheduling a quick call."}
          </p>
          <Link className="inquirySubmit inquirySubmit--full" href="/">
            Back to portfolio
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <form onSubmit={continueOrSubmit} onKeyDown={continueOnEnter} className="inquiryForm" noValidate>
          <header className="inquiryHeader">
            <InquiryStepper currentStep={step} progressPercent={progressPercent} />
          </header>

          <div
            className={`inquiryQuestion${step === 0 ? " inquiryQuestion--hero" : ""}`}
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
                <label className="inquiryField">
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
                {useEmailInstead ? (
                  <>
                    <h2 id="inquiry-title">Where should I send the meeting link?</h2>
                    <label className="inquiryField">
                      <span className="srOnly">Email address</span>
                      <input
                        data-inquiry-autofocus
                        type="email"
                        autoComplete="email"
                        required
                        value={inquiry.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="you@company.com"
                        aria-invalid={inquiry.email.length > 0 && !isEmail(inquiry.email)}
                      />
                    </label>
                    {inquiry.email && !isEmail(inquiry.email) ? (
                      <p className="inquiryValidation">Enter a valid email address.</p>
                    ) : null}
                    <button
                      className="inquirySkip"
                      type="button"
                      onClick={() => {
                        update("email", "");
                        setUseEmailInstead(false);
                      }}
                    >
                      Use phone instead
                    </button>
                  </>
                ) : (
                  <>
                    <h2 id="inquiry-title">What&apos;s the best number to reach you?</h2>
                    <label className="inquiryField">
                      <span className="srOnly">Phone number</span>
                      <input
                        data-inquiry-autofocus
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        value={inquiry.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="+63 917 123 4567"
                        aria-invalid={inquiry.phone.length > 0 && !isPhone(inquiry.phone)}
                      />
                    </label>
                    {inquiry.phone && !isPhone(inquiry.phone) ? (
                      <p className="inquiryValidation">Enter a valid phone number.</p>
                    ) : null}
                    <button
                      className="inquirySkip"
                      type="button"
                      onClick={() => {
                        update("phone", "");
                        setUseEmailInstead(true);
                      }}
                    >
                      Use email instead
                    </button>
                  </>
                )}
                <InquiryPrivacyControls
                  consent={consent}
                  onConsentChange={setConsentWithSecurity}
                  onCaptchaTokenChange={setCaptchaToken}
                />
              </>
            ) : null}
          </div>

          <footer className="inquiryActions">
            {submitHint && !validStep && status !== "loading" ? (
              <p className="inquirySubmitHint" role="status">{submitHint}</p>
            ) : null}
            {status === "error" ? (
              <p className="inquiryError" role="alert">
                <CircleAlert size={17} aria-hidden="true" />
                {error}
              </p>
            ) : null}
            {step > 0 ? (
              <button className="inquiryBack" type="button" onClick={goBack}>
                <ChevronLeft size={17} aria-hidden="true" />
                Back
              </button>
            ) : null}
            <button className="inquirySubmit inquirySubmit--full" type="submit" disabled={!validStep || status === "loading"}>
              {status === "loading" ? (
                <>
                  <LoaderCircle className="inquiryLoader" size={17} aria-hidden="true" />
                  Sending…
                </>
              ) : step === 4 ? (
                <>
                  <span className="inquirySubmitShort">Send meeting link</span>
                  <span className="inquirySubmitLong">Send me the meeting link</span>
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
    <div className="inquiryStepper" aria-label={`Step ${currentStep + 1} of 5`}>
      <ol className="inquiryStepperList">
        {inquirySteps.map((label, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <li
              key={label}
              className={`inquiryStepperItem${active ? " inquiryStepperItem--active" : ""}${complete ? " inquiryStepperItem--complete" : ""}`}
              aria-current={active ? "step" : undefined}
            >
              <span className="inquiryStepperNode">{String(index + 1).padStart(2, "0")}</span>
              <span className="inquiryStepperLabel">{label}</span>
            </li>
          );
        })}
      </ol>
      <div className="inquiryProgressBar" aria-hidden="true">
        <div className="inquiryProgressBarTrack">
          <div className="inquiryProgressBarFill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="inquiryProgressBarPercent">{progressPercent}%</span>
      </div>
    </div>
  );
}

function InquiryPrivacyControls({
  consent,
  onConsentChange,
  onCaptchaTokenChange,
}: {
  consent: boolean;
  onConsentChange: (value: boolean) => void;
  onCaptchaTokenChange: (token: string) => void;
}) {
  return (
    <div className="inquiryPrivacy inquiryPrivacyPanel">
      <p className="inquiryPrivacyNotice">
        Contact details are only used to reply.{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer">
          Privacy notice
        </Link>
      </p>
      <label className="inquiryConsent">
        <input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} />
        <span>I understand the privacy notice and accept necessary cookies to send this inquiry securely.</span>
      </label>
      <TurnstileField onTokenChange={onCaptchaTokenChange} inquiryConsent={consent} />
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
    <fieldset className="inquiryChoices">
      <legend id={asMainStep ? "inquiry-title" : undefined}>{title}</legend>
      {description ? <p>{description}</p> : null}
      <div>
        {options.map((option, index) => (
          <label className="inquiryChoice" key={option}>
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
  onChange: (field: keyof Inquiry, value: string) => void;
};

function BudgetStep({ hasOtherProject, hasThesis, budget, thesisBudget, onChange }: BudgetStepProps) {
  return (
    <section className="inquiryBudgetStep" aria-labelledby="inquiry-title">
      <h2 id="inquiry-title">What budget range are you working with?</h2>
      <p>
        Be honest — there&apos;s no wrong answer here. An accurate range keeps us aligned so I can recommend the
        right approach, not over- or under-scope your project.
      </p>
      {hasOtherProject ? (
        <ChoiceStep
          title="Project work"
          description=""
          name="budget"
          options={[...standardBudgets]}
          value={budget}
          onChange={(value) => onChange("budget", value)}
        />
      ) : null}
      {hasThesis ? (
        <ChoiceStep
          title="Thesis / capstone"
          description=""
          name="thesisBudget"
          options={[...thesisBudgets]}
          value={thesisBudget}
          onChange={(value) => onChange("thesisBudget", value)}
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
    <fieldset className="inquiryChoices inquiryProjectChoices">
      <legend className="srOnly">Project type</legend>
      <div>
        {inquiryProjectTypes.map(({ label, value: typeValue }) => {
          const selected = value.includes(typeValue);
          const Icon = projectTypeIcons[typeValue];
          const wide = typeValue === "Something else";

          return (
            <label className={`inquiryChoice${wide ? " inquiryProjectChoiceWide" : ""}`} key={typeValue}>
              <input
                type="checkbox"
                name="projectTypes"
                value={typeValue}
                checked={selected}
                onChange={() => onChange(typeValue)}
              />
              <span>
                {selected ? (
                  <span className="inquiryProjectChoiceCheck" aria-hidden="true">
                    <Check size={12} />
                  </span>
                ) : null}
                <span className="inquiryProjectChoiceIcon">
                  <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
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
