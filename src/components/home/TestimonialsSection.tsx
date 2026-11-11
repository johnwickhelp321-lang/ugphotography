"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { testimonials, TestimonialItem } from "@/data/testimonials";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const current: TestimonialItem = testimonials[currentIndex] || testimonials[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      id="experience"
      data-nav-theme="light"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-20 w-full bg-paper text-paper-text py-24 sm:py-36 px-5vw overflow-hidden transition-colors duration-500"
      aria-label="Words from Families"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end border-b hairline-light pb-6 mb-14">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold block mb-2">
              07 / Words from Family · Islamabad
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-paper-text">
              Client Reflections
            </h2>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper-text/45 hidden sm:block">
            Auto-cycling [06s] · Hover to pause
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[440px]">
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div
              className="relative w-full sm:w-[320px] lg:w-[26vw] aspect-[3/4] overflow-hidden border border-paper-text/15 shadow-xl bg-ink/5 rounded-[3px]"
              data-cursor="view"
            >
              {testimonials.map((item, idx) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${idx === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  style={{
                    clipPath:
                      idx === currentIndex
                        ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                        : "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
                    transitionProperty: "opacity, transform, clip-path",
                    transitionDuration: "800ms",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    loading="eager"
                    placeholder={item.blurDataURL ? "blur" : "empty"}
                    blurDataURL={item.blurDataURL}
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-ink/10" />
                </div>
              ))}

              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-paper-text/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-paper-text/40 pointer-events-none" />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between h-full">
            <div className="relative">
              <span className="font-serif text-8xl sm:text-9xl text-paper-text/10 select-none absolute -top-12 -left-6 pointer-events-none">
                “
              </span>

              <blockquote className="relative z-10 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.18] tracking-tight text-paper-text">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-8 pt-6 border-t hairline-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <cite className="not-italic font-mono text-sm uppercase tracking-widest text-paper-text font-semibold block">
                    {current.author}
                  </cite>
                  <span className="font-mono text-xs uppercase tracking-wider text-paper-text/60 block mt-1">
                    {current.location} · {current.event}
                  </span>
                  {current.isTodo && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent mt-1 block">
                      [TODO: Verified client review text pending in words-from-family/ folder]
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="flex items-center gap-2 mr-2">
                    {testimonials.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentIndex(dotIdx)}
                        aria-label={`Go to testimonial ${dotIdx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${dotIdx === currentIndex
                          ? "w-8 bg-paper-text"
                          : "w-2 bg-paper-text/25 hover:bg-paper-text/50"
                          }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handlePrev}
                    aria-label="Previous client testimonial"
                    className="w-10 h-10 rounded-full border border-paper-text/20 flex items-center justify-center text-paper-text hover:bg-paper-text hover:text-paper transition-colors duration-200 focus:outline-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Next client testimonial"
                    className="w-10 h-10 rounded-full border border-paper-text/20 flex items-center justify-center text-paper-text hover:bg-paper-text hover:text-paper transition-colors duration-200 focus:outline-none"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
