'use client';
// components/gear/GearCard.tsx

import Image from 'next/image';
import { useState } from 'react';
import { GearProduct, getAmazonSearchUrl } from '@/data/gearData';
import RacketIllustration from './RacketIllustration';

interface GearCardProps {
  product: GearProduct;
  animDelay?: number;
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
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

export default function GearCard({ product, animDelay = 0 }: GearCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const amazonUrl = getAmazonSearchUrl(product);

  const cardBase = [
    'group relative rounded-[24px] border overflow-hidden',
    'transition-all duration-350 ease-in-out cursor-default',
  ].join(' ');

  const cardStyle = product.featured
    ? `${cardBase} bg-[rgba(204,255,0,0.025)] border-volt/[0.18] hover:border-volt/[0.35] hover:-translate-y-1`
    : `${cardBase} bg-[rgba(255,255,255,0.03)] border-white/[0.08] hover:border-volt/[0.22] hover:-translate-y-1`;

  const illustrationVariant =
    product.rank === 1 ? 'featured' : product.rank === 2 ? 'standard' : 'entry';

  return (
    <article
      className={cardStyle}
      style={{ animationDelay: `${animDelay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${product.brand} ${product.name} — ${product.price}`}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-4 right-4 h-px pointer-events-none z-10"
        style={{
          background: product.featured
            ? 'linear-gradient(90deg, transparent, rgba(204,255,0,0.10), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[24px] transition-opacity duration-350"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'radial-gradient(ellipse 200px 200px at 50% 40%, rgba(204,255,0,0.06), transparent)',
        }}
      />

      {/* Rank watermark */}
      <span
        className="absolute bottom-6 right-5 font-sans font-black leading-none select-none pointer-events-none"
        style={{
          fontSize: '72px',
          letterSpacing: '-0.05em',
          color: 'rgba(255,255,255,0.04)',
          zIndex: 0,
        }}
        aria-hidden
      >
        {String(product.rank).padStart(2, '0')}
      </span>

      <div className="relative z-10 p-7 pb-6 flex flex-col h-full">

        {/* Badge row */}
        <div className="flex items-center justify-between mb-1">
          {product.featured ? (
            <span className="font-sans text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-volt text-[#050505]">
              Editor&apos;s Pick
            </span>
          ) : (
            <span className="font-sans text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/30">
              {product.skillLevel}
            </span>
          )}
          {product.featured && (
            <span className="font-sans text-[9px] font-bold tracking-[0.1em] uppercase text-white/25">
              {product.skillLevel}
            </span>
          )}
        </div>

        {/* Racket image / illustration */}
        <div className="relative h-[200px] flex items-center justify-center my-2">
          {/* Hover ground glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-10 rounded-full pointer-events-none transition-opacity duration-350"
            style={{
              background: 'rgba(204,255,0,0.06)',
              filter: 'blur(16px)',
              opacity: hovered ? 1 : 0,
            }}
          />

          {!imgError ? (
            <Image
              src={product.imagePath}
              alt={product.imageAlt}
              width={100}
              height={180}
              className="object-contain transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:-rotate-2"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <RacketIllustration
              brand={product.brand}
              variant={illustrationVariant}
              className="w-[100px] h-[180px] transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:-rotate-2"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
            />
          )}
        </div>

        {/* Product copy */}
        <div className="flex-1">
          <p className="font-sans text-[10px] font-bold tracking-[0.12em] uppercase text-white/22 mb-1.5">
            {product.category}
          </p>
          <h3 className="font-sans text-[18px] font-extrabold tracking-tight text-white leading-[1.15] mb-1.5">
            {product.brand} {product.name}
          </h3>
          <p className="font-sans text-[12px] text-white/35 leading-[1.55] mb-5">
            {product.spec}
          </p>

          {/* Attribute chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.attrs.map((attr) => (
              <span
                key={attr}
                className="font-sans text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] bg-white/[0.04] border border-white/[0.08] text-white/30"
              >
                {attr}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-auto">
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.06em] uppercase text-white/22 mb-0.5">
              From
            </p>
            <p className="font-sans text-[22px] font-extrabold tracking-tight text-white leading-none">
              {product.price}
            </p>
          </div>

          <a
            href={amazonUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={`View ${product.brand} ${product.name} on Amazon`}
            className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold text-white/35 no-underline transition-all duration-250 ease-in-out hover:text-volt hover:gap-2.5"
          >
            View on Amazon
            <span className="transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
