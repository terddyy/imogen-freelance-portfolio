import { contactMethods } from "@/lib/portfolio-data";

export type Inquiry = {
  projectTypes: string[];
  project: string;
  website: string;
  budget: string;
  thesisBudget: string;
  teamSize: string;
  phone: string;
  email: string;
};

export const emptyInquiry: Inquiry = {
  projectTypes: [],
  project: "",
  website: "",
  budget: "",
  thesisBudget: "",
  teamSize: "",
  phone: "",
  email: "",
};

export const standardBudgets = ["Under ₱100k", "₱100k–₱350k", "₱350k–₱650k", "₱650k–₱1.2M", "₱1.2M+"];
export const thesisBudgets = ["Under ₱50k", "₱50k–₱100k", "₱100k–₱300k", "₱300k+"];

export const teamSizes = [
  "Solo founder",
  "2–5 people",
  "6–15 people",
  "16–50 people",
  "50+ people",
] as const;

export const inquirySteps = [
  "Getting started",
  "Your website",
  "Budget",
  "Team size",
  "Contact",
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
