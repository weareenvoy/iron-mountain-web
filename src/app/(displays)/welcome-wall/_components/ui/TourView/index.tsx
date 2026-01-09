'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useWelcomeWall } from '@/app/(displays)/welcome-wall/_components/providers/welcome-wall';

const SHOW_LOGO_AT_SECONDS = 7;
const HIDE_LOGO_AT_SECONDS = 10;
const LOGO_FADE_DURATION_MS = 800;

const TourView = () => {
  const { data, locale } = useWelcomeWall();
  const [showLogo, setShowLogo] = useState(0);

  // Ref for data access inside effect without causing re-runs
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!data || !backgroundVideoRef.current) return;

    // set the background video url based on the locale
    const bgVideoUrl = dataRef.current?.videos[locale === 'en' ? 'tourLoopEn' : 'tourLoopPt'].url;

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

  if (!data) return null;

  const clientTourLogoUrl = data.clientTourLogo.url;

  const handleTimeUpdate = (video: HTMLVideoElement) => {
    const shouldShow = video.currentTime >= SHOW_LOGO_AT_SECONDS && video.currentTime <= HIDE_LOGO_AT_SECONDS;
    setShowLogo(prev => (prev === (shouldShow ? 1 : 0) ? prev : shouldShow ? 1 : 0));
  };

  return (
    <div className="welcome-container relative h-full w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        muted
        onTimeUpdate={e => handleTimeUpdate(e.currentTarget)}
        playsInline
        preload="auto"
        ref={backgroundVideoRef}
      />

      <Image
        alt="Client logo"
        className="absolute top-1/2 left-1/2 z-10 h-auto w-[28%] -translate-y-1/2"
        height={50}
        src={clientTourLogoUrl}
        style={{ opacity: showLogo, transition: `opacity ${LOGO_FADE_DURATION_MS}ms ease` }}
        width={50}
      />
    </div>
  );
};

export default TourView;
