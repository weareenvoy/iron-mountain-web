import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-3'];
};

const Problem3 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-secondary-im-purple space-y-8 text-center">
        <div className="text-5xl font-bold">{data.title}</div>
        <div className="grid grid-cols-2 gap-8">
          <div className="text-2xl font-semibold">{data['challenge-1'].title}</div>
          <div className="text-lg">{data['challenge-1'].body}</div>
          <div className="text-2xl font-semibold">{data['challenge-2'].title}</div>
          <div className="text-lg">{data['challenge-2'].body}</div>
          <div className="text-2xl font-semibold">{data['challenge-3'].title}</div>
          <div className="text-lg">{data['challenge-3'].body}</div>
          <div className="text-2xl font-semibold">{data['challenge-4'].title}</div>
          <div className="text-lg">{data['challenge-4'].body}</div>
        </div>
      </div>
    </div>
  );
};

export default Problem3;
