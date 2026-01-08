import Image from 'next/image';

type PhotoDiamondProps = {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

const PhotoDiamond = ({ className, imageAlt, imageSrc }: PhotoDiamondProps) => {
  return (
    <div className={className}>
      <div className="relative size-full">
        {imageSrc ? (
          <Image
            alt={imageAlt ?? ''}
            className="clip-diamond-rounded object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="520px"
            src={imageSrc}
          />
        ) : (
          <div className="clip-diamond-rounded h-full w-full bg-[#6dcff6]" />
        )}
      </div>
    </div>
  );
};

export default PhotoDiamond;
