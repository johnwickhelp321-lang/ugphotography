/**
 * Single source of truth for Umer Gill Photography verified business data.
 * STRICT RULE: Only the two verified phone numbers (0313 5266515 primary/WhatsApp,
 * 0312 5266515 secondary call line) may appear anywhere on the site.
 * Missing or unconfirmed details remain clearly marked with TODO.
 */

export interface SiteConfig {
  name: string;
  displayName: string;
  tagline: string;
  logoLockupTagline: string;
  flyerCopy: {
    headline: string;
    subline: string;
  };
  photographer: {
    firstName: string; // "Umer" (roman)
    lastName: string;  // "Gill" (italic)
    fullName: string;
    role: string;      // "CEO & Founder"
    statement: string;
  };
  contact: {
    phone: string;                  // "0313 5266515" (Primary / WhatsApp)
    phoneInternational: string;     // "+923135266515"
    whatsappUrl: string;            // "https://wa.me/923135266515"
    whatsappPrefillTemplate: string;
    secondaryPhone: string;         // "0312 5266515"
    secondaryPhoneInternational: string; // "+923125266515"
    email: string;                  // TODO placeholder
    bookingMethod: string;          // "DM for bookings"
    address: string;                // Exact studio address
    landmark: string;               // Exact landmark line
    city: string;                   // "Islamabad, Pakistan"
    cityShort: string;              // "Islamabad"
    timezone: string;               // "Asia/Karachi"
    timezoneLabel: string;          // "PKT"
    mapsUrl: string;
    mapsEmbedUrl: string;
  };
  social: {
    instagram: {
      handle: string;
      url: string;
      displayName: string;
    };
    facebook: string; // TODO: unconfirmed
    youtube: string;  // TODO: unconfirmed
    // TikTok omitted per explicit instruction unless confirmed by client
  };
  services: Array<{
    index: string;
    title: string;
    category: string;
    deliverableNote: string;
  }>;
  whyChooseUs: string[];
  instagramBioTagline: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
    siteUrl: string;
  };
  stats: Array<{
    value: number;
    suffix: string;
    label: string;
    isTodo?: boolean;
    note?: string;
  }>;
  packages: {
    note: string;
    items: Array<{
      name: string;
      price: string;
      deliverables: string[];
    }>;
  };
  team: {
    note: string;
    members: Array<{
      name: string;
      role: string;
      bio: string;
    }>;
  };
}

