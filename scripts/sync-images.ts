import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp, { OverlayOptions } from "sharp";

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
    detectedFolders: Array<{ folder: string; mappedTo: SectionKey | "unmatched"; rasterCount: number; rawCount: number }>;
    missingExpectedFolders: string[];
    skippedRawFiles: Array<{ path: string; ext: string; reason: string }>;
    duplicateRootFiles: Array<{ file: string; matchesPath: string }>;
    watermarkedWarnings: Array<{ path: string; note: string }>;
    totalSyncedImages: number;
  };
}

const ROOT = process.cwd();
const PUBLIC_SYNCED_DIR = path.join(ROOT, "public", "synced");
const PUBLIC_BRAND_DIR = path.join(ROOT, "public", "brand");
const OUTPUT_MANIFEST = path.join(ROOT, "src", "data", "images.generated.json");

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  "public",
  "src",
  "scripts",
  ".git",
  ".vercel",
  ".vscode",
]);

const RASTER_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff", ".tif", ".gif"]);
const RAW_EXTS = new Set([".cr2", ".nef", ".arw", ".dng", ".raf", ".orf", ".rw2", ".psd", ".ai"]);
const WIDTHS = [640, 1280, 2000] as const;

const KNOWN_WATERMARKED_NAMES = new Set(["s3.jpg.jpeg", "2.jpg (2).jpeg"]);

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const forceRebuild = process.argv.includes("--force");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function toSlug(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "frame"
  );
}

function sha1File(filePath: string): string {
  const hash = crypto.createHash("sha1");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function mapFolderToSection(folderName: string): SectionKey | null {
  const lower = folderName.toLowerCase().trim();
  if (/story[-_ ]?for[-_ ]?family|about|manifesto|profile|owner/.test(lower)) {
    return "aboutPortrait";
  }
  if (/words[-_ ]?from[-_ ]?family|testimonial|review|client|words/.test(lower)) {
    return "testimonials";
  }
  if (/^(hero|cover|landing|banner)/.test(lower) || /hero/.test(lower)) {
    return "hero";
  }
  if (/chapter|five/.test(lower)) {
    return "chapters";
  }
  if (/frame|motion|gallery|strip|selected/.test(lower)) {
    return "frames";
  }
  if (/stor|work|case/.test(lower)) {
    return "stories";
  }
  if (/insta|instagram/.test(lower)) {
    return "instagram";
  }
  if (/film|reel|video/.test(lower)) {
    return "film";
  }
  return null;
}

function buildAltText(section: SectionKey, originalName: string, index: number): string {
  const cleanName = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/\(.*?\)|copy|insta/gi, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sectionLabels: Record<SectionKey, string> = {
    hero: "Signature bridal and couple hero portrait",
    stories: "Wedding story editorial frame",
    chapters: "Five chapters South Asian wedding ritual frame",
    frames: "Selected portrait frame in motion",
    aboutPortrait: "Umer Gill portrait behind the camera",
    testimonials: "Couple portrait for client story",
    instagram: "Umer Gill Photography studio feed photograph",
    film: "Cinematic wedding film still frame",
    rootExtras: "Studio editorial wedding & portrait frame",
  };

  const label = sectionLabels[section];
  const suffix = cleanName ? ` (${cleanName})` : "";
  return `${label} by Umer Gill Photography, Islamabad — #${String(index + 1).padStart(2, "0")}${suffix}`;
}

function findSidecarText(imagePath: string): string | undefined {
  const baseNoExt = imagePath.replace(/\.[^.]+$/, "");
  const candidates = [`${baseNoExt}.txt`, `${imagePath}.txt`];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const content = fs.readFileSync(c, "utf8").trim();
      if (content) return content;
    }
  }
  return undefined;
}

