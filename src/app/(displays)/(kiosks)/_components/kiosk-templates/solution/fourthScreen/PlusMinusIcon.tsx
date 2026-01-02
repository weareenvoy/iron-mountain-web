import { Minus, Plus } from 'lucide-react';
import type { AccordionColor } from '@/app/(displays)/(kiosks)/_types/accordion-types';

type PlusMinusIconProps = {
  readonly accordionColor: AccordionColor;
};

const PlusMinusIcon = ({ accordionColor }: PlusMinusIconProps) => {
  return (
    <span
      aria-hidden
      className="relative block h-[72px] w-[72px] data-[accordion-color=blue]:text-[#ededed] data-[accordion-color=lightBlue]:text-[#14477d] data-[accordion-color=navy]:text-[#ededed] data-[accordion-color=white]:text-[#14477d]"
      data-accordion-color={accordionColor}
    >
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
