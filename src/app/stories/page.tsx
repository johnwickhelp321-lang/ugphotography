import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { stories } from "@/data/stories";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import CustomCursor from "@/components/common/CustomCursor";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio Stories & Celebrations | Umer Gill Photography Islamabad",
  description:
    "Explore weddings, Mehndi nights, bridal portraits, and milestone celebrations documented by Umer Gill Photography in Islamabad.",
};

export default function StoriesIndexPage() {
  return (
    <div className="min-h-screen bg-ink text-white selection:bg-accent selection:text-ink">
      <CustomCursor />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-28 px-5vw">
        <div className="max-w-7xl mx-auto">
          <div className="border-b hairline-dark pb-10 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-3">
              Archive Index · {String(stories.length).padStart(2, "0")} Collections
            </span>
            <h1 className="font-serif headline-giant font-normal text-white tracking-tight">
              Stories we were <em className="italic text-accent font-light">trusted</em> with
            </h1>
            <p className="font-sans text-white/65 text-sm sm:text-base max-w-2xl mt-6 leading-relaxed font-light">
              Curated collections from weddings, Mehndi nights, bridal shoots, and family
              celebrations documented by Umer Gill Photography, Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {stories.map((story, idx) => (
              <article
                key={story.slug}
                className="group flex flex-col justify-between border border-white/10 bg-[#161619] overflow-hidden rounded-[3px] transition-all duration-500 hover:border-accent hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(232,184,106,0.14)]"
                data-cursor="view"
              >
                <Link href={`/stories/${story.slug}`} className="block relative w-full aspect-[4/5] overflow-hidden">
                  <Image
                    src={story.heroImage}
                    alt={story.heroAlt}
                    fill
                    placeholder={story.heroBlur ? "blur" : "empty"}
                    blurDataURL={story.heroBlur}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top filter grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-accent bg-ink/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                </Link>

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
                      {story.type} · {story.year}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-accent transition-colors">
                      <Link href={`/stories/${story.slug}`}>{story.coupleNames}</Link>
                    </h2>
                    <p className="font-sans text-xs text-white/70 line-clamp-2 mt-3 leading-relaxed font-light">
                      {story.synopsis}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-white/45 tracking-wider">
                      {story.location}
                    </span>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-accent group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
