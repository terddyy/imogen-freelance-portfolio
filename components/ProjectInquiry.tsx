"use client";

import { ArrowRight, Boxes, Check, ChevronLeft, CircleAlert, Ellipsis, Globe2, GraduationCap, LoaderCircle, MonitorSmartphone, PhoneCall, Plus, TrendingUp, X, type LucideProps } from "lucide-react";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { contactMethods } from "@/lib/portfolio-data";
import { WhatsAppIcon } from "@/components/WhatsAppContact";
import { isTurnstileConfigured, TurnstileField } from "@/components/TurnstileField";

type Inquiry = {
  projectTypes: string[];
  project: string;
  website: string;
  budget: string;
  thesisBudget: string;
  teamSize: string;
  phone: string;
  email: string;
};

type ProjectInquiryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyInquiry: Inquiry = { projectTypes: [], project: "", website: "", budget: "", thesisBudget: "", teamSize: "", phone: "", email: "" };
const standardBudgets = ["Under ₱100k", "₱100k–₱350k", "₱350k–₱650k", "₱650k–₱1.2M", "₱1.2M+"];
const thesisBudgets = ["Under ₱50k", "₱50k–₱100k", "₱100k–₱300k", "₱300k+"];
const teamSizes = ["Solo founder", "2–5 people", "6–15 people", "16–50 people", "50+ people"];
function MobileAppIcon({ size = 24, ...props }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect width="10" height="16" x="7" y="4" rx="2" ry="2" />
    </svg>
  );
}

const projectTypes = [
  { label: "Website", icon: Globe2 },
  { label: "Web app / SaaS", icon: MonitorSmartphone },
  { label: "Mobile app", icon: MobileAppIcon },
  { label: "Internal system", icon: Boxes },
  { label: "Improve an existing product", icon: TrendingUp },
  { label: "Thesis / capstone", icon: GraduationCap },
  { label: "Something else", icon: Ellipsis },
];
const whatsappContact = contactMethods.find((method) => method.label === "WhatsApp");
const phoneContact = contactMethods.find((method) => method.label === "Call");
const inquirySteps = [
  "Getting started",
  "Your website",
  "Budget",
  "Team size",
  "Contact",
] as const;

function isWebsite(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return false;
  if (digits.startsWith("63") && digits.length === 12) return true;
  if (digits.startsWith("0") && digits.length === 11) return true;
  if (digits.length === 10 && digits.startsWith("9")) return true;
  return value.trim().startsWith("+") && digits.length >= 8;
}