export const siteConfig: SiteConfig = {
  name: "Umer Gill Photography",
  displayName: "Umer gill photography",
  tagline: "Capturing Your Special Events",
  logoLockupTagline: "Capturing You Special Events",
  flyerCopy: {
    headline: "Make every moment picture-perfect, beautifully captured.",
    subline:
      "Let us turn your special occasions into timeless photographs you'll treasure for years.",
  },
  photographer: {
    firstName: "Umer",
    lastName: "Gill",
    fullName: "Umer Gill",
    role: "CEO & Founder",
    statement:
      "Make every moment picture-perfect, beautifully captured. Let us turn your special occasions into timeless photographs you'll treasure for years.",
  },
  contact: {
    phone: "0313 5266515",
    phoneInternational: "+923135266515",
    whatsappUrl: "https://wa.me/923135266515",
    whatsappPrefillTemplate:
      "Assalam o Alaikum, I found your website and would like to check availability for [event type] on [date].",
    secondaryPhone: "0312 5266515",
    secondaryPhoneInternational: "+923125266515",
    email: "TODO: Official studio email pending verification",
    bookingMethod: "DM for bookings on Instagram or WhatsApp direct",
    address: "Office 402, Fourth Floor, Darwaish Tower, E-11/2 Markaz, Islamabad",
    landmark: "Pervaiz Market, near 15 Stop, Islamabad",
    city: "Islamabad, Pakistan",
    cityShort: "Islamabad",
    timezone: "Asia/Karachi",
    timezoneLabel: "PKT",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Darwaish+Tower+E-11%2F2+Markaz+Islamabad+Pakistan",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=Darwaish+Tower+E-11%2F2+Markaz+Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  social: {
    instagram: {
      handle: "umergillphotography1",
      url: "https://www.instagram.com/umergillphotography1/",
      displayName: "umergillphotography1",
    },
    facebook: "TODO: Facebook page URL pending client confirmation",
    youtube: "TODO: YouTube channel / showreel URL pending client confirmation",
  },
  instagramBioTagline: "Weddings | Portraits | Events. DM for bookings",
  services: [
    {
      index: "01",
      title: "Wedding Photography and Cinematography",
      category: "Signature Coverage",
      deliverableNote: "Multi-day stills & cinema",
    },
    {
      index: "02",
      title: "Engagement and Mehndi Shoots",
      category: "Ceremonial",
      deliverableNote: "Candid color & dhol rhythm",
    },
    {
      index: "03",
      title: "Birthday and Anniversary Events",
      category: "Milestones",
      deliverableNote: "Intimate family gatherings",
    },
    {
      index: "04",
      title: "Bridal and Couple Portraits",
      category: "Editorial",
      deliverableNote: "Studio & twilight sessions",
    },
    {
      index: "05",
      title: "Family and Kids Photography",
      category: "Heirlooms",
      deliverableNote: "Natural timeless frames",
    },
    {
      index: "06",
      title: "Corporate Events",
      category: "Commercial",
      deliverableNote: "Keynotes, galas & press",
    },
    {
      index: "07",
      title: "Outdoor and Studio Photoshoots",
      category: "Lookbook",
      deliverableNote: "Islamabad hills & E-11 studio",
    },
    {
      index: "08",
      title: "Professional Bridal and Party Makeup Services",
      category: "Bridal Atelier",
      deliverableNote: "In-studio styling & prep",
    },
  ],
  whyChooseUs: [
    "High-quality photography",
    "Creative and professional team",
    "Affordable packages",
    "Fast delivery",
    "Friendly and reliable service",
    "Capturing every emotion with perfection",
  ],
  meta: {
    title: "Umer Gill Photography | Islamabad Wedding & Portrait Studio",
    description:
      "Umer Gill Photography (Office 402, Darwaish Tower, E-11/2 Markaz, Islamabad). Luxury wedding photography, cinematography, Mehndi, Bridal portraits, events & makeup services.",
    keywords: [
      "Umer Gill Photography",
      "Islamabad Wedding Photographer",
      "Darwaish Tower E-11/2 Markaz",
      "Pakistani Wedding Cinematography",
      "Bridal Portraits Islamabad",
      "Mehndi Baraat Walima Photography",
    ],
    siteUrl: "https://umergillphotography.com",
  },
  stats: [
    {
      value: 260,
      suffix: "+",
      label: "Weddings Documented",
      isTodo: true,
      note: "TODO: Client to confirm verified wedding total",
    },
    {
      value: 8,
      suffix: "+",
      label: "Service Disciplines",
      isTodo: false,
      note: "Verified from studio brochure",
    },
    {
      value: 5,
      suffix: " Days",
      label: "Ritual Story Chapters",
      isTodo: false,
      note: "Mehndi through Editorial",
    },
    {
      value: 4,
      suffix: "K",
      label: "Cinema & Print Archive",
      isTodo: false,
      note: "Master grading & albums",
    },
  ],
  packages: {
    note: "TODO: Official pricing & package tiers to be confirmed by Umer Gill Photography before public listing.",
    items: [
      {
        name: "TODO: Wedding Photography & Cinematography Suite",
        price: "TODO: Custom Quote via WhatsApp (0313 5266515)",
        deliverables: [
          "Engagement, Mehndi, Nikkah, Baraat & Walima coverage",
          "Led by Umer Gill (CEO & Founder) with creative team",
          "High-resolution edited gallery & highlight film",
        ],
      },
      {
        name: "TODO: Outdoor & Studio Portrait Sessions",
        price: "TODO: Custom Quote via WhatsApp (0313 5266515)",
        deliverables: [
          "E-11/2 Markaz studio or Margalla outdoor session",
          "Bridal, couple & family heirloom plates",
          "Optional professional bridal & party makeup coordination",
        ],
      },
    ],
  },
  team: {
    note: "Led by Umer Gill, CEO & Founder, supported by a creative photography, cinema, and bridal styling crew in Islamabad.",
    members: [
      {
        name: "Umer Gill",
        role: "CEO & Founder",
        bio: "Capturing Your Special Events with high-quality photography, cinema, and every emotion preserved with perfection.",
      },
    ],
  },
};

export function getWhatsAppUrl(customMessage?: string): string {
  const msg =
    customMessage || siteConfig.contact.whatsappPrefillTemplate;
  return `${siteConfig.contact.whatsappUrl}?text=${encodeURIComponent(msg)}`;
}
