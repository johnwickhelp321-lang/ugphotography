import manifestJson from "@/data/images.generated.json";

export type SectionKey =
  | "hero"
  | "stories"
  | "chapters"
  | "frames"
  | "aboutPortrait"
  | "testimonials"
  | "instagram"
  | "film"
  | "rootExtras";

export interface SyncedImage {
  id: string;
  section: SectionKey;
  originalName: string;
  originalRelativePath: string;
  slug: string;
  src: string;
  src640: string;
  src1280: string;
  src2000: string;
  srcSetWebp: string;
  srcSetAvif: string;
  w: number;
  h: number;
  aspectRatio: number;
  orientation: "portrait" | "landscape" | "square";
  blur: string;
  alt: string;
  sidecarText?: string;
  watermarkWarning?: string;
  sourceSize: number;
  sourceMtimeMs: number;
  sha1: string;
}

export interface SyncedBrandAssets {
  originalFile: string;
  logoLightPng: string;
  logoLightWebp: string;
  logoDarkPng: string;
  logoDarkWebp: string;
  logoGoldPng: string;
  logoGoldWebp: string;
  favicon16: string;
  favicon32: string;
  appleTouchIcon: string;
  icon192: string;
  icon512: string;
  ogImage: string;
  w: number;
  h: number;
  sourceSize: number;
  sourceMtimeMs: number;
}

export interface GeneratedImagesManifest {
  generatedAt: string;
  brand: SyncedBrandAssets | null;
  sections: Record<SectionKey, SyncedImage[]>;
  report: {
    detectedFolders: Array<{
      folder: string;
      mappedTo: SectionKey | "unmatched";
      rasterCount: number;
      rawCount: number;
    }>;
    missingExpectedFolders: string[];
    skippedRawFiles: Array<{ path: string; ext: string; reason: string }>;
    duplicateRootFiles: Array<{ file: string; matchesPath: string }>;
    watermarkedWarnings: Array<{ path: string; note: string }>;
    totalSyncedImages: number;
  };
}

export const imagesManifest = manifestJson as GeneratedImagesManifest;

function cleanList(items: SyncedImage[] = []): SyncedImage[] {
  return items.filter((img) => !img.watermarkWarning);
}

export function getHeroImages(): SyncedImage[] {
  const clean = cleanList(imagesManifest.sections.hero);
  // Put rich architectural amber hero frame first for dramatic immediate impact
  const preferredOrder = clean.sort((a, b) => {
    const score = (x: SyncedImage) =>
      x.slug.includes("98-jpg") ? 0 : x.slug.includes("100-jpg") ? 1 : x.slug.includes("34-jpg") ? 2 : 3;
    return score(a) - score(b);
  });
  return preferredOrder;
}

export function getStoryImages(): SyncedImage[] {
  return cleanList(imagesManifest.sections.stories);
}

export function getChapterImages(): SyncedImage[] {
  const cleanChapters = cleanList(imagesManifest.sections.chapters);
  if (cleanChapters.length >= 5) return cleanChapters;
  const fallbackPool = [
    ...cleanList(imagesManifest.sections.rootExtras),
    ...cleanList(imagesManifest.sections.stories),
  ];
  return [...cleanChapters, ...fallbackPool].slice(0, 5);
}

export function getFramesImages(): SyncedImage[] {
  return cleanList(imagesManifest.sections.frames);
}

export function getAboutPortrait(): { image: SyncedImage; isFallback: boolean } {
  const dedicated = cleanList(imagesManifest.sections.aboutPortrait);
  if (dedicated.length > 0) {
    return { image: dedicated[0], isFallback: false };
  }
  const rootClean = cleanList(imagesManifest.sections.rootExtras).filter(
    (img) => !img.slug.includes("28-jpg")
  );
  const preferred =
    rootClean.find((img) => img.slug.includes("46-jpg")) ||
    rootClean.find((img) => img.orientation === "portrait") ||
    cleanList(imagesManifest.sections.stories)[0];
  return { image: preferred, isFallback: true };
}

export function getTestimonialImages(count = 3): SyncedImage[] {
  const dedicated = cleanList(imagesManifest.sections.testimonials);
  if (dedicated.length > 0) return dedicated.slice(0, count);

  const rootClean = cleanList(imagesManifest.sections.rootExtras).filter(
    (img) => !img.slug.includes("28-jpg")
  );
  const pool = [...rootClean, ...cleanList(imagesManifest.sections.stories)];
  return pool.slice(0, count);
}

export function getInstagramStripImages(count = 6): SyncedImage[] {
  const dedicated = cleanList(imagesManifest.sections.instagram);
  if (dedicated.length >= count) return dedicated.slice(0, count);

  const rootClean = cleanList(imagesManifest.sections.rootExtras).filter(
    (img) => !img.slug.includes("28-jpg")
  );
  const pool = [
    ...rootClean,
    ...cleanList(imagesManifest.sections.stories),
    ...cleanList(imagesManifest.sections.frames),
  ];
  // Deduplicate by sha1 so no identical photo shows twice in strip
  const unique: SyncedImage[] = [];
  const seen = new Set<string>();
  for (const img of [...dedicated, ...pool]) {
    if (!seen.has(img.sha1)) {
      seen.add(img.sha1);
      unique.push(img);
    }
    if (unique.length >= count) break;
  }
  return unique;
}

export function getFilmPosterImage(): SyncedImage {
  const film = cleanList(imagesManifest.sections.film);
  if (film.length > 0) return film[0];

  const pool = [
    ...cleanList(imagesManifest.sections.hero),
    ...cleanList(imagesManifest.sections.rootExtras),
  ];
  const landscape = pool.find((i) => i.orientation === "landscape") || pool[0];
  return landscape;
}

export function getFlyThroughImages(): SyncedImage[] {
  const seen = new Set<string>();
  const combined: SyncedImage[] = [];
  for (const img of [
    ...cleanList(imagesManifest.sections.frames),
    ...cleanList(imagesManifest.sections.rootExtras),
    ...cleanList(imagesManifest.sections.stories),
  ]) {
    if (!seen.has(img.sha1)) {
      seen.add(img.sha1);
      combined.push(img);
    }
    if (combined.length >= 9) break;
  }
  return combined;
}
