"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, getWhatsAppUrl } from "@/data/site";
import { useLiveClock } from "@/hooks/useLiveClock";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { ArrowUp, Clock, MapPin, Navigation, Phone, MessageCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const localTime = useLiveClock(siteConfig.contact.timezone);
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && footerRef.current && wordmarkRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          wordmarkRef.current,
          { opacity: 0.02, y: 36 },
          {
            opacity: 0.09,
            y: 0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wordmarkRef.current,
              start: "top 95%",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }, footerRef);

      return () => ctx.revert();
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative z-20 w-full bg-[#0d0d0f] text-white pt-24 sm:pt-32 overflow-hidden border-t hairline-dark"
      aria-label="Footer and Studio Reservations"
    >
      <div className="max-w-7xl mx-auto px-5vw">
        {/* Giant Headline Row */}
        <div className="border-b hairline-dark pb-14 mb-16">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-4">
            08 / Reservations · Islamabad Atelier
          </span>

          <h2 className="font-serif headline-giant font-normal text-white max-w-5xl tracking-tight mb-8">
            Let us make <em className="italic font-light text-accent">something</em>{" "}
            you will keep.
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/65 max-w-2xl mb-10 font-light">
            {siteConfig.flyerCopy.headline} {siteConfig.flyerCopy.subline}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-ink font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_28px_rgba(232,184,106,0.28)] hover:scale-105 active:scale-95"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-700" />
              </span>
              <span>Check Availability · WhatsApp</span>
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-white/60">
              <a
                href={`tel:${siteConfig.contact.phoneInternational}`}
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent" />
                <span>WhatsApp / Call: <strong className="text-white">{siteConfig.contact.phone}</strong></span>
              </a>
              <span className="text-white/25">·</span>
              <a
                href={`tel:${siteConfig.contact.secondaryPhoneInternational}`}
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>Second Line: <strong className="text-white">{siteConfig.contact.secondaryPhone}</strong></span>
              </a>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Left Enquiry Form, Right Location Map & Studio Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 pb-20 border-b hairline-dark">
          <div className="lg:col-span-6">
            <EnquiryForm />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-10">
            {/* Dark Styled Studio Map + Exact Islamabad Address */}
            <div className="bg-[#151518] border border-white/10 rounded-sm overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-1">
                      Visit Our Islamabad Studio
                    </span>
                    <p className="font-sans text-sm text-white/90 leading-snug">
                      {siteConfig.contact.address}
                    </p>
                    <p className="font-mono text-[11px] text-white/55 mt-1">
                      Landmark: {siteConfig.contact.landmark}
                    </p>
                  </div>
                </div>

                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-accent text-white hover:text-accent font-mono text-[10px] uppercase tracking-widest flex-shrink-0 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get directions ↗</span>
                </a>
              </div>

              {/* Embedded Map styled subtly for dark palette */}
              <div className="relative w-full h-52 sm:h-60 bg-[#0d0d0f] overflow-hidden">
                <iframe
                  title="Umer Gill Photography — Darwaish Tower, E-11/2 Markaz, Islamabad"
                  src={siteConfig.contact.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 filter grayscale invert-[0.9] contrast-[1.08] opacity-85 hover:opacity-100 transition-opacity"
                />
                <div className="pointer-events-none absolute inset-0 border-t border-white/5" />
              </div>
            </div>

            {/* 3 Link Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 font-mono text-xs">
              <div className="flex flex-col gap-2.5">
                <span className="text-accent uppercase tracking-widest text-[10px]">
                  Direct Lines
                </span>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-accent transition-colors"
                >
                  WhatsApp: {siteConfig.contact.phone}
                </a>
                <a
                  href={`tel:${siteConfig.contact.phoneInternational}`}
                  className="text-white/75 hover:text-accent transition-colors"
                >
                  Call 1: {siteConfig.contact.phone}
                </a>
                <a
                  href={`tel:${siteConfig.contact.secondaryPhoneInternational}`}
                  className="text-white/75 hover:text-accent transition-colors"
                >
                  Call 2: {siteConfig.contact.secondaryPhone}
                </a>
                <span className="text-white/35 text-[10px]">{siteConfig.contact.email}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-accent uppercase tracking-widest text-[10px]">
                  Navigate
                </span>
                <Link href="/stories" className="text-white/80 hover:text-accent transition-colors">
                  All Stories ↗
                </Link>
                <Link href="/#services" className="text-white/75 hover:text-accent transition-colors">
                  8 Services
                </Link>
                <Link href="/#chapters" className="text-white/75 hover:text-accent transition-colors">
                  Five Chapters
                </Link>
                <Link href="/contact" className="text-white/75 hover:text-accent transition-colors">
                  Book Consultation
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-accent uppercase tracking-widest text-[10px]">
                  Connect
                </span>
                <a
                  href={siteConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-accent transition-colors"
                >
                  @{siteConfig.social.instagram.handle} ↗
                </a>
                <span className="text-white/45 text-[10px]">
                  {siteConfig.instagramBioTagline}
                </span>
                <span className="text-white/35 text-[10px]">{siteConfig.social.facebook}</span>
              </div>
            </div>

            {/* Live Islamabad Studio Clock */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    Islamabad Local Time
                  </span>
                </div>
                <div className="font-mono text-2xl sm:text-3xl text-white tracking-widest font-light tabular-nums">
                  {localTime || "00:00:00"}{" "}
                  <span className="text-xs text-accent/80 ml-1">
                    {siteConfig.contact.timezoneLabel}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right font-mono text-[10px] text-white/45 uppercase tracking-widest">
                <div className="flex items-center sm:justify-end gap-1.5 text-emerald-400 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Booking Dates Open</span>
                </div>
                <span>{siteConfig.contact.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Row */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-5 text-white/45 font-mono text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/brand/logo-light.webp"
                alt="Umer Gill Photography official mark — Capturing You Special Events"
                fill
                sizes="40px"
                className="object-contain opacity-90"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white/80">
                © {new Date().getFullYear()} {siteConfig.name}
              </span>
              <span className="text-[9px] text-white/40">
                {siteConfig.logoLockupTagline} · {siteConfig.photographer.role}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <span className="text-accent/80">
              WhatsApp: {siteConfig.contact.phone} · Call: {siteConfig.contact.secondaryPhone}
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white/65 hover:text-accent transition-colors focus:outline-none"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Giant Outline Wordmark */}
      <div
        ref={wordmarkRef}
        className="w-full overflow-hidden select-none pointer-events-none flex justify-center py-2 text-center will-change-transform"
      >
        <span
          className="font-serif text-[17vw] leading-none tracking-tighter uppercase whitespace-nowrap text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(232, 184, 106, 0.35)",
          }}
        >
          UMER GILL
        </span>
      </div>
    </footer>
  );
}
