import Image from 'next/image';
import TealGradientDiamondThird from '@/components/ui/icons/Kiosks/Solutions/TealGradientDiamondThird';
import { cn } from '@/lib/tailwind/utils/cn';

type FilledDiamondProps = {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

const FilledDiamond = ({ className, imageAlt, imageSrc }: FilledDiamondProps) => {
  return (
    <div className={cn('absolute', className)}>
      <div className="relative size-[390px]">
        {imageSrc ? (
          <Image
            alt={imageAlt ?? ''}
            className="clip-diamond-rounded object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="390px"
            src={imageSrc}
          />
        ) : (
          <TealGradientDiamondThird aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
    </div>
  );
};

export default FilledDiamond;
