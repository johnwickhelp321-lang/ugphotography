import fs from "fs";
import path from "path";
import sharp from "sharp";

interface InstagramRawPost {
  id: string;
  url: string;
  displayUrl?: string;
  mediaUrl?: string;
  caption?: string;
  likesCount?: number;
  timestamp?: string;
}

const INSTAGRAM_HANDLE = process.env.INSTAGRAM_HANDLE || "umergillphotography1";
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const OUTPUT_DIR = path.join(process.cwd(), "public", "instagram");
const METADATA_FILE = path.join(process.cwd(), "src", "data", "instagram.json");

function categorizeCaption(caption: string = ""): string {
  const lower = caption.toLowerCase();
  if (lower.includes("mehndi") || lower.includes("dholak") || lower.includes("mayun")) return "mehndi";
  if (lower.includes("nikkah") || lower.includes("qubool")) return "nikkah";
  if (lower.includes("baraat") || lower.includes("rukhsati")) return "baraat";
  if (lower.includes("walima") || lower.includes("reception")) return "walima";
  return "portrait";
}

async function fetchFromApify(handle: string, token: string): Promise<InstagramRawPost[]> {
  console.log(`[Apify] Triggering Instagram Scraper for @${handle}...`);
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [handle],
        resultsLimit: 36,
        resultsType: "posts",
      }),
    }
  );

  if (!runResponse.ok) {
    throw new Error(`Apify run creation failed: HTTP ${runResponse.status}`);
  }

  const runData = (await runResponse.json()) as { data: { defaultDatasetId: string; status: string; id: string } };
  const datasetId = runData.data.defaultDatasetId;
  console.log(`[Apify] Run started (ID: ${runData.data.id}). Fetching dataset items...`);

  // Wait 15 seconds for actor to populate items
  await new Promise((r) => setTimeout(r, 15000));

  const datasetResponse = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`
  );

  if (!datasetResponse.ok) {
    throw new Error(`Apify dataset fetch failed: HTTP ${datasetResponse.status}`);
  }

  const items = (await datasetResponse.json()) as Array<{
    id?: string;
    url?: string;
    displayUrl?: string;
    caption?: string;
    likesCount?: number;
    timestamp?: string;
  }>;

  return items.map((item, idx) => ({
    id: item.id || `apify-${idx + 1}`,
    url: item.url || `https://www.instagram.com/${handle}`,
    displayUrl: item.displayUrl,
    caption: item.caption || "",
    likesCount: item.likesCount || 0,
    timestamp: item.timestamp || new Date().toISOString(),
  }));
}

async function fetchFromMetaGraph(accessToken: string): Promise<InstagramRawPost[]> {
  console.log(`[Meta Graph] Fetching Instagram Media with Access Token...`);
  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count&access_token=${accessToken}`
  );
  if (!res.ok) {
    throw new Error(`Meta Graph API error: HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    data: Array<{
      id: string;
      caption?: string;
      media_url?: string;
      permalink?: string;
      timestamp?: string;
      like_count?: number;
    }>;
  };

  return data.data.map((item) => ({
    id: item.id,
    url: item.permalink || `https://www.instagram.com/p/${item.id}`,
    displayUrl: item.media_url,
    caption: item.caption || "",
    likesCount: item.like_count || 0,
    timestamp: item.timestamp || new Date().toISOString(),
  }));
}

async function downloadAndOptimize(imageUrl: string, filename: string): Promise<string> {
  const buffer = await (await fetch(imageUrl)).arrayBuffer();
  const targetPath = path.join(OUTPUT_DIR, filename);

  await sharp(Buffer.from(buffer))
    .resize(2000, 2000, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toFile(targetPath);

  return `/instagram/${filename}`;
}

async function main() {
  console.log("==================================================");
  console.log("   UMER GILL PHOTOGRAPHY - INSTAGRAM IMPORT PIPELINE");
  console.log("==================================================");
  console.log(`Target handle: @${INSTAGRAM_HANDLE}`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let rawPosts: InstagramRawPost[] = [];

  if (APIFY_TOKEN) {
    try {
      rawPosts = await fetchFromApify(INSTAGRAM_HANDLE, APIFY_TOKEN);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Error] Apify fetch failed: ${errorMsg}`);
    }
  } else if (INSTAGRAM_ACCESS_TOKEN) {
    try {
      rawPosts = await fetchFromMetaGraph(INSTAGRAM_ACCESS_TOKEN);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Error] Meta Graph fetch failed: ${errorMsg}`);
    }
  } else {
    console.log(
      `\n[Notice] No APIFY_TOKEN or INSTAGRAM_ACCESS_TOKEN found in environment variables.`
    );
    console.log(
      `To sync live data from Instagram:\n  1. Add APIFY_TOKEN=<your_token> to .env.local\n  2. Or add INSTAGRAM_ACCESS_TOKEN=<token>\n  3. Run: npm run import:instagram\n`
    );
    console.log(`Currently using curated seed assets in public/instagram/ and src/data/instagram.json.`);
    return;
  }

  if (rawPosts.length === 0) {
    console.log("No posts retrieved. Preserving existing instagram.json");
    return;
  }

  console.log(`Processing and optimizing ${rawPosts.length} posts...`);
  const finalPosts = [];

  for (let i = 0; i < rawPosts.length; i++) {
    const post = rawPosts[i];
    const imgUrl = post.displayUrl || post.mediaUrl;
    if (!imgUrl) continue;

    const filename = `post-${i + 1}-${post.id.slice(-6)}.webp`;
    try {
      const localPath = await downloadAndOptimize(imgUrl, filename);
      finalPosts.push({
        id: post.id,
        url: post.url,
        image: localPath,
        caption: post.caption || "",
        likes: post.likesCount || 0,
        date: post.timestamp || new Date().toISOString(),
        category: categorizeCaption(post.caption),
      });
      console.log(`[Optimized] ${filename}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[Skip] Could not process image ${post.id}: ${errorMsg}`);
    }
  }

  const payload = {
    lastSyncedAt: new Date().toISOString(),
    handle: INSTAGRAM_HANDLE,
    totalPosts: finalPosts.length,
    posts: finalPosts,
  };

  fs.writeFileSync(METADATA_FILE, JSON.stringify(payload, null, 2));
  console.log(`Successfully saved ${finalPosts.length} posts to ${METADATA_FILE}`);
}

main().catch(console.error);

