# Drinklivery Public Assets

## Directory Structure

| Folder | Purpose | Runtime URL Prefix |
| --- | --- | --- |
| `catalog/` | Product images served to catalog, detail, cart, and checkout views | `/catalog/` |
| `brand/` | Brand/marketing images (icons, OG preview, optional hero) | `/brand/` |

## Required Images

### Product Images (MVP)

| File | Runtime URL | Size |
| --- | --- | --- |
| `catalog/mojito-pack-x4.webp` | `/catalog/mojito-pack-x4.webp` | 1600x1000 |
| `catalog/margarita-pack-x4.webp` | `/catalog/margarita-pack-x4.webp` | 1600x1000 |
| `catalog/passion-fruit-mocktail-pack-x4.webp` | `/catalog/passion-fruit-mocktail-pack-x4.webp` | 1600x1000 |

### Brand Images (MVP)

| File | Runtime URL | Size |
| --- | --- | --- |
| `brand/drinklivery-icon-1024.png` | `/brand/drinklivery-icon-1024.png` | 1024x1024 |
| `apple-touch-icon.png` (root) | `/apple-touch-icon.png` | 180x180 |
| `favicon.png` (root) | `/favicon.png` | 64x64 |
| `brand/drinklivery-og.webp` | `/brand/drinklivery-og.webp` | 1200x630 |

## Image Generation Rules

Generated files must avoid: text, logos, people, hands, watermarks, and sensitive ID/document imagery.

Prefer `.webp` for product/hero images and `.png` for icons/favicons.
