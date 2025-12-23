import Image from 'next/image';
import { type ReactNode } from 'react';

export type MediaDiamondProps = {
  readonly className: string;
  readonly fallback?: ReactNode;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly sizeClass?: string;
};

const MediaDiamond = ({ className, fallback, imageAlt, imageSrc, sizeClass = 'size-[666px]' }: MediaDiamondProps) => {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass} rotate-[45deg] overflow-hidden rounded-[120px]`}>
        {imageSrc ? (
          <Image alt={imageAlt ?? ''} className="-rotate-[45deg] object-cover" fill sizes="900px" src={imageSrc} />
        ) : (
          <div className="flex h-full w-full -rotate-[45deg] items-center justify-center">{fallback}</div>
        )}
      </div>
    </div>
  );
};

export default MediaDiamond;
