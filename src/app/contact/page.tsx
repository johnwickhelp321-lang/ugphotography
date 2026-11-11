import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import CustomCursor from "@/components/common/CustomCursor";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { siteConfig, getWhatsAppUrl } from "@/data/site";
import { MessageCircle, Phone, MapPin, Navigation } from "lucide-react";
import InstagramIcon from "@/components/common/InstagramIcon";

export const metadata: Metadata = {
  title: "Book & Studio Location | Umer Gill Photography Islamabad",
  description:
    "Visit Umer Gill Photography at Office 402, Fourth Floor, Darwaish Tower, E-11/2 Markaz, Islamabad, or WhatsApp 0313 5266515 for wedding and portrait bookings.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink text-white selection:bg-accent selection:text-ink">
      <CustomCursor />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-28 px-5vw">
        <div className="max-w-7xl mx-auto">
          <div className="border-b hairline-dark pb-10 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-3">
              Reservations & Studio Location · Islamabad
            </span>
            <h1 className="font-serif headline-giant font-normal text-white tracking-tight">
              Make every moment <em className="italic text-accent font-light">picture-perfect</em>
            </h1>
            <p className="font-sans text-white/65 text-sm sm:text-base max-w-2xl mt-6 leading-relaxed font-light">
              {siteConfig.flyerCopy.subline} Connect with {siteConfig.photographer.fullName} (
              {siteConfig.photographer.role}) on WhatsApp or visit our Islamabad office in E-11/2 Markaz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <EnquiryForm />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Primary WhatsApp Card */}
              <div className="p-8 bg-[#161619] border border-white/10 rounded-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    WhatsApp & Primary Booking
                  </span>
                </div>
                <div className="font-mono text-2xl text-white">
                  {siteConfig.contact.phone}
                </div>
                <p className="font-sans text-xs text-white/65 leading-relaxed font-light">
                  Direct WhatsApp inquiries for wedding photography, cinematography, Mehndi coverage,
                  portraits, and studio sessions.
                </p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-center py-3 rounded-full bg-accent text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Open WhatsApp Chat ({siteConfig.contact.phone})
                </a>
              </div>

              {/* Studio Address & Second Call Line */}
              <div className="p-8 bg-[#161619] border border-white/10 rounded-sm flex flex-col gap-6 font-mono text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block uppercase tracking-wider">
                      Islamabad Studio Address
                    </span>
                    <span className="text-white/80 text-[12px] font-sans block mt-1.5 leading-relaxed">
                      {siteConfig.contact.address}
                    </span>
                    <span className="text-white/50 text-[11px] block mt-1">
                      Landmark: {siteConfig.contact.landmark}
                    </span>
                    <a
                      href={siteConfig.contact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline mt-3 text-[11px] uppercase tracking-widest"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get directions on Google Maps ↗</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                  <Phone className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white block uppercase tracking-wider">
                      Direct Call Lines
                    </span>
                    <a
                      href={`tel:${siteConfig.contact.phoneInternational}`}
                      className="text-white/80 hover:text-accent transition-colors"
                    >
                      Primary / WhatsApp: {siteConfig.contact.phone}
                    </a>
                    <a
                      href={`tel:${siteConfig.contact.secondaryPhoneInternational}`}
                      className="text-white/75 hover:text-accent transition-colors"
                    >
                      Second Call Line: {siteConfig.contact.secondaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                  <InstagramIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block uppercase tracking-wider">
                      Instagram DM for Bookings
                    </span>
                    <a
                      href={siteConfig.social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline block mt-1"
                    >
                      @{siteConfig.social.instagram.handle} ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