export function ProjectInquiryDialog({ open, onOpenChange }: ProjectInquiryDialogProps) {
  const [step, setStep] = useState(0);
  const [inquiry, setInquiry] = useState<Inquiry>(emptyInquiry);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [useEmailInstead, setUseEmailInstead] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const turnstileRequired = isTurnstileConfigured();

  const hasAnswers = inquiry.projectTypes.length > 0 || Object.entries(inquiry).some(([field, value]) => field !== "projectTypes" && Boolean(value));
  const hasThesis = inquiry.projectTypes.includes("Thesis / capstone");
  const hasOtherProject = inquiry.projectTypes.some((type) => type !== "Thesis / capstone");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;
    const previous = {
      bodyOverflow: bodyStyle.overflow,
      bodyPosition: bodyStyle.position,
      bodyTop: bodyStyle.top,
      bodyWidth: bodyStyle.width,
      htmlOverflow: htmlStyle.overflow,
    };

    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    return () => {
      bodyStyle.overflow = previous.bodyOverflow;
      bodyStyle.position = previous.bodyPosition;
      bodyStyle.top = previous.bodyTop;
      bodyStyle.width = previous.bodyWidth;
      htmlStyle.overflow = previous.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-inquiry-autofocus]")?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, step, status]);

  const resetInquiry = useCallback(() => {
    setStep(0);
    setInquiry(emptyInquiry);
    setUseEmailInstead(false);
    setNoteOpen(false);
    setStepDirection("forward");
    setStatus("idle");
    setError("");
    setConsent(false);
    setCaptchaToken("");
  }, []);

  const discardAndClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    onOpenChange(false);
    resetInquiry();
  }, [onOpenChange, resetInquiry]);

  const requestClose = useCallback(() => {
    if (hasAnswers) {
      const confirmed = window.confirm("Discard your project details?");
      if (!confirmed) return;
    }
    discardAndClose();
  }, [discardAndClose, hasAnswers]);

  const validStep =
    step === 0
      ? inquiry.projectTypes.length > 0
      : step === 1
        ? isWebsite(inquiry.website)
        : step === 2
          ? (!hasOtherProject || Boolean(inquiry.budget)) && (!hasThesis || Boolean(inquiry.thesisBudget))
          : step === 3
            ? Boolean(inquiry.teamSize)
            : (useEmailInstead ? isEmail(inquiry.email) : isPhone(inquiry.phone)) &&
              consent &&
              (!turnstileRequired || Boolean(captchaToken));

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

      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to send your inquiry right now.");
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
    <dialog
      ref={dialogRef}
      className="inquiryDialog"
      aria-labelledby="inquiry-title"
      onClose={() => {
        onOpenChange(false);
        resetInquiry();
      }}
        onCancel={(event) => {
          event.preventDefault();
          requestClose();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) requestClose();
        }}
      >
        <div className="inquiryModal">
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
              <a href={whatsappContact?.href ?? "https://wa.me/639602506993"} target="_blank" rel="noreferrer" aria-label="Message Imogen on WhatsApp">
                <WhatsAppIcon size={16} />
                WhatsApp
              </a>
            </div>
          </aside>
          {status === "success" ? (
            <section className="inquirySuccess" aria-live="polite">
              <span className="inquirySuccessIcon"><Check size={25} aria-hidden="true" /></span>
              <p className="inquiryStep">Project inquiry sent</p>
              <h2 id="inquiry-title" data-inquiry-autofocus tabIndex={-1}>Your project is on my radar.</h2>
              <p>{useEmailInstead ? "Thanks for sharing the details. Check your inbox for the meeting link, and let&apos;s discuss how we can bring this to life." : "Thanks for sharing the details. I&apos;ll text you the next steps for scheduling a quick call."}</p>
              <button
                className="primaryButton inquirySubmit"
                type="button"
                onClick={() => {
                  discardAndClose();
                  router.push("/");
                }}
              >
                Back to portfolio
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </section>
          ) : (
            <form onSubmit={continueOrSubmit} onKeyDown={continueOnEnter} className="inquiryForm" noValidate>
              <header className="inquiryHeader">
                <div className="inquiryProgressWrap">
                  <div className="inquiryProgress" aria-label={`Step ${step + 1} of 5`}>
                    <span>Step {String(step + 1).padStart(2, "0")} / 05</span>
                    <div aria-hidden="true"><i style={{ width: `${((step + 1) / 5) * 100}%` }} /></div>
                    <small>{inquirySteps[step]}</small>
                  </div>
                </div>
                <button
                  className="inquiryClose"
                  type="button"
                  onClick={requestClose}
                  aria-label="Close project inquiry"
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </header>

              <div className="inquiryQuestion" key={step} data-direction={stepDirection}>
                {step === 0 ? (
                  <>
                    <h2 id="inquiry-title">Let&apos;s work together.</h2>
                    <p>Choose everything that applies.</p>
                    <ProjectTypeStep value={inquiry.projectTypes} onChange={toggleProjectType} />
                    <div className="inquiryOptional">
                      <button
                        className="inquiryOptionalToggle"
                        type="button"
                        aria-expanded={noteOpen}
                        onClick={() => setNoteOpen((open) => !open)}
                      >
                        <Plus size={14} aria-hidden="true" />
                        Add a note <span>(optional)</span>
                      </button>
                      {noteOpen ? (
                        <label className="inquiryField">
                          <span className="inquiryOptionalLabel">Additional details</span>
                          <textarea rows={3} value={inquiry.project} onChange={(event) => update("project", event.target.value)} placeholder="Tell us anything important…" />
                        </label>
                      ) : null}
                    </div>
                  </>
                ) : null}

                {step === 1 ? (
                  <>
                    <h2 id="inquiry-title">Do you already have a website?</h2>
                    <p>Share the link if you have one. If not, you can skip this step.</p>
                    <label className="inquiryField">
                      <span className="srOnly">Existing website</span>
                      <input data-inquiry-autofocus type="text" inputMode="url" autoComplete="url" value={inquiry.website} onChange={(event) => update("website", event.target.value)} placeholder="https://yourwebsite.com" aria-invalid={inquiry.website.length > 0 && !isWebsite(inquiry.website)} />
                    </label>
                    {inquiry.website && !isWebsite(inquiry.website) ? <p className="inquiryValidation">Enter a valid website address.</p> : null}
                    <button className="inquirySkip" type="button" onClick={() => { update("website", ""); setStep(2); }}>Skip for now</button>
                  </>
                ) : null}

                {step === 2 ? <BudgetStep hasOtherProject={hasOtherProject} hasThesis={hasThesis} budget={inquiry.budget} thesisBudget={inquiry.thesisBudget} onChange={update} /> : null}
                {step === 3 ? <ChoiceStep dialogTitle title="How big is your team?" description="This helps me understand how the project will be managed and who I&apos;ll collaborate with." name="team" options={teamSizes} value={inquiry.teamSize} onChange={(value) => update("teamSize", value)} /> : null}

                {step === 4 ? (
                  <>
                    {useEmailInstead ? (
                      <>
                        <h2 id="inquiry-title">Where should I send the meeting link?</h2>
                        <p>Enter your email and I&apos;ll send you the next steps for scheduling a quick call.</p>
                        <label className="inquiryField">
                          <span className="srOnly">Email address</span>
                          <input data-inquiry-autofocus type="email" autoComplete="email" required value={inquiry.email} onChange={(event) => update("email", event.target.value)} placeholder="you@company.com" aria-invalid={inquiry.email.length > 0 && !isEmail(inquiry.email)} />
                        </label>
                        {inquiry.email && !isEmail(inquiry.email) ? <p className="inquiryValidation">Enter a valid email address.</p> : null}
                        <button className="inquirySkip" type="button" onClick={() => { update("email", ""); setUseEmailInstead(false); }}>Use phone instead</button>
                      </>
                    ) : (
                      <>
                        <h2 id="inquiry-title">What&apos;s the best number to reach you?</h2>
                        <p>Share your mobile number and I&apos;ll text you the next steps for scheduling a quick call.</p>
                        <label className="inquiryField">
                          <span className="srOnly">Phone number</span>
                          <input data-inquiry-autofocus type="tel" autoComplete="tel" inputMode="tel" required value={inquiry.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+63 917 123 4567" aria-invalid={inquiry.phone.length > 0 && !isPhone(inquiry.phone)} />
                        </label>
                        {inquiry.phone && !isPhone(inquiry.phone) ? <p className="inquiryValidation">Enter a valid phone number.</p> : null}
                        <button className="inquirySkip" type="button" onClick={() => { update("phone", ""); setUseEmailInstead(true); }}>Use email instead</button>
                      </>
                    )}
                    <InquiryPrivacyControls consent={consent} onConsentChange={setConsent} onCaptchaTokenChange={setCaptchaToken} />
                  </>
                ) : null}
              </div>

              {status === "error" ? <p className="inquiryError" role="alert"><CircleAlert size={17} aria-hidden="true" />{error}</p> : null}
              <footer className="inquiryActions">
                {step > 0 ? <button className="inquiryBack" type="button" onClick={goBack}><ChevronLeft size={17} aria-hidden="true" />Back</button> : <span />}
                <button className="primaryButton inquirySubmit" type="submit" disabled={!validStep || status === "loading"}>
                  {status === "loading" ? <><LoaderCircle className="inquiryLoader" size={17} aria-hidden="true" />Sending…</> : step === 4 ? "Send me the meeting link" : <>Continue <ArrowRight size={17} aria-hidden="true" /></>}
                </button>
              </footer>
            </form>
          )}
        </div>
      </dialog>
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
    <div className="inquiryPrivacy">
      <p className="inquiryPrivacyNotice">
        Your contact details are only used to reply about this project. Read the{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer">
          privacy notice
        </Link>{" "}
        for subprocessors and deletion requests.
      </p>
      <label className="inquiryConsent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
        />
        <span>I understand how my contact details will be used and want to send this inquiry.</span>
      </label>
      <TurnstileField onTokenChange={onCaptchaTokenChange} />
    </div>
  );
}

