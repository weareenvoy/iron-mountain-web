'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, type ReactNode } from 'react';

import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';

type Props = { id?: string; slides?: ReactNode[] };

const InnerEmbla = ({ id = 'inner-embla', slides }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const controller = useKioskController();

  useEffect(() => {
    if (!emblaApi) return;

    controller.register(id, {
      goTo: i => {
        if (emblaApi) {
          emblaApi.scrollTo(i);
          return true;
        }
        return false;
      },
      next: () => {
        if (emblaApi && emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
          return true;
        }
        return false;
      },
      prev: () => {
        if (emblaApi && emblaApi.canScrollPrev()) {
          emblaApi.scrollPrev();
          return true;
        }
        return false;
      },
    });

    return () => controller.unregister(id);
  }, [controller, emblaApi, id]);

  return (
    <div className="embla" ref={emblaRef} style={{ overflow: 'hidden' }}>
      <div className="embla__container" style={{ display: 'flex' }}>
        {slides?.length
          ? slides.map((slide, index) => (
              <div className="embla__slide" key={index} style={{ minWidth: '100%' }}>
                {slide}
              </div>
            ))
          : [1, 2, 3].map(slideNumber => (
              <div className="embla__slide" key={slideNumber} style={{ minWidth: '100%', padding: 20 }}>
                <div>Inner Embla slide {slideNumber}</div>
              </div>
            ))}
      </div>
    </div>
  );
};

InnerEmbla.displayName = 'InnerEmbla';

export default InnerEmbla;

