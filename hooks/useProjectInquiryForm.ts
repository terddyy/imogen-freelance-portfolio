"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { isTurnstileConfigured } from "@/components/TurnstileField";
import { grantInquirySecurityConsent } from "@/lib/inquiry-consent";
import {
  emptyInquiry,
  isBudgetSelectionValid,
  isEmail,
  isPhone,
  resolveBudgetValue,
  standardBudgets,
  thesisBudgets,
  type Inquiry,
} from "@/lib/project-inquiry";

export function useProjectInquiryForm() {
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

  return {
    panelRef,
    step,
    inquiry,
    status,
    useEmailInstead,
    setUseEmailInstead,
    stepDirection,
    error,
    consent,
    setConsent: setConsentWithSecurity,
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
  };
}
