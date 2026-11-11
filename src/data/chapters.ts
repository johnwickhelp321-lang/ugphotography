import { getChapterImages, SyncedImage } from "@/lib/images";

export interface ChapterCard {
  index: string;
  title: string;
  subtitleItalic: string;
  description: string;
  image: string;
  blurDataURL?: string;
  imageAlt: string;
  tag: string;
}

const chapterImgs: SyncedImage[] = getChapterImages();

function getImg(idx: number): SyncedImage {
  return chapterImgs[idx % chapterImgs.length];
}

export const weddingChapters: ChapterCard[] = [
  {
    index: "01",
    title: "Engagement & Mehndi",
    subtitleItalic: "Fragrance of fresh henna, warm marigolds & unscripted family rhythm.",
    description:
      "Vibrant choreography, candid laughter across generations, and the warm glow of evening lights preserved cleanly in still and motion frames.",
    image: getImg(0).src1280,
    blurDataURL: getImg(0).blur,
    imageAlt: getImg(0).alt,
    tag: "Chapter One · Festivity",
  },
  {
    index: "02",
    title: "The Nikkah",
    subtitleItalic: "Sacred vows, quiet tears of joy & the stillness of new beginnings.",
    description:
      "Discreet lens discipline when the room holds its breath—honoring every tear, blessing from elders, and signature under warm architectural light.",
    image: getImg(1).src1280,
    blurDataURL: getImg(1).blur,
    imageAlt: getImg(1).alt,
    tag: "Chapter Two · Sacred Vows",
  },
  {
    index: "03",
    title: "Baraat & Rukhsati",
    subtitleItalic: "Grand royal procession followed by the tender ache of farewell.",
    description:
      "From high-energy processions to intimate parental embraces, capturing every emotion with perfection so your family relives the night for decades.",
    image: getImg(2).src1280,
    blurDataURL: getImg(2).blur,
    imageAlt: getImg(2).alt,
    tag: "Chapter Three · Procession",
  },
  {
    index: "04",
    title: "The Walima",
    subtitleItalic: "Refined hospitality, chandelier light & relaxed celebration.",
    description:
      "Timeless portraits and documentary coverage of your reception banquet, delivered promptly with true-to-life color and editorial polish.",
    image: getImg(3).src1280,
    blurDataURL: getImg(3).blur,
    imageAlt: getImg(3).alt,
    tag: "Chapter Four · Reception",
  },
  {
    index: "05",
    title: "Bridal & Studio Portraits",
    subtitleItalic: "Bridal styling, studio portraiture & outdoor Margalla golden hour.",
    description:
      "Combining professional bridal and party makeup artistry with sculpted portrait lighting at our E-11/2 Markaz studio or outdoor locations across Islamabad.",
    image: getImg(4).src1280,
    blurDataURL: getImg(4).blur,
    imageAlt: getImg(4).alt,
    tag: "Chapter Five · Portraiture",
  },
];
