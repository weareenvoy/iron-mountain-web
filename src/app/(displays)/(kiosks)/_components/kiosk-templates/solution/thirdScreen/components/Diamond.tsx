import { type ComponentType, type SVGProps } from 'react';
import renderRegisteredMark from '../../../challenge/utils/renderRegisteredMark';

export type DiamondProps = {
  readonly className: string;
  readonly label?: string;
  readonly outline?: ComponentType<SVGProps<SVGSVGElement>>;
  readonly sizeClass?: string;
  readonly textColor?: string;
  readonly textWrapperClassName?: string;
};

const Diamond = ({
  className,
  label,
  outline: OutlineComponent,
  sizeClass = 'size-[666px]',
  textColor = '#ededed',
  textWrapperClassName,
}: DiamondProps) => {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass}`}>
        {OutlineComponent ? (
          <OutlineComponent aria-hidden="true" className="block h-full w-full object-contain" focusable="false" />
        ) : null}
        <div
          className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center ${
            textWrapperClassName ?? 'w-[600px]'
          }`}
        >
          <span className="text-[67px] leading-[1.4] font-normal tracking-[-3.3px]" style={{ color: textColor }}>
            {renderRegisteredMark(label)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Diamond;
