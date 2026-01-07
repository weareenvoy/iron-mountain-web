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
  const clientTourLogoRef = useRef<HTMLImageElement>(null);

  const clientTourLogoUrl = data?.clientTourLogo.url ?? '';

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

    const animationLoop = () => {
      if (!backgroundVideoRef.current) return;

      const shouldShow =
        backgroundVideoRef.current.currentTime >= SHOW_LOGO_AT_SECONDS &&
        backgroundVideoRef.current.currentTime <= HIDE_LOGO_AT_SECONDS;

      setShowLogo(prev => {
        const newValue = shouldShow ? 1 : 0;
        if (prev !== newValue) {
          return newValue;
        }
        return prev;
      });

      requestAnimationFrame(animationLoop);
    };

    requestAnimationFrame(animationLoop);
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

      <Image
        alt="Client logo"
        className="logo"
        height={50}
        ref={clientTourLogoRef}
        src={clientTourLogoUrl}
        style={{ opacity: showLogo, transition: `opacity ${LOGO_FADE_DURATION_MS}ms ease` }}
        width={50}
      />
    </div>
  );
};

export default TourView;
