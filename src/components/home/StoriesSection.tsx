"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stories, StoryProject } from "@/data/stories";
import { ArrowUpRight } from "lucide-react";

export default function StoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion || !containerRef.current || !pinnedCardRef.current) return;

      const totalStories = stories.length;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalStories * 100}%`,
        pin: pinnedCardRef.current,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const index = Math.min(
            Math.floor(self.progress * totalStories),
            totalStories - 1
          );
          setActiveIndex(index);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const currentStory: StoryProject = stories[activeIndex] || stories[0];
  const totalStoriesLabel = String(stories.length).padStart(2, "0");

  return (
    <section
      ref={containerRef}
      id="stories"
      className="relative z-20 w-full bg-ink text-white"
      style={{ height: `${stories.length * 100}vh` }}
      aria-label="Stories Portfolio Showcase"
    >
      <div
        ref={pinnedCardRef}
        className="w-full h-screen overflow-hidden flex flex-col justify-between py-8 px-5vw"
      >
        {/* Header Row */}
        <div className="w-full max-w-7xl mx-auto flex items-end justify-between border-b hairline-dark pb-4 pt-16 sm:pt-20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-1">
              02 / Curated Heirlooms
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white">
              Stories we were trusted with
            </h2>
          </div>

          <div className="font-mono text-sm tracking-widest text-accent">
            <span className="text-xl text-white font-serif">
              {(activeIndex + 1).toString().padStart(2, "0")}
            </span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/40">{totalStoriesLabel}</span>
          </div>
        </div>

        {/* Pinned Showcase: Center Large Portrait Image with Clip-Path Wipe */}
        <div className="relative w-full max-w-5xl mx-auto flex-1 min-h-0 my-3 sm:my-4 flex items-center justify-center">
          <div
            className="relative h-[48vh] sm:h-[55vh] max-h-[560px] w-auto aspect-[3/4] max-w-full overflow-hidden border border-white/10 shadow-2xl group"
            data-cursor="view"
          >
            {stories.map((story, idx) => (
              <div
                key={story.slug}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  idx === activeIndex
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-105 pointer-events-none"
                }`}
                style={{
                  clipPath:
                    idx === activeIndex
                      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                      : "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                  transitionProperty: "opacity, transform, clip-path",
                  transitionDuration: "800ms",
                }}
              >
                <Link href={`/stories/${story.slug}`} className="block w-full h-full">
                  <Image
                    src={story.heroImage}
                    alt={story.heroAlt}
                    fill
                    priority={idx < 2}
                    loading="eager"
                    placeholder={story.heroBlur ? "blur" : "empty"}
                    blurDataURL={story.heroBlur}
                    sizes="(max-width: 768px) 90vw, 450px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80" />
                </Link>
              </div>
            ))}

            {/* Corner visual crop marks */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/40 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/40 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/40 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Bottom Bar: Couple Names, Meta Line & View Story Link */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t hairline-dark pt-4 pb-2">
          <div className="flex flex-col">
            <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal tracking-tight">
              {currentStory.coupleNames}
            </h3>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/50 mt-1">
              <span>{currentStory.type}</span>
              <span>·</span>
              <span>{currentStory.location}</span>
              <span>·</span>
              <span className="text-accent">{currentStory.year}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={`/stories/${currentStory.slug}`}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-accent text-white hover:text-accent font-mono text-xs uppercase tracking-widest transition-all duration-300 bg-white/5 backdrop-blur-sm"
            >
              <span>Explore Story</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/stories"
              className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-4"
            >
              All Projects ({totalStoriesLabel})
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
