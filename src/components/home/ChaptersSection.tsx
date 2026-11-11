"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weddingChapters } from "@/data/chapters";

export default function ChaptersSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>(".chapter-card");
    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return;

        gsap.to(card, {
          scale: 0.94,
          filter: "brightness(0.4)",
          ease: "none",
          scrollTrigger: {
            trigger: cards[index + 1],
            start: "top 65%",
            end: "top 15%",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="chapters"
      className="relative z-20 w-full bg-ink text-white py-28 px-5vw border-t hairline-dark"
      aria-label="Five Chapters Experience"
    >
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end border-b hairline-dark pb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-2">
            05 / The Anatomy of Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight">
            Five chapters,{" "}
            <em className="italic font-light text-accent">one long story</em>
          </h2>
        </div>
        <p className="font-sans text-xs sm:text-sm text-white/60 max-w-sm mt-4 md:mt-0 font-light leading-relaxed">
          From Mehndi dholak nights to Nikkah vows, Baraat grandeur, Walima elegance, and
          bridal portraiture—every moment receives dedicated attention.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative">
        {weddingChapters.map((chapter, idx) => (
          <div
            key={chapter.index}
            className="chapter-card sticky top-20 sm:top-24 w-full min-h-[540px] sm:min-h-[620px] rounded-[4px] overflow-hidden border border-white/15 bg-[#161619] shadow-2xl flex flex-col justify-between p-8 sm:p-14 will-change-transform"
            style={{ zIndex: idx + 1 }}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                loading="eager"
                placeholder={chapter.blurDataURL ? "blur" : "empty"}
                blurDataURL={chapter.blurDataURL}
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover object-[center_22%] filter brightness-[0.75] contrast-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
              <div className="absolute inset-0 bg-ink/25" />
            </div>

            <div className="relative z-10 flex justify-between items-center border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-light text-accent">
                  {chapter.index}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/65">
                  / CHAPTER {chapter.index}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent bg-ink/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {chapter.tag}
              </span>
            </div>

            <div className="relative z-10 mt-auto pt-16 max-w-2xl">
              <h3 className="font-serif text-4xl sm:text-6xl font-normal text-white tracking-tight mb-3">
                {chapter.title}
              </h3>
              <p className="font-serif italic text-xl sm:text-2xl text-accent/95 font-light mb-5 leading-snug">
                {chapter.subtitleItalic}
              </p>
              <p className="font-sans text-sm sm:text-base text-white/80 font-light leading-relaxed">
                {chapter.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
