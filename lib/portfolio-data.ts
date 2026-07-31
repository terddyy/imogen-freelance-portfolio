import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Blocks,
  Bot,
  CalendarCheck,
  Code2,
  FilePenLine,
  FormInput,
  Gauge,
  Laptop,
  LayoutDashboard,
  Mail,
  Palette,
  Rocket,
  SearchCheck,
  Settings2,
  ShoppingBag,
  Sparkles,
  Wrench,
} from "lucide-react";

export type Project = {
  title: string;
  summary: string;
  category: "Websites" | "Landing Pages" | "Commerce" | "Dashboards";
  tags: string[];
  image: string;
  initials: string[];
  href: string;
};

export type Skill = {
  name: string;
  group: "Design" | "Frontend" | "Tools" | "Workflow";
};

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ProcessStep = {
  number: string;
  title: string;
  label: string;
  description: string;
};

export type PricingTier = {
  name: string;
  subtitle: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export type Testimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
};

export const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Email", href: "mailto:hello@imogeninocentes.dev" },
];

export const projects: Project[] = [
  {
    title: "Local Service Website",
    summary:
      "A clean service-site concept with clear offers, appointment prompts, and mobile-first contact paths.",
    category: "Websites",
    tags: ["Next.js", "Responsive UI", "Contact CTA"],
    image: "/placeholders/project-service.svg",
    initials: ["II", "CL"],
    href: "/projects",
  },
  {
    title: "Personal Brand Portfolio",
    summary:
      "A polished personal site system for showcasing credibility, services, case studies, and inquiry flow.",
    category: "Websites",
    tags: ["Brand System", "Portfolio", "SEO"],
    image: "/placeholders/project-portfolio.svg",
    initials: ["II"],
    href: "/projects",
  },
  {
    title: "Online Booking Landing Page",
    summary:
      "A focused campaign page with concise copy, trust cues, calendar intent, and conversion-friendly sections.",
    category: "Landing Pages",
    tags: ["Landing Page", "Booking", "Forms"],
    image: "/placeholders/project-booking.svg",
    initials: ["II", "BK"],
    href: "/projects",
  },
  {
    title: "Product Catalog Mockup",
    summary:
      "A starter commerce catalog with featured items, simple filtering, and product cards that feel easy to scan.",
    category: "Commerce",
    tags: ["Catalog", "E-commerce", "Cards"],
    image: "/placeholders/project-catalog.svg",
    initials: ["II", "PM"],
    href: "/projects",
  },
  {
    title: "Event Promo Page",
    summary:
      "A promotional event page with schedule blocks, speaker highlights, and fast paths to registration.",
    category: "Landing Pages",
    tags: ["Events", "Campaign", "CTA"],
    image: "/placeholders/project-event.svg",
    initials: ["II", "EV"],
    href: "/projects",
  },
  {
    title: "Client Dashboard Concept",
    summary:
      "A compact dashboard concept for tracking requests, client updates, status, and project next steps.",
    category: "Dashboards",
    tags: ["Dashboard", "UI System", "Status"],
    image: "/placeholders/project-dashboard.svg",
    initials: ["II", "UX"],
    href: "/projects",
  },
];

export const skills: Skill[] = [
  { name: "Next.js", group: "Frontend" },
  { name: "TypeScript", group: "Frontend" },
  { name: "React", group: "Frontend" },
  { name: "Responsive CSS", group: "Frontend" },
  { name: "Figma", group: "Design" },
  { name: "Brand Systems", group: "Design" },
  { name: "Landing Pages", group: "Workflow" },
  { name: "Forms", group: "Workflow" },
  { name: "Content Updates", group: "Workflow" },
  { name: "SEO Basics", group: "Tools" },
  { name: "GitHub", group: "Tools" },
  { name: "Automation", group: "Tools" },
];

