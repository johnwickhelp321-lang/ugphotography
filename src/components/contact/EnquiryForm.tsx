"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";
import { siteConfig, getWhatsAppUrl } from "@/data/site";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    eventDate: "",
    eventType: siteConfig.services[0].title,
    message: "",
    _honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState("");

  const buildPersonalizedWhatsApp = () => {
    const eventLabel = formData.eventType || "Photography & Cinematography";
    const dateLabel = formData.eventDate || "[date]";
    const nameSuffix = formData.name ? ` My name is ${formData.name}.` : "";
    return getWhatsAppUrl(
      `Assalam o Alaikum, I found your website and would like to check availability for ${eventLabel} on ${dateLabel}.${nameSuffix}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");
    const waHref = buildPersonalizedWhatsApp();
    setSubmittedWhatsappUrl(waHref);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFeedback(
          data.message ||
          "Your enquiry has been logged. For fastest confirmation, tap WhatsApp below to chat directly with Umer Gill."
        );
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#e8b86a", "#ffffff", "#f2ede4"],
        });
        setFormData({
          name: "",
          contact: "",
          eventDate: "",
          eventType: siteConfig.services[0].title,
          message: "",
          _honeypot: "",
        });
      } else {
        setStatus("error");
        setFeedback(
          data.error ||
          `Could not deliver form. Please WhatsApp ${siteConfig.contact.phone} directly.`
        );
      }
    } catch {
      setStatus("error");
      setFeedback(
        `Network error. Please message us directly on WhatsApp (${siteConfig.contact.phone}) or call ${siteConfig.contact.secondaryPhone}.`
      );
    }
  };

  return (
    <div className="w-full bg-[#161619] border border-white/10 p-6 sm:p-10 rounded-sm">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Direct Studio Enquiry · Islamabad
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Response within 24h
        </span>
      </div>

      {status === "success" ? (
        <div className="py-10 flex flex-col items-center text-center">
          <CheckCircle2 className="w-12 h-12 text-accent mb-4" />
          <h3 className="font-serif text-2xl text-white mb-2">Enquiry Received</h3>
          <p className="font-sans text-sm text-white/70 max-w-md mb-6 leading-relaxed">
            {feedback}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={submittedWhatsappUrl || getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send on WhatsApp ({siteConfig.contact.phone})</span>
            </a>
            <button
              onClick={() => setStatus("idle")}
              className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-accent underline underline-offset-4"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Honeypot field - invisible to human users */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="_honeypot">Leave blank</label>
            <input
              type="text"
              id="_honeypot"
              name="_honeypot"
              value={formData._honeypot}
              onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-mono text-[11px] uppercase tracking-widest text-white/60"
              >
                Your Names *
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Your full name / couple names"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact"
                className="font-mono text-[11px] uppercase tracking-widest text-white/60"
              >
                Your WhatsApp / Phone or Email *
              </label>
              <input
                id="contact"
                type="text"
                required
                placeholder="Your WhatsApp number or email"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="eventDate"
                className="font-mono text-[11px] uppercase tracking-widest text-white/60"
              >
                Event Date / Season
              </label>
              <input
                id="eventDate"
                type="text"
                placeholder="e.g. December 2026 / Event Dates"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="eventType"
                className="font-mono text-[11px] uppercase tracking-widest text-white/60"
              >
                Service / Occasion
              </label>
              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="bg-ink border border-white/15 px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                {siteConfig.services.map((srv) => (
                  <option key={srv.index} value={srv.title}>
                    {srv.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="font-mono text-[11px] uppercase tracking-widest text-white/60"
            >
              Event Venues & Notes
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Share your venue, city, dates, or photography & cinematography preferences..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <div className="font-mono text-xs text-rose-400 bg-rose-500/10 p-3 border border-rose-500/20">
              {feedback}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex-1 py-4 rounded-full bg-accent hover:bg-white text-ink font-mono text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <span>{status === "loading" ? "Sending Enquiry..." : "Send Studio Enquiry"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <a
              href={buildPersonalizedWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full border border-white/20 hover:border-accent text-white hover:text-accent font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-accent" />
              <span>WhatsApp Quick Chat</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
