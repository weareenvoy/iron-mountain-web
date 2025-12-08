import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-1'];
};

const Problem1 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-secondary-im-purple text-center text-5xl font-bold">{data.text}</div>
    </div>
  );
};

export default Problem1;
