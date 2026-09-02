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
  CUSTOM_BUDGET_OPTION,
  formatCustomBudgetAmount,
  inquiryProjectTypes,
  inquirySteps,
  isCustomBudget,
  isEmail,
  isPhone,
  isValidCustomBudgetAmount,
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
    submitHint,
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
      className="flex flex-col overflow-hidden rounded-lg border border-neon/25 bg-[linear-gradient(180deg,rgba(18,29,37,0.92),rgba(7,12,20,0.96))] p-2.5 shadow-[0_0_0_1px_rgba(255,178,0,0.08),0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-2xl sm:p-5 sm:shadow-[0_0_0_1px_rgba(255,178,0,0.08),0_24px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(255,178,0,0.05)]"
    >
      {status === "success" ? (
        <section className="grid flex-1 content-center justify-items-start gap-2.5 sm:gap-4" aria-live="polite">
          <span className="grid size-11 place-items-center rounded-full border border-neon/40 bg-neon/10 text-neon sm:size-14">
            <Check size={22} aria-hidden="true" className="sm:hidden" />
            <Check size={25} aria-hidden="true" className="hidden sm:block" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide text-neon sm:text-sm">Project inquiry sent</p>
          <h2 id="inquiry-title" data-inquiry-autofocus tabIndex={-1} className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Your project is on my radar.
          </h2>
          <p className="max-w-prose text-[13px] leading-relaxed text-[#c4d2e0] sm:text-[15px]">
            {useEmailInstead
              ? "Thanks for sharing the details. Check your inbox for the meeting link, and let's discuss how we can bring this to life."
              : "Thanks for sharing the details. I'll text you the next steps for scheduling a quick call."}
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neon px-3 py-2 text-xs font-extrabold text-[#1a1200] shadow-[0_10px_28px_rgba(255,178,0,0.24)] transition hover:bg-[#2dd46a] sm:mt-3 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          >
            Back to portfolio
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <form
          onSubmit={continueOrSubmit}
          onKeyDown={continueOnEnter}
          className="grid grid-rows-[auto_auto_auto] gap-1.5 sm:gap-3"
          noValidate
        >
          <InquireStepper currentStep={step} progressPercent={progressPercent} />

          <div
            key={step}
            data-direction={stepDirection}
            className={`${
              step === 0 ? "pt-1 text-center sm:pt-4" : "pt-0 text-left sm:pt-1"
            } ${stepDirection === "forward" ? "animate-inquiry-forward" : "animate-inquiry-back"}`}
          >
            {step === 0 ? (
              <>
                <h2 id="inquiry-title" className="mb-2 text-lg font-bold tracking-tight text-white sm:mb-5 sm:text-2xl sm:text-[28px]">
                  Let&apos;s work together.
                </h2>
                <ProjectTypeGrid value={inquiry.projectTypes} onChange={toggleProjectType} />
              </>
            ) : null}

            {step === 1 ? (
              <div className="text-left">
                <h2 id="inquiry-title" className="text-sm font-bold tracking-tight text-white sm:text-lg">
                  What are you building?
                </h2>
                <label className="mt-1.5 block sm:mt-2.5">
                  <span className="sr-only">Project goals</span>
                  <textarea
                    data-inquiry-autofocus
                    rows={2}
                    value={inquiry.project}
                    onChange={(event) => update("project", event.target.value)}
                    placeholder="Describe what you want to achieve…"
                    className="h-10 w-full resize-none rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-2.5 py-1.5 text-[11px] text-white outline-none transition placeholder:text-[#9eafbf]/60 focus:border-neon/60 sm:h-14 sm:px-3 sm:py-2 sm:text-[13px]"
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
                <h2 id="inquiry-title" className="text-sm font-bold tracking-tight text-white sm:text-lg">
                  What budget range are you working with?
                </h2>
                <p className="mt-1 hidden max-w-prose text-[13px] leading-relaxed text-[#c4d2e0] sm:block">
                  Be honest — there&apos;s no wrong answer here. An accurate range keeps us aligned so I can
                  recommend the right approach, not over- or under-scope your project.
                </p>
                {hasOtherProject ? (
                  <BudgetRadioGroup
                    title="Project work"
                    name="budget"
                    options={standardBudgets}
                    value={inquiry.budget}
                    customAmount={inquiry.customBudgetAmount}
                    onChange={(value) => update("budget", value)}
                    onCustomAmountChange={(value) => update("customBudgetAmount", value)}
                  />
                ) : null}
                {hasThesis ? (
                  <BudgetRadioGroup
                    title="Thesis / capstone"
                    name="thesisBudget"
                    options={thesisBudgets}
                    value={inquiry.thesisBudget}
                    customAmount={inquiry.customThesisBudgetAmount}
                    onChange={(value) => update("thesisBudget", value)}
                    onCustomAmountChange={(value) => update("customThesisBudgetAmount", value)}
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

          <footer className="relative z-10 mt-0 grid gap-1 pt-0.5 sm:gap-2 sm:pt-2">
            {submitHint && !validStep && status !== "loading" ? (
              <p className="text-[10px] leading-snug text-[#9eafbf] sm:text-[12px]" role="status">
                {submitHint}
              </p>
            ) : null}
            <div className="flex flex-col-reverse gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
            {status === "error" ? (
              <p className="flex items-center gap-1.5 text-[11px] text-[#ffb5a8] sm:gap-2 sm:text-sm" role="alert">
                <CircleAlert size={15} aria-hidden="true" className="shrink-0 sm:hidden" />
                <CircleAlert size={17} aria-hidden="true" className="hidden shrink-0 sm:block" />
                {error}
              </p>
            ) : null}
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center gap-0.5 self-start text-[11px] font-extrabold text-[#9eafbf] transition hover:text-neon sm:gap-1 sm:text-sm"
              >
                <ChevronLeft size={15} aria-hidden="true" className="sm:hidden" />
                <ChevronLeft size={17} aria-hidden="true" className="hidden sm:block" />
                Back
              </button>
            ) : null}
            <button
              type="submit"
              disabled={!validStep || status === "loading"}
              className="inline-flex w-full min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-neon px-2.5 py-1.5 text-[11px] font-extrabold text-[#1a1200] shadow-[0_8px_20px_rgba(255,178,0,0.2)] transition enabled:hover:bg-[#2dd46a] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/35 disabled:shadow-none sm:min-h-0 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:shadow-[0_10px_28px_rgba(255,178,0,0.24)]"
            >
              {status === "loading" ? (
                <>
                  <LoaderCircle className="animate-spin" size={15} aria-hidden="true" />
                  Sending…
                </>
              ) : step === 4 ? (
                <>
                  <span className="sm:hidden">Send link</span>
                  <span className="hidden sm:inline">Send me the meeting link</span>
                </>
              ) : (
                "Continue"
              )}
            </button>
            </div>
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
      <ol className="relative mb-1 grid grid-cols-5 gap-0 before:absolute before:top-[8px] before:right-[10%] before:left-[10%] before:h-px before:bg-white/12 before:content-[''] sm:mb-2.5 sm:before:top-[12px]">
        {inquirySteps.map((label, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <li
              key={label}
              className="grid justify-items-center gap-1 text-center sm:gap-1.5"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={`relative z-10 grid size-4 place-items-center rounded-full border font-mono text-[7px] font-bold transition sm:size-6 sm:text-[9px] ${
                  active
                    ? "border-[#ffb200] bg-[#ffb200] text-[#1a1200] shadow-[0_0_0_4px_rgba(255,178,0,0.12),0_0_18px_rgba(255,178,0,0.55)]"
                    : complete
                      ? "border-[#ffb200]/40 bg-[rgba(10,14,18,0.92)] text-[#ffb200]"
                      : "border-white/16 bg-[rgba(10,14,18,0.92)] text-[#9eafbf]/70"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`relative hidden w-full overflow-hidden pb-1 text-[11px] leading-tight whitespace-nowrap text-ellipsis sm:block sm:pb-2 ${
                  active
                    ? "font-bold text-white after:absolute after:right-[22%] after:bottom-0 after:left-[22%] after:h-0.5 after:rounded-full after:bg-[#ffb200] after:shadow-[0_0_8px_rgba(255,178,0,0.7)] after:content-['']"
                    : "font-medium text-[#9eafbf]/60"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 sm:gap-3" aria-hidden="true">
        <div className="h-[2px] overflow-hidden rounded-full bg-white/10 sm:h-[3px]">
          <div
            className="h-full rounded-full bg-[#ffb200] shadow-[0_0_12px_rgba(255,178,0,0.7)] transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="hidden text-[11px] font-medium text-[#9eafbf]/80 sm:inline">{progressPercent}%</span>
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
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-1.5">
        {inquiryProjectTypes.map(({ label, value: typeValue }) => {
          const selected = value.includes(typeValue);
          const Icon = projectTypeIcons[typeValue];

          return (
            <label key={typeValue} className="relative min-h-[44px] cursor-pointer sm:min-h-[72px]">
              <input
                type="checkbox"
                name="projectTypes"
                value={typeValue}
                checked={selected}
                onChange={() => onChange(typeValue)}
                className="peer sr-only"
              />
              <span
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-1.5 text-center transition sm:gap-1.5 sm:rounded-xl sm:px-2 sm:py-2.5 ${
                  selected
                    ? "border-neon bg-neon/[0.06] shadow-[inset_0_0_0_1px_rgba(255,178,0,0.2),0_0_20px_rgba(255,178,0,0.18)]"
                    : "border-white/8 bg-white/[0.03] hover:border-white/15"
                }`}
              >
                {selected ? (
                  <span
                    className="absolute top-0.5 right-0.5 grid size-3 place-items-center rounded-full bg-neon text-[#1a1200] shadow-[0_0_10px_rgba(255,178,0,0.55)] sm:top-1 sm:right-1 sm:size-4"
                    aria-hidden="true"
                  >
                    <Check size={7} className="sm:hidden" />
                    <Check size={9} className="hidden sm:block" />
                  </span>
                ) : null}
                <Icon
                  size={14}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`sm:hidden ${selected ? "text-neon drop-shadow-[0_0_8px_rgba(255,178,0,0.55)]" : "text-neon/90 drop-shadow-[0_0_6px_rgba(255,178,0,0.35)]"}`}
                />
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`hidden sm:block ${selected ? "text-neon drop-shadow-[0_0_8px_rgba(255,178,0,0.55)]" : "text-neon/90 drop-shadow-[0_0_6px_rgba(255,178,0,0.35)]"}`}
                />
                <strong className="text-[8px] font-semibold leading-tight text-white sm:text-[11px]">{label}</strong>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function BudgetRadioGroup({
  title,
  name,
  options,
  value,
  customAmount,
  onChange,
  onCustomAmountChange,
}: {
  title: string;
  name: string;
  options: readonly string[];
  value: string;
  customAmount: string;
  onChange: (value: string) => void;
  onCustomAmountChange: (value: string) => void;
}) {
  const choiceOptions = [...options, CUSTOM_BUDGET_OPTION];
  const showCustomInput = isCustomBudget(value);
  const formattedAmount = customAmount ? formatCustomBudgetAmount(customAmount) : "";

  return (
    <fieldset className="mt-1.5 border-0 text-left sm:mt-3">
      <legend className="text-[10px] font-bold text-[#c4d2e0] sm:text-[12px]">{title}</legend>
      <div className="mt-1 grid grid-cols-1 gap-1 sm:mt-2 sm:grid-cols-2 sm:gap-1.5 md:grid-cols-3">
        {choiceOptions.map((option, index) => {
          const checked = value === option;
          const isWide = option === CUSTOM_BUDGET_OPTION;

          return (
            <label
              key={option}
              className={`relative min-h-7 cursor-pointer sm:min-h-8${isWide ? " sm:col-span-2 md:col-span-3" : ""}`}
            >
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
                className={`flex h-full items-center rounded-md border px-2 py-1 text-[10px] font-extrabold transition sm:rounded-lg sm:px-3 sm:py-2 sm:text-[13px] ${
                  checked
                    ? "border-neon/70 bg-neon/10 text-neon shadow-[inset_0_0_0_1px_rgba(255,178,0,0.13)]"
                    : "border-white/10 bg-white/[0.035] text-[#9eafbf] hover:border-neon/50 hover:text-white"
                }`}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
      {showCustomInput ? (
        <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 sm:mt-3 sm:p-3">
          <label htmlFor={`${name}-amount`} className="text-[10px] font-bold text-[#c4d2e0] sm:text-[12px]">
            Your budget amount
          </label>
          <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-2.5 py-1.5 sm:px-3 sm:py-2">
            <span className="text-[11px] font-bold text-[#9eafbf] sm:text-[13px]" aria-hidden="true">
              ₱
            </span>
            <input
              id={`${name}-amount`}
              data-inquiry-autofocus
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={customAmount}
              onChange={(event) => onCustomAmountChange(event.target.value.replace(/\D/g, ""))}
              placeholder="500000"
              aria-describedby={`${name}-amount-hint`}
              className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-[#9eafbf]/60 sm:text-[13px]"
            />
          </div>
          <p id={`${name}-amount-hint`} className="mt-1.5 text-[10px] leading-relaxed text-[#9eafbf] sm:text-[12px]">
            {formattedAmount && isValidCustomBudgetAmount(customAmount)
              ? `We'll note your budget as ${formattedAmount}.`
              : "Enter the amount in Philippine pesos (minimum ₱1,000)."}
          </p>
        </div>
      ) : null}
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
    <fieldset className={`border-0 ${asMainStep ? "text-left" : "mt-1.5 text-left sm:mt-3"}`}>
      <legend
        id={asMainStep ? "inquiry-title" : undefined}
        className={`${asMainStep ? "text-sm font-bold tracking-tight text-white sm:text-lg" : "text-[10px] font-bold text-[#c4d2e0] sm:text-[12px]"}`}
      >
        {title}
      </legend>
      {description ? <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-[#c4d2e0]">{description}</p> : null}
      <div className="mt-1 grid grid-cols-1 gap-1 sm:mt-2 sm:grid-cols-2 sm:gap-1.5 md:grid-cols-3">
        {options.map((option, index) => {
          const checked = value === option;
          return (
            <label key={option} className="relative min-h-7 cursor-pointer sm:min-h-8">
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
                className={`flex h-full items-center rounded-md border px-2 py-1 text-[10px] font-extrabold transition sm:rounded-lg sm:px-3 sm:py-2 sm:text-[13px] ${
                  checked
                    ? "border-neon/70 bg-neon/10 text-neon shadow-[inset_0_0_0_1px_rgba(255,178,0,0.13)]"
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
          <h2 id="inquiry-title" className="text-sm font-bold tracking-tight text-white sm:text-lg">
            Where should I send the meeting link?
          </h2>
          <label className="mt-1.5 block sm:mt-2.5">
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
              className="w-full rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-2.5 py-1.5 text-[11px] text-white outline-none transition placeholder:text-[#9eafbf]/60 focus:border-neon/60 focus:bg-[rgba(2,7,12,0.8)] focus:shadow-[0_0_0_4px_rgba(255,178,0,0.1)] sm:px-3 sm:py-2 sm:text-[13px]"
            />
          </label>
          {inquiry.email && !isEmail(inquiry.email) ? (
            <p className="mt-1.5 text-[11px] text-[#ffb5a8] sm:mt-2 sm:text-sm">Enter a valid email address.</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              update("email", "");
              setUseEmailInstead(false);
            }}
            className="mt-2 text-[11px] font-extrabold text-neon underline underline-offset-4 sm:mt-3 sm:text-sm"
          >
            Use phone instead
          </button>
        </>
      ) : (
        <>
          <h2 id="inquiry-title" className="text-sm font-bold tracking-tight text-white sm:text-lg">
            What&apos;s the best number to reach you?
          </h2>
          <label className="mt-1.5 block sm:mt-2.5">
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
              className="w-full rounded-lg border border-white/10 bg-[rgba(2,7,12,0.56)] px-2.5 py-1.5 text-[11px] text-white outline-none transition placeholder:text-[#9eafbf]/60 focus:border-neon/60 focus:bg-[rgba(2,7,12,0.8)] focus:shadow-[0_0_0_4px_rgba(255,178,0,0.1)] sm:px-3 sm:py-2 sm:text-[13px]"
            />
          </label>
          {inquiry.phone && !isPhone(inquiry.phone) ? (
            <p className="mt-1.5 text-[11px] text-[#ffb5a8] sm:mt-2 sm:text-sm">Enter a valid phone number.</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              update("phone", "");
              setUseEmailInstead(true);
            }}
            className="mt-2 text-[11px] font-extrabold text-neon underline underline-offset-4 sm:mt-3 sm:text-sm"
          >
            Use email instead
          </button>
        </>
      )}
      <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-2 sm:mt-4 sm:rounded-xl sm:p-3.5">
        <p className="text-[10px] leading-snug text-[#9eafbf] sm:text-[12px]">
          Contact details are only used to reply.{" "}
          <Link href="/privacy" target="_blank" rel="noreferrer" className="font-bold text-neon underline underline-offset-2">
            Privacy notice
          </Link>
        </p>
        <label className="mt-1.5 flex cursor-pointer items-start gap-1.5 text-[11px] leading-snug text-white sm:mt-3 sm:gap-2.5 sm:text-[13px]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 size-3 shrink-0 accent-[#ffb200] sm:size-4"
          />
          <span>
            I understand the privacy notice and accept necessary cookies to send this inquiry securely.
          </span>
        </label>
        <div className="mt-1.5 origin-left scale-[0.82] sm:mt-0 sm:scale-100">
          <TurnstileField onTokenChange={setCaptchaToken} inquiryConsent={consent} />
        </div>
      </div>
    </div>
  );
}
