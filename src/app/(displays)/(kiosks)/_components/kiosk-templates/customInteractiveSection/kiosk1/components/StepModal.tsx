import { ArrowLeft } from 'lucide-react';
import NextImage from 'next/image';

export type ModalContent = {
  readonly body: string;
  readonly heading: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

type StepModalProps = {
  readonly content: ModalContent | null;
  readonly onClose: () => void;
};

const StepModal = ({ content, onClose }: StepModalProps) => {
  if (!content) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-[200] flex items-center justify-center">
      <div className="pointer-events-auto absolute inset-0 bg-black/60 backdrop-blur-[50px]" onClick={onClose} />
      <div className="pointer-events-auto relative z-[201] flex h-[2800px] max-h-[90vh] w-[1920px] flex-col overflow-hidden rounded-[48px] bg-[#97e9ff] p-[80px] text-[#14477d] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <button
            className="pointer-events-auto relative top-[45px] left-[60px] flex h-[200px] items-center gap-[24px] rounded-[1000px] bg-[#ededed] px-[90px] py-[60] pr-[100px] text-[55px] leading-[1.4] font-normal tracking-[-2.7px] text-[#14477d] transition hover:scale-[1.02]"
            onClick={onClose}
            type="button"
          >
            <span className="flex items-center justify-center">
              <ArrowLeft aria-hidden className="mr-[30px] h-[52px] w-[52px]" color="#14477d" strokeWidth={2} />
            </span>
            Back
          </button>
        </div>

        <div className="mt-[80px] grid gap-[80px] text-[#14477d]">
          <div className="relative top-[150px] left-[45px] space-y-[60px]">
            <h2 className="mb-[105px] text-[100px] leading-[1.3] font-normal tracking-[-5px]">{content.heading}</h2>
            <div className="w-[1170px] space-y-[32px] text-[60px] leading-[1.4] font-normal tracking-[-3px]">
              <p className="whitespace-pre-line">{content.body}</p>
            </div>
          </div>

          {content.imageSrc ? (
            <div className="flex items-center justify-center">
              <div className="relative top-[130px] h-[1680px] w-[1680px] rotate-[45deg] rounded-[80px] border-0 bg-transparent">
                <div className="absolute inset-0 flex -rotate-[45deg] items-center justify-center rounded-[80px] bg-transparent">
                  <NextImage
                    alt={content.imageAlt ?? 'Modal illustration'}
                    className="h-full w-full object-contain"
                    height={1394}
                    src={content.imageSrc}
                    width={1680}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StepModal;
