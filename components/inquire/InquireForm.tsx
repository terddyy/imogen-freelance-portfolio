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
  TrendingUp,
  type LucideProps,
} from "lucide-react";
import Link from "next/link";
import { TurnstileField } from "@/components/TurnstileField";
import { useProjectInquiryForm } from "@/hooks/useProjectInquiryForm";
import {
  inquiryProjectTypes,
  inquirySteps,
  isEmail,
  isPhone,
  standardBudgets,
  teamSizes,
  thesisBudgets,
  timelines,
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

export function InquireForm() {
  const {
    panelRef,
    step,
    inquiry,
    status,
    useEmailInstead,
    setUseEmailInstead,
    stepDirection,
    error,
    consent,
    setConsent,
    setCaptchaToken,
    hasThesis,
    hasOtherProject,
    progressPercent,
    validStep,
    update,
    toggleProjectType,
    continueOrSubmit,
    continueOnEnter,
    goBack,
  } = useProjectInquiryForm();

  return (
    <div
      ref={panelRef}
      className="flex flex-col overflow-hidden rounded-2xl border border-neon/25 bg-[linear-gradient(180deg,rgba(18,29,37,0.92),rgba(7,12,20,0.96))] p-4 shadow-[0_0_0_1px_rgba(0,255,136,0.08),0_24px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(0,255,136,0.05)] backdrop-blur-xl sm:p-5"
    >
      {status === "success" ? (
        <section className="grid flex-1 content-center justify-items-start gap-4" aria-live="polite">
          <span className="grid size-14 place-items-center rounded-full border border-neon/40 bg-neon/10 text-neon">
            <Check size={25} aria-hidden="true" />
          </span>
          <p className="text-sm font-bold uppercase tracking-wide text-neon">Project inquiry sent</p>
          <h2 id="inquiry-title" data-inquiry-autofocus tabIndex={-1} className="text-xl font-bold tracking-tight text-white">
            Your project is on my radar.
          </h2>
          <p className="max-w-prose text-[15px] leading-relaxed text-[#c4d2e0]">
            {useEmailInstead
              ? "Thanks for sharing the details. Check your inbox for the meeting link, and let's discuss how we can bring this to life."
              : "Thanks for sharing the details. I'll text you the next steps for scheduling a quick call."}
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-2.5 text-sm font-extrabold text-[#04120a] shadow-[0_10px_28px_rgba(0,255,136,0.24)] transition hover:bg-[#2dd46a]"
          >
            Back to portfolio
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <form
          onSubmit={continueOrSubmit}
          onKeyDown={continueOnEnter}
          className="grid grid-rows-[auto_auto_auto] gap-3"
          noValidate
        >
          <InquireStepper currentStep={step} progressPercent={progressPercent} />

          <div
            key={step}
            data-direction={stepDirection}
            className={`${
              step === 0 ? "pt-4 text-center" : "pt-1 text-left"
            } ${stepDirection === "forward" ? "animate-inquiry-forward" : "animate-inquiry-back"}`}
          >
            {step === 0 ? (
              <>
                <h2 id="inquiry-title" className="mb-5 text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Let&apos;s work together.
                </h2>
                <ProjectTypeGrid value={inquiry.projectTypes} onChange={toggleProjectType} />
              </>
            ) : null}

            {step === 1 ? (
              <div className="text-left">
                <h2 id="inquiry-title" className="text-lg font-bold tracking-tight text-white">
                  What are you building?
                </h2>
                <label className="mt-2.5 block">
                  <span className="sr-only">Project goals</span>
                  <textarea
                    data-inquiry-autofocus
                    rows={2}
                    value={inquiry.project}
                    onChange={(event) => update("project", event.target.value)}
                    placeholder="Describe what you want to achieve…"
                    className="h-14 w-full resize-none rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-3 py-2 text-[13px] text-white outline-none transition placeholder:text-[#9eafbf]/60 focus:border-neon/60"
                  />
                </label>
                <RadioGroup
                  title="Team size"
                  name="team"
                  options={[...teamSizes]}
                  value={inquiry.teamSize}
                  onChange={(value) => update("teamSize", value)}
                />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="text-left">
                <h2 id="inquiry-title" className="text-lg font-bold tracking-tight text-white">
                  What budget range are you working with?
                </h2>
                <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-[#c4d2e0]">
                  Be honest — there&apos;s no wrong answer here. An accurate range keeps us aligned so I can
                  recommend the right approach, not over- or under-scope your project.
                </p>
                {hasOtherProject ? (
                  <RadioGroup
                    title="Project work"
                    name="budget"
                    options={[...standardBudgets]}
                    value={inquiry.budget}
                    onChange={(value) => update("budget", value)}
                  />
                ) : null}
                {hasThesis ? (
                  <RadioGroup
                    title="Thesis / capstone"
                    name="thesisBudget"
                    options={[...thesisBudgets]}
                    value={inquiry.thesisBudget}
                    onChange={(value) => update("thesisBudget", value)}
                  />
                ) : null}
              </div>
            ) : null}

            {step === 3 ? (
              <RadioGroup
                title="When do you need this?"
                name="timeline"
                options={[...timelines]}
                value={inquiry.timeline}
                onChange={(value) => update("timeline", value)}
                asMainStep
              />
            ) : null}

            {step === 4 ? (
              <ContactStep
                inquiry={inquiry}
                useEmailInstead={useEmailInstead}
                setUseEmailInstead={setUseEmailInstead}
                update={update}
                consent={consent}
                setConsent={setConsent}
                setCaptchaToken={setCaptchaToken}
              />
            ) : null}
          </div>

          <footer className="relative z-10 mt-0 flex items-center gap-2.5 pt-2">
            {status === "error" ? (
              <p className="flex items-center gap-2 text-sm text-[#ffb5a8]" role="alert">
                <CircleAlert size={17} aria-hidden="true" />
                {error}
              </p>
            ) : null}
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1 text-sm font-extrabold text-[#9eafbf] transition hover:text-neon"
              >
                <ChevronLeft size={17} aria-hidden="true" />
                Back
              </button>
            ) : null}
            <button
              type="submit"
              disabled={!validStep || status === "loading"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon px-4 py-2.5 text-sm font-extrabold text-[#04120a] shadow-[0_10px_28px_rgba(0,255,136,0.24)] transition enabled:hover:bg-[#2dd46a] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/35 disabled:shadow-none"
            >
              {status === "loading" ? (
                <>
                  <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
                  Sending…
                </>
              ) : step === 4 ? (
                "Send me the meeting link"
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

function InquireStepper({
  currentStep,
  progressPercent,
}: {
  currentStep: number;
  progressPercent: number;
}) {
  return (
    <div className="w-full" aria-label={`Step ${currentStep + 1} of 5`}>
      <ol className="relative mb-2.5 grid grid-cols-5 gap-0 before:absolute before:top-[12px] before:right-[10%] before:left-[10%] before:h-px before:bg-white/12 before:content-['']">
        {inquirySteps.map((label, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <li
              key={label}
              className="grid justify-items-center gap-1.5 text-center"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={`relative z-10 grid size-6 place-items-center rounded-full border font-mono text-[9px] font-bold transition ${
                  active
                    ? "border-[#00ff88] bg-[#00ff88] text-[#04120a] shadow-[0_0_0_4px_rgba(0,255,136,0.12),0_0_18px_rgba(0,255,136,0.55)]"
                    : complete
                      ? "border-[#00ff88]/40 bg-[rgba(10,14,18,0.92)] text-[#00ff88]"
                      : "border-white/16 bg-[rgba(10,14,18,0.92)] text-[#9eafbf]/70"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`relative w-full overflow-hidden pb-2 text-[11px] leading-tight whitespace-nowrap text-ellipsis ${
                  active
                    ? "font-bold text-white after:absolute after:right-[22%] after:bottom-0 after:left-[22%] after:h-0.5 after:rounded-full after:bg-[#00ff88] after:shadow-[0_0_8px_rgba(0,255,136,0.7)] after:content-['']"
                    : "font-medium text-[#9eafbf]/60"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3" aria-hidden="true">
        <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.7)] transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-[#9eafbf]/80">{progressPercent}%</span>
      </div>
    </div>
  );
}

function ProjectTypeGrid({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Project type</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
        {inquiryProjectTypes.map(({ label, value: typeValue }) => {
          const selected = value.includes(typeValue);
          const Icon = projectTypeIcons[typeValue];

          return (
            <label key={typeValue} className="relative min-h-[108px] cursor-pointer sm:min-h-[118px]">
              <input
                type="checkbox"
                name="projectTypes"
                value={typeValue}
                checked={selected}
                onChange={() => onChange(typeValue)}
                className="peer sr-only"
              />
              <span
                className={`relative flex h-full flex-col items-center justify-center gap-3 rounded-2xl border px-3 py-4 text-center transition ${
                  selected
                    ? "border-neon bg-neon/[0.06] shadow-[inset_0_0_0_1px_rgba(0,255,136,0.2),0_0_28px_rgba(0,255,136,0.18)]"
                    : "border-white/8 bg-white/[0.03] hover:border-white/15"
                }`}
              >
                {selected ? (
                  <span
                    className="absolute top-2.5 right-2.5 grid size-[22px] place-items-center rounded-full bg-neon text-[#04120a] shadow-[0_0_14px_rgba(0,255,136,0.55)]"
                    aria-hidden="true"
                  >
                    <Check size={12} />
                  </span>
                ) : null}
                <Icon
                  size={28}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`${selected ? "text-neon drop-shadow-[0_0_12px_rgba(0,255,136,0.55)]" : "text-neon/90 drop-shadow-[0_0_8px_rgba(0,255,136,0.35)]"}`}
                />
                <strong className="text-sm font-semibold text-white">{label}</strong>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RadioGroup({
  title,
  description,
  name,
  options,
  value,
  onChange,
  asMainStep = false,
}: {
  title: string;
  description?: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  asMainStep?: boolean;
}) {
  return (
    <fieldset className={`border-0 ${asMainStep ? "text-left" : "mt-3 text-left"}`}>
      <legend
        id={asMainStep ? "inquiry-title" : undefined}
        className={`${asMainStep ? "text-lg font-bold tracking-tight text-white" : "text-[12px] font-bold text-[#c4d2e0]"}`}
      >
        {title}
      </legend>
      {description ? <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-[#c4d2e0]">{description}</p> : null}
      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {options.map((option, index) => {
          const checked = value === option;
          return (
            <label key={option} className="relative min-h-8 cursor-pointer">
              <input
                data-inquiry-autofocus={index === 0 ? true : undefined}
                type="radio"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={`flex h-full items-center rounded-lg border px-3 py-2 text-[13px] font-extrabold transition ${
                  checked
                    ? "border-neon/70 bg-neon/10 text-neon shadow-[inset_0_0_0_1px_rgba(0,255,136,0.13)]"
                    : "border-white/10 bg-white/[0.035] text-[#9eafbf] hover:border-neon/50 hover:text-white"
                }`}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ContactStep({
  inquiry,
  useEmailInstead,
  setUseEmailInstead,
  update,
  consent,
  setConsent,
  setCaptchaToken,
}: {
  inquiry: { email: string; phone: string };
  useEmailInstead: boolean;
  setUseEmailInstead: (value: boolean) => void;
  update: (field: "email" | "phone", value: string) => void;
  consent: boolean;
  setConsent: (value: boolean) => void;
  setCaptchaToken: (token: string) => void;
}) {
  return (
    <div className="text-left">
      {useEmailInstead ? (
        <>
          <h2 id="inquiry-title" className="text-lg font-bold tracking-tight text-white">
            Where should I send the meeting link?
          </h2>
          <label className="mt-2.5 block">
            <span className="sr-only">Email address</span>
            <input
              data-inquiry-autofocus
              type="email"
              autoComplete="email"
              required
              value={inquiry.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@company.com"
              aria-invalid={inquiry.email.length > 0 && !isEmail(inquiry.email)}
              className="w-full rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-3 py-2 text-[13px] text-white outline-none transition placeholder:text-[#9eafbf]/60 focus:border-neon/60 focus:bg-[rgba(2,7,12,0.8)] focus:shadow-[0_0_0_4px_rgba(0,255,136,0.1)]"
            />
          </label>
          {inquiry.email && !isEmail(inquiry.email) ? (
            <p className="mt-2 text-sm text-[#ffb5a8]">Enter a valid email address.</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              update("email", "");
              setUseEmailInstead(false);
            }}
            className="mt-3 text-sm font-extrabold text-neon underline underline-offset-4"
          >
            Use phone instead
          </button>
        </>
      ) : (
        <>
          <h2 id="inquiry-title" className="text-lg font-bold tracking-tight text-white">
            What&apos;s the best number to reach you?
          </h2>
          <label className="mt-2.5 block">
            <span className="sr-only">Phone number</span>
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
              className="w-full rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-3 py-2 text-[13px] text-white outline-none transition placeholder:text-[#9eafbf]/60 focus:border-neon/60 focus:bg-[rgba(2,7,12,0.8)] focus:shadow-[0_0_0_4px_rgba(0,255,136,0.1)]"
            />
          </label>
          {inquiry.phone && !isPhone(inquiry.phone) ? (
            <p className="mt-2 text-sm text-[#ffb5a8]">Enter a valid phone number.</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              update("phone", "");
              setUseEmailInstead(true);
            }}
            className="mt-3 text-sm font-extrabold text-neon underline underline-offset-4"
          >
            Use email instead
          </button>
        </>
      )}
      <div className="mt-3 grid gap-2">
        <p className="text-[12px] leading-snug text-[#9eafbf]">
          Contact details are only used to reply.{" "}
          <Link href="/privacy" target="_blank" rel="noreferrer" className="font-bold text-neon underline underline-offset-2">
            Privacy notice
          </Link>
        </p>
        <label className="flex cursor-pointer items-start gap-2 text-[12px] leading-snug text-white">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5"
          />
          <span>I understand and want to send this inquiry.</span>
        </label>
        <TurnstileField onTokenChange={setCaptchaToken} />
      </div>
    </div>
  );
}
