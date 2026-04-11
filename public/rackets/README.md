# Racket Images — How to add real PNGs

The component uses `next/image` and falls back to the SVG illustration
if the PNG is missing or fails to load. To add real product images:

## 1. Source transparent-background PNGs

Good sources:
- The brand's official press kit (bullpadel.com, head.com, adidas.com)
- Amazon product images (download the main PNG — they often have white BGs, use remove.bg to strip them)
- remove.bg — paste any product image URL to get a transparent PNG in seconds

## 2. Name and place the files

Place each PNG in `/public/rackets/` with the exact filename matching
the `imagePath` in `data/gearData.ts`:

```
public/
  rackets/
    bullpadel-hack-03.png     ← Editor's Pick card
    head-delta-pro.png        ← Card 2
    adidas-metalbone.png      ← Card 3
```

## 3. Recommended PNG specs

- Width:  400–600px
- Height: 800–1200px (portrait, racket oriented vertically)
- Background: transparent (alpha channel)
- Format: PNG-24 with alpha

The `<Image>` component renders at 100×180px display size but Next.js will
serve the appropriately sized version via its built-in optimisation pipeline.

## 4. No other code changes needed

Once the PNGs are in `/public/rackets/`, Next.js picks them up automatically.
The SVG fallback disappears and the real product images appear instead.