async function recolorAlphaMask(
  trimmedBuffer: Buffer,
  hex: { r: number; g: number; b: number }
): Promise<Buffer> {
  const { data, info } = await sharp(trimmedBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const srcIdx = i * info.channels;
    const dstIdx = i * 4;
    const alpha = info.channels === 4 ? data[srcIdx + 3] : 255;
    out[dstIdx] = hex.r;
    out[dstIdx + 1] = hex.g;
    out[dstIdx + 2] = hex.b;
    out[dstIdx + 3] = alpha;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function processLogoAssets(
  previousBrand: SyncedBrandAssets | null,
  featuredBgPath: string | null
): Promise<SyncedBrandAssets | null> {
  const rootEntries = fs.readdirSync(ROOT, { withFileTypes: true });
  const logoEntry = rootEntries.find(
    (entry) =>
      entry.isFile() &&
      /logo/i.test(entry.name) &&
      RASTER_EXTS.has(path.extname(entry.name).toLowerCase())
  );

  if (!logoEntry) {
    console.log("[sync-images] No root *logo* file found.");
    return null;
  }

  const logoPath = path.join(ROOT, logoEntry.name);
  const stat = fs.statSync(logoPath);
  ensureDir(PUBLIC_BRAND_DIR);

  const expectedOutputs = [
    path.join(PUBLIC_BRAND_DIR, "logo-light.png"),
    path.join(PUBLIC_BRAND_DIR, "logo-light.webp"),
    path.join(PUBLIC_BRAND_DIR, "logo-dark.png"),
    path.join(PUBLIC_BRAND_DIR, "logo-dark.webp"),
    path.join(PUBLIC_BRAND_DIR, "logo-gold.png"),
    path.join(PUBLIC_BRAND_DIR, "logo-gold.webp"),
    path.join(PUBLIC_BRAND_DIR, "favicon-16.png"),
    path.join(PUBLIC_BRAND_DIR, "favicon-32.png"),
    path.join(PUBLIC_BRAND_DIR, "apple-touch-icon.png"),
    path.join(PUBLIC_BRAND_DIR, "icon-192.png"),
    path.join(PUBLIC_BRAND_DIR, "icon-512.png"),
    path.join(PUBLIC_BRAND_DIR, "og-image.jpg"),
  ];

  const cacheHit =
    !forceRebuild &&
    previousBrand &&
    previousBrand.originalFile === logoEntry.name &&
    previousBrand.sourceSize === stat.size &&
    Math.abs(previousBrand.sourceMtimeMs - stat.mtimeMs) < 5 &&
    expectedOutputs.every((f) => fs.existsSync(f));

  if (cacheHit && previousBrand) {
    return previousBrand;
  }

  console.log(`[sync-images] Processing brand logo: ${logoEntry.name}`);

  // Trim outer transparent pixels safely and resize max width 720
  const trimmedBuf = await sharp(logoPath)
    .ensureAlpha()
    .trim()
    .resize({ width: 720, withoutEnlargement: true })
    .png()
    .toBuffer();

  const meta = await sharp(trimmedBuf).metadata();
  const w = meta.width || 600;
  const h = meta.height || 600;

  // 1. Light (crisp pure white/original preserving alpha)
  const whiteBuf = await recolorAlphaMask(trimmedBuf, { r: 247, g: 243, b: 236 });
  await sharp(whiteBuf).png({ quality: 92 }).toFile(path.join(PUBLIC_BRAND_DIR, "logo-light.png"));
  await sharp(whiteBuf).webp({ quality: 90 }).toFile(path.join(PUBLIC_BRAND_DIR, "logo-light.webp"));

  // 2. Dark (#1a1816 ink for warm cream sections)
  const darkBuf = await recolorAlphaMask(trimmedBuf, { r: 26, g: 24, b: 22 });
  await sharp(darkBuf).png({ quality: 92 }).toFile(path.join(PUBLIC_BRAND_DIR, "logo-dark.png"));
  await sharp(darkBuf).webp({ quality: 90 }).toFile(path.join(PUBLIC_BRAND_DIR, "logo-dark.webp"));

  // 3. Brand Gold (#c8a96a)
  const goldBuf = await recolorAlphaMask(trimmedBuf, { r: 200, g: 169, b: 106 });
  await sharp(goldBuf).png({ quality: 92 }).toFile(path.join(PUBLIC_BRAND_DIR, "logo-gold.png"));
  await sharp(goldBuf).webp({ quality: 90 }).toFile(path.join(PUBLIC_BRAND_DIR, "logo-gold.webp"));

  // Helper to build square dark-ink (#121214) icons with gold monogram centered
  const makeSquareIcon = async (size: number, outPath: string, paddingRatio = 0.16) => {
    const inner = Math.max(8, Math.round(size * (1 - paddingRatio * 2)));
    const resizedLogo = await sharp(goldBuf)
      .resize({ width: inner, height: inner, fit: "inside" })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 18, g: 18, b: 20, alpha: 1 },
      },
    })
      .composite([{ input: resizedLogo, gravity: "centre" }])
      .png()
      .toFile(outPath);
  };

  await makeSquareIcon(16, path.join(PUBLIC_BRAND_DIR, "favicon-16.png"), 0.1);
  await makeSquareIcon(32, path.join(PUBLIC_BRAND_DIR, "favicon-32.png"), 0.12);
  await makeSquareIcon(180, path.join(PUBLIC_BRAND_DIR, "apple-touch-icon.png"), 0.18);
  await makeSquareIcon(192, path.join(PUBLIC_BRAND_DIR, "icon-192.png"), 0.18);
  await makeSquareIcon(512, path.join(PUBLIC_BRAND_DIR, "icon-512.png"), 0.18);

  // Also sync Next App Router convention icons in src/app/
  await sharp(path.join(PUBLIC_BRAND_DIR, "icon-512.png")).toFile(
    path.join(ROOT, "src", "app", "icon.png")
  );
  await sharp(path.join(PUBLIC_BRAND_DIR, "apple-touch-icon.png")).toFile(
    path.join(ROOT, "src", "app", "apple-icon.png")
  );

  // 4. OpenGraph 1200x630 editorial card
  const ogWidth = 1200;
  const ogHeight = 630;
  const ogComposites: OverlayOptions[] = [];

  if (featuredBgPath && fs.existsSync(featuredBgPath)) {
    const bgBlurred = await sharp(featuredBgPath)
      .rotate()
      .resize(ogWidth, ogHeight, { fit: "cover", position: "attention" })
      .modulate({ brightness: 0.34, saturation: 0.72 })
      .blur(2)
      .jpeg({ quality: 86 })
      .toBuffer();

    ogComposites.push({ input: bgBlurred, blend: "over" });
  }

  // Dark editorial vignette + thin #c8a96a frame SVG
  const frameSvg = Buffer.from(`
    <svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="48%" r="70%">
          <stop offset="0%" stop-color="#121214" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#0b0b0d" stop-opacity="0.92" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)" />
      <rect x="28" y="28" width="${ogWidth - 56}" height="${ogHeight - 56}" fill="none" stroke="#c8a96a" stroke-opacity="0.45" stroke-width="1.2" />
      <rect x="38" y="38" width="${ogWidth - 76}" height="${ogHeight - 76}" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    </svg>
  `);
  ogComposites.push({ input: frameSvg, blend: "over" });

  const logoForOg = await sharp(goldBuf)
    .resize({ width: 380, height: 380, fit: "inside" })
    .png()
    .toBuffer();
  ogComposites.push({ input: logoForOg, gravity: "centre" });

  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 18, g: 18, b: 20, alpha: 1 },
    },
  })
    .composite(ogComposites)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(PUBLIC_BRAND_DIR, "og-image.jpg"));

  return {
    originalFile: logoEntry.name,
    logoLightPng: "/brand/logo-light.png",
    logoLightWebp: "/brand/logo-light.webp",
    logoDarkPng: "/brand/logo-dark.png",
    logoDarkWebp: "/brand/logo-dark.webp",
    logoGoldPng: "/brand/logo-gold.png",
    logoGoldWebp: "/brand/logo-gold.webp",
    favicon16: "/brand/favicon-16.png",
    favicon32: "/brand/favicon-32.png",
    appleTouchIcon: "/brand/apple-touch-icon.png",
    icon192: "/brand/icon-192.png",
    icon512: "/brand/icon-512.png",
    ogImage: "/brand/og-image.jpg",
    w,
    h,
    sourceSize: stat.size,
    sourceMtimeMs: stat.mtimeMs,
  };
}

