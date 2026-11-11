import type { Metadata, Viewport } from "next";
import { instrumentSerif, inter, jetbrainsMono } from "@/app/fonts";
import StructuredData from "@/components/common/StructuredData";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.meta.siteUrl),
  title: {
    default: siteConfig.meta.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.meta.description,
  keywords: siteConfig.meta.keywords,
  authors: [{ name: siteConfig.photographer.fullName }],
  creator: siteConfig.photographer.fullName,
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.meta.siteUrl,
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Umer Gill Photography — Islamabad · Capturing Your Special Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: ["/brand/og-image.jpg"],
  },
  alternates: {
    canonical: siteConfig.meta.siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink text-white antialiased overflow-x-hidden selection:bg-accent selection:text-ink">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
