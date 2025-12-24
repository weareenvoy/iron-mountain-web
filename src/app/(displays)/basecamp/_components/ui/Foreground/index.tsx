'use client';

import { startTransition, useEffect, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { isForegroundSeamlessTransition } from '@/app/(displays)/basecamp/_utils';
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

const Foreground = () => {
  const { data, exhibitState, readyBeatId } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;

  // Build and validate the target beat ID
  const targetBeatIdRaw = `${momentId}-${beatIdx + 1}`;
  const targetBeatId = isValidBasecampBeatId(targetBeatIdRaw) ? targetBeatIdRaw : null;

  const [displayedBeatId, setDisplayedBeatId] = useState<BasecampBeatId | null>(null);
  // True when fade-out completed but video wasn't ready yet
  const [fadedOut, setFadedOut] = useState(false);

  const isReady = targetBeatId !== null && readyBeatId === targetBeatId;
  const isValid = targetBeatId !== null;

  // Main transition effect
  useEffect(() => {
    if (!isReady || !isValid) return;
    if (displayedBeatId === targetBeatId) return;

    const seamless = isForegroundSeamlessTransition(displayedBeatId, targetBeatId);

    // Switch when: seamless transition, OR fade-out already completed
    if (seamless || fadedOut) {
      startTransition(() => {
        setDisplayedBeatId(targetBeatId);
        setFadedOut(false);
      });
    }
  }, [displayedBeatId, fadedOut, isReady, isValid, targetBeatId]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // More specific check
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== 'opacity') return;
    // Capture current values to avoid stale closures
    const currentDisplayed = displayedBeatId;
    const currentTarget = targetBeatId;
    const currentReady = readyBeatId === currentTarget;
    if (currentDisplayed === currentTarget) return;
    if (currentDisplayed && !isForegroundSeamlessTransition(currentDisplayed, currentTarget)) {
      if (currentReady) {
        startTransition(() => setDisplayedBeatId(currentTarget));
      } else {
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
  const shouldFadeOut =
    displayedBeatId !== targetBeatId && !isForegroundSeamlessTransition(displayedBeatId, targetBeatId);

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
