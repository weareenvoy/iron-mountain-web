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
      <div className={`relative ${sizeClass}`}>
        {imageSrc ? (
          <Image
            alt={imageAlt ?? ''}
            className="object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="900px"
            src={imageSrc}
            className="clip-diamond-rounded object-cover"
          />
        ) : null}
      </div>
    </div>
  );
};

export default MediaDiamond;
