# Mobile hero and homepage revision — 26 November 2026

The live portrait hero image endpoint returned HTTP 402 with `OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`; original WebP assets returned 200. Destination switching waited for that failed request and could not complete.

## Changes
- Sharp-generated static responsive WebP files, selected through a Next Image custom loader. 709 original masters preserved; 1,378 smaller variants, fixed quality 80. No Vercel runtime optimizer requests. Dimensions and byte savings: responsive-media-manifest.json.
- Mobile full-screen hero with a more compact title and four visible destination cards. An animation completion timeout prevents a stuck picker.
- Menu drawer with grayscale + blur backdrop, scroll lock, Escape handling and focus restoration.
- Localized three-link information strip below the hero, and sticky stacking cards for hotels, sailing and transfers. Reduced-motion and short screens receive a regular non-sticky layout.
- Server-rendered legacy HTML images share the same pure loader as Next Image.

## Verification
- Production build and TypeScript passed. 10 journey/content tests plus 3 media tests passed.
- All four hero selections tested sequentially at mobile size. Menu open/close, Escape and focus restoration verified.
- Responsive layouts reviewed at 360, 390, 768, 1440 and 1920px; no horizontal overflow observed.
- Full local route/redirect/image audit: no failures (see link-audit.json).
- Three local production Lighthouse runs per device: mobile and desktop median performance/accessibility/best practices/SEO all 100. This is a local `/tr` homepage measurement, not a whole-site or live performance guarantee.
- No physical iOS/Android device or full screen-reader session tested. Reduced motion reviewed in code.

## Live release
- Published to https://magical-steps.vercel.app/tr (production READY), deployment `dpl_FLaCaSGwAZxw1Prmdmn5cdjPHLE5`, source commit `876044b`.
- All six homepages and four legacy-image page types returned 200. Eight original/responsive mobile hero assets returned 200 with valid WebP data and immutable cache headers.
- All four mobile selections completed on the live site; menu verified; no browser console errors observed.
- GitHub: https://github.com/ahmetyesevikocyigit/magical-steps
