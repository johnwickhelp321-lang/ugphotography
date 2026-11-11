"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig, getWhatsAppUrl } from "@/data/site";
import { getAboutPortrait } from "@/lib/images";
import { Check } from "lucide-react";

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const { image: portraitImg, isFallback } = useMemo(() => getAboutPortrait(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (photoFrameRef.current) {
        gsap.to(photoFrameRef.current, {
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }

      const words = headlineRef.current?.querySelectorAll(".scrub-word");
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { filter: "blur(10px)", opacity: 0.2, y: 8 },
          {
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 82%",
              end: "bottom 48%",
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const manifestoHeadline =
    "Let us turn your special occasions into timeless photographs you will treasure for years.";

  return (
    <section
      ref={sectionRef}
      id="work"
      data-nav-theme="light"
      className="relative z-20 w-full bg-paper text-paper-text py-24 sm:py-36 px-5vw transition-colors duration-500 overflow-hidden"
      aria-label="Studio Manifesto and Story for Family"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Framed Portrait (~22vw) */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <div
            ref={photoFrameRef}
            className="w-full sm:w-[290px] lg:w-[22vw] aspect-[3/4] relative bg-ink/5 p-2 border border-paper-text/15 shadow-xl will-change-transform"
            data-cursor="view"
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={portraitImg.src1280}
                alt={portraitImg.alt}
                fill
                loading="eager"
                placeholder="blur"
                blurDataURL={portraitImg.blur}
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover object-top filter contrast-[1.04] hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-paper-text/45" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-paper-text/45" />
          </div>

          <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-paper-text/65 flex flex-col gap-1">
            <span>
              {siteConfig.photographer.fullName} · {siteConfig.photographer.role}
            </span>
            <span className="text-[9px] text-paper-text/45">
              {siteConfig.contact.address}
            </span>
            {isFallback && (
              <span className="text-[9px] text-accent font-medium mt-1">
                [TODO: Add dedicated photographer portrait to story-for-family/ folder]
              </span>
            )}
          </div>
        </div>

        {/* Right: Blur-to-Sharp Statement + 6 Why-Choose-Us Trust Points */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent mb-6 font-semibold">
            01 / Story for Family · {siteConfig.tagline}
          </span>

          <h2
            ref={headlineRef}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.06] tracking-tight mb-10 text-paper-text"
          >
            {manifestoHeadline.split(" ").map((word, idx) => (
              <span
                key={idx}
                className="scrub-word inline-block mr-2 sm:mr-3 will-change-transform"
              >
                {word === "special" || word === "timeless" || word === "treasure" ? (
                  <em className="font-serif italic font-light text-paper-text">
                    {word}
                  </em>
                ) : (
                  word
                )}
              </span>
            ))}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-paper-text/75 font-sans text-sm sm:text-base leading-relaxed mb-10">
            <p>
              Led by {siteConfig.photographer.fullName}, {siteConfig.photographer.role}, our
              Islamabad studio captures weddings, engagements, Mehndi nights, bridal
              portraits, birthdays, corporate events, and curated outdoor sessions with
              quiet precision and artistic grace.
            </p>
            <p>
              From pre-bridal makeup artistry to the final emotion of Rukhsati and
              reception cinematography, every frame is built around authentic human feeling,
              dependable scheduling, and heirloom presentation.
            </p>
          </div>

          {/* Official Flyer "Why Choose Us" 6 Guarantees */}
          <div className="border-t hairline-light pt-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper-text/50 block mb-5">
              Why Families Choose Umer Gill Photography
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {siteConfig.whyChooseUs.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-paper-text/[0.04] border border-paper-text/10 rounded-sm"
                >
                  <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <span className="font-sans text-xs sm:text-sm text-paper-text/90">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t hairline-light flex flex-wrap items-center justify-between gap-4">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-paper-text hover:text-accent transition-colors"
            >
              <span>WhatsApp Umer Gill ({siteConfig.contact.phone})</span>
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </a>

            <span className="font-mono text-[10px] uppercase text-paper-text/45 tracking-wider">
              {siteConfig.contact.cityShort} · Call {siteConfig.contact.secondaryPhone}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
