'use client';

import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import PossibilitiesDetail from './views/PossibilitiesDetail';
import PossibilitiesTitle from './views/PossibilitiesTitle';
import Problem1 from './views/Problem1';
import Problem2 from './views/Problem2';
import Problem3 from './views/Problem3';
import WelcomeView from './views/WelcomeView';
import type { BasecampData } from '@/app/(displays)/basecamp/_types';
import type { ReactElement } from 'react';

type DataKey =
  | 'possibilities'
  | 'possibilities-a'
  | 'possibilities-b'
  | 'possibilities-c'
  | 'problem-1'
  | 'problem-2'
  | 'problem-3'
  | 'welcome';

// Mapping from moment + beatIdx to data key
const getDataKey = (moment: string, beatIdx: number): DataKey | null => {
  if (moment === 'welcome' && beatIdx === 0) return 'welcome';
  if (moment === 'problem' && beatIdx === 0) return 'problem-1';
  if (moment === 'problem' && beatIdx === 2) return 'problem-2';
  if (moment === 'problem' && beatIdx === 3) return 'problem-3';
  if (moment === 'possibilities' && beatIdx === 0) return 'possibilities';
  if (moment === 'possibilities' && beatIdx === 2) return 'possibilities-a';
  if (moment === 'possibilities' && beatIdx === 3) return 'possibilities-b';
  if (moment === 'possibilities' && beatIdx === 4) return 'possibilities-c';

  return null; // No content for this moment/beatIdx combination
};

const RENDERERS: { [K in DataKey]: (data: BasecampData[K]) => ReactElement } = {
  'possibilities': data => <PossibilitiesTitle data={data} />,
  'possibilities-a': data => <PossibilitiesDetail data={data} />,
  'possibilities-b': data => <PossibilitiesDetail data={data} />,
  'possibilities-c': data => <PossibilitiesDetail data={data} />,
  'problem-1': data => <Problem1 data={data} />,
  'problem-2': data => <Problem2 data={data} />,
  'problem-3': data => <Problem3 data={data} />,
  'welcome': data => <WelcomeView data={data} />,
};

const Foreground = () => {
  const { data, exhibitState } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;

  const dataKey = getDataKey(momentId, beatIdx);
  if (!dataKey || !data) {
    return null;
  }
  const content = data[dataKey] as BasecampData[typeof dataKey];

  if (!content) return null; // No content to show for this moment/beatIdx

  const render = RENDERERS[dataKey] as (d: typeof content) => ReactElement;

  // Single positioned wrapper to enable parent-controlled transitions
  return <div className="absolute inset-0">{render(content)}</div>;
};

export default Foreground;
