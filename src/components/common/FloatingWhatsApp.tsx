"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/data/site";

export default function FloatingWhatsApp() {
  const whatsappUrl = getWhatsAppUrl(
    `Assalam o Alaikum ${siteConfig.name}, I found your website and would like to check availability for [event type] on [date].`
  );

  return (
    <aside aria-label="Quick WhatsApp contact" className="fixed bottom-6 right-6 z-[9000]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Umer Gill Photography on WhatsApp (0313 5266515)"
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-ink/90 backdrop-blur-md border border-white/15 text-white shadow-2xl transition-all duration-300 hover:border-accent hover:bg-ink hover:scale-105 active:scale-95"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
        </div>
        <MessageCircle className="w-4 h-4 text-accent transition-transform duration-300 group-hover:scale-110" />
        <span className="font-mono text-xs uppercase tracking-widest text-white/90 group-hover:text-accent transition-colors">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}
