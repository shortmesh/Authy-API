export const REPOS = [
  {
    name: "Authy API",
    desc: "OTP generation, delivery & verification service",
    detail:
      "Generate and verify one-time passwords delivered over Signal, WhatsApp and Telegram.",
    href: "https://github.com/shortmesh/Authy-API",
    lang: "Go",
    preview: "otp",
  },
  {
    name: "Interface API",
    desc: "Primary interface service built on Matrix",
    detail:
      "A Matrix-powered unified messaging layer that routes OTP delivery across multiple platforms through a single API.",
    href: "https://github.com/shortmesh/Interface-API",
    lang: "Go",
    preview: "router",
  },
  {
    name: "Widget",
    desc: "Drop-in platform-picker for web & Android",
    detail:
      "An embeddable platform picker that lets your users choose their preferred messaging channel for OTP delivery. Available as a zero-dependency web component and a native Android SDK.",
    links: [
      { label: "Web (JS)", href: "https://github.com/shortmesh/Widgets" },
      { label: "Android", href: "https://github.com/shortmesh/Widget-android" },
    ],
    preview: "widget",
  },
];
