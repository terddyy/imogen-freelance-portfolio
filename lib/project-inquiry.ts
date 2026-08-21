import { contactMethods } from "@/lib/portfolio-data";

export type Inquiry = {
  projectTypes: string[];
  project: string;
  website: string;
  budget: string;
  thesisBudget: string;
  customBudgetAmount: string;
  customThesisBudgetAmount: string;
  teamSize: string;
  timeline: string;
  phone: string;
  email: string;
};

export const emptyInquiry: Inquiry = {
  projectTypes: [],
  project: "",
  website: "",
  budget: "",
  thesisBudget: "",
  customBudgetAmount: "",
  customThesisBudgetAmount: "",
  teamSize: "",
  timeline: "",
  phone: "",
  email: "",
};

export const standardBudgets = ["Under ₱100k", "₱100k–₱350k", "₱350k–₱650k", "₱650k–₱1.2M", "₱1.2M+"];
export const thesisBudgets = ["Under ₱50k", "₱50k–₱100k", "₱100k–₱300k", "₱300k+"];
export const CUSTOM_BUDGET_OPTION = "Enter specific amount";

export function isCustomBudget(value: string) {
  return value === CUSTOM_BUDGET_OPTION;
}

export function isValidCustomBudgetAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return false;

  const amount = Number(digits);
  return Number.isFinite(amount) && amount >= 1_000 && amount <= 999_999_999;
}

export function formatCustomBudgetAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  const amount = Number(digits);
  if (!Number.isFinite(amount) || amount <= 0) return "";

  return `₱${amount.toLocaleString("en-PH")}`;
}

export function isBudgetSelectionValid(selection: string, customAmount: string, presets: readonly string[]) {
  if (!selection) return false;
  if (isCustomBudget(selection)) return isValidCustomBudgetAmount(customAmount);
  return presets.includes(selection);
}

export function resolveBudgetValue(selection: string, customAmount: string) {
  if (isCustomBudget(selection)) return formatCustomBudgetAmount(customAmount);
  return selection;
}

export function isAcceptedBudgetValue(value: string, presets: readonly string[]) {
  return presets.includes(value) || /^₱[\d,]+$/.test(value);
}

export const teamSizes = [
  "Solo founder",
  "2–5 people",
  "6–15 people",
  "16–50 people",
  "50+ people",
] as const;

export const timelines = [
  "ASAP",
  "1–2 months",
  "3–6 months",
  "6+ months",
  "Flexible",
] as const;

export const inquirySteps = [
  "Getting started",
  "Goals & scope",
  "Budget",
  "Timeline",
  "Your details",
] as const;

export const inquiryProjectTypes = [
  { label: "Website", value: "Website" },
  { label: "Web app / SaaS", value: "Web app / SaaS" },
  { label: "Mobile app", value: "Mobile app" },
  { label: "Internal system", value: "Internal system" },
  { label: "Improve an existing product", value: "Improve an existing product" },
  { label: "Thesis / capstone", value: "Thesis / capstone" },
  { label: "Something else", value: "Something else" },
] as const;

export const whatsappContact = contactMethods.find((method) => method.label === "WhatsApp");
export const phoneContact = contactMethods.find((method) => method.label === "Call");

export function isWebsite(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return false;
  if (digits.startsWith("63") && digits.length === 12) return true;
  if (digits.startsWith("0") && digits.length === 11) return true;
  if (digits.length === 10 && digits.startsWith("9")) return true;
  return value.trim().startsWith("+") && digits.length >= 8;
}
