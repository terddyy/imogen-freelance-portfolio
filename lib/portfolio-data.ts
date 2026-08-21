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

export type ProofMobileLayout = "hero" | "tall" | "default" | "team" | "onsite";

export type ProofDesktopLayout = "feature" | "meeting" | "workshop" | "team" | "onsite";

export type ProofMoment = {
  id: string;
  src: string;
  alt: string;
  label: string;
  /** Mobile bento slot — used below 981px */
  layout: ProofMobileLayout;
  /** Desktop bento slot — used from 981px up */
  desktopLayout: ProofDesktopLayout;
};

export type Service = {
  title: string;
  description: string;
  iconKey: ServiceIconKey;
  offerings: string[];
  highlighted?: boolean;
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
  id: string;
  initials: string;
  name: string;
  role: string;
  quote: string;
  theme: "gold" | "sage" | "navy";
  rating: number;
  image?: string;
  email?: string;
};

export const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/TERDTHEPRO/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/terd/" },
  { label: "GitHub", href: "https://github.com/terddyy" },
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
    desktopLayout: "feature",
  },
  {
    id: "with-clients",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1771775485/Screenshot_2026-02-22-23-17-42-93_99c04817c0de5652397fc8b56c3b3817_zkccqk.jpg",
    alt: "Client meeting, discussing project goals",
    label: "Client meeting",
    layout: "tall",
    desktopLayout: "workshop",
  },
  {
    id: "in-the-room",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1774422110/pubmat_xy3fsz.png",
    alt: "Workshop session with collaborators in the room",
    label: "Workshop",
    layout: "default",
    desktopLayout: "meeting",
  },
  {
    id: "team",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1771775487/FB_IMG_1771773624608_grg6qp.jpg",
    alt: "Working alongside a team on a shared build",
    label: "Team session",
    layout: "team",
    desktopLayout: "team",
  },
  {
    id: "on-site",
    src: "/proof/aws.jpg",
    alt: "On site during a project handoff",
    label: "On site",
    layout: "onsite",
    desktopLayout: "onsite",
  },
];

export const services: Service[] = [
  {
    title: "Custom Systems / Software",
    description:
      "The core offer: software built around how the business actually runs, not a generic template.",
    iconKey: "puzzle",
    highlighted: true,
    offerings: [
      "CRM (customer management)",
      "Inventory & sales tracking",
      "Booking & scheduling",
      "School/clinic management",
      "POS & transaction tracking",
      "Employee monitoring/timekeeping",
      "Admin dashboards with analytics",
    ],
  },
  {
    title: "Websites",
    description: "Sites that introduce the work clearly and give visitors a next step.",
    iconKey: "globe",
    offerings: [
      "Business websites",
      "E-commerce stores",
      "Booking systems",
      "Portfolio & personal sites",
      "Landing pages for marketing",
    ],
  },
  {
    title: "Applications",
    description: "Apps for the devices people already use, with shared dashboards when the work spans more than one screen.",
    iconKey: "smartphone",
    offerings: [
      "Mobile apps (Android/iOS)",
      "Desktop apps (Windows/Mac)",
      "Multi-device system dashboards",
    ],
  },
  {
    title: "Capstone Projects",
    description: "Thesis and capstone systems scoped to defend well: working software, clear architecture, and a demo that holds up.",
    iconKey: "graduationCap",
    offerings: [
      "Thesis and capstone builds",
      "Documentation-ready architecture",
      "Adviser-friendly scope",
      "Defense-ready walkthroughs",
    ],
  },
  {
    title: "AI Integration",
    description: "Practical AI inside the tools a team already uses — assistants, automation, and agent-style workflows.",
    iconKey: "sparkles",
    offerings: [
      "AI assistants in existing systems",
      "Document and workflow automation",
      "Chat and image tools",
      "Agent-style task support",
    ],
  },
  {
    title: "Branding & Design",
    description: "Visual systems that stay consistent from the product UI to the posts around it.",
    iconKey: "palette",
    offerings: [
      "UI/UX design",
      "Logo design",
      "Social media graphics",
      "Marketing materials",
    ],
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
    id: "jayneil-pagalunan",
    initials: "JP",
    name: "Jayneil Pagalunan",
    role: "Full Stack Developer at Nexvision Innovations INC",
    quote:
      "Terd leads a team the way a strong full-stack lead should: clear priorities, no wasted motion, and fast unblocking when someone is stuck. He keeps people aligned without micromanaging, which is why delivery stays efficient even when the pressure is on.",
    theme: "navy",
    rating: 5,
    image: "/testimonials/jayneil-pagalunan.png",
  },
  {
    id: "marc-lester",
    initials: "ML",
    name: "Marc Lester",
    role: "App Client",
    quote:
      "We are happy sa kinalabasan ng project namin so far. Madali kausapin and tries his best to accommodate our requests. Bugs are also solved immediately. Will recommend him to those na need ng application or digital system.",
    theme: "sage",
    rating: 5,
    image: "/testimonials/marc-lester.png",
    email: "marc.cueto@yahoo.com",
  },
  {
    id: "alexie-anoya",
    initials: "AA",
    name: "Alexie Anoya",
    role: "Website client",
    quote:
      "I'm satisfied with the commissioned project. Sir Terd knows his stuff and works really well even with rush commissions. He is also straightforward and easy to talk to. Would definitely recommend him to people who need immediate outputs.",
    theme: "gold",
    rating: 5,
    image: "/testimonials/alexie-anoya.png",
    email: "alexieanoya@gmail.com",
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
