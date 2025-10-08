"use client";

import { useEffect, useState } from "react";

function useSecondsTimer({ enabled = true }: { enabled?: boolean } = {}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return seconds;
}

export default useSecondsTimer;
