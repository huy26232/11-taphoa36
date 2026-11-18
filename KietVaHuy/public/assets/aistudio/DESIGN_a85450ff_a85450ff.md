---
name: Tạp Hóa Số Modern Grocery
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#574143'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8a7173'
  outline-variant: '#debfc1'
  surface-tint: '#a93349'
  primary: '#a93349'
  on-primary: '#ffffff'
  primary-container: '#fb7185'
  on-primary-container: '#6f0122'
  inverse-primary: '#ffb2b9'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#a43073'
  on-tertiary: '#ffffff'
  tertiary-container: '#f271b5'
  on-tertiary-container: '#6b0046'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadc'
  primary-fixed-dim: '#ffb2b9'
  on-primary-fixed: '#400010'
  on-primary-fixed-variant: '#891933'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#85145a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  price-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  price-strike:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1.25rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system reimagines the vibrant, trusted intimacy of the Vietnamese neighborhood corner shop (*tiệm tạp hóa*) through a modern, mobile-first e-commerce lens. It targets urban Vietnamese families, busy professionals, and young homemakers who value convenience, fresh daily ingredients, and genuine neighborhood warmth without visual clutter.

The visual style blends soft minimalism with cheerful tactile commerce cues. By balancing warm pastel rose and strawberry tones with crisp garden mint accents, the interface feels both nurturing and farm-fresh. Surfaces are bright, breezy, and approachable, avoiding aggressive flash-sale cacophony in favor of clear product legibility, tactile steppers, instant quick-add interactions, and scannable promotional stamps.

## Colors

The palette establishes an appetizing, trusted retail environment:

- **Primary (`#FB7185` / `#F472B6`):** The signature brand blossom. Used for high-intent conversion points, sticky cart action triggers, active tab states, and hero promotional highlights.
- **Secondary / Accent (`#10B981`):** Represents fresh produce, organic certifications, rapid same-day delivery flags, and discount/savings tags (`-25%`). Paired with `#ECFDF5` for soft pill containers.
- **Surface & Backgrounds:** The base canvas uses `#FAFAF9` (warm crisp white), layered with card surfaces at `#FFFFFF` and branded containers at `#FDF2F8` and `#FCE7F3`.
- **Neutrals & Text:** Deep charcoal `#0F172A` provides crisp contrast for product names and unit prices. `#64748B` anchors secondary meta-labels (weight, origin, pack size), while `#E2E8F0` defines whisper-light borders.

## Typography

`Be Vietnam Pro` serves across all typographic hierarchies. Engineered specifically for Vietnamese tone diacritics (dấu ngã, hỏi, nặng, sắc, huyền), it avoids character clipping and awkward vertical line-height jumping while maintaining pristine legibility in condensed e-commerce product grids.

Currency values should format explicitly with the Vietnamese Dong symbol (`₫`) appended directly to the bold numeric string without spacing (`45.000₫`). Strike-through prices sit adjacent in subdued slate neutral (`#94A3B8`).

## Layout & Spacing

The layout adopts a flexible hybrid grid optimized for mobile ergonomics and dense shelf browsing:

- **Mobile (< 768px):** 2-column dynamic product shelf with `0.75rem` gutters and `1rem` safe margins. Sticky category chips allow rapid thumb navigation, with a bottom sticky checkout summary bar anchored at 64px height.
- **Tablet (768px - 1024px):** 3- to 4-column product shelf with `1rem` gutters.
- **Desktop (> 1024px):** 12-column structured grid with a fixed 260px category sidebar and a 4- to 5-column product grid with `1.25rem` gutters and `2rem` max outer page margins (max container width: 1280px).

Internal card padding respects an 8pt baseline rhythm: `space-sm` for badges, `space-md` for product card internal content, and `space-xl` for sectional spacing.

## Elevation & Depth

Visual depth is achieved through layered tonal tints, crisp borders, and ultra-diffused pastel ambient shadows:

- **Surface Level 0 (Base):** `#FAFAF9` page canvas.
- **Surface Level 1 (Card/Container):** Pure `#FFFFFF` surfaces with a micro-border `1px solid #F1F5F9` and an ultra-soft ambient shadow: `0 4px 16px -2px rgba(251, 113, 133, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`.
- **Surface Level 2 (Floating Modals & Bottom Navigation):** Elevated pill bars and floating carts use `0 12px 32px -4px rgba(244, 114, 182, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.06)`.
- **Surface Level 3 (Active Overlays & Cart Drawer):** Glassmorphic backdrops (`backdrop-blur-md` over `rgba(15, 23, 42, 0.3)`).

## Shapes

The design system embraces generous, friendly geometry that reflects organic produce and warm hospitality. Standard components use base 16px (`1rem` / `rounded-2xl`) styling for product cards, banner modules, and modals. Steppers, badges, category filter chips, and primary action buttons utilize full pill radii (`9999px`) for touch-friendly ergonomics.

## Components

- **Product Cards:** Built on a white base with `rounded-2xl` corners, framed by a delicate 1px `#F1F5F9` border. Aspect ratio 1:1 image container with a subtle neutral-light backdrop (`#F8FAFC`). Includes an absolute top-left slot for discount/organic badges and a bottom-right quick-add action.
- **Quick-Add & Stepper Controls (Bach Hoa Xanh inspired):**
  - *Default State:* A compact circular or rounded pill button (`#FDF2F8` background with `#FB7185` bold plus icon).
  - *Active State:* Expands into a horizontal pill counter with soft rose fill, minus icon (`-`), centered bold quantity, and plus icon (`+`) with tactile haptic response.
- **Badges & Micro-Tags:**
  - *Fresh / Organic:* `#ECFDF5` background, `#047857` text, 10px rounded pill with a tiny leaf indicator.
  - *Flash Sale / Tiết Kiệm:* `#FFF1F2` background, `#E11D48` text, bold unit percentage.
- **Primary Buttons:** High-contrast pill-shaped actions using gradient-kissed `#FB7185` to `#F472B6`, white typography, and a subtle glowing shadow (`0 4px 14px rgba(251, 113, 133, 0.35)`).
- **Filter & Category Chips:** Horizontally scrollable pills with white background, `#E2E8F0` border, and slate text. Active state transitions to `#FDF2F8` with a `#FB7185` border and `#FB7185` semi-bold text.
- **Inputs & Search:** Generous 44px height search inputs with full pill radii, subtle magnifying glass prefix, `#F8FAFC` background fill, and focus state shifting to `#FFFFFF` with a 2px `#F472B6` outline.