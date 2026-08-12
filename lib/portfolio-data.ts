import type {
  AboutHighlightIconKey,
  ContactMethodIconKey,
  ServiceIconKey,
  ToolCardIconKey,
} from "@/lib/portfolio-icons";

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

export type ProofMoment = {
  id: string;
  src: string;
  alt: string;
  label: string;
  layout: "hero" | "tall" | "wide" | "default";
};

export type Service = {
  title: string;
  description: string;
  iconKey: ServiceIconKey;
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
  { label: "GitHub", href: "https://github.com/terddyy" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/terd/" },
  { label: "Email", href: "mailto:terd@zentariph.com" },
];

export const projects: Project[] = [
  {
    title: "SK Logistics",
    summary:
      "Enterprise fleet command center for live GPS tracking, trip control, compliance, and financial performance.",
    category: "Dashboards",
    tags: ["Fleet Ops", "Live Tracking", "Analytics"],
    image: "/projects/sk-logistics.webp",
    initials: ["SK", "II"],
    href: "https://sk-logistics.nexvision.info",
  },
  {
    title: "Ayyan Tech",
    summary:
      "Product showcase for Hi-Res Hybrid-ANC headphones with feature storytelling and quote-ready CTAs.",
    category: "Commerce",
    tags: ["Product Page", "Brand", "Campaign"],
    image: "/projects/ayyan-tech.webp",
    initials: ["AY", "II"],
    href: "https://ayyantech.net",
  },
  {
    title: "Zentari Software",
    summary:
      "Agency site for custom software, web and mobile apps, and AI solutions built to scale with growing teams.",
    category: "Websites",
    tags: ["Agency", "SaaS", "Brand System"],
    image: "/projects/zentari.webp",
    initials: ["ZS", "II"],
    href: "https://zentariph.com",
  },
  {
    title: "BalanceFlow",
    summary:
      "Receivables SaaS landing experience focused on balances, payment approvals, and organized collections.",
    category: "Landing Pages",
    tags: ["Fintech", "SaaS", "Conversion"],
    image: "/projects/balanceflow.webp",
    initials: ["BF", "II"],
    href: "https://balanceflow.zentariph.com",
  },
  {
    title: "TerdAI",
    summary:
      "Friendly AI companion workspace for smart chats, creative ideas, and built-in image tools.",
    category: "Websites",
    tags: ["AI Product", "Chat UI", "Image Tools"],
    image: "/projects/terdai.webp",
    initials: ["TA", "II"],
    href: "https://terdai.app",
  },
  {
    title: "WaterLinks",
    summary:
      "Asia-Pacific water and sanitation platform highlighting partnerships, utility training, and shared knowledge.",
    category: "Websites",
    tags: ["Nonprofit", "Partnerships", "WASH"],
    image: "/projects/waterlinks.webp",
    initials: ["WL", "II"],
    href: "https://waterlinks.org",
  },
  {
    title: "NEXCRM",
    summary:
      "Multi-agent sales CRM that finds revenue leaks, guides teams, and executes approved pipeline actions.",
    category: "Dashboards",
    tags: ["CRM", "AI Agents", "Sales"],
    image: "/projects/nexcrm.webp",
    initials: ["NX", "II"],
    href: "https://nexcrm.terd.dev",
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

export const proofMoments: ProofMoment[] = [
  {
    id: "building",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1771775485/Screenshot_2026-02-22-23-16-55-04_99c04817c0de5652397fc8b56c3b3817_oxtxth.jpg",
    alt: "Working at a desk during a build",
    label: "At the desk",
    layout: "hero",
  },
  {
    id: "with-clients",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1771775485/Screenshot_2026-02-22-23-17-42-93_99c04817c0de5652397fc8b56c3b3817_zkccqk.jpg",
    alt: "Client meeting, discussing project goals",
    label: "Client meeting",
    layout: "tall",
  },
  {
    id: "in-the-room",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1774422110/pubmat_xy3fsz.png",
    alt: "Workshop session with collaborators in the room",
    label: "Workshop",
    layout: "default",
  },
  {
    id: "team",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1771775487/FB_IMG_1771773624608_grg6qp.jpg",
    alt: "Working alongside a team on a shared build",
    label: "Team session",
    layout: "wide",
  },
  {
    id: "on-site",
    src: "/proof/aws.jpg",
    alt: "On site during a project handoff",
    label: "On site",
    layout: "wide",
  },
];

export const services: Service[] = [
  {
    title: "Portfolio & Business Websites",
    description:
      "Readable, credible websites that introduce your work clearly and guide visitors toward an inquiry.",
    iconKey: "laptop",
  },
  {
    title: "Brand-Aligned Landing Pages",
    description:
      "Campaign pages with sharp messaging, visual consistency, and conversion-focused section flow.",
    iconKey: "palette",
  },
  {
    title: "Content Updates & Site Care",
    description:
      "Practical site upkeep, page refreshes, content edits, and UI improvements without unnecessary rebuilds.",
    iconKey: "wrench",
  },
  {
    title: "Booking & Inquiry Forms",
    description:
      "Simple lead paths for bookings, requests, and project briefs that keep next steps clear.",
    iconKey: "formInput",
  },
  {
    title: "Simple E-commerce Setup",
    description:
      "Starter catalog and storefront experiences for small product lines, service add-ons, or launches.",
    iconKey: "shoppingBag",
  },
  {
    title: "Workflow Automation Support",
    description:
      "Lightweight automations that connect forms, messages, spreadsheets, and repeatable admin tasks.",
    iconKey: "settings2",
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

export const statCards = [
  { label: "Focus", value: "Solo freelance builds", iconKey: "sparkles" as const },
  { label: "Deliverables", value: "Websites, landing pages, forms", iconKey: "blocks" as const },
  { label: "Process", value: "Clear scope to launch", iconKey: "badgeCheck" as const },
];

export const contactMethods: Array<{
  label: string;
  value: string;
  href: string;
  iconKey: ContactMethodIconKey;
}> = [
  {
    label: "WhatsApp",
    value: "+63 960 250 6993",
    href: "https://wa.me/639602506993",
    iconKey: "messageCircle",
  },
  {
    label: "Call",
    value: "+63 960 250 6993",
    href: "tel:+639602506993",
    iconKey: "phone",
  },
  {
    label: "Email",
    value: "terd@zentariph.com",
    href: "mailto:terd@zentariph.com",
    iconKey: "mail",
  },
  {
    label: "Project brief",
    value: "Share goals, pages, references, and launch date.",
    href: "/contact",
    iconKey: "filePenLine",
  },
  {
    label: "Availability",
    value: "Open for freelance work",
    href: "/contact",
    iconKey: "calendarCheck",
  },
];

export const aboutHighlights: Array<{
  title: string;
  description: string;
  iconKey: AboutHighlightIconKey;
}> = [
  {
    title: "Practical design",
    description:
      "Layouts are shaped around what visitors need to understand, compare, and do next.",
    iconKey: "searchCheck",
  },
  {
    title: "Reliable build habits",
    description:
      "Responsive sections, reusable components, and clear content structure are treated as baseline work.",
    iconKey: "code2",
  },
  {
    title: "Launch-minded polish",
    description:
      "Each page is checked for spacing, mobile behavior, clarity, and conversion paths before handoff.",
    iconKey: "rocket",
  },
];

export const toolCards: Array<{
  title: string;
  description: string;
  iconKey: ToolCardIconKey;
}> = [
  { title: "Selected Code", description: "Placeholder area for public GitHub projects.", iconKey: "code2" },
  { title: "UI Systems", description: "Reusable components for consistent pages and cards.", iconKey: "layoutDashboard" },
  { title: "Performance Care", description: "Lightweight, responsive pages with practical image handling.", iconKey: "gauge" },
];
