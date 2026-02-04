'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useWelcomeWall } from '@/app/(displays)/welcome-wall/_components/providers/welcome-wall';

const SHOW_LOGO_AT_SECONDS = 7;
const HIDE_LOGO_AT_SECONDS = 10;
const LOGO_FADE_DURATION_MS = 800;

const SHOW_MESSAGE_VIEW_AT_SECONDS = 12;
const HIDE_MESSAGE_VIEW_AT_SECONDS = 18;
const MESSAGE_VIEW_FADE_DURATION_MS = 800;

const TourView = () => {
  const { data, locale } = useWelcomeWall();
  const [showLogo, setShowLogo] = useState(0);
  const [showMessageView, setShowMessageView] = useState(0);

  // Ref for data access inside effect without causing re-runs
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!data || !backgroundVideoRef.current) return;

    const bgVideoUrl = dataRef.current?.videos['tourLoop'].url;

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
    const shouldShowLogo = video.currentTime >= SHOW_LOGO_AT_SECONDS && video.currentTime <= HIDE_LOGO_AT_SECONDS;
    const shouldShowMessageView =
      video.currentTime >= SHOW_MESSAGE_VIEW_AT_SECONDS && video.currentTime <= HIDE_MESSAGE_VIEW_AT_SECONDS;
    setShowLogo(prev => (prev === (shouldShowLogo ? 1 : 0) ? prev : shouldShowLogo ? 1 : 0));
    setShowMessageView(prev => (prev === (shouldShowMessageView ? 1 : 0) ? prev : shouldShowMessageView ? 1 : 0));
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

      <div
        className="absolute inset-0 z-20 flex flex-col justify-between"
        style={{ opacity: showMessageView, transition: `opacity ${MESSAGE_VIEW_FADE_DURATION_MS}ms ease` }}
      >
        {/* Middle: main title (message-container) */}
        <div className="flex h-full w-full items-center justify-center text-center">
          <h1 className="text-primary-im-dark-blue px-[204px] font-geometria text-[204.51px] leading-[110%] font-normal">
            {data.welcome.title}
          </h1>
        </div>

        {/* Bottom info bar (footer-container) */}
        <div className="absolute bottom-0 flex h-[20%] w-full flex-row items-center justify-between text-[65.49px] font-normal text-white">
          <div className="flex flex-row items-center pl-[204px]">
            <svg
              aria-hidden
              className="h-[1em] w-[1em] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            </svg>
            <h2 className="pl-[50px] font-normal">{data.location_details.name}</h2>
          </div>
          <div className="flex flex-row items-center pr-[204px]">
            <svg
              aria-hidden
              className="h-[1em] w-[1em] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <h2 className="pl-[50px] font-normal">{data.location_details.elevation}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourView;
