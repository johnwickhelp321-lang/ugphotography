import fs from 'fs';
import path from 'path';

const assets = [
  // Hero images
  {
    dir: 'public/images/hero',
    name: 'hero-1.webp',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85'
  },
  {
    dir: 'public/images/hero',
    name: 'hero-2.webp',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=85'
  },
  {
    dir: 'public/images/hero',
    name: 'hero-3.webp',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1800&q=85'
  },
  {
    dir: 'public/images/hero',
    name: 'hero-4.webp',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85'
  },

  // Manifesto: Photographer with telephoto lens
  {
    dir: 'public/images/manifesto',
    name: 'umer-gill-portrait.webp',
    url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1200&q=85'
  },

  // Stories
  {
    dir: 'public/images/stories',
    name: 'story-1.webp',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85'
  },
  {
    dir: 'public/images/stories',
    name: 'story-2.webp',
    url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1400&q=85'
  },
  {
    dir: 'public/images/stories',
    name: 'story-3.webp',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85'
  },
  {
    dir: 'public/images/stories',
    name: 'story-4.webp',
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1400&q=85'
  },
  {
    dir: 'public/images/stories',
    name: 'story-5.webp',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85'
  },
  {
    dir: 'public/images/stories',
    name: 'story-6.webp',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85'
  },

  // Chapters
  {
    dir: 'public/images/chapters',
    name: 'chapter-1.webp', // Mehndi
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=85'
  },
  {
    dir: 'public/images/chapters',
    name: 'chapter-2.webp', // Nikkah
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85'
  },
  {
    dir: 'public/images/chapters',
    name: 'chapter-3.webp', // Baraat
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85'
  },
  {
    dir: 'public/images/chapters',
    name: 'chapter-4.webp', // Walima
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85'
  },
  {
    dir: 'public/images/chapters',
    name: 'chapter-5.webp', // Portraits
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=85'
  },

  // Gallery
  {
    dir: 'public/images/gallery',
    name: 'gallery-1.webp',
    url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=85'
  },
  {
    dir: 'public/images/gallery',
    name: 'gallery-2.webp',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85'
  },
  {
    dir: 'public/images/gallery',
    name: 'gallery-3.webp',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85'
  },
  {
    dir: 'public/images/gallery',
    name: 'gallery-4.webp',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=85'
  },
  {
    dir: 'public/images/gallery',
    name: 'gallery-5.webp',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85'
  },
  {
    dir: 'public/images/gallery',
    name: 'gallery-6.webp',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85'
  },

  // Film Poster
  {
    dir: 'public/images/film',
    name: 'film-poster.webp',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85'
  },

  // Testimonials
  {
    dir: 'public/images/testimonials',
    name: 'testimonial-1.webp',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85'
  },
  {
    dir: 'public/images/testimonials',
    name: 'testimonial-2.webp',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85'
  },
  {
    dir: 'public/images/testimonials',
    name: 'testimonial-3.webp',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85'
  },

  // Instagram Strip
  {
    dir: 'public/instagram',
    name: 'post-1.webp',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85'
  },
  {
    dir: 'public/instagram',
    name: 'post-2.webp',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=85'
  },
  {
    dir: 'public/instagram',
    name: 'post-3.webp',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85'
  },
  {
    dir: 'public/instagram',
    name: 'post-4.webp',
    url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=85'
  },
  {
    dir: 'public/instagram',
    name: 'post-5.webp',
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=85'
  },
  {
    dir: 'public/instagram',
    name: 'post-6.webp',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85'
  }
];

async function downloadAll() {
  console.log('Downloading high-res curated editorial photography...');
  for (const item of assets) {
    fs.mkdirSync(item.dir, { recursive: true });
    const targetPath = path.join(item.dir, item.name);
    if (!fs.existsSync(targetPath)) {
      try {
        const res = await fetch(item.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(targetPath, Buffer.from(buffer));
        console.log(`Saved: ${targetPath}`);
      } catch (err) {
        console.error(`Failed ${item.name}: ${err.message}`);
      }
    } else {
      console.log(`Already exists: ${targetPath}`);
    }
  }
  console.log('Finished downloading seed assets.');
}

downloadAll();

