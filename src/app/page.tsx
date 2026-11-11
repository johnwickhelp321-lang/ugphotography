"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/common/SmoothScroll";
import Preloader from "@/components/common/Preloader";
import CustomCursor from "@/components/common/CustomCursor";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import StoriesSection from "@/components/home/StoriesSection";
import StatsMarquee from "@/components/home/StatsMarquee";
import HorizontalGallery from "@/components/home/HorizontalGallery";
import ChaptersSection from "@/components/home/ChaptersSection";
import FilmSection from "@/components/home/FilmSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramStrip from "@/components/home/InstagramStrip";
import Footer from "@/components/layout/Footer";

const WebGLCanvas = dynamic(() => import("@/components/webgl/WebGLCanvas"), {
  ssr: false,
});

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <CustomCursor />
      <div className="film-grain" />
      <WebGLCanvas />

      {/* 4.1 Navbar */}
      <Navbar />

      <main className="relative z-10 w-full bg-ink">
        {/* 4.2 Hero */}
        <HeroSection />

        {/* 4.3 Manifesto */}
        <ManifestoSection />

        {/* 4.4 Stories we were trusted with */}
        <StoriesSection />

        {/* 4.5 Stats Marquee & 8 Craft Disciplines */}
        <StatsMarquee />

        {/* 4.6 Horizontal Gallery */}
        <HorizontalGallery />

        {/* 4.7 Five Chapters */}
        <ChaptersSection />

        {/* 4.8 The Film */}
        <FilmSection />

        {/* 4.9 Testimonials */}
        <TestimonialsSection />

        {/* 4.10 Instagram Strip */}
        <InstagramStrip />
      </main>

      {/* 4.11 Contact and Footer */}
      <Footer />

      {/* Persistent floating WhatsApp button */}
      <FloatingWhatsApp />
    </SmoothScroll>
  );
}
