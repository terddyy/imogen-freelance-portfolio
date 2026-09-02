import type {
  AboutHighlightIconKey,
  ContactMethodIconKey,
  ServiceIconKey,
  ToolCardIconKey,
} from "@/lib/portfolio-icons";

export type Project = {
  title: string;
  summary: string;
  category: "Websites" | "App" | "Custom" | "Others";
  tags: string[];
  image: string;
  initials: string[];
  href: string;
};

export type Skill = {
  name: string;
  group: "Design" | "Frontend" | "Tools" | "Workflow";
};

export type ProofMobileLayout =
  | "hero"
  | "tall"
  | "default"
  | "team"
  | "onsite"
  | "hero2"
  | "tall2"
  | "default2"
  | "team2"
  | "onsite2";

export type ProofDesktopLayout =
  | "feature"
  | "meeting"
  | "workshop"
  | "team"
  | "onsite"
  | "feature2"
  | "meeting2"
  | "workshop2"
  | "team2"
  | "onsite2";

export type ProofMoment = {
  id: string;
  src: string;
  alt: string;
  label: string;
  /** Media kind — defaults to image when omitted. */
  kind?: "image" | "video";
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

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

/** Footer and secondary surfaces — home is implied from the brand mark. */
export const navItems = [
  { label: "Work", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/TERDTHEPRO/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/terd/" },
  { label: "GitHub", href: "https://github.com/terddyy" },
  { label: "Email", href: "mailto:terd@zentariph.com" },
];

export const projects: Project[] = [
  // Websites
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
    title: "Kado Kōhi",
    summary:
      "Brand site for a Marikina matcha and specialty coffee shop with menu storytelling, bookings, and online ordering.",
    category: "Websites",
    tags: ["Brand", "Cafe", "Menu"],
    image: "/projects/kadokohi.webp",
    initials: ["KK", "II"],
    href: "https://kadokohi.com",
  },
  {
    title: "Alon",
    summary:
      "Slow-travel magazine for the Mimaropa islands — festivals, food, and faith across four island chapters.",
    category: "Websites",
    tags: ["Magazine", "Editorial", "Travel"],
    image: "/projects/alon.webp",
    initials: ["AL", "II"],
    href: "https://alexie.vercel.app",
  },
  // App (mobile)
  {
    title: "Inventala",
    summary:
      "Construction inventory app that logs material usage, tracks wastage, and keeps sites stocked with predictive restocking.",
    category: "App",
    tags: ["Mobile App", "Inventory", "Construction"],
    image: "/projects/inventala.webp",
    initials: ["IN", "II"],
    href: "https://drive.google.com/file/d/1KAnJQI580sZDmSQIcddntNGeHOTHXQTN/view?usp=sharing",
  },
  // Custom systems
  {
    title: "SK Logistics",
    summary:
      "Enterprise fleet command center for live GPS tracking, trip control, compliance, and financial performance.",
    category: "Custom",
    tags: ["Fleet Ops", "Live Tracking", "Analytics"],
    image: "/projects/sk-logistics.webp",
    initials: ["SK", "II"],
    href: "https://sk-logistics.nexvision.info",
  },
  {
    title: "NEXCRM",
    summary:
      "Multi-agent sales CRM that finds revenue leaks, guides teams, and executes approved pipeline actions.",
    category: "Custom",
    tags: ["CRM", "AI Agents", "Sales"],
    image: "/projects/nexcrm.webp",
    initials: ["NX", "II"],
    href: "https://nexcrm.nexvision.info",
  },
  {
    title: "eSerbisyo",
    summary:
      "Barangay resident workspace for documents, appointments, incident reports, and updates in one simple system.",
    category: "Custom",
    tags: ["Government", "Records", "Workspace"],
    image: "/projects/eserbisyo.webp",
    initials: ["ES", "II"],
    href: "https://eserbisyo.vercel.app",
  },
  // Others
  {
    title: "Ayyan Tech",
    summary:
      "Product showcase for Hi-Res Hybrid-ANC headphones with feature storytelling and quote-ready CTAs.",
    category: "Others",
    tags: ["Product Page", "Brand", "Campaign"],
    image: "/projects/ayyan-tech.webp",
    initials: ["AY", "II"],
    href: "https://ayyantech.net",
  },
  {
    title: "BalanceFlow",
    summary:
      "Receivables SaaS landing experience focused on balances, payment approvals, and organized collections.",
    category: "Others",
    tags: ["Fintech", "SaaS", "Conversion"],
    image: "/projects/balanceflow.webp",
    initials: ["BF", "II"],
    href: "https://balanceflow.zentariph.com",
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
    alt: "Client result: 2.5m+ revenue within 6 months",
    label: "2.5m+ revenue within 6 months",
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
    alt: "Promotional graphic outlining website service offers",
    label: "Service offer",
    layout: "default",
    desktopLayout: "meeting",
  },
  {
    id: "team",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1774421921/IMG_20260317_232359_220_anupvj.jpg",
    alt: "Building late into the night",
    label: "Someone I admire",
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
  {
    id: "in-motion",
    src: "https://res.cloudinary.com/dqojscxhd/video/upload/v1787344225/copy_21012066-F52F-494D-9458-B2D1B3FACEF6_cqthvu.mov",
    alt: "Short clip of recent client work captured on screen",
    label: "In motion",
    kind: "video",
    layout: "hero2",
    desktopLayout: "feature2",
  },
  {
    id: "behind-the-screen",
    src: "https://res.cloudinary.com/dqojscxhd/video/upload/du_3/v1787344224/copy_4C7979BC-FAD6-44C2-A398-DFDE5E12EE47_tohkgk.mov",
    alt: "Short clip of work in progress",
    label: "Behind the screen",
    kind: "video",
    layout: "tall2",
    desktopLayout: "meeting2",
  },
  {
    id: "on-the-floor",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1787344197/44aaf787dad2ad8c817ce89769fee27f_ndx7t8.jpg",
    alt: "Recent project snapshot",
    label: "On the floor",
    layout: "default2",
    desktopLayout: "workshop2",
  },
  {
    id: "late-hours",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1771775487/FB_IMG_1771773624608_grg6qp.jpg",
    alt: "Core team at a community event",
    label: "Community event",
    layout: "team2",
    desktopLayout: "team2",
  },
  {
    id: "quiet-corner",
    src: "https://res.cloudinary.com/dqojscxhd/image/upload/v1774421921/IMG_20260313_223915_251_wc9hgy.jpg",
    alt: "Core team at a community event",
    label: "Community event",
    layout: "onsite2",
    desktopLayout: "onsite2",
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
      "POS & transaction tracking",
      "Admin dashboards with analytics",
    ],
  },
  {
    title: "Websites",
    description: "Sites that introduce the work clearly and give visitors a next step.",
    iconKey: "globe",
    offerings: [
      "Business & company websites",
      "E-commerce stores",
      "Booking & reservation systems",
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
      "Cross-platform apps",
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
    title: "Industry-Specific Software",
    description: "Tailored systems built for how a specific industry works, with the right rules baked in.",
    iconKey: "building",
    offerings: [
      "Restaurant & food ordering systems",
      "Real estate & property management",
      "Clinic, pharmacy & healthcare tools",
      "Learning management systems (LMS)",
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
