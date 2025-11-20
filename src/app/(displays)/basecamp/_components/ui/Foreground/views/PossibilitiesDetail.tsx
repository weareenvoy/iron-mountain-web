import type { BasecampData } from '@/app/(displays)/basecamp/_types';

type Props = {
  readonly data: BasecampData['possibilities-a'];
};

const PossibilitiesDetail = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-secondary-im-purple space-y-8 text-center">
        <div className="text-5xl font-bold">{data.title}</div>
        <div className="space-y-4">
          <div className="text-2xl">{data['body-1']}</div>
          <div className="text-2xl">{data['body-2']}</div>
          <div className="text-2xl">{data['body-3']}</div>
        </div>
      </div>
    </div>
  );
};

export default PossibilitiesDetail;
