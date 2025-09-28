"use client";

import Script from "next/script";

interface OrganizationSchemaProps {
  name: string;
  description: string;
  url: string;
  logo: string;
}

export function OrganizationSchema({
  name,
  description,
  url,
  logo,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    description: description,
    url: url,
    logo: {
      "@type": "ImageObject",
      url: logo,
      width: 400,
      height: 400,
    },
    foundingDate: "2025",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
      url: `${url}/contact`,
    },
    sameAs: [
      // Add your actual social media URLs when available
      "https://twitter.com/leadmate_app",
      "https://linkedin.com/company/leadmate",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schema)}
    </Script>
  );
}

interface SoftwareApplicationSchemaProps {
  url: string;
  name: string;
  description: string;
}

export function SoftwareApplicationSchema({
  url,
  name,
  description,
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    url: url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web-based",
    browserRequirements:
      "Requires JavaScript. Compatible with all modern browsers.",
    softwareVersion: "1.0",
    releaseNotes:
      "Initial release with AI-powered WhatsApp automation features",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "0",
      description: "Free trial available",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "AI-powered WhatsApp responses",
      "Automated lead capture",
      "24/7 customer support",
      "Business knowledge integration",
      "Real-time chat monitoring",
      "Lead management dashboard",
    ],
    screenshot: `${url}/og-image.png`,
    softwareHelp: `${url}/contact`,
    downloadUrl: url,
    installUrl: url,
    memoryRequirements: "Minimal - runs in web browser",
    processorRequirements: "Any modern device with internet access",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "25",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <Script
      id="software-application-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schema)}
    </Script>
  );
}

interface WebSiteSchemaProps {
  url: string;
  name: string;
  description: string;
}

export function WebSiteSchema({ url, name, description }: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    description: description,
    url: url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    author: {
      "@type": "Organization",
      name: name,
    },
    publisher: {
      "@type": "Organization",
      name: name,
    },
    inLanguage: "en-US",
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schema)}
    </Script>
  );
}

interface ServiceSchemaProps {
  url: string;
  name: string;
  description: string;
}

export function ServiceSchema({ url, name, description }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WhatsApp AI Customer Support Automation",
    description: description,
    url: url,
    provider: {
      "@type": "Organization",
      name: name,
      url: url,
    },
    serviceType: "Customer Support Automation",
    category: "Business Software",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Small Business Owners",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "LeadMate Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI WhatsApp Automation",
            description:
              "Automated WhatsApp customer support with AI responses",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Lead Capture System",
            description:
              "Automatic lead detection and capture from conversations",
          },
        },
        {
          "@type": "Service",
          name: "24/7 Customer Support",
          description: "Round-the-clock automated customer service",
        },
      ],
    },
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schema)}
    </Script>
  );
}
