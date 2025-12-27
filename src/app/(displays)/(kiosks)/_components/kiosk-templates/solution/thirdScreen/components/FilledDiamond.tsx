import Image from 'next/image';
import TealGradientDiamondThird from '@/components/ui/icons/Kiosks/Solutions/TealGradientDiamondThird';

type FilledDiamondProps = {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

const FilledDiamond = ({ className, imageAlt, imageSrc }: FilledDiamondProps) => {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[390px] rotate-[45deg]">
        {imageSrc ? (
          <Image alt={imageAlt ?? ''} className="-rotate-[45deg] object-cover" fill sizes="390px" src={imageSrc} />
        ) : (
          <TealGradientDiamondThird aria-hidden="true" className="h-full w-full -rotate-[45deg]" focusable="false" />
        )}
      </div>
    </div>
  );
};

export default FilledDiamond;
