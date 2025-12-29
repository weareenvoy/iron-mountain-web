import Image from 'next/image';

type PhotoDiamondProps = {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

const PhotoDiamond = ({ className, imageAlt, imageSrc }: PhotoDiamondProps) => {
  return (
    <div className={className}>
      <div className="relative size-full rotate-[45deg] overflow-hidden rounded-[160px]">
        {imageSrc ? (
          <Image
            alt={imageAlt ?? ''}
            className="-rotate-[45deg] object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="520px"
            src={imageSrc}
          />
        ) : (
          <div className="h-full w-full -rotate-[45deg] bg-[#6dcff6]" />
        )}
      </div>
    </div>
  );
};

export default PhotoDiamond;