async function processSingleImage(
  filePath: string,
  section: SectionKey,
  index: number,
  previousByRelPath: Map<string, SyncedImage>
): Promise<SyncedImage> {
  const originalName = path.basename(filePath);
  const originalRelativePath = path.relative(ROOT, filePath).replace(/\\/g, "/");
  const stat = fs.statSync(filePath);
  const slugBase = toSlug(originalName);
  const uniqueSlug = `${String(index + 1).padStart(2, "0")}-${slugBase}`;
  const outDir = path.join(PUBLIC_SYNCED_DIR, section);
  ensureDir(outDir);

  const webpPaths = WIDTHS.map((w) => path.join(outDir, `${uniqueSlug}-${w}.webp`));
  const avifPaths = WIDTHS.map((w) => path.join(outDir, `${uniqueSlug}-${w}.avif`));
  const prev = previousByRelPath.get(originalRelativePath);

  const outputsExist = [...webpPaths, ...avifPaths].every((p) => fs.existsSync(p));
  const hasWatermark = KNOWN_WATERMARKED_NAMES.has(originalName.toLowerCase());
  const watermarkWarning = hasWatermark
    ? "Third-party watermark ('Junaid Photography 03485897050') detected in source file — excluded from live phone/brand display."
    : undefined;

  if (hasWatermark) {
    // Ensure third-party watermarked images are never stored in public/synced/ or committed to git
    for (const p of [...webpPaths, ...avifPaths]) {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    return {
      id: `${section}-${uniqueSlug}`,
      section,
      originalName,
      originalRelativePath,
      slug: uniqueSlug,
      src: "",
      src640: "",
      src1280: "",
      src2000: "",
      srcSetWebp: "",
      srcSetAvif: "",
      w: prev?.w || 1600,
      h: prev?.h || 1067,
      aspectRatio: prev?.aspectRatio || 1.5,
      orientation: prev?.orientation || "landscape",
      blur: "",
      alt: buildAltText(section, originalName, index),
      watermarkWarning,
      sourceSize: stat.size,
      sourceMtimeMs: stat.mtimeMs,
      sha1: prev?.sha1 || sha1File(filePath),
    };
  }

  if (
    !forceRebuild &&
    prev &&
    prev.slug === uniqueSlug &&
    prev.sourceSize === stat.size &&
    Math.abs(prev.sourceMtimeMs - stat.mtimeMs) < 5 &&
    outputsExist
  ) {
    return {
      ...prev,
      sidecarText: findSidecarText(filePath),
      watermarkWarning,
    };
  }

  console.log(`[sync-images] Optimizing [${section}] ${originalName}`);
  const rotatedPipeline = sharp(filePath).rotate();
  const meta = await rotatedPipeline.metadata();
  const origW = meta.width || 1600;
  const origH = meta.height || 1200;

  // Decode rotated baseline buffer once per image so multi-width outputs encode much faster
  const normalizedJpeg = await sharp(filePath)
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .jpeg({ quality: 92 })
    .toBuffer();

  for (const w of WIDTHS) {
    const webpOut = path.join(outDir, `${uniqueSlug}-${w}.webp`);
    const avifOut = path.join(outDir, `${uniqueSlug}-${w}.avif`);

    const resized = sharp(normalizedJpeg).resize({
      width: w,
      withoutEnlargement: true,
    });

    await Promise.all([
      resized.clone().webp({ quality: 82 }).toFile(webpOut),
      resized.clone().avif({ quality: 58, effort: 2 }).toFile(avifOut),
    ]);
  }

  const blurBuf = await sharp(normalizedJpeg)
    .resize({ width: 24, height: 24, fit: "inside" })
    .webp({ quality: 45 })
    .toBuffer();
  const blur = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  const orientation: "portrait" | "landscape" | "square" =
    origW > origH * 1.05 ? "landscape" : origH > origW * 1.05 ? "portrait" : "square";

  const src640 = `/synced/${section}/${uniqueSlug}-640.webp`;
  const src1280 = `/synced/${section}/${uniqueSlug}-1280.webp`;
  const src2000 = `/synced/${section}/${uniqueSlug}-2000.webp`;

  return {
    id: `${section}-${uniqueSlug}`,
    section,
    originalName,
    originalRelativePath,
    slug: uniqueSlug,
    src: src2000,
    src640,
    src1280,
    src2000,
    srcSetWebp: `${src640} 640w, ${src1280} 1280w, ${src2000} 2000w`,
    srcSetAvif: `/synced/${section}/${uniqueSlug}-640.avif 640w, /synced/${section}/${uniqueSlug}-1280.avif 1280w, /synced/${section}/${uniqueSlug}-2000.avif 2000w`,
    w: origW,
    h: origH,
    aspectRatio: Number((origW / origH).toFixed(3)),
    orientation,
    blur,
    alt: buildAltText(section, originalName, index),
    sidecarText: findSidecarText(filePath),
    watermarkWarning,
    sourceSize: stat.size,
    sourceMtimeMs: stat.mtimeMs,
    sha1: prev?.sha1 || sha1File(filePath),
  };
}

async function runSync() {
  ensureDir(PUBLIC_SYNCED_DIR);
  ensureDir(path.dirname(OUTPUT_MANIFEST));

  let previousManifest: GeneratedImagesManifest | null = null;
  if (fs.existsSync(OUTPUT_MANIFEST)) {
    try {
      previousManifest = JSON.parse(fs.readFileSync(OUTPUT_MANIFEST, "utf8")) as GeneratedImagesManifest;
    } catch {
      previousManifest = null;
    }
  }

  const previousByRelPath = new Map<string, SyncedImage>();
  if (previousManifest?.sections) {
    for (const items of Object.values(previousManifest.sections)) {
      for (const item of items) {
        previousByRelPath.set(item.originalRelativePath, item);
      }
    }
  }

  const sections: Record<SectionKey, SyncedImage[]> = {
    hero: [],
    stories: [],
    chapters: [],
    frames: [],
    aboutPortrait: [],
    testimonials: [],
    instagram: [],
    film: [],
    rootExtras: [],
  };

  const detectedFolders: GeneratedImagesManifest["report"]["detectedFolders"] = [];
  const skippedRawFiles: GeneratedImagesManifest["report"]["skippedRawFiles"] = [];
  const duplicateRootFiles: GeneratedImagesManifest["report"]["duplicateRootFiles"] = [];
  const watermarkedWarnings: GeneratedImagesManifest["report"]["watermarkedWarnings"] = [];

  const rootEntries = fs.readdirSync(ROOT, { withFileTypes: true });
  const seenHashes = new Map<string, string>(); // sha1 -> relative path

  // 1. Process mapped subfolders first
  for (const entry of rootEntries) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name) || entry.name.startsWith(".")) {
      continue;
    }

    const mappedSection = mapFolderToSection(entry.name);
    const dirPath = path.join(ROOT, entry.name);
    const files = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .sort((a, b) => collator.compare(a, b));

    const rasterFiles: string[] = [];
    let rawCount = 0;

    for (const fileName of files) {
      const fullPath = path.join(dirPath, fileName);
      const ext = path.extname(fileName).toLowerCase();
      if (RAW_EXTS.has(ext)) {
        rawCount++;
        skippedRawFiles.push({
          path: `${entry.name}/${fileName}`,
          ext,
          reason: `Camera RAW (${ext.toUpperCase()}) requires JPEG/PNG export before Sharp web optimization`,
        });
      } else if (RASTER_EXTS.has(ext) && !/logo/i.test(fileName)) {
        rasterFiles.push(fullPath);
      }
    }

    detectedFolders.push({
      folder: entry.name,
      mappedTo: mappedSection || "unmatched",
      rasterCount: rasterFiles.length,
      rawCount,
    });

    if (!mappedSection) continue;

    for (let i = 0; i < rasterFiles.length; i++) {
      const synced = await processSingleImage(rasterFiles[i], mappedSection, i, previousByRelPath);
      sections[mappedSection].push(synced);
      if (!seenHashes.has(synced.sha1)) {
        seenHashes.set(synced.sha1, synced.originalRelativePath);
      }
      if (synced.watermarkWarning) {
        watermarkedWarnings.push({
          path: synced.originalRelativePath,
          note: synced.watermarkWarning,
        });
      }
    }
  }

  // 2. Process loose raster files in root (skipping logos & exact SHA-1 duplicates of folders)
  const looseFiles = rootEntries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .sort((a, b) => collator.compare(a, b));

  const uniqueLooseFiles: string[] = [];
  for (const fileName of looseFiles) {
    if (/logo/i.test(fileName)) continue;
    const ext = path.extname(fileName).toLowerCase();
    const fullPath = path.join(ROOT, fileName);

    if (RAW_EXTS.has(ext)) {
      skippedRawFiles.push({
        path: fileName,
        ext,
        reason: `Camera RAW (${ext.toUpperCase()}) in project root cannot be decoded directly by Sharp`,
      });
      continue;
    }

    if (!RASTER_EXTS.has(ext)) continue;

    const hash = previousByRelPath.get(fileName)?.sha1 || sha1File(fullPath);
    const existing = seenHashes.get(hash);
    if (existing) {
      duplicateRootFiles.push({ file: fileName, matchesPath: existing });
      continue;
    }

    seenHashes.set(hash, fileName);
    uniqueLooseFiles.push(fullPath);
  }

  for (let i = 0; i < uniqueLooseFiles.length; i++) {
    const synced = await processSingleImage(uniqueLooseFiles[i], "rootExtras", i, previousByRelPath);
    sections.rootExtras.push(synced);
  }

  // Preserve existing pre-synced manifest cleanly on CI / Vercel builds when raw shoot folders are gitignored
  const hasSourceAssets =
    detectedFolders.some((d) => d.rasterCount > 0) || uniqueLooseFiles.length > 0;
  if (!forceRebuild && !hasSourceAssets && previousManifest && previousManifest.report.totalSyncedImages > 0) {
    console.log(
      `\n[sync-images] No raw source folders present; preserving committed manifest (${previousManifest.report.totalSyncedImages} frames) and /public/synced assets.\n`
    );
    return;
  }

  // 3. Process brand logo & derive OG background from cleanest dramatic hero image
  const cleanHeroFile =
    sections.hero.find((img) => !img.watermarkWarning && img.slug.includes("98-jpg")) ||
    sections.hero.find((img) => !img.watermarkWarning);
  const ogBgSource = cleanHeroFile
    ? path.join(ROOT, cleanHeroFile.originalRelativePath)
    : null;
  const brand = await processLogoAssets(previousManifest?.brand || null, ogBgSource);

  // 4. Identify missing expected folders
  const missingExpectedFolders: string[] = [];
  if (sections.aboutPortrait.length === 0) missingExpectedFolders.push("story-for-family");
  if (sections.testimonials.length === 0) missingExpectedFolders.push("words-from-family");
  if (sections.instagram.length === 0) missingExpectedFolders.push("instagram (using synced folder/root photography fallback)");

  const totalSyncedImages = Object.values(sections).reduce((acc, arr) => acc + arr.length, 0);

  const manifest: GeneratedImagesManifest = {
    generatedAt: new Date().toISOString(),
    brand,
    sections,
    report: {
      detectedFolders,
      missingExpectedFolders,
      skippedRawFiles,
      duplicateRootFiles,
      watermarkedWarnings,
      totalSyncedImages,
    },
  };

  fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2), "utf8");

  // Print clean MAPPING REPORT
  console.log("\n================= IMAGE SYNC MAPPING REPORT =================");
  console.log(`Logo assets: ${brand ? `Generated in /public/brand from "${brand.originalFile}"` : "NOT FOUND"}`);
  console.log("\nDetected Folders:");
  for (const df of detectedFolders) {
    console.log(`  - "${df.folder}" -> section [${df.mappedTo}] (${df.rasterCount} images, ${df.rawCount} RAW skipped)`);
  }
  console.log(`\nUnique loose root photos synced -> [rootExtras]: ${sections.rootExtras.length}`);
  if (duplicateRootFiles.length > 0) {
    console.log(`Skipped duplicate root copies: ${duplicateRootFiles.length}`);
  }
  if (skippedRawFiles.length > 0) {
    console.log("\nSkipped non-raster RAW files:");
    skippedRawFiles.forEach((r) => console.log(`  - ${r.path} (${r.ext})`));
  }
  if (watermarkedWarnings.length > 0) {
    console.log("\n[WARNING] Third-party watermarked files detected (hidden from live UI):");
    watermarkedWarnings.forEach((w) => console.log(`  - ${w.path}: ${w.note}`));
  }
  if (missingExpectedFolders.length > 0) {
    console.log("\nMissing expected section folders:");
    missingExpectedFolders.forEach((m) => console.log(`  - ${m}`));
  }
  console.log(`\nTotal unique optimized gallery frames: ${totalSyncedImages}`);
  console.log(`Manifest written -> src/data/images.generated.json`);
  console.log("==============================================================\n");
}

runSync().catch((err) => {
  console.error("[sync-images] Fatal error:", err);
  process.exit(1);
});
