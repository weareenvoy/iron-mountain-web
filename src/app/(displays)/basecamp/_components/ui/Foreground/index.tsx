'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { BasecampBeatId, BasecampData, isValidBasecampBeatId } from '@/lib/internal/types';
import AmbientView from './views/AmbientView';
import PossibilitiesDetail from './views/PossibilitiesDetail';
import PossibilitiesTitle from './views/PossibilitiesTitle';
import Problem3 from './views/Problem3';
import Problem4 from './views/Problem4';
import ProblemIntro from './views/ProblemIntro';
import WelcomeView from './views/WelcomeView';

type ViewRenderer = (data: BasecampData, beatId: BasecampBeatId) => React.ReactNode;

const VIEWS: Partial<Record<BasecampBeatId, ViewRenderer>> = {
  'ambient-1': () => <AmbientView />,
  'possibilities-1': data => <PossibilitiesTitle data={data.possibilities} />,
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
  if (!from) return true; // first load is always instant
  return SEAMLESS_GROUPS.some(group => group.includes(from) && group.includes(to));
};

const Foreground = () => {
  const { data, exhibitState, readyBeatId } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const targetBeatId = `${momentId}-${beatIdx + 1}` as BasecampBeatId;

  const [currentBeatId, setCurrentBeatId] = useState<BasecampBeatId | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const currentBeatIdRef = useRef<BasecampBeatId | null>(null);
  const pendingBeatIdRef = useRef<BasecampBeatId | null>(null);

  const isReady = readyBeatId === targetBeatId;
  const isValid = isValidBasecampBeatId(targetBeatId);

  // Sync ref with state
  useEffect(() => {
    currentBeatIdRef.current = currentBeatId;
  }, [currentBeatId]);

  // When a new beat's background is ready
  useEffect(() => {
    if (!isReady || !isValid) return;
    const currentBeat = currentBeatIdRef.current;
    if (currentBeat === targetBeatId) return;

    if (isSeamlessTransition(currentBeat, targetBeatId)) {
      startTransition(() => {
        setCurrentBeatId(targetBeatId);
      });
    } else {
      pendingBeatIdRef.current = targetBeatId;
      startTransition(() => {
        setIsFadingOut(true);
      });
    }
  }, [isReady, isValid, targetBeatId]);

  // When fade-out finishes, show new content
  const handleFadeComplete = () => {
    if (!isFadingOut) return;
    const pendingBeatId = pendingBeatIdRef.current;
    if (pendingBeatId) {
      setCurrentBeatId(pendingBeatId);
      pendingBeatIdRef.current = null;
    }
    setIsFadingOut(false);
  };

  if (!data) return null;

  // No foreground overlay for this beat
  if (!currentBeatId || !VIEWS[currentBeatId]) return null;

  const View = VIEWS[currentBeatId]!;

  return (
    <div
      className={`absolute inset-0 z-10 ${isFadingOut ? 'animate-fade-out' : ''}`}
      onAnimationEnd={handleFadeComplete}
    >
      {View(data, currentBeatId)}
    </div>
  );
};

export default Foreground;
