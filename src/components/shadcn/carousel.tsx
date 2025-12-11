'use client';

import useEmblaCarousel from 'embla-carousel-react';
import * as React from 'react';
import { cn } from '@/lib/tailwind/utils/cn';

type EmblaApi = ReturnType<typeof useEmblaCarousel>[1];

type CarouselProps = React.HTMLAttributes<HTMLDivElement> &
  Readonly<{
    className?: string;
    opts?: Parameters<typeof useEmblaCarousel>[0];
    setApi?: (api: EmblaApi | undefined) => void;
  }>;

type CarouselContextValue = {
  readonly api: EmblaApi | undefined;
  readonly canScrollNext: boolean;
  readonly canScrollPrev: boolean;
  readonly scrollNext: () => void;
  readonly scrollPrev: () => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export const useCarousel = () => {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel>');
  }
  return context;
};

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className, opts, setApi, ...props }, ref) => {
    const [emblaRef, api] = useEmblaCarousel(opts);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    const onSelect = React.useCallback(() => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, [api]);

    React.useEffect(() => {
      if (!api) return;
      setApi?.(api);
      onSelect();
      api.on('reInit', onSelect);
      api.on('select', onSelect);
    }, [api, onSelect, setApi]);

    return (
      <CarouselContext.Provider value={{ api, canScrollNext, canScrollPrev, scrollNext, scrollPrev }}>
        <div className={cn('relative', className)} ref={ref} {...props}>
          <div className="overflow-hidden" ref={emblaRef}>
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => <div className={cn('-ml-4 flex', className)} ref={ref} {...props} />
);
CarouselContent.displayName = 'CarouselContent';

type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>;

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(({ className, ...props }, ref) => (
  <div className={cn('min-w-0 shrink-0 grow-0 pl-4', className)} ref={ref} {...props} />
));
CarouselItem.displayName = 'CarouselItem';

type CarouselButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseButtonClasses =
  'pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-current bg-white/80 text-[#14477d] shadow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40';

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ className, disabled, ...props }, ref) => {
    const { canScrollPrev, scrollPrev } = useCarousel();
    const isDisabled = disabled ?? !canScrollPrev;
    return (
      <button
        aria-label="Previous slide"
        className={cn(baseButtonClasses, className)}
        disabled={isDisabled}
        onClick={scrollPrev}
        ref={ref}
        type="button"
        {...props}
      >
        <span aria-hidden="true">←</span>
      </button>
    );
  }
);
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ className, disabled, ...props }, ref) => {
    const { canScrollNext, scrollNext } = useCarousel();
    const isDisabled = disabled ?? !canScrollNext;
    return (
      <button
        aria-label="Next slide"
        className={cn(baseButtonClasses, className)}
        disabled={isDisabled}
        onClick={scrollNext}
        ref={ref}
        type="button"
        {...props}
      >
        <span aria-hidden="true">→</span>
      </button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';
