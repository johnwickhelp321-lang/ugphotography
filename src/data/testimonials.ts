import { getTestimonialImages, SyncedImage } from "@/lib/images";

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  event: string;
  location: string;
  image: string;
  blurDataURL?: string;
  imageAlt: string;
  isTodo: boolean;
}

const imgs: SyncedImage[] = getTestimonialImages(3);

function pickImg(i: number): SyncedImage {
  return imgs[i % imgs.length];
}

/**
 * NOTE: Dedicated `words-from-family/` folder was not present in project root at sync time.
 * Images draw from synced clean root/story photography; quotes remain clearly marked `isTodo`
 * until the client provides verified client review copy.
 */
export const testimonials: TestimonialItem[] = [
  {
    id: "test-1",
    quote:
      imgs[0]?.sidecarText ||
      "TODO: Add verified client review from Islamabad wedding couple in words-from-family/ folder.",
    author: "Wedding Couple · Islamabad",
    event: "Wedding Photography & Cinematography [TODO: Verify client name & quote]",
    location: "Islamabad",
    image: pickImg(0).src1280,
    blurDataURL: pickImg(0).blur,
    imageAlt: pickImg(0).alt,
    isTodo: !imgs[0]?.sidecarText,
  },
  {
    id: "test-2",
    quote:
      imgs[1]?.sidecarText ||
      "TODO: Add verified Bridal Portrait & Makeup client testimonial in words-from-family/ folder.",
    author: "Bridal Client · E-11 Studio",
    event: "Bridal Portraits & Makeup Services [TODO: Verify client name & quote]",
    location: "Islamabad",
    image: pickImg(1).src1280,
    blurDataURL: pickImg(1).blur,
    imageAlt: pickImg(1).alt,
    isTodo: !imgs[1]?.sidecarText,
  },
  {
    id: "test-3",
    quote:
      imgs[2]?.sidecarText ||
      "TODO: Add verified Family / Corporate event review in words-from-family/ folder.",
    author: "Family Celebration · Islamabad",
    event: "Mehndi & Family Event Coverage [TODO: Verify client name & quote]",
    location: "Islamabad",
    image: pickImg(2).src1280,
    blurDataURL: pickImg(2).blur,
    imageAlt: pickImg(2).alt,
    isTodo: !imgs[2]?.sidecarText,
  },
];
