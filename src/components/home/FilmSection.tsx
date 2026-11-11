"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, X, MessageCircle } from "lucide-react";
import { getFilmPosterImage } from "@/lib/images";
import { siteConfig, getWhatsAppUrl } from "@/data/site";

export default function FilmSection() {
  const poster = useMemo(() => getFilmPosterImage(), []);
  const containerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && containerRef.current && panelRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          panelRef.current,
          { width: "65%", borderRadius: "16px" },
          {
            width: "100%",
            borderRadius: "0px",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "center 45%",
              scrub: 1,
            },
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  return (
    <>
      <section
        ref={containerRef}
        id="film"
        className="relative z-20 w-full bg-ink text-white py-28 overflow-hidden flex flex-col items-center justify-center border-t hairline-dark"
        aria-label="Wedding Cinematography Showcase"
      >
        <div className="max-w-7xl w-full mx-auto px-5vw mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-2">
              06 / Motion Picture · Cinematography
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight">
              The <em className="italic font-light text-accent">Film</em> Reel
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-white/50 mt-2 sm:mt-0">
            Wedding Cinematography · 4K Color Master
          </span>
        </div>

        <div
          ref={panelRef}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-video max-h-[75vh] w-full mx-auto overflow-hidden border border-white/15 shadow-2xl cursor-pointer group will-change-transform"
          data-cursor="play"
          role="button"
          tabIndex={0}
          aria-label="Open Umer Gill Photography cinema screening room"
          onKeyDown={(e) => e.key === "Enter" && setIsLightboxOpen(true)}
        >
          <Image
            src={poster.src2000}
            alt={poster.alt}
            fill
            loading="eager"
            placeholder="blur"
            blurDataURL={poster.blur}
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.72] group-hover:brightness-[0.82] group-hover:scale-105 transition-all duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40 pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent text-ink flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
            </div>

            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white mt-6 group-hover:text-accent transition-colors">
              Enter Cinema Screening Room
            </span>
            <span className="font-serif italic text-white/60 text-sm mt-1">
              Full Wedding Highlights &amp; Teasers Available on Request
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/75 bg-ink/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {siteConfig.name} · Islamabad
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent bg-ink/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              [TODO: Client Video Reel URL]
            </span>
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cinema screening notice"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[99995] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-accent hover:text-ink transition-colors focus:outline-none"
            aria-label="Close cinema screening modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video bg-[#121215] rounded-lg overflow-hidden border border-white/20 shadow-2xl flex flex-col items-center justify-center p-8 text-center"
          >
            <Image
              src={poster.src1280}
              alt={poster.alt}
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="relative z-10 max-w-lg flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent border border-accent/40 px-3 py-1 rounded-full mb-4">
                TODO: Video Embed Pending
              </span>
              <h3 className="font-serif text-3xl sm:text-5xl text-white mb-4">
                Private Wedding Cinema <em className="italic font-light text-accent">Reels</em>
              </h3>
              <p className="font-sans text-sm text-white/75 leading-relaxed mb-8">
                To protect family privacy across private events in Islamabad, full wedding
                highlight films and teasers are shared directly on request before we attach a
                public showreel embed.
              </p>
              <a
                href={getWhatsAppUrl(
                  "Assalam o Alaikum, I would like to watch recent Wedding Cinematography showreels from Umer Gill Photography."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-accent text-ink font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Private Showreel on WhatsApp ({siteConfig.contact.phone})</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
