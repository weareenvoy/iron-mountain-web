import type { BasecampData } from '@/app/(displays)/basecamp/_types';

type Props = {
  readonly data: BasecampData['possibilities'];
};

const PossibilitiesTitle = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-secondary-im-purple text-center text-5xl font-bold">{data.title}</div>
    </div>
  );
};

export default PossibilitiesTitle;
