/** Replace with Ali-approved wording when available */
export const openAppLabel = "Open App";

export const heroBadge = "Now in early access";

export const hero = {
  title: "Your ad data,",
  titleEm: "inside every agent",
  subtitle:
    "Connect LinkedIn Ads and Google Ads once. Every AI tool your team uses gets instant, governed access — no extra integrations required.",
  primaryCta: "Start your free trial →",
  secondaryCta: "See how it works",
  secondaryHref: "#how-it-works",
  note: "15-day free trial · No credit card required · $20/seat/mo after",
} as const;

export const logoBar = {
  label: "Works with",
  platforms: [
    { label: "LinkedIn Ads", icon: "in", active: true },
    { label: "Google Ads", icon: "G", active: true },
    { label: "Reddit Ads", icon: "R", active: false, badge: "coming soon" },
    { label: "More platforms", icon: "+", active: false, badge: "WIP" },
  ],
  agents: [
    { label: "Claude", icon: "C" },
    { label: "ChatGPT", icon: "⚡" },
    { label: "Any MCP agent", icon: "∞" },
  ],
} as const;

export const howItWorks = {
  label: "How it works",
  heading: "Three steps to",
  headingEm: "connected",
  sub: "No engineering required. Go from zero to AI-powered ad analysis in minutes.",
  steps: [
    {
      num: "01",
      title: "Connect your ad accounts",
      body: "Authorize LinkedIn Ads and Google Ads with a single OAuth flow. Jumon handles tokens, refresh cycles, and permissions.",
      footer: "● LinkedIn Ads · Google Ads",
    },
    {
      num: "02",
      title: "Add the MCP endpoint",
      body: "Paste one URL into Claude, ChatGPT, or any agent that supports MCP. Your agent instantly discovers all available tools.",
      footer: "https://mcp.jumon.ai/your-token",
    },
    {
      num: "03",
      title: "Ask anything",
      body: "Pull reports, compare campaigns, and spot underperformers — in plain language, right inside the AI tools your team already uses.",
      footer: "Ready to query →",
    },
  ],
} as const;

export const features = {
  label: "Built for growth teams",
  heading: "Everything your agent needs\nto",
  headingEm: "act on",
  headingSuffix: "ad data",
  sub: "Jumon isn't a dashboard. It's the layer that puts your campaigns inside the AI workflows you're already building.",
  cards: [
    {
      icon: "🔐",
      title: "One-time auth",
      body: "Authorize once. Every agent you add inherits the same secure, scoped access — no re-entering credentials.",
    },
    {
      icon: "⚡",
      title: "Real-time data",
      body: "Live campaign metrics, spend, and performance data — not yesterday's export. Ask your agent what's happening right now.",
    },
    {
      icon: "🛡️",
      title: "Governed access",
      body: "Control exactly what each agent can read or write. Audit logs for every action taken on your ad accounts.",
    },
    {
      icon: "🔌",
      title: "Any MCP-compatible agent",
      body: "Claude, ChatGPT, internal copilots — if it supports MCP, it works with Jumon out of the box.",
    },
  ],
  highlight: {
    title: "No more brittle one-off integrations",
    body: "Stop asking engineering to build and maintain custom API connections for every AI tool. Jumon is the single layer that handles it all.",
    badge: "Save weeks of eng time →",
  },
} as const;

export const testimonials = {
  label: "Early access users",
  heading: "Growth teams",
  headingEm: "moving faster",
  headingSuffix: "with Jumon",
  items: [
    {
      featured: true,
      company: "Understory Agency",
      quote:
        "We run LinkedIn and Google Ads across multiple B2B clients. With Jumon, our whole team pulls live campaign data straight from Claude — no dashboard, no CSV exports. It's become a core part of how we work.",
      initials: "UA",
      name: "Understory Agency",
      role: "Allbound Growth Engineering for B2B SaaS",
    },
    {
      featured: false,
      company: null,
      quote:
        "We went from exporting CSVs to asking Claude about our campaigns directly. It's a completely different workflow.",
      initials: "SR",
      name: "Sarah R.",
      role: "Head of Growth, Series B SaaS",
    },
    {
      featured: false,
      company: null,
      quote:
        "Setting up took 5 minutes. Now our whole team queries LinkedIn performance without ever opening the dashboard.",
      initials: "MK",
      name: "Marcus K.",
      role: "Demand Gen Lead, B2B Startup",
    },
  ],
} as const;

export const pricing = {
  label: "Pricing",
  heading: "Simple,",
  headingEm: "transparent",
  headingSuffix: "pricing",
  sub: "Start free. No credit card needed. Upgrade when you're ready.",
  trialDays: 15,
  priceUsd: 20,
  billingCadence: "seat / month",
  planLabel: "Early access plan",
  tagline: "After your 15-day free trial. Cancel anytime.",
  trialCallout: {
    title: "15 days free — no credit card required",
    sub: "Full access from day one. Upgrade only when you love it.",
  },
  bullets: [
    "LinkedIn Ads + Google Ads connected",
    "One MCP endpoint for all your agents",
    "Real-time campaign data & reporting",
    "Works with Claude, ChatGPT & any MCP agent",
    "Governed access & audit logs",
    "Early access to new ad platforms as they launch",
  ],
  note: "No credit card · 15 days free · $20/seat/mo after",
} as const;

export const ctaSection = {
  heading: "Start querying your\nad data",
  headingEm: "today",
  sub: "15 days free, no credit card required. See what your AI tools can do when they have real campaign data.",
  cta: "Start your free trial →",
  trust: [
    "No credit card",
    "15 days free",
    "$20/seat/mo after",
    "Cancel anytime",
  ],
} as const;

export const faq: { question: string; answer: string }[] = [
  {
    question: "What is MCP?",
    answer:
      "Model Context Protocol is how compatible assistants advertise tools they can invoke. Jumon exposes MCP so your assistant can fetch ad data via consistent tool calls instead of bespoke API wiring per assistant vendor.",
  },
  {
    question: "Which ad platforms?",
    answer: "Today: LinkedIn Ads and Google Ads. More networks follow the same MCP pattern.",
  },
  {
    question: "Read vs write access?",
    answer:
      "You connect only what you're comfortable approving. Today's surface prioritizes dependable reads and guarded operational checks—write paths stay explicit and disciplined as they roll out.",
  },
  {
    question: "How do I revoke access?",
    answer:
      "Disconnect providers inside Jumon and remove the MCP connector inside your assistant when you fully wind down experimentation.",
  },
  {
    question: "What does a seat cover?",
    answer: `${pricing.priceUsd} USD per seat monthly after the trial. Seats scale alongside team members needing access—not per ad account.`,
  },
  {
    question: "Where do I upgrade or manage billing?",
    answer:
      "Start in the web app — you'll manage subscription details there once checkout is wired end-to-end.",
  },
];

export const footer = {
  earlyAccessBadge: "● Early access open",
  privacyLabel: "Privacy",
  privacyStatus: "Coming soon",
  termsLabel: "Terms",
  termsStatus: "Coming soon",
  docsLabel: "Docs",
  contactLabel: "Contact",
  secondaryLinkLabel: "Open app",
  trademark: `© ${new Date().getFullYear()} Jumon`,
};