export const services: Service[] = [
  {
    title: "Portfolio & Business Websites",
    description:
      "Readable, credible websites that introduce your work clearly and guide visitors toward an inquiry.",
    icon: Laptop,
  },
  {
    title: "Brand-Aligned Landing Pages",
    description:
      "Campaign pages with sharp messaging, visual consistency, and conversion-focused section flow.",
    icon: Palette,
  },
  {
    title: "Content Updates & Site Care",
    description:
      "Practical site upkeep, page refreshes, content edits, and UI improvements without unnecessary rebuilds.",
    icon: Wrench,
  },
  {
    title: "Booking & Inquiry Forms",
    description:
      "Simple lead paths for bookings, requests, and project briefs that keep next steps clear.",
    icon: FormInput,
  },
  {
    title: "Simple E-commerce Setup",
    description:
      "Starter catalog and storefront experiences for small product lines, service add-ons, or launches.",
    icon: ShoppingBag,
  },
  {
    title: "Workflow Automation Support",
    description:
      "Lightweight automations that connect forms, messages, spreadsheets, and repeatable admin tasks.",
    icon: Settings2,
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    label: "Project fit",
    description:
      "Clarify the goal, audience, references, deadlines, and what a successful launch should accomplish.",
  },
  {
    number: "02",
    title: "Scope",
    label: "Plan the work",
    description:
      "Turn the brief into a clear page list, section plan, deliverables, timeline, and content checklist.",
  },
  {
    number: "03",
    title: "Design",
    label: "Shape the system",
    description:
      "Create the visual direction, page rhythm, reusable components, and responsive layout decisions.",
  },
  {
    number: "04",
    title: "Build",
    label: "Make it real",
    description:
      "Implement the site in clean responsive code, with practical content structure and accessible UI.",
  },
  {
    number: "05",
    title: "Review",
    label: "Polish together",
    description:
      "Walk through desktop and mobile, tighten details, and adjust copy, spacing, and calls to action.",
  },
  {
    number: "06",
    title: "Launch",
    label: "Hand off",
    description:
      "Prepare the final files, launch checklist, and simple guidance for future updates.",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    subtitle: "A focused first site",
    price: "From PHP 12k",
    description:
      "Best for a concise personal, freelancer, or local business site that needs to go live cleanly.",
    features: [
      "One to three responsive pages",
      "Core brand and layout styling",
      "Contact or inquiry CTA",
      "Placeholder-ready project/media areas",
    ],
    cta: "Ask about Starter",
  },
  {
    name: "Growth",
    subtitle: "More sections, stronger flow",
    price: "From PHP 24k",
    description:
      "For service providers and small teams that need richer sections, conversion flow, and polish.",
    features: [
      "Up to six page sections or routes",
      "Project/service card systems",
      "Booking or inquiry form UI",
      "Responsive QA and launch support",
    ],
    cta: "Plan a Growth site",
    highlighted: true,
  },
  {
    name: "Custom",
    subtitle: "Built around the brief",
    price: "By quote",
    description:
      "For dashboards, commerce concepts, automations, or a larger site that needs scoped requirements.",
    features: [
      "Custom interface or workflow",
      "Expanded content structure",
      "Advanced interaction planning",
      "Maintenance options after launch",
    ],
    cta: "Request a quote",
  },
];

export const testimonials: Testimonial[] = [
  {
    initials: "CN",
    name: "Client Note",
    role: "Placeholder feedback",
    quote:
      "This space is reserved for a real client note once Imogen has approved feedback to publish. The design keeps the layout ready without inventing testimonials.",
  },
  {
    initials: "PR",
    name: "Project Review",
    role: "Placeholder feedback",
    quote:
      "Use this card for a short review about communication, design clarity, delivery, or launch support. Replace it only with permission from the client.",
  },
  {
    initials: "FS",
    name: "Future Story",
    role: "Placeholder feedback",
    quote:
      "A third placeholder keeps the carousel balanced while the portfolio is being prepared. It should be swapped for a real result or removed before public launch.",
  },
];

export const assistantPrompts = [
  "What kind of websites does Imogen build?",
  "Can I request a landing page?",
  "How do project inquiries work?",
];

export const statCards = [
  { label: "Focus", value: "Solo freelance builds", icon: Sparkles },
  { label: "Deliverables", value: "Websites, landing pages, forms", icon: Blocks },
  { label: "Process", value: "Clear scope to launch", icon: BadgeCheck },
];

export const contactMethods = [
  {
    label: "Email",
    value: "hello@imogeninocentes.dev",
    href: "mailto:hello@imogeninocentes.dev",
    icon: Mail,
  },
  {
    label: "Project brief",
    value: "Share goals, pages, references, and launch date.",
    href: "/contact",
    icon: FilePenLine,
  },
  {
    label: "Availability",
    value: "Open for freelance work",
    href: "/contact",
    icon: CalendarCheck,
  },
];

export const aboutHighlights = [
  {
    title: "Practical design",
    description:
      "Layouts are shaped around what visitors need to understand, compare, and do next.",
    icon: SearchCheck,
  },
  {
    title: "Reliable build habits",
    description:
      "Responsive sections, reusable components, and clear content structure are treated as baseline work.",
    icon: Code2,
  },
  {
    title: "Launch-minded polish",
    description:
      "Each page is checked for spacing, mobile behavior, clarity, and conversion paths before handoff.",
    icon: Rocket,
  },
];

export const toolCards = [
  { title: "Selected Code", description: "Placeholder area for public GitHub projects.", icon: Code2 },
  { title: "UI Systems", description: "Reusable components for consistent pages and cards.", icon: LayoutDashboard },
  { title: "Performance Care", description: "Lightweight, responsive pages with practical image handling.", icon: Gauge },
  { title: "Portfolio Assistant", description: "A visual-only shell ready for future content grounding.", icon: Bot },
];
