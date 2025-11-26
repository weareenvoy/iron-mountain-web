'use client';
import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';

type Props = { id?: string; slides?: React.ReactNode[] };

export default function InnerEmbla({ id = 'inner-embla', slides }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const controller = useKioskController();

  useEffect(() => {
    if (!emblaApi) return;

    controller.register(id, {
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
      goTo: (i) => {
        if (emblaApi) {
          emblaApi.scrollTo(i);
          return true;
        }
        return false;
      }
    });

    return () => controller.unregister(id);
  }, [emblaApi, controller, id]);

  return (
    <div className="embla" ref={emblaRef} style={{ overflow: 'hidden' }}>
      <div className="embla__container" style={{ display: 'flex' }}>
        {slides?.length
          ? slides.map((s, i) => (
              <div key={i} className="embla__slide" style={{ minWidth: '100%' }}>
                {s}
              </div>
            ))
          : [1, 2, 3].map((n) => (
              <div key={n} className="embla__slide" style={{ minWidth: '100%', padding: 20 }}>
                <div>Inner Embla slide {n}</div>
              </div>
            ))}
      </div>
    </div>
  );
}
