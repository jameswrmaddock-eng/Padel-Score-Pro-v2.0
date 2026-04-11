// data/gearData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Product catalogue for the Recommended Gear section.
// To add a product: duplicate an entry, update the fields, and add the PNG
// to /public/rackets/. The image path is relative to /public.
//
// Affiliate tag: jmadd1791-21
// ─────────────────────────────────────────────────────────────────────────────

export type SkillLevel = 'Beginner' | 'Intermediate' | 'All-round' | 'Advanced' | 'Pro';
export type RacketShape = 'Diamond' | 'Tear-drop' | 'Round';

export interface GearProduct {
  id: string;
  rank: number;
  featured?: boolean;

  // Product identity
  brand: string;
  name: string;
  category: string;
  price: string;           // display string e.g. "£249"
  skillLevel: SkillLevel;

  // Description
  spec: string;            // one-sentence editorial description
  attrs: string[];         // 3–4 short attribute chips

  // Image
  imagePath: string;       // e.g. "/rackets/bullpadel-hack-03.png"
  imageAlt: string;

  // Affiliate link
  amazonAsin: string;      // ASIN — URL is built by getAmazonUrl()
  amazonSearchQuery: string; // fallback search if ASIN link fails
}

const AFFILIATE_TAG = 'jmadd1791-21';

export function getAmazonUrl(product: GearProduct): string {
  return `https://www.amazon.co.uk/dp/${product.amazonAsin}?tag=${AFFILIATE_TAG}`;
}

export function getAmazonSearchUrl(product: GearProduct): string {
  return `https://www.amazon.co.uk/s?k=${encodeURIComponent(product.amazonSearchQuery)}&tag=${AFFILIATE_TAG}`;
}

export const GEAR_PRODUCTS: GearProduct[] = [
  {
    id:          'bullpadel-hack-03',
    rank:        1,
    featured:    true,
    brand:       'Bullpadel',
    name:        'Hack 03',
    category:    'Padel Racket',
    price:       '£249',
    skillLevel:  'Advanced',
    spec:        'Diamond shape used on the WPT tour. Maximum power from the back of the court with excellent control at the net.',
    attrs:       ['Diamond', 'Carbon fibre', 'WPT Tour', 'Hard EVA'],
    imagePath:   '/rackets/bullpadel-hack-03.png',
    imageAlt:    'Bullpadel Hack 03 padel racket — black diamond shape with volt green detailing',
    amazonAsin:  'B0CKQT7RZX',
    amazonSearchQuery: 'bullpadel hack 03 padel racket',
  },
  {
    id:          'head-delta-pro',
    rank:        2,
    featured:    false,
    brand:       'Head',
    name:        'Delta Pro',
    category:    'Padel Racket',
    price:       '£179',
    skillLevel:  'All-round',
    spec:        'Round profile for consistent playmakers. Preferred by players who prioritise touch and all-court coverage over raw power.',
    attrs:       ['Round', 'Graphene 360', 'Control', 'Medium EVA'],
    imagePath:   '/rackets/head-delta-pro.png',
    imageAlt:    'Head Delta Pro padel racket — round profile with white and black finish',
    amazonAsin:  'B0B5YWLQKZ',
    amazonSearchQuery: 'head delta pro padel racket',
  },
  {
    id:          'adidas-metalbone',
    rank:        3,
    featured:    false,
    brand:       'Adidas',
    name:        'Metalbone',
    category:    'Padel Racket',
    price:       '£129',
    skillLevel:  'Beginner',
    spec:        'Tear-drop shape bridging power and comfort. The ideal first serious racket for players moving up from recreational play.',
    attrs:       ['Tear-drop', 'Fibreglass', 'Comfort', 'Soft EVA'],
    imagePath:   '/rackets/adidas-metalbone.png',
    imageAlt:    'Adidas Metalbone padel racket — tear-drop shape with dark frame',
    amazonAsin:  'B0C5VGKZ98',
    amazonSearchQuery: 'adidas metalbone padel racket',
  },
];
