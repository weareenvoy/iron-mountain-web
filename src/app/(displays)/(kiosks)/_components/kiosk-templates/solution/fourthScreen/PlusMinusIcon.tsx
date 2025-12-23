import { Minus, Plus } from 'lucide-react';

type PlusMinusIconProps = {
  readonly color: string;
};

const PlusMinusIcon = ({ color }: PlusMinusIconProps) => {
  return (
    <span aria-hidden className="relative block h-[72px] w-[72px]" style={{ color }}>
      <Minus
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity group-data-[state=open]/accordion-trigger:opacity-100"
        strokeWidth={1.5}
      />
      <Plus
        className="absolute inset-0 h-full w-full transition-opacity group-data-[state=open]/accordion-trigger:opacity-0"
        strokeWidth={1.5}
      />
    </span>
  );
};

export default PlusMinusIcon;

