# Umer Gill Photography — Islamabad

> **Capturing Your Special Events**  
> Next.js 16 (App Router) · TypeScript · Tailwind CSS · GSAP ScrollTrigger · Lenis · React Three Fiber + Three.js

A luxury, scroll-driven photography and cinematography portfolio built for **Umer Gill Photography** in Islamabad, Pakistan (`@umergillphotography1`).

---

## Verified Studio & Contact Details

- **Studio**: Umer Gill Photography (`Umer Gill`, CEO & Founder)
- **Primary WhatsApp / Call**: `0313 5266515` (`https://wa.me/923135266515`)
- **Second Call Line**: `0312 5266515` (`tel:+923125266515`)
- **Location**: Office 402, Fourth Floor, Darwaish Tower, E-11/2 Markaz, Islamabad
- **Landmark**: Pervaiz Market, near 15 Stop, Islamabad
- **Instagram**: [@umergillphotography1](https://www.instagram.com/umergillphotography1/)
- **Services**: Wedding Photography and Cinematography; Engagement and Mehndi Shoots; Birthday and Anniversary Events; Bridal and Couple Portraits; Family and Kids Photography; Corporate Events; Outdoor and Studio Photoshoots; Professional Bridal and Party Makeup Services

---

## Local Development & Automated Media Sync

Every `npm run dev` and `npm run build` automatically executes **`scripts/sync-images.ts`** (`predev` & `prebuild`):

1. **Brand Logo Pipeline (`Umer Gill Logo.png` → `public/brand/`)**:
   - Generates transparent dark-surface (`logo-light.*`), cream-surface (`logo-dark.*`), and brand-gold (`logo-gold.*`) WebP/PNG files, favicons (`16px`, `32px`), `apple-touch-icon.png` (`180px`), `icon-512.png`, and `og-image.jpg` (`1200x630`).
2. **Section Folder Detection (`public/synced/<section>/` + `src/data/images.generated.json`)**:
   - Auto-detects `hero section/`, `stories/`, `Five chapters/`, `Selected Frames in Motion/`, `story-for-family/`, `words-from-family/`, `instagram/`, and loose root JPEGs/PNGs.
   - Outputs 640px / 1280px / 2000px `.webp` & `.avif` responsive sets, base64 blur placeholders, and aspect dimensions using `sharp`.
   - Safely skips camera RAW files (`.CR2`, `.NEF`, `.ARW`, `.DNG`) and logs warnings for missing folders or watermarked files.

```bash
# Install dependencies
npm install

# Sync/rebuild all logo assets & root photo folders (--force ignores cache)
npm run sync:images
npx tsx scripts/sync-images.ts --force

# Run local development server (syncs images first, then serves on http://localhost:3000)
npm run dev

# Build and start production server locally
npm run build
npm run start
```

---

## Adding New Photos or Client Testimonials

- **Add photos**: Drop JPEG/PNG/WebP images into `hero section/`, `stories/`, `Five chapters/`, `Selected Frames in Motion/`, `story-for-family/` (portrait of Umer Gill), or `words-from-family/` and run `npm run sync:images` (or restart `npm run dev`).
- **Convert `.CR2` RAW files**: Export `WHD29061.CR2` and `WHD29063.CR2` to JPEG in Lightroom/Photoshop before adding to web folders.
- **Add real client reviews**: Place `1.jpg` + matching `1.txt` quote inside `words-from-family/`.

---

## Pre-Launch `TODO` Checklist

- [ ] Replace placeholder client testimonials in `words-from-family/` (`src/data/testimonials.ts` & `src/data/stories.ts`)
- [ ] Add Umer Gill photographer portrait (`holding white telephoto lens`) inside `story-for-family/`
- [ ] Replace `hero section/s3.jpg.jpeg` & `Five chapters/s3.jpg.jpeg` (currently excluded from live UI due to visible third-party studio watermark)
- [ ] Confirm verified counts (`260+` weddings stat in `src/data/site.ts`), official email, packages/pricing, and 4K showreel URL for `FilmSection`

---

## Deploying to Vercel & Supabase Backend Setup

1. Run the hardened SQL schema in [`supabase/schema.sql`](./supabase/schema.sql) inside **Supabase Dashboard -> SQL Editor**. It enforces Row Level Security (RLS) so public forms can `INSERT` new enquiries only—never read, update, or delete customer records.
2. Push repository to GitHub (`.env.local` and raw DSLR shoot folders are gitignored automatically; `public/synced` and `public/brand` serve pre-optimized assets cleanly on CI/Vercel).
3. Import repository in Vercel (framework preset: **Next.js**) and configure Environment Variables (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, optional `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `CRON_SECRET`).
