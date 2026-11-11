import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { stories } from "@/data/stories";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import CustomCursor from "@/components/common/CustomCursor";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) return { title: "Story Not Found" };

  return {
    title: `${story.coupleNames} | ${story.title}`,
    description: story.synopsis,
    openGraph: {
      images: [story.heroImage],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const currentIndex = stories.findIndex((s) => s.slug === slug);
  if (currentIndex === -1) notFound();

  const story = stories[currentIndex];
  const nextStory = stories[(currentIndex + 1) % stories.length];

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-accent selection:text-ink">
      <CustomCursor />
      <Navbar />

      <section className="relative w-full min-h-[88vh] flex flex-col justify-between pt-32 pb-16 px-5vw overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={story.heroImage}
            alt={story.heroAlt}
            fill
            priority
            placeholder={story.heroBlur ? "blur" : "empty"}
            blurDataURL={story.heroBlur}
            sizes="100vw"
            className="object-cover object-top filter brightness-[0.65] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/75 hover:text-accent transition-colors bg-ink/55 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Archive</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full mt-auto pt-16">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
            {story.type} · {story.location} · {story.year}
          </div>
          <h1 className="font-serif headline-giant font-normal text-white tracking-tight">
            {story.coupleNames}
          </h1>
          <p className="font-serif italic text-xl sm:text-3xl text-white/80 max-w-2xl mt-4 font-light">
            &ldquo;{story.title}&rdquo;
          </p>
        </div>
      </section>

      <section className="relative w-full py-24 sm:py-32 px-5vw border-b hairline-dark bg-ink">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 border-l hairline-dark pl-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-3">
              Client Reflection
            </span>
            <blockquote className="font-serif italic text-xl sm:text-2xl text-white leading-relaxed">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
            <cite className="font-mono text-xs uppercase text-white/45 block mt-4 not-italic">
              — {story.coupleNames}
            </cite>
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              The Chronicle
            </span>
            <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed font-light">
              {story.synopsis}
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t hairline-dark font-mono text-[11px] text-white/60">
              <div>
                <span className="text-white/40 block uppercase text-[9px]">Venue</span>
                <span>{story.meta.venue}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[9px]">Palette</span>
                <span>{story.meta.palette}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[9px]">Director</span>
                <span>{story.meta.director}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 px-5vw bg-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end border-b hairline-dark pb-6 mb-12">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-1">
                Visual Documentation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal">
                Master Exhibition Plates
              </h2>
            </div>
            <span className="font-mono text-xs uppercase text-white/40">
              {story.galleryImages.length} Curated Frames
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {story.galleryImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden border border-white/10 bg-white/5 rounded-[3px] group ${idx % 3 === 0 ? "md:col-span-2 aspect-[16/10]" : "aspect-[3/4]"
                  }`}
                data-cursor="view"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  placeholder={img.blurDataURL ? "blur" : "empty"}
                  blurDataURL={img.blurDataURL}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover object-top filter grayscale-[0.06] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-ink/20 group-hover:opacity-0 transition-opacity" />
                <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/80 bg-ink/80 backdrop-blur-md px-3 py-1 rounded">
                  {img.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-5vw bg-ink border-y hairline-dark">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            Next Story
          </span>
          <Link
            href={`/stories/${nextStory.slug}`}
            className="group flex flex-col items-center gap-4"
          >
            <h3 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-white group-hover:text-accent transition-colors">
              {nextStory.coupleNames}
            </h3>
            <span className="font-serif italic text-xl sm:text-2xl text-white/60">
              &ldquo;{nextStory.title}&rdquo;
            </span>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent mt-4 group-hover:translate-x-2 transition-transform">
              <span>View Next Collection</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
