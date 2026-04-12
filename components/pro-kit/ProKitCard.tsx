import { ProKitProduct, getAmazonUrl } from '@/data/products';
import ProductIcon from './ProductIcon';

interface ProKitCardProps {
  product: ProKitProduct;
  index?: number;
}

function ArrowUpRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="flex-shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProKitCard({ product, index = 0 }: ProKitCardProps) {
  const { featured, name, sub, attrs, price, asin, category, rank } = product;
  const rankStr = rank < 10 ? `0${rank}` : `${rank}`;

  return (
    <article
      className={[
        'group relative flex flex-col rounded-[20px] border overflow-hidden',
        'backdrop-blur-xl transition-all duration-250 ease-out',
        'hover:-translate-y-[3px]',
        featured
          ? 'border-volt/[0.18] bg-volt/[0.03] hover:border-volt/[0.28] hover:bg-volt/[0.05]'
          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]',
      ].join(' ')}
      style={{ animationDelay: `${index * 0.06}s` }}
      aria-label={`${name} — ${category}`}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-4 right-4 h-px pointer-events-none"
        style={{
          background: featured
            ? 'linear-gradient(90deg, transparent, rgba(204,255,0,0.12), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
        }}
      />

      {/* Visual area */}
      <div
        className={[
          'relative h-40 flex items-center justify-center',
          'border-b border-white/[0.05]',
          featured ? 'bg-volt/[0.03]' : 'bg-transparent',
        ].join(' ')}
      >
        {/* Product icon */}
        <div className="w-20 h-20">
          <ProductIcon category={category} />
        </div>

        {/* Editor's pick badge */}
        {featured && (
          <span className="absolute top-3 left-3.5 font-display text-[9px] font-bold tracking-[0.12em] uppercase text-[#050505] bg-volt px-2 py-[3px] rounded-full">
            Editor&apos;s pick
          </span>
        )}

        {/* Large rank watermark */}
        <span
          className="absolute bottom-2 right-3.5 font-display text-[52px] font-extrabold leading-none tracking-tighter select-none pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.04)' }}
          aria-hidden
        >
          {rankStr}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-[18px] pt-4">
        {/* Category tag */}
        <p className="font-display text-[9px] font-bold tracking-[0.14em] uppercase text-white/25 mb-1.5">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>

        {/* Product name */}
        <h3 className="font-display text-[17px] font-extrabold tracking-tight leading-[1.15] text-white mb-1.5">
          {name}
        </h3>

        {/* Description */}
        <p className="text-[12px] font-light text-white/38 leading-[1.55] mb-3.5">
          {sub}
        </p>

        {/* Attribute pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {attrs.map((attr) => (
            <span
              key={attr}
              className="font-display text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-[3px] rounded-md bg-white/[0.04] border border-white/[0.08] text-white/30"
            >
              {attr}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between mt-auto pt-3.5 border-t border-white/[0.06]">
          <div>
            <p className="font-display text-[9px] font-semibold tracking-[0.1em] uppercase text-white/20 mb-0.5">
              From
            </p>
            <p className="font-display text-[18px] font-extrabold tracking-tight text-white">
              {price}
            </p>
          </div>

          <a
            href={getAmazonUrl(asin)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={`View ${name} on Amazon`}
            className={[
              'group/link inline-flex items-center gap-1.5',
              'font-display text-[11px] font-bold tracking-[0.06em] uppercase',
              'py-1.5 transition-colors duration-200',
              featured
                ? 'text-volt/55 hover:text-volt'
                : 'text-white/32 hover:text-white/75',
            ].join(' ')}
          >
            View on Amazon
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </article>
  );
}
