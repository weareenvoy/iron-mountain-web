'use client';

import { useEffect, useRef } from 'react';
import { useWelcomeWall } from '@/app/(displays)/welcome-wall/_components/providers/welcome-wall';

const AmbientView = () => {
  const { data, locale } = useWelcomeWall();

  // Ref for data access inside effect without causing re-runs
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!data || !backgroundVideoRef.current) return;

    // set the background video url based on the locale
    const bgVideoUrl = dataRef.current?.videos[locale === 'en' ? 'ambientLoopEn' : 'ambientLoopPt'].url;

    if (!bgVideoUrl) return;

    backgroundVideoRef.current.src = bgVideoUrl;
    backgroundVideoRef.current.currentTime = 0;
    backgroundVideoRef.current.loop = true;

    const onReady = () => {
      backgroundVideoRef.current?.play();
    };

    backgroundVideoRef.current.addEventListener('canplaythrough', onReady, { once: true });
    backgroundVideoRef.current.load();
  }, [data, locale]);

  return (
    <div className="welcome-container relative h-full w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        ref={backgroundVideoRef}
      />
    </div>
  );
};

export default AmbientView;
