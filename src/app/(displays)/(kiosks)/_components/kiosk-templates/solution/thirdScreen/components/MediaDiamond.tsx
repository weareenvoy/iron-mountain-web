import Image from 'next/image';
import { cn } from '@/lib/tailwind/utils/cn';

export type MediaDiamondProps = {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly sizeClass?: string;
};

const MediaDiamond = ({ className, imageAlt, imageSrc, sizeClass = 'size-[666px]' }: MediaDiamondProps) => {
  return (
    <div className={cn('absolute', className)}>
      <div className={cn('relative', sizeClass)}>
        {imageSrc ? (
          <Image
            alt={imageAlt ?? ''}
            className="clip-diamond-rounded object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="900px"
            src={imageSrc}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MediaDiamond;
