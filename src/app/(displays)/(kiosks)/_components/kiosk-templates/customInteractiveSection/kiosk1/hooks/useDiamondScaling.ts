import { useCallback, useEffect } from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

type EmblaApi = UseEmblaCarouselType[1];

/**
 * Layout constants for edge transforms
 */
const LAYOUT = {
  EDGE_TRANSFORM_X: 240,
} as const;

/**
 * Distance from center to identify edge slides
 */
const EDGE_OFFSET = 2;

/**
 * Hook to manage diamond edge transforms for carousel overlap effect
 * Applies CSS transforms to push edge diamonds toward center
 *
 * @param emblaApi - Embla carousel API instance
 * @param totalSlides - Total number of slides in carousel
 * @returns Function to manually apply edge transforms
 */
export const useDiamondScaling = (emblaApi: EmblaApi | undefined, totalSlides: number) => {
  /**
   * Applies transform to edge diamonds to create overlap effect
   * Operates on actual DOM (including Embla's cloned slides) for loop consistency
   */
  const applyEdgeTransforms = useCallback(
    (currentIndex: number) => {
      if (!emblaApi?.rootNode || totalSlides === 0) {
        return;
      }

      const root = emblaApi.rootNode();
      // Query fresh on each call - no caching needed for consistency
      const slides = root.querySelectorAll<HTMLElement>('[data-slide-index], .embla__slide');
      const half = Math.floor(totalSlides / 2);
      const rootRect = root.getBoundingClientRect();
      const rootCenter = rootRect.left + rootRect.width / 2;

      let activeSlide: HTMLElement | null = null;
      let activeDistance = Number.POSITIVE_INFINITY;

      // Find the active slide closest to center (handles clones)
      slides.forEach((slide: HTMLElement) => {
        const indexAttr =
          slide.dataset.slideIndex ??
          slide.getAttribute('data-embla-slide-index') ??
          slide.getAttribute('data-embla-index');
        const rawIndex = Number(indexAttr);
        if (Number.isNaN(rawIndex)) {
          return;
        }
        const normalizedIndex = ((rawIndex % totalSlides) + totalSlides) % totalSlides;
        if (normalizedIndex !== currentIndex) return;
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const distance = Math.abs(slideCenter - rootCenter);
        if (distance < activeDistance) {
          activeDistance = distance;
          activeSlide = slide;
        }
      });

      // Apply transforms to push edge diamonds toward center
      slides.forEach((slide: HTMLElement) => {
        const indexAttr =
          slide.dataset.slideIndex ??
          slide.getAttribute('data-embla-slide-index') ??
          slide.getAttribute('data-embla-index');
        const rawIndex = Number(indexAttr);
        if (Number.isNaN(rawIndex)) {
          slide.style.transform = '';
          return;
        }
        const normalizedIndex = ((rawIndex % totalSlides) + totalSlides) % totalSlides;
        let delta = normalizedIndex - currentIndex;

        if (normalizedIndex === currentIndex && slide !== activeSlide) {
          const slideRect = slide.getBoundingClientRect();
          const slideCenter = slideRect.left + slideRect.width / 2;
          delta = slideCenter < rootCenter ? -EDGE_OFFSET : EDGE_OFFSET;
        }

        if (delta > half) {
          delta -= totalSlides;
        }
        if (delta < -half) {
          delta += totalSlides;
        }

        const transform =
          delta === -EDGE_OFFSET
            ? `translate3d(${LAYOUT.EDGE_TRANSFORM_X}px, 0px, 0px)`
            : delta === EDGE_OFFSET
              ? `translate3d(-${LAYOUT.EDGE_TRANSFORM_X}px, 0px, 0px)`
              : '';
        slide.style.transform = transform;
      });
    },
    [emblaApi, totalSlides]
  );

  // Apply transforms continuously during scroll using RAF throttling
  useEffect(() => {
    if (!emblaApi) return undefined;

    let raf = 0;
    let isRunning = false;

    const tick = () => {
      isRunning = false;
      const nextSnap = emblaApi.selectedScrollSnap();
      applyEdgeTransforms(nextSnap);
    };

    const onScroll = () => {
      if (isRunning) return;
      isRunning = true;
      raf = requestAnimationFrame(tick);
    };

    emblaApi.on('scroll', onScroll);

    return () => {
      emblaApi.off('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [applyEdgeTransforms, emblaApi]);

  return applyEdgeTransforms;
};
