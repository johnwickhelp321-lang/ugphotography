"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/site";
import { getHeroImages } from "@/lib/images";

export default function HeroSection() {
  const heroImages = useMemo(() => getHeroImages().slice(0, 5), []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const nameLeftRef = useRef<HTMLDivElement>(null);
  const nameRightRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const tintOverlayRef = useRef<HTMLDivElement>(null);

  // Auto cross-fade every 3.5 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // GSAP ScrollTrigger Pinning and Choreography
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".hero-reveal-line",
        {
          y: 72,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.05,
          ease: "power3.out",
          delay: 1.35,
        }
      );

      if (containerRef.current && pinTargetRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%",
            pin: pinTargetRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        scrollTl
          .fromTo(
            nameLeftRef.current,
            { xPercent: 0, opacity: 1 },
            {
              xPercent: -35,
              opacity: 0.1,
              ease: "none",
            },
            0
          )
          .fromTo(
            nameRightRef.current,
            { xPercent: 0, opacity: 1 },
            {
              xPercent: 35,
              opacity: 0.1,
              ease: "none",
            },
            0
          )
          .fromTo(
            photoContainerRef.current,
            { filter: "blur(0px)", scale: 1 },
            {
              filter: "blur(14px)",
              scale: 1.06,
              ease: "none",
            },
            0
          )
          .fromTo(
            tintOverlayRef.current,
            { opacity: 0 },
            {
              opacity: 0.65,
              ease: "none",
            },
            0
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-ink text-white overflow-hidden"
      style={{ height: "250vh" }}
      aria-label="Hero Showcase"
    >
      <div
        ref={pinTargetRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Full-Bleed Background Images Cross-Fade */}
        <div
          ref={photoContainerRef}
          className="absolute inset-0 z-0 will-change-transform"
        >
          {heroImages.map((img, idx) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              style={{
                transitionProperty: "opacity, transform",
                transitionDuration: "1400ms",
              }}
            >
              <Image
                src={img.src1280}
                alt={img.alt}
                fill
                priority={idx === 0}
                loading="eager"
                placeholder="blur"
                blurDataURL={img.blur}
                sizes="100vw"
                className={`object-cover ${
                  img.slug.includes("98-jpg") || img.slug.includes("100-jpg")
                    ? "object-[82%_26%] md:object-[center_12%]"
                    : "object-[center_18%]"
                }`}
              />
            </div>
          ))}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-ink/80 via-ink/20 to-ink/90" />
          <div className="absolute inset-0 bg-ink/35 pointer-events-none" />
        </div>

        {/* Tint overlay triggered on scroll into cream section */}
        <div
          ref={tintOverlayRef}
          className="absolute inset-0 z-[1] bg-[#e4a47e] pointer-events-none opacity-0 mix-blend-color transition-opacity"
        />

        {/* Top Tag Row */}
        <div className="relative z-10 pt-24 sm:pt-28 px-5vw flex justify-between items-start">
          <div className="overflow-hidden">
            <div className="hero-reveal-line flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white/85 bg-ink/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>{siteConfig.contact.cityShort}</span>
              <span className="text-white/30">/</span>
              <span className="hidden sm:inline">{siteConfig.tagline}</span>
              <span className="sm:hidden">Weddings · Portraits</span>
            </div>
          </div>

          <div className="hidden md:block overflow-hidden text-right">
            <a
              href={`tel:${siteConfig.contact.phoneInternational}`}
              className="hero-reveal-line block font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 hover:text-accent transition-colors bg-ink/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15"
            >
              {siteConfig.contact.phone} · DM for Bookings
            </a>
          </div>
        </div>

        {/* Center / Hero Typography: HUGE display serif names overlapping photo */}
        <div className="relative z-10 w-full px-5vw my-auto pointer-events-none select-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline">
            {/* First Name Roman Left */}
            <div ref={nameLeftRef} className="overflow-hidden">
              <h1 className="hero-reveal-line font-serif headline-hero font-normal text-white [text-shadow:0_12px_36px_rgba(0,0,0,0.65)] leading-[0.86]">
                {siteConfig.photographer.firstName}
              </h1>
            </div>

            {/* Second Name Italic Right with Vertical Offset */}
            <div
              ref={nameRightRef}
              className="overflow-hidden self-end md:self-auto mt-[-1rem] md:mt-32 md:mr-4 pr-4"
            >
              <span className="hero-reveal-line block font-serif headline-hero italic font-light text-accent [text-shadow:0_12px_36px_rgba(0,0,0,0.65)] leading-[0.86]">
                {siteConfig.photographer.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Statement & Scroll Prompt */}
        <div className="relative z-10 pb-20 sm:pb-24 px-5vw flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="overflow-hidden">
            <div className="hero-reveal-line flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-white/70">
              <div className="w-8 h-[1px] bg-accent" />
              <span>Scroll to Begin Journey</span>
            </div>
          </div>

          {/* Studio Statement max 28ch */}
          <div className="overflow-hidden max-w-[32ch] md:max-w-[28ch]">
            <p className="hero-reveal-line font-sans text-xs sm:text-sm text-white/85 leading-relaxed font-light">
              {siteConfig.flyerCopy.headline} {siteConfig.instagramBioTagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
