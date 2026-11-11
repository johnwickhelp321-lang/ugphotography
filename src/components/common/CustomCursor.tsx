"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable cursor on non-touch devices
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    const enableId = requestAnimationFrame(() => setEnabled(true));

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
        if (cursorAttr) {
          setCursorText(cursorAttr.toUpperCase());
          setIsHovered(true);
        } else if (target.closest("a, button, input, textarea, [role='button']")) {
          setCursorText("");
          setIsHovered(true);
        } else {
          setCursorText("");
          setIsHovered(false);
        }
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // RAF loop for smooth lerping of the trailing ring
    let animationFrameId: number;
    const render = () => {
      const lerp = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(enableId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Precision inner dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-accent transition-opacity duration-200 ${
          cursorText ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Trailing interactive ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border transition-all duration-300 ease-out will-change-transform ${
          cursorText
            ? "w-20 h-20 -ml-10 -mt-10 bg-accent text-ink border-accent font-mono text-[11px] font-semibold tracking-widest scale-100 shadow-2xl"
            : isHovered
            ? "w-12 h-12 -ml-6 -mt-6 border-accent/80 bg-accent/10 scale-100"
            : isClicking
            ? "w-7 h-7 -ml-3.5 -mt-3.5 border-white/80 bg-white/20 scale-90"
            : "w-9 h-9 -ml-[18px] -mt-[18px] border-white/40 scale-100"
        }`}
      >
        {cursorText && (
          <span className="select-none tracking-widest animate-fade-in">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}

