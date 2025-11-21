import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['welcome'];
};

const WelcomeView = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-secondary-im-purple text-center text-6xl font-bold">{data.text}</div>
    </div>
  );
};

export default WelcomeView;
