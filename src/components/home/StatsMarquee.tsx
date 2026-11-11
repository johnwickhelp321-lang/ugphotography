"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { siteConfig, getWhatsAppUrl } from "@/data/site";
import { getStoryImages } from "@/lib/images";

const MARQUEE_WORDS = [
  { text: "Portraits", italic: false },
  { text: "Weddings", italic: true },
  { text: "Mehndi", italic: false },
  { text: "Nikkah", italic: true },
  { text: "Baraat", italic: false },
  { text: "Walima", italic: true },
  { text: "Films", italic: false },
  { text: "Editorial", italic: true },
];

export default function StatsMarquee() {
  const containerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState<number[]>(
    siteConfig.stats.map(() => 0)
  );
  const [hoveredServiceIdx, setHoveredServiceIdx] = useState<number>(0);
  const storyThumbs = useMemo(() => getStoryImages(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let xOffset = 0;
    const baseSpeed = 1.2;
    let currentSpeed = baseSpeed;
    let animId: number;

    const updateMarquee = () => {
      xOffset -= currentSpeed;
      if (marqueeRef.current) {
        marqueeRef.current.style.transform = `translate3d(${xOffset}px, 0, 0)`;
        const width = marqueeRef.current.scrollWidth / 2;
        if (width > 0 && Math.abs(xOffset) >= width) {
          xOffset = 0;
        }
      }
      currentSpeed += (baseSpeed - currentSpeed) * 0.05;
      animId = requestAnimationFrame(updateMarquee);
    };

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(updateMarquee);

      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          currentSpeed = baseSpeed + Math.min(Math.max(velocity / 80, -10), 10);
        },
      });

      const statsObj = { values: siteConfig.stats.map(() => 0) };
      const ctx = gsap.context(() => {
        gsap.to(statsObj.values, {
          endArray: siteConfig.stats.map((s) => s.value),
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stats-grid",
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            setAnimatedStats(statsObj.values.map((v) => Math.floor(v)));
          },
        });
      }, containerRef);

      return () => {
        cancelAnimationFrame(animId);
        scrollTriggerInstance.kill();
        ctx.revert();
      };
    } else {
      const id = requestAnimationFrame(() => {
        setAnimatedStats(siteConfig.stats.map((s) => s.value));
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const previewPhoto = storyThumbs[hoveredServiceIdx % storyThumbs.length];

  return (
    <section
      ref={containerRef}
      className="relative z-20 w-full bg-ink text-white py-24 sm:py-32 overflow-hidden border-y hairline-dark"
      aria-label="Category Marquee, Studio Metrics and Offerings"
    >
      {/* Giant Infinite Marquee */}
      <div className="w-full overflow-hidden select-none py-6 border-b hairline-dark">
        <div
          ref={marqueeRef}
          className="flex items-center gap-10 sm:gap-16 whitespace-nowrap will-change-transform"
        >
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 sm:gap-14">
              <span
                className={`font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight transition-colors duration-300 hover:text-accent ${
                  item.italic
                    ? "italic font-light text-white/90"
                    : "font-normal text-white/40"
                }`}
              >
                {item.text}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Row of 4 Count-up Stats */}
      <div className="stats-grid max-w-7xl mx-auto px-5vw pt-16 sm:pt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {siteConfig.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="flex flex-col border-l hairline-dark pl-6 sm:pl-8 group hover:border-accent transition-colors duration-500"
            >
              <div className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight tabular-nums flex items-baseline">
                <span>{animatedStats[idx]}</span>
                <span className="text-accent text-3xl sm:text-4xl ml-1 font-light">
                  {stat.suffix}
                </span>
              </div>

              <span className="font-mono text-xs uppercase tracking-widest text-white/70 mt-2 block">
                {stat.label}
              </span>

              {stat.isTodo && (
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent/65 mt-1 block">
                  [{stat.note?.split(":")[0] || "TODO: Pending client confirmation"}]
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official 8 Flyer Services Discipline Index */}
      <div
        id="services"
        className="max-w-7xl mx-auto px-5vw pt-20 sm:pt-24 mt-16 sm:mt-24 border-t hairline-dark"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-2">
              03 / Studio Disciplines · {siteConfig.contact.cityShort}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
              Eight ways we <em className="italic font-light text-accent">preserve</em> it
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-white/60 max-w-md font-light leading-relaxed">
            Every offering printed by Umer Gill Photography in E-11/2 Markaz—spanning
            bridal portraiture, makeup artistry, corporate coverage, and wedding cinema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 divide-y divide-white/[0.12] border-y border-white/[0.12]">
            {siteConfig.services.map((service, idx) => {
              const isActive = idx === hoveredServiceIdx;
              return (
                <div
                  key={service.index}
                  onMouseEnter={() => setHoveredServiceIdx(idx)}
                  className={`group py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer transition-colors duration-300 ${
                    isActive ? "bg-white/[0.025] px-3 -mx-3" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-5 sm:gap-7">
                    <span
                      className={`font-mono text-xs tracking-widest transition-colors ${
                        isActive ? "text-accent" : "text-white/35"
                      }`}
                    >
                      {service.index}
                    </span>
                    <div>
                      <h3
                        className={`font-serif text-xl sm:text-2xl md:text-3xl font-normal tracking-tight transition-colors ${
                          isActive ? "text-accent" : "text-white group-hover:text-accent"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/45 block mt-1">
                        {service.category} · {service.deliverableNote}
                      </span>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl(
                      `Assalam o Alaikum, I found your website and would like to check availability for ${service.title} on [date].`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Enquire about ${service.title} on WhatsApp`}
                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all flex-shrink-0 ${
                      isActive
                        ? "border-accent text-ink bg-accent"
                        : "border-white/15 text-white/60 hover:border-accent hover:text-accent"
                    }`}
                  >
                    <span>Book</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            {previewPhoto && (
              <div className="border border-white/15 bg-[#161619] p-2.5 rounded-[3px] shadow-2xl">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px]">
                  <Image
                    key={previewPhoto.id}
                    src={previewPhoto.src1280}
                    alt={previewPhoto.alt}
                    fill
                    placeholder="blur"
                    blurDataURL={previewPhoto.blur}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-1">
                      {siteConfig.services[hoveredServiceIdx]?.index} /{" "}
                      {siteConfig.services[hoveredServiceIdx]?.category}
                    </span>
                    <p className="font-serif text-2xl text-white">
                      {siteConfig.services[hoveredServiceIdx]?.title}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
