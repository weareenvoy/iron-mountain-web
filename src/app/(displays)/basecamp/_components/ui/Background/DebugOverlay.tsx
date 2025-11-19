'use client';

type Props = {
  readonly beatIdx: number;
  readonly momentId: string;
  readonly time: number;
};

const DebugOverlay = ({ beatIdx, momentId, time }: Props) => {
  return (
    <div className="absolute top-4 left-4 rounded bg-black/50 p-2 text-white">
      <p>Moment: {momentId}</p>
      <p>BeatIdx: {beatIdx}</p>
      <p>Time: {time.toFixed(1)}s</p>
    </div>
  );
};

export default DebugOverlay;
