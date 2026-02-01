
# Progressive Loading Implementation Plan

## Overview
Implement a two-tier image loading system where compressed/thumbnail versions are used in the carousel for fast browsing, and full-resolution images are only loaded when the user opens the Lightbox.

---

## What This Will Achieve
- Faster initial page load (compressed images are much smaller)
- Smooth carousel navigation with pre-cached thumbnails
- Full-quality images only when zooming in the lightbox
- Better user experience with no visible loading delays during browsing

---

## File Structure

### New Compressed Images Folder
```text
src/assets/
  jan-cover.jpeg          <-- New compressed cover (JPEG)
  pages/
    pg1.png ... pg17.png  <-- Full resolution (for Lightbox)
  pages-compressed/       <-- NEW FOLDER
    pg2.png               <-- Compressed versions (for Carousel)
    pg3.png
    pg4.png
    pg5.png
    pg6.png
    (pg1, pg7-pg17 will use full-res temporarily until you provide compressed versions)
```

---

## Implementation Steps

### Step 1: Copy New Assets
- Copy the new compressed cover image `PAGE-COVER_1.jpeg` to `src/assets/jan-cover.jpeg`
- Create a new folder `src/assets/pages-compressed/`
- Copy the 5 compressed pages (pg2-pg6) to the new folder

### Step 2: Update HeroSection
- Change the import from `jan-cover.png` to `jan-cover.jpeg` for the compressed hero cover

### Step 3: Update CarouselSection
- Import compressed images for pages 2-6 from `pages-compressed/`
- For pages without compressed versions yet (pg1, pg7-pg17), continue using full-resolution
- Create a `compressedPages` array for carousel display
- Continue preloading compressed images on mount (faster)

### Step 4: Update Lightbox  
- Keep using full-resolution images from `pages/`
- Add "loading" state to show a brief loading indicator while full-res loads
- Preload the full-resolution image when lightbox opens (optional enhancement)

---

## Technical Details

### CarouselSection Changes
```text
Imports:
- Add imports for compressed versions (pg2-pg6) from pages-compressed/
- Create compressedPages array mixing compressed + full-res as fallback

Preload Logic:
- Only preload compressed images (faster initial load)
- Full-res images load on-demand in Lightbox
```

### Lightbox Changes
```text
- Continue using full-resolution `pages` array
- Optional: Add a loading state with blur-to-sharp transition
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/assets/jan-cover.jpeg` | Create (copy from upload) |
| `src/assets/pages-compressed/pg2.png` | Create (copy from upload) |
| `src/assets/pages-compressed/pg3.png` | Create (copy from upload) |
| `src/assets/pages-compressed/pg4.png` | Create (copy from upload) |
| `src/assets/pages-compressed/pg5.png` | Create (copy from upload) |
| `src/assets/pages-compressed/pg6.png` | Create (copy from upload) |
| `src/components/HeroSection.tsx` | Modify - update cover import to JPEG |
| `src/components/CarouselSection.tsx` | Modify - use compressed images for carousel |
| `src/components/Lightbox.tsx` | Minor update - ensure full-res loading |

---

## Next Steps After Implementation
Once this is working with the first 5 pages, you can provide compressed versions for the remaining pages (pg1, pg7-pg17) and I will add them to the `pages-compressed/` folder.
