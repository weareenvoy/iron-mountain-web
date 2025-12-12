'use client';

import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { BasecampBeatId, BasecampData, isValidBasecampBeatId } from '@/lib/internal/types';
import AmbientView from './views/AmbientView';
import PossibilitiesDetail from './views/PossibilitiesDetail';
import PossibilitiesTitle from './views/PossibilitiesTitle';
import Problem1 from './views/Problem1';
import Problem2 from './views/Problem2';
import Problem3 from './views/Problem3';
import Problem4 from './views/Problem4';
import WelcomeView from './views/WelcomeView';
import type { ReactElement } from 'react';

const VIEWS: Partial<Record<BasecampBeatId, (data: BasecampData) => ReactElement>> = {
  // Ambient
  'ambient-1': () => <AmbientView />,

  // Possibilities
  'possibilities-1': data => <PossibilitiesTitle data={data.possibilities} />,
  'possibilities-3': data => <PossibilitiesDetail data={data['possibilities-a']} />,
  'possibilities-4': data => <PossibilitiesDetail data={data['possibilities-b']} />,
  'possibilities-5': data => <PossibilitiesDetail data={data['possibilities-c']} />,

  // Problem
  'problem-1': data => <Problem1 data={data['problem-1']} />,
  'problem-2': data => <Problem2 data={data['problem-1']} />, // Problem 2 uses Problem 1 data, the text shrinks and flies away.
  'problem-3': data => <Problem3 data={data['problem-2']} />,
  'problem-4': data => <Problem4 data={data['problem-3']} />,

  // Welcome
  'welcome-1': data => <WelcomeView data={data.welcome} />,
};

const Foreground = () => {
  const { data, exhibitState, readyBeatId } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const beatId = `${momentId}-${beatIdx + 1}`;

  // Only render content when THIS beat's background is ready
  const isReady = readyBeatId === beatId;

  if (!data) return null;
  if (!isValidBasecampBeatId(beatId)) return null;
  if (!isReady) return null;

  const renderView = VIEWS[beatId as BasecampBeatId];

  // Returns null for video-only beats (no overlay)
  if (!renderView) return null;

  const content = renderView(data);

  return <div className="absolute inset-0 z-10">{content}</div>;
};

export default Foreground;
