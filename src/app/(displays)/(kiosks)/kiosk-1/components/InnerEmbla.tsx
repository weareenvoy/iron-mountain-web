'use client';

import { useEffect, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';

type Props = { readonly id?: string; readonly slides?: ReactNode[] };

const InnerEmbla = ({ id = 'inner-embla', slides }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const controller = useKioskController();

  useEffect(() => {
    if (!emblaApi) return;

    controller.register(id, {
      goTo: i => {
        emblaApi.scrollTo(i);
        return true;
      },
      next: () => {
        if (!emblaApi.canScrollNext()) {
          return false;
        }
        emblaApi.scrollNext();
        return true;
      },
      prev: () => {
        if (!emblaApi.canScrollPrev()) {
          return false;
        }
        emblaApi.scrollPrev();
        return true;
      },
    });

    return () => controller.unregister(id);
  }, [controller, emblaApi, id]);

  return (
    <div className="embla overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex">
        {slides?.length
          ? slides.map((slide, index) => (
              <div className="embla__slide min-w-full" key={index}>
                {slide}
              </div>
            ))
          : [1, 2, 3].map(slideNumber => (
              <div className="embla__slide min-w-full p-5" key={slideNumber}>
                <div>Inner Embla slide {slideNumber}</div>
              </div>
            ))}
      </div>
    </div>
  );
};

InnerEmbla.displayName = 'InnerEmbla';

export default InnerEmbla;
