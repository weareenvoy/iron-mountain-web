'use client';

// import { useWelcome } from '@/app/(displays)/welcome/_components/providers/welcome';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import IRMLogo from '../icons/IRMLogo';
import LocationIcon from '../icons/LocationIcon';
import MountainBG from '../icons/MountainBG';
import MountainIcon from '../icons/MountainIcon';

const CROSSFADE_DURATION_MS = 800;
const PING_PONG_INTERVAL_MS = 5000;
const TourView = () => {
  // const { data, exhibitState } = useWelcome();

  // Refs to track the two images
  const imageA = useRef<HTMLImageElement>(null);
  const imageB = useRef<HTMLImageElement>(null);

  // Track which image is currently visible
  const activeRef = useRef<'a' | 'b'>('a');
  const [activeDisplay, setActiveDisplay] = useState<'a' | 'b'>('a');

  useEffect(() => {
    if (!imageA.current || !imageB.current) return;

    const performTransition = () => {
      const visible = activeRef.current === 'a' ? imageA.current : imageB.current;
      const hidden = activeRef.current === 'a' ? imageB.current : imageA.current;

      if (!visible || !hidden) return;

      // Apply transition to both images
      visible.style.transition = hidden.style.transition = `opacity ${CROSSFADE_DURATION_MS}ms ease`;

      // Fade out visible, fade in hidden
      visible.style.opacity = '0';
      hidden.style.opacity = '1';

      // Switch active reference
      activeRef.current = activeRef.current === 'a' ? 'b' : 'a';
      setActiveDisplay(activeRef.current);
    };

    // Set up interval for continuous ping pong
    const intervalId = setInterval(performTransition, PING_PONG_INTERVAL_MS);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="welcome-container relative h-full w-full overflow-hidden">
      {/* Logo View */}
      <div
        ref={imageA}
        style={{
          opacity: activeDisplay === 'a' ? 1 : 0,
          transition: `opacity ${CROSSFADE_DURATION_MS}ms ease`,
        }}
      >
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 w-full">
          <MountainBG className="h-auto w-full" />
        </div>
        <div className="logo-container">
          <div className="logo-left">
            <IRMLogo className="logo" />
          </div>
          <div className="logo-right">
            <Image
              alt="Client logo"
              className="logo"
              height={50}
              src="/images/welcome-wall-temp/MclarenLogo.png"
              width={50}
            />
          </div>
        </div>
      </div>

      {/* Message View */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        ref={imageB}
        style={{
          backgroundImage: 'url(/images/welcome-wall-temp/welcome-message-bg.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: activeDisplay === 'b' ? 1 : 0,
          transition: `opacity ${CROSSFADE_DURATION_MS}ms ease`,
        }}
      >
        <div className="message-container">
          <h1>Welcome to the Iron Mountain Executive Briefing Center</h1>
        </div>

        <div className="footer-container">
          <div className="footer-left">
            <LocationIcon />
            <h2 className="footer-location-text">Sao Paulo, Brazil</h2>
          </div>
          <div className="footer-right">
            <MountainIcon />
            <h2 className="footer-elevation-text">Elevation 760 m (2,493.4 ft)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourView;
