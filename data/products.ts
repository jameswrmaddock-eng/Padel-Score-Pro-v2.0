export type ProductCategory = 'racket' | 'ball' | 'shoe' | 'bag' | 'accessory';

export interface ProKitProduct {
  id: number;
  category: ProductCategory;
  name: string;
  sub: string;
  attrs: string[];
  price: string;
  asin: string;
  featured?: boolean;
  rank: number;
}

const AFFILIATE_TAG = 'jmadd1791-21';

export function getAmazonUrl(asin: string): string {
  return `https://www.amazon.co.uk/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

export const PRODUCTS: ProKitProduct[] = [
  {
    id: 1,
    category: 'racket',
    name: 'Bullpadel Hack 03',
    sub: 'Aggressive diamond shape. Used on the WPT tour by top-ranked players. Maximum power with excellent control from the back of the court.',
    attrs: ['Diamond shape', 'Carbon fibre', 'WPT Tour'],
    price: '£249',
    asin: 'B0CKQT7RZX',
    featured: true,
    rank: 1,
  },
  {
    id: 2,
    category: 'racket',
    name: 'Head Delta Pro',
    sub: 'Round profile for consistent playmakers. Preferred by players who prioritise touch and all-court coverage over raw power.',
    attrs: ['Round shape', 'Graphene 360', 'Control'],
    price: '£179',
    asin: 'B0B5YWLQKZ',
    rank: 2,
  },
  {
    id: 3,
    category: 'ball',
    name: 'Dunlop Pro Tour',
    sub: 'Official WPT match ball. Consistent bounce across all court surfaces — indoor and outdoor.',
    attrs: ['WPT Official', '3-ball tube', 'All surfaces'],
    price: '£8',
    asin: 'B09PLHQ7C4',
    rank: 1,
  },
  {
    id: 4,
    category: 'shoe',
    name: 'Adidas Adizero Ubersonic',
    sub: 'Lightweight lateral stability for the fast stop-start movement padel demands. Herringbone grip outsole built for clay.',
    attrs: ['Clay / hard', 'Herringbone', 'Lightweight'],
    price: '£119',
    asin: 'B0C5VGKZ98',
    rank: 1,
  },
  {
    id: 5,
    category: 'bag',
    name: 'Bullpadel BPM Tour',
    sub: 'Holds 2 rackets with padded individual pockets. Thermal compartment keeps balls pressurised between sessions.',
    attrs: ['2-racket capacity', 'Thermal pocket', 'Padded straps'],
    price: '£65',
    asin: 'B09XF7DQYT',
    rank: 1,
  },
  {
    id: 6,
    category: 'accessory',
    name: 'Wilson Pro Overgrip',
    sub: 'Tacky finish for sweat absorption during long rallies. Tour professionals replace every session. Pack of 30.',
    attrs: ['Tacky finish', 'Pack of 30', 'Pro choice'],
    price: '£14',
    asin: 'B003IRLJ58',
    rank: 1,
  },
];

export const CATEGORIES: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'racket',    label: 'Rackets' },
  { key: 'ball',      label: 'Balls' },
  { key: 'shoe',      label: 'Shoes' },
  { key: 'bag',       label: 'Bags' },
  { key: 'accessory', label: 'Accessories' },
];
