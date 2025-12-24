import Image from 'next/image';

export type MediaDiamondProps = {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly sizeClass?: string;
};

const MediaDiamond = ({ className, imageAlt, imageSrc, sizeClass = 'size-[666px]' }: MediaDiamondProps) => {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass} rotate-45 overflow-hidden rounded-[120px]`}>
        {imageSrc ? (
          <Image alt={imageAlt ?? ''} className="-rotate-45 object-cover" fill sizes="900px" src={imageSrc} />
        ) : null}
      </div>
    </div>
  );
};

export default MediaDiamond;
