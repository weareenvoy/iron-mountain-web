'use client';

// import { useWelcome } from '@/app/(displays)/welcome/_components/providers/welcome';

import { useEffect, useRef, useState } from 'react';
import { useWelcomeWall } from '@/app/(displays)/welcome-wall/_components/providers/welcome-wall';
// import IRMLogo from '../icons/IRMLogo';
// import LocationIcon from '../icons/LocationIcon';
// import MountainBG from '../icons/MountainBG';
// import MountainIcon from '../icons/MountainIcon';

// const CROSSFADE_DURATION_MS = 800;
// const PING_PONG_INTERVAL_MS = 5000;
const AmbientView = () => {
  // NEW NEW

  const { data, exhibitState } = useWelcomeWall();

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  // NEW NEW

  // const { data, exhibitState } = useWelcome();

  // Refs to track the two images
  // const imageA = useRef<HTMLImageElement>(null);
  // const imageB = useRef<HTMLImageElement>(null);

  // // Track which image is currently visible
  // const activeRef = useRef<'a' | 'b'>('a');
  // const [activeDisplay, setActiveDisplay] = useState<'a' | 'b'>('a');

  useEffect(() => {
    // if (!data || !backgroundVideoRef.current) return;

    // const url = data.beats[beatId].url;
    const url =
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/welcome-wall/IRM_Entryway_AmbientLoop.mp4';
    // if (!url) return;

    backgroundVideoRef.current.src = url;
    backgroundVideoRef.current.currentTime = 0;
    backgroundVideoRef.current.loop = true;

    const onReady = () => {
      console.info('onReady');
      backgroundVideoRef.current?.play();
    };

    backgroundVideoRef.current.addEventListener('canplaythrough', onReady, { once: true });
    backgroundVideoRef.current.load();

    // if (!imageA.current || !imageB.current) return;
    // const performTransition = () => {
    //   const visible = activeRef.current === 'a' ? imageA.current : imageB.current;
    //   const hidden = activeRef.current === 'a' ? imageB.current : imageA.current;
    //   if (!visible || !hidden) return;
    //   // Apply transition to both images
    //   visible.style.transition = hidden.style.transition = `opacity ${CROSSFADE_DURATION_MS}ms ease`;
    //   // Fade out visible, fade in hidden
    //   visible.style.opacity = '0';
    //   hidden.style.opacity = '1';
    //   // Switch active reference
    //   activeRef.current = activeRef.current === 'a' ? 'b' : 'a';
    //   setActiveDisplay(activeRef.current);
    // };
    // // Set up interval for continuous ping pong
    // const intervalId = setInterval(performTransition, PING_PONG_INTERVAL_MS);
    // // Cleanup on unmount
    // return () => clearInterval(intervalId);
  }, [data]);

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
