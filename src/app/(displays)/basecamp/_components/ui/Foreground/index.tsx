'use client';

import { startTransition, useEffect, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { BasecampBeatId, BasecampData, isValidBasecampBeatId } from '@/lib/internal/types';
import AmbientView from './views/AmbientView';
import PossibilitiesDetail from './views/PossibilitiesDetail';
import PossibilitiesDetailsTitles from './views/PossibilitiesDetailsTitles';
import PossibilitiesTitle from './views/PossibilitiesTitle';
import Problem3 from './views/Problem3';
import Problem4 from './views/Problem4';
import ProblemIntro from './views/ProblemIntro';
import WelcomeView from './views/WelcomeView';

type ViewRenderer = (data: BasecampData, beatId: BasecampBeatId) => React.ReactNode;

const VIEWS: Partial<Record<BasecampBeatId, ViewRenderer>> = {
  'ambient-1': () => <AmbientView />,
  'possibilities-1': data => <PossibilitiesTitle data={data.possibilities} />,
  'possibilities-2': data => (
    <PossibilitiesDetailsTitles
      data={[data.possibilitiesA.title, data.possibilitiesB.title, data.possibilitiesC.title]}
    />
  ),
  'possibilities-3': data => <PossibilitiesDetail data={data.possibilitiesA} />,
  'possibilities-4': data => <PossibilitiesDetail data={data.possibilitiesB} />,
  'possibilities-5': data => <PossibilitiesDetail data={data.possibilitiesC} />,
  'problem-1': (data, beatId) => <ProblemIntro beatId={beatId as 'problem-1' | 'problem-2'} data={data.problem1} />,
  'problem-2': (data, beatId) => <ProblemIntro beatId={beatId as 'problem-1' | 'problem-2'} data={data.problem1} />,
  'problem-3': data => <Problem3 data={data.problem2} />,
  'problem-4': data => <Problem4 data={data.problem3} />,
  'welcome-1': data => <WelcomeView data={data.welcome} />,
};

// changing from problem1 to 2 doesn't need fade.
const SEAMLESS_GROUPS: readonly BasecampBeatId[][] = [['problem-1', 'problem-2']];

const isSeamlessTransition = (from: BasecampBeatId | null, to: BasecampBeatId): boolean => {
  if (!from) return true;
  return SEAMLESS_GROUPS.some(group => group.includes(from) && group.includes(to));
};

const Foreground = () => {
  const { data, exhibitState, readyBeatId } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const targetBeatId = `${momentId}-${beatIdx + 1}` as BasecampBeatId;

  const [displayedBeatId, setDisplayedBeatId] = useState<BasecampBeatId | null>(null);
  // True when fade-out completed but video wasn't ready yet
  const [fadedOut, setFadedOut] = useState(false);

  const isReady = readyBeatId === targetBeatId;
  const isValid = isValidBasecampBeatId(targetBeatId);

  // Main transition effect
  useEffect(() => {
    if (!isReady || !isValid) return;
    if (displayedBeatId === targetBeatId) return;

    const seamless = isSeamlessTransition(displayedBeatId, targetBeatId);

    // Switch when: seamless transition, OR fade-out already completed
    if (seamless || fadedOut) {
      startTransition(() => {
        setDisplayedBeatId(targetBeatId);
        setFadedOut(false);
      });
    }
  }, [displayedBeatId, fadedOut, isReady, isValid, targetBeatId]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== 'opacity') return;
    if (displayedBeatId === targetBeatId) return;

    // Fade-out completed for non-seamless transition
    if (displayedBeatId && !isSeamlessTransition(displayedBeatId, targetBeatId)) {
      if (isReady) {
        startTransition(() => setDisplayedBeatId(targetBeatId));
      } else {
        // Video not ready - mark faded out, effect will switch when ready
        setFadedOut(true);
      }
    }
  };

  if (!data) return null;

  // No early return. Container stays mounted even if view is null, to participate in transitions.
  const getView = (): ViewRenderer => {
    if (!displayedBeatId) return () => null;
    return VIEWS[displayedBeatId] ?? (() => null);
  };

  const View = getView();

  // Determine if we should be fading out
  const shouldFadeOut = displayedBeatId !== targetBeatId && !isSeamlessTransition(displayedBeatId, targetBeatId);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      key={displayedBeatId} // Forces full remount
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity: shouldFadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
      }}
    >
      {View(data, displayedBeatId!)}
    </div>
  );
};

export default Foreground;
