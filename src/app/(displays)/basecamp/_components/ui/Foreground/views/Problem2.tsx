import type { BasecampData } from '@/app/(displays)/basecamp/_types';

type Props = {
  readonly data: BasecampData['problem-2'];
};

const Problem2 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-secondary-im-purple space-y-8 text-center">
        {data.map(item => {
          const key = `${item.percent}-${item.percentSubtitle}`;
          return (
            <div className="space-y-2" key={key}>
              <div className="text-8xl font-bold">{item.percent}</div>
              <div className="text-2xl">{item.percentSubtitle}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Problem2;
