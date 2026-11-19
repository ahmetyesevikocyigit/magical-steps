# Magical Steps media audit

Updated: 2026-11-11T19:10:54.068Z

- Source: the authorised existing [Magical Steps website](https://www.magical-steps.com/). No third-party stock photography was substituted.
- 585 raster assets converted to WebP at quality 80; photographs were auto-oriented, metadata removed, and transparency retained.
- Original bytes: 78,866,798; WebP bytes: 42,816,254; aggregate saving: 45.7%. 53 individual WebP files are larger than their already-compressed source; the manifest preserves exact comparisons.
- Hero max width: 2560 px. Other source images max width: 1600 px. Small source images are never enlarged; the existing hero is 1350 × 900 px.
- Original files remain in the workspace's work/media/originals directory. Output filenames include a content/settings hash. Re-running the command reuses originals and existing matching conversions.
- Responsive delivery is handled by Next Image; this script deliberately generates one optimised master per source instead of redundant responsive variants.
- Cormorant Garamond and Manrope WOFF2 fonts are hosted locally with Latin, extended Latin, Cyrillic and extended Cyrillic subsets. Fonts were fetched from Google Fonts; OFL license files and local font-face CSS are in public/fonts.
- Source URL, final dimensions and exact byte sizes are recorded in src/data/media.json.
- 8 source YouTube video links retain their original website thumbnail pairings as local WebP. Titles and channel names were verified with YouTube oEmbed; video players are not fetched by this pipeline.

## Source failures

- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/030b1196_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/6bbcc7bc_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/0ec1efff_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/802be046_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/3ce06a6c_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/298d7a8b_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/537b8301_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/0d73f2bf_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/geziturlar/hotel/hotels/c9f3ab46_z.jpg: Source returned an empty file
- https://www.magical-steps.com/contents/img/msc-crociere-msc-bellissima-01.jpg: HTTP 404
- https://www.magical-steps.com/contents/img/msc-crociere-msc-armonia-01.jpg: HTTP 404
- https://www.magical-steps.com/images/ui/tripadvisor_like.png: HTTP 404
- https://www.magical-steps.com/contents/img/temp/resimyok.jpg: HTTP 404

Source failures are not substitute images. The UI must omit unavailable decorative images and use verified local images for product thumbnails. All 585 output files were decoded and checked for WebP format, matching dimensions and exact byte counts. 7 outputs retain an alpha channel. Browser currentSrc, loading, clipping and layout-shift verification are performed by the application QA pass.

## Final inventory coverage

The final 107-product / 39-page catalog references 567 unique images: 558 are mapped to verified local files, and nine hotel image sources return empty bodies. No source raster URLs remain unprocessed. The complete media manifest contains 585 WebP files, including home-page/service assets and eight original video previews.

The legacy decorative enlogo11.svg source also returned 404 during verification. The external TripAdvisor GIF badge was excluded as decoration. No SVG source was rasterized.
