"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Counter animation from 0 to 100 in ~1.5s
    const counterObj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Curtain reveal animation
        const curtainTl = gsap.timeline({
          onComplete: () => {
            setIsFinished(true);
            onComplete?.();
          },
        });

        curtainTl.to(".preloader-text", {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
        });

        curtainTl.to(".preloader-panel-top", {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        });

        curtainTl.to(
          ".preloader-panel-bottom",
          {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "<"
        );
      },
    });

    tl.to(counterObj, {
      value: 100,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.floor(counterObj.value));
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[99990] flex flex-col justify-between pointer-events-none select-none"
    >
      {/* Top half curtain */}
      <div className="preloader-panel-top fixed top-0 left-0 w-full h-1/2 bg-[#0e0e10] border-b border-white/5" />

      {/* Bottom half curtain */}
      <div className="preloader-panel-bottom fixed bottom-0 left-0 w-full h-1/2 bg-[#0e0e10] border-t border-white/5" />

      {/* Center content */}
      <div className="preloader-text fixed inset-0 flex flex-col items-center justify-center z-10 px-6">
        <div className="flex flex-col items-center max-w-md w-full">
          {/* Subtle mono label */}
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-dark mb-4">
            Visual Atelier · Islamabad
          </span>

          {/* Luxury Brand Title */}
          <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight flex items-baseline gap-2">
            <span>Umer</span>
            <span className="italic font-light text-accent">Gill</span>
          </h1>

          {/* Counter indicator */}
          <div className="w-full mt-10">
            <div className="flex justify-between items-center font-mono text-xs text-muted-dark mb-2">
              <span className="uppercase tracking-widest">Loading Cinema</span>
              <span className="text-accent tabular-nums">
                {count.toString().padStart(3, "0")}%
              </span>
            </div>
            <div className="w-full h-[1px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-75 ease-out"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