type ChoiceStepProps = {
  dialogTitle?: boolean;
  title: string;
  description: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function ChoiceStep({ dialogTitle, title, description, name, options, value, onChange }: ChoiceStepProps) {
  return (
    <fieldset className="inquiryChoices">
      <legend id={dialogTitle ? "inquiry-title" : undefined}>{title}</legend>
      {description ? <p>{description}</p> : null}
      <div>
        {options.map((option, index) => (
          <label className="inquiryChoice" key={option}>
            <input data-inquiry-autofocus={index === 0 ? true : undefined} type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
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
      <p>A realistic range helps me recommend the right scope and approach. It won&apos;t lock you into anything.</p>
      {hasOtherProject ? <ChoiceStep title="Project work" description="" name="budget" options={standardBudgets} value={budget} onChange={(value) => onChange("budget", value)} /> : null}
      {hasThesis ? <ChoiceStep title="Thesis / capstone" description="" name="thesisBudget" options={thesisBudgets} value={thesisBudget} onChange={(value) => onChange("thesisBudget", value)} /> : null}
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
        {projectTypes.map(({ label, icon: Icon }) => {
          const selected = value.includes(label);
          const wide = label === "Something else";

          return (
            <label className={`inquiryChoice${wide ? " inquiryProjectChoiceWide" : ""}`} key={label}>
              <input type="checkbox" name="projectTypes" value={label} checked={selected} onChange={() => onChange(label)} />
              <span>
                {selected ? <span className="inquiryProjectChoiceCheck" aria-hidden="true"><Check size={12} /></span> : null}
                <span className="inquiryProjectChoiceIcon"><Icon size={24} aria-hidden="true" /></span>
                <strong>{label}</strong>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
