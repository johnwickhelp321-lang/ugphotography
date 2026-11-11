import { siteConfig } from "@/data/site";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Photographer",
        "@id": `${siteConfig.meta.siteUrl}/#photographer`,
        "name": siteConfig.photographer.fullName,
        "jobTitle": siteConfig.photographer.role,
        "image": `${siteConfig.meta.siteUrl}/brand/og-image.jpg`,
        "description": siteConfig.photographer.statement,
        "telephone": [
          siteConfig.contact.phoneInternational,
          siteConfig.contact.secondaryPhoneInternational,
        ],
        "url": siteConfig.meta.siteUrl,
        "sameAs": [siteConfig.social.instagram.url],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.meta.siteUrl}/#business`,
        "name": siteConfig.name,
        "alternateName": siteConfig.displayName,
        "slogan": siteConfig.tagline,
        "url": siteConfig.meta.siteUrl,
        "logo": `${siteConfig.meta.siteUrl}/brand/logo-light.png`,
        "image": `${siteConfig.meta.siteUrl}/brand/og-image.jpg`,
        "telephone": [
          siteConfig.contact.phoneInternational,
          siteConfig.contact.secondaryPhoneInternational,
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": siteConfig.contact.phoneInternational,
            "contactType": "reservations & WhatsApp",
            "areaServed": "PK",
            "availableLanguage": ["English", "Urdu"],
          },
          {
            "@type": "ContactPoint",
            "telephone": siteConfig.contact.secondaryPhoneInternational,
            "contactType": "customer service",
            "areaServed": "PK",
            "availableLanguage": ["English", "Urdu"],
          },
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Office 402, Fourth Floor, Darwaish Tower, E-11/2 Markaz (Pervaiz Market, near 15 Stop)",
          "addressLocality": "Islamabad",
          "addressRegion": "Islamabad Capital Territory",
          "addressCountry": "PK",
        },
        "founder": {
          "@type": "Person",
          "name": siteConfig.photographer.fullName,
          "jobTitle": siteConfig.photographer.role,
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Photography, Cinematography & Bridal Services",
          "itemListElement": siteConfig.services.map((srv) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": srv.title,
            },
          })),
        },
      },
    ],
  };

  const jsonLd = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
