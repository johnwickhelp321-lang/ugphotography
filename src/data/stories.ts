import { getStoryImages, getFramesImages, SyncedImage } from "@/lib/images";

export interface StoryProject {
  slug: string;
  title: string;
  coupleNames: string;
  type: string;
  location: string;
  year: string;
  heroImage: string;
  heroBlur?: string;
  heroAlt: string;
  synopsis: string;
  quote: string;
  isTodoQuote?: boolean;
  galleryImages: Array<{
    src: string;
    blurDataURL?: string;
    alt: string;
    aspectRatio?: "portrait" | "landscape" | "square";
  }>;
  meta: {
    venue: string;
    palette: string;
    director: string;
  };
}

const storyPool: SyncedImage[] = getStoryImages();
const framesPool: SyncedImage[] = getFramesImages();

function pickStoryImg(idx: number): SyncedImage {
  return storyPool[idx % storyPool.length] || framesPool[idx % framesPool.length];
}

function pickFrameImg(idx: number): SyncedImage {
  return framesPool[idx % framesPool.length] || pickStoryImg(idx);
}

export const stories: StoryProject[] = [
  {
    slug: "noor-hamza-islamabad",
    title: "Evening Under Chandeliers",
    coupleNames: "Bridal & Couple Commission I",
    type: "Wedding Photography & Cinematography",
    location: "Islamabad",
    year: "Archive I",
    heroImage: pickStoryImg(0).src1280,
    heroBlur: pickStoryImg(0).blur,
    heroAlt: pickStoryImg(0).alt,
    synopsis:
      "Twilight vows and heirloom embroidery captured across Islamabad courtyard architecture. Intimate framing focused on stillness, eye contact, and timeless film grain.",
    quote: "TODO: Client testimonial quote pending confirmation from Umer Gill Photography archive.",
    isTodoQuote: true,
    galleryImages: [
      {
        src: pickStoryImg(0).src1280,
        blurDataURL: pickStoryImg(0).blur,
        alt: pickStoryImg(0).alt,
        aspectRatio: pickStoryImg(0).orientation,
      },
      {
        src: pickStoryImg(6).src1280,
        blurDataURL: pickStoryImg(6).blur,
        alt: pickStoryImg(6).alt,
        aspectRatio: pickStoryImg(6).orientation,
      },
      {
        src: pickFrameImg(0).src1280,
        blurDataURL: pickFrameImg(0).blur,
        alt: pickFrameImg(0).alt,
        aspectRatio: pickFrameImg(0).orientation,
      },
      {
        src: pickFrameImg(1).src1280,
        blurDataURL: pickFrameImg(1).blur,
        alt: pickFrameImg(1).alt,
        aspectRatio: pickFrameImg(1).orientation,
      },
    ],
    meta: {
      venue: "Islamabad Courtyard Venue",
      palette: "Warm Gold, Ivory, Obsidian",
      director: "Umer Gill",
    },
  },
  {
    slug: "mehndi-dholak-chronicle",
    title: "Saffron, Marigold & Rhythm",
    coupleNames: "Mehndi & Engagement Series",
    type: "Engagement & Mehndi Shoots",
    location: "Margalla Foothills, Islamabad",
    year: "Archive II",
    heroImage: pickStoryImg(1).src1280,
    heroBlur: pickStoryImg(1).blur,
    heroAlt: pickStoryImg(1).alt,
    synopsis:
      "Unscripted laughter, brass oil lamps, and swirling evening dances under the open Islamabad sky—documented gently without interrupting the warmth of family celebration.",
    quote: "TODO: Client testimonial quote pending confirmation from Umer Gill Photography archive.",
    isTodoQuote: true,
    galleryImages: [
      {
        src: pickStoryImg(1).src1280,
        blurDataURL: pickStoryImg(1).blur,
        alt: pickStoryImg(1).alt,
        aspectRatio: pickStoryImg(1).orientation,
      },
      {
        src: pickStoryImg(7).src1280,
        blurDataURL: pickStoryImg(7).blur,
        alt: pickStoryImg(7).alt,
        aspectRatio: pickStoryImg(7).orientation,
      },
      {
        src: pickFrameImg(2).src1280,
        blurDataURL: pickFrameImg(2).blur,
        alt: pickFrameImg(2).alt,
        aspectRatio: pickFrameImg(2).orientation,
      },
      {
        src: pickFrameImg(3).src1280,
        blurDataURL: pickFrameImg(3).blur,
        alt: pickFrameImg(3).alt,
        aspectRatio: pickFrameImg(3).orientation,
      },
    ],
    meta: {
      venue: "Outdoor Marquee & Gardens",
      palette: "Marigold, Amber, Emerald",
      director: "Umer Gill",
    },
  },
  {
    slug: "royal-bridal-portraits",
    title: "Heirlooms in Crimson Velvet",
    coupleNames: "Bridal Portraiture Study",
    type: "Bridal & Couple Portraits",
    location: "E-11/2 Atelier & On-Location",
    year: "Archive III",
    heroImage: pickStoryImg(2).src1280,
    heroBlur: pickStoryImg(2).blur,
    heroAlt: pickStoryImg(2).alt,
    synopsis:
      "Dedicated bridal artistry, sculpted directional key lighting, and quiet moments of reflection before stepping out into the Baraat celebration.",
    quote: "TODO: Client testimonial quote pending confirmation from Umer Gill Photography archive.",
    isTodoQuote: true,
    galleryImages: [
      {
        src: pickStoryImg(2).src1280,
        blurDataURL: pickStoryImg(2).blur,
        alt: pickStoryImg(2).alt,
        aspectRatio: pickStoryImg(2).orientation,
      },
      {
        src: pickStoryImg(8).src1280,
        blurDataURL: pickStoryImg(8).blur,
        alt: pickStoryImg(8).alt,
        aspectRatio: pickStoryImg(8).orientation,
      },
      {
        src: pickFrameImg(4).src1280,
        blurDataURL: pickFrameImg(4).blur,
        alt: pickFrameImg(4).alt,
        aspectRatio: pickFrameImg(4).orientation,
      },
    ],
    meta: {
      venue: "Studio & Bridal Suite",
      palette: "Deep Ruby, Antique Gold, Charcoal",
      director: "Umer Gill",
    },
  },
  {
    slug: "walima-twilight-reception",
    title: "The Calm After Vows",
    coupleNames: "Walima Banquet & Reception",
    type: "Wedding Photography & Cinematography",
    location: "Islamabad Club & Environs",
    year: "Archive IV",
    heroImage: pickStoryImg(3).src1280,
    heroBlur: pickStoryImg(3).blur,
    heroAlt: pickStoryImg(3).alt,
    synopsis:
      "Champagne reflections, tailored silhouettes, and heartfelt family portraits crafted with editorial restraint and natural skin tones.",
    quote: "TODO: Client testimonial quote pending confirmation from Umer Gill Photography archive.",
    isTodoQuote: true,
    galleryImages: [
      {
        src: pickStoryImg(3).src1280,
        blurDataURL: pickStoryImg(3).blur,
        alt: pickStoryImg(3).alt,
        aspectRatio: pickStoryImg(3).orientation,
      },
      {
        src: pickStoryImg(9).src1280,
        blurDataURL: pickStoryImg(9).blur,
        alt: pickStoryImg(9).alt,
        aspectRatio: pickStoryImg(9).orientation,
      },
      {
        src: pickFrameImg(5).src1280,
        blurDataURL: pickFrameImg(5).blur,
        alt: pickFrameImg(5).alt,
        aspectRatio: pickFrameImg(5).orientation,
      },
    ],
    meta: {
      venue: "Grand Reception Lawn",
      palette: "Pearl Ivory, Slate, Burnished Gold",
      director: "Umer Gill",
    },
  },
  {
    slug: "outdoor-margalla-editorial",
    title: "Golden Hour Portraits",
    coupleNames: "Outdoor & Studio Lookbook",
    type: "Outdoor & Studio Photoshoots",
    location: "Islamabad Hills",
    year: "Archive V",
    heroImage: pickStoryImg(4).src1280,
    heroBlur: pickStoryImg(4).blur,
    heroAlt: pickStoryImg(4).alt,
    synopsis:
      "Natural late-afternoon sun filtering through pines and stone terraces, pairing effortless movement with refined composition.",
    quote: "TODO: Client testimonial quote pending confirmation from Umer Gill Photography archive.",
    isTodoQuote: true,
    galleryImages: [
      {
        src: pickStoryImg(4).src1280,
        blurDataURL: pickStoryImg(4).blur,
        alt: pickStoryImg(4).alt,
        aspectRatio: pickStoryImg(4).orientation,
      },
      {
        src: pickStoryImg(10).src1280,
        blurDataURL: pickStoryImg(10).blur,
        alt: pickStoryImg(10).alt,
        aspectRatio: pickStoryImg(10).orientation,
      },
      {
        src: pickFrameImg(6).src1280,
        blurDataURL: pickFrameImg(6).blur,
        alt: pickFrameImg(6).alt,
        aspectRatio: pickFrameImg(6).orientation,
      },
    ],
    meta: {
      venue: "Margalla Overlook, Islamabad",
      palette: "Warm Chestnut, Sand, Amber",
      director: "Umer Gill",
    },
  },
  {
    slug: "family-milestone-gatherings",
    title: "Generations Framed Forever",
    coupleNames: "Family & Event Chronicles",
    type: "Family, Birthday & Corporate Events",
    location: "Islamabad & Rawalpindi",
    year: "Archive VI",
    heroImage: pickStoryImg(5).src1280,
    heroBlur: pickStoryImg(5).blur,
    heroAlt: pickStoryImg(5).alt,
    synopsis:
      "From milestone anniversaries and birthdays to formal corporate galas and family sessions, every emotion preserved with clarity and warmth.",
    quote: "TODO: Client testimonial quote pending confirmation from Umer Gill Photography archive.",
    isTodoQuote: true,
    galleryImages: [
      {
        src: pickStoryImg(5).src1280,
        blurDataURL: pickStoryImg(5).blur,
        alt: pickStoryImg(5).alt,
        aspectRatio: pickStoryImg(5).orientation,
      },
      {
        src: pickFrameImg(7).src1280,
        blurDataURL: pickFrameImg(7).blur,
        alt: pickFrameImg(7).alt,
        aspectRatio: pickFrameImg(7).orientation,
      },
      {
        src: pickFrameImg(8).src1280,
        blurDataURL: pickFrameImg(8).blur,
        alt: pickFrameImg(8).alt,
        aspectRatio: pickFrameImg(8).orientation,
      },
    ],
    meta: {
      venue: "Private Residence & Studio",
      palette: "Warm Cream, Espresso, Champagne",
      director: "Umer Gill",
    },
  },
];
