"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { siteConfig } from "@/data/site";
import { getFramesImages, SyncedImage } from "@/lib/images";

const FRAME_META = [
  { caption: "Archway Silk & Bridal Gaze · Islamabad", heightClass: "h-[460px]", baselineClass: "self-start mt-6" },
  { caption: "Twirls in Evening Warmth · Mehndi", heightClass: "h-[540px]", baselineClass: "self-end mb-8" },
  { caption: "Gold Heirloom Jewelry · Bridal Suite", heightClass: "h-[420px]", baselineClass: "self-center" },
  { caption: "Sacred Stillness · Nikkah Portrait", heightClass: "h-[510px]", baselineClass: "self-start mt-14" },
  { caption: "Margalla Dusk Couple Frame", heightClass: "h-[450px]", baselineClass: "self-end mb-4" },
  { caption: "Crimson Velvet Embroidered Trail", heightClass: "h-[530px]", baselineClass: "self-center" },
  { caption: "Lantern Glow & Procession", heightClass: "h-[470px]", baselineClass: "self-start mt-8" },
  { caption: "Walima Chandelier Portraiture", heightClass: "h-[520px]", baselineClass: "self-end mb-6" },
  { caption: "Intimate Bridal Veil Light", heightClass: "h-[430px]", baselineClass: "self-center" },
  { caption: "Candid Family Celebration", heightClass: "h-[500px]", baselineClass: "self-start mt-10" },
];

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frames = useMemo(() => getFramesImages().slice(0, 10), []);
  const [activeLightbox, setActiveLightbox] = useState<SyncedImage | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    if (!prefersReducedMotion && !isMobile && containerRef.current && trackRef.current) {
      const track = trackRef.current;
      const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth + 100);

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveLightbox(null);
    };
    if (activeLightbox) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeLightbox]);

  return (
    <>
      <section
        ref={containerRef}
        className="relative z-20 w-full bg-ink text-white overflow-hidden py-16 md:py-0"
        aria-label="Horizontal Editorial Gallery"
      >
        <div className="w-full md:h-screen flex flex-col justify-between py-8 px-5vw">
          {/* Section Heading */}
          <div className="max-w-7xl w-full mx-auto flex items-end justify-between border-b hairline-dark pb-4 mb-6 md:mb-0 pt-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-1">
                04 / The Archive
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight">
                Selected Frames in Motion
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-white/40 hidden md:block">
              [Scroll Vertically to Traverse]
            </span>
          </div>

          {/* Desktop Pinned Horizontal Track / Mobile Touch Carousel */}
          <div className="relative w-full flex-1 flex items-center overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory">
            <div
              ref={trackRef}
              className="flex items-center gap-8 md:gap-14 h-full will-change-transform pl-2 pr-12 py-6"
            >
              {frames.map((item, idx) => {
                const styleMeta = FRAME_META[idx % FRAME_META.length];
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveLightbox(item)}
                    className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] ${styleMeta.heightClass} ${styleMeta.baselineClass} flex flex-col justify-between group snap-center cursor-pointer`}
                    data-cursor="view"
                  >
                    {/* Image Card */}
                    <div className="relative w-full flex-1 overflow-hidden border border-white/10 bg-white/5 rounded-[2px]">
                      <Image
                        src={item.src1280}
                        alt={item.alt}
                        fill
                        loading="eager"
                        placeholder="blur"
                        blurDataURL={item.blur}
                        sizes="(max-width: 768px) 300px, 400px"
                        className="object-cover object-top filter grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Caption Below */}
                    <div className="pt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/60">
                      <span className="group-hover:text-accent transition-colors">
                        {styleMeta.caption}
                      </span>
                      <span className="text-white/30">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom meta row */}
          <div className="max-w-7xl w-full mx-auto flex justify-between items-center border-t hairline-dark pt-3 mt-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              {siteConfig.tagline}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {siteConfig.name} · {siteConfig.contact.cityShort}
            </span>
          </div>
        </div>
      </section>

      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-[99995] bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
        >
          <button
            onClick={() => setActiveLightbox(null)}
            aria-label="Close frame lightbox"
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-accent hover:text-ink transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full h-[80vh] flex flex-col items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={activeLightbox.src2000}
                alt={activeLightbox.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/70 mt-4 text-center">
              {activeLightbox.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
