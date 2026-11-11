"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { getInstagramStripImages } from "@/lib/images";
import { ArrowUpRight } from "lucide-react";
import InstagramIcon from "@/components/common/InstagramIcon";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const IG_LABELS = [
  "Weddings · Islamabad",
  "Mehndi & Colors",
  "Bridal Portrait",
  "Reception Evening",
  "Couple Editorial",
  "Studio Portraiture",
];

export default function InstagramStrip() {
  const containerRef = useRef<HTMLElement>(null);
  const stripImages = useMemo(() => getInstagramStripImages(6), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && containerRef.current) {
      const items = gsap.utils.toArray<HTMLElement>(".ig-strip-item");
      const ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 w-full bg-ink text-white py-24 sm:py-28 px-5vw border-t hairline-dark overflow-hidden"
      aria-label="Instagram Stream"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b hairline-dark pb-6 mb-12 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <InstagramIcon className="w-5 h-5 text-accent" />
              <h2 className="font-mono text-sm sm:text-base uppercase tracking-[0.18em] text-white">
                @{siteConfig.social.instagram.handle}
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
              {siteConfig.instagramBioTagline} · {siteConfig.contact.cityShort}
            </span>
          </div>

          <a
            href={siteConfig.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:text-white transition-colors"
          >
            <span>Open Instagram Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stripImages.map((img, idx) => (
            <a
              key={img.id}
              href={siteConfig.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View @${siteConfig.social.instagram.handle} on Instagram`}
              className="ig-strip-item group relative aspect-[4/5] rounded-[3px] overflow-hidden border border-white/10 bg-white/5 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-[0_12px_30px_rgba(232,184,106,0.16)]"
              data-cursor="view"
            >
              <Image
                src={img.src640}
                alt={img.alt}
                fill
                loading="eager"
                placeholder="blur"
                blurDataURL={img.blur}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-top filter grayscale-[0.12] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent bg-ink/80 px-2 py-0.5 rounded border border-accent/30 self-start">
                  #{IG_LABELS[idx % IG_LABELS.length]}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/80">
                  DM on Instagram ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center font-mono text-[10px] uppercase tracking-widest text-white/35">
          DM for bookings on @{siteConfig.social.instagram.handle} · WhatsApp{" "}
          {siteConfig.contact.phone}
        </div>
      </div>
    </section>
  );
}
