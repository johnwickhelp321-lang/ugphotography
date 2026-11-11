"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, getWhatsAppUrl } from "@/data/site";
import { stories } from "@/data/stories";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar when scrolling down past 120px, reveal when scrolling up
      if (currentScrollY > 120 && currentScrollY > lastScrollY && !isMobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;

      // Detect if navbar is currently hovering over light/cream sections
      const lightElements = document.querySelectorAll('[data-nav-theme="light"]');
      let overLight = false;

      lightElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom >= 40) {
          overLight = true;
        }
      });

      setIsLightMode(overLight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Work", href: "/#work" },
    { label: "Stories", href: "/#stories" },
    { label: "Chapters", href: "/#chapters" },
    { label: "The Film", href: "/#film" },
    { label: "Contact", href: "/#contact" },
  ];

  const storyCountLabel = String(stories.length).padStart(2, "0");

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[8000] transition-all duration-500 ease-out px-5vw py-4 sm:py-5 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${
          isLightMode
            ? "text-paper-text bg-paper/85 backdrop-blur-md border-b border-paper-text/10"
            : "text-white bg-ink/75 backdrop-blur-md border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Left */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Umer Gill Photography - Homepage"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
              <Image
                src={isLightMode ? "/brand/logo-dark.webp" : "/brand/logo-light.webp"}
                alt="Umer Gill Photography monogram"
                fill
                sizes="36px"
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-serif text-xl sm:text-2xl font-normal tracking-tight flex items-baseline gap-1.5 leading-none">
                <span>Umer</span>
                <span className="italic font-light text-accent">Gill</span>
              </div>
              <span
                className={`font-mono text-[9px] uppercase tracking-widest transition-opacity duration-300 mt-1 ${
                  isLightMode ? "text-paper-text/60" : "text-white/50"
                }`}
              >
                Photography &amp; Film · {siteConfig.contact.cityShort}
              </span>
            </div>
          </Link>

          {/* Desktop Links Center */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 relative py-1 hover:text-accent group ${
                  isLightMode ? "text-paper-text/80" : "text-white/80"
                }`}
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Enquire Button Right */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/#contact"
              className={`group inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all duration-300 border hover:scale-105 active:scale-95 ${
                isLightMode
                  ? "border-paper-text text-paper-text hover:bg-paper-text hover:text-paper"
                  : "border-accent/80 text-white hover:border-accent hover:bg-accent hover:text-ink shadow-[0_0_15px_rgba(232,184,106,0.15)]"
              }`}
            >
              <span>Enquire</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-inherit focus:outline-none"
            aria-label="Toggle mobile navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-[7990] bg-ink/95 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between px-8 py-24 md:hidden ${
          isMobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="flex flex-col gap-5 mt-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Navigation Index · {siteConfig.contact.cityShort}
          </span>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-white hover:text-accent transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-white/30">↗</span>
            </Link>
          ))}
          <Link
            href="/stories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-serif text-3xl text-white hover:text-accent transition-colors flex items-center justify-between"
          >
            <span>All Projects</span>
            <span className="font-mono text-xs text-white/30">{storyCountLabel}</span>
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-serif text-3xl text-white hover:text-accent transition-colors flex items-center justify-between"
          >
            <span>Visit E-11/2 Studio</span>
            <span className="font-mono text-xs text-white/30">↗</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-mono text-white/60">
            <span>WhatsApp &amp; Bookings</span>
            <span className="text-accent">{siteConfig.contact.phone}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-white/50">
            <span>Second Call Line</span>
            <a href={`tel:${siteConfig.contact.secondaryPhoneInternational}`} className="text-white/80">
              {siteConfig.contact.secondaryPhone}
            </a>
          </div>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center py-3.5 mt-1 rounded-full bg-accent text-ink font-mono text-xs font-semibold uppercase tracking-widest"
          >
            Check Availability on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
