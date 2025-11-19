'use client';

import { useEffect } from 'react';
import { toast, type ExternalToast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const OFFLINE_FIRST = (process.env.NEXT_PUBLIC_KIOSK_OFFLINE_FIRST ?? 'true') === 'true';

const SwRegister = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      let updateFoundHandler: (() => void) | undefined;
      let controllerChangeHandler: (() => void) | undefined;
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        // Configure runtime options for the SW
        if (reg?.active) {
          reg.active.postMessage({
            apiBase: API_BASE,
            offlineFirst: OFFLINE_FIRST,
            type: 'CONFIG',
          });
        } else if (reg?.installing) {
          const onStateChange = () => {
            if (reg.installing?.state === 'activated' && reg.active) {
              reg.active.postMessage({
                apiBase: API_BASE,
                offlineFirst: OFFLINE_FIRST,
                type: 'CONFIG',
              });
            }
          };
          reg.installing.addEventListener('statechange', onStateChange);
        }

        // Listen for updates found
        updateFoundHandler = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          const onStateChange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              toast('A new version is available.', {
                action: { label: 'Reload', onClick: () => window.location.reload() },
                description: 'Update to the latest content.',
              } as Partial<ExternalToast>);
            }
          };
          newWorker.addEventListener('statechange', onStateChange, { once: true });
        };
        reg.addEventListener('updatefound', updateFoundHandler);

        // When the active SW changes (post-activation), suggest reload once
        let prompted = false;
        controllerChangeHandler = () => {
          if (prompted) return;
          prompted = true;
          toast('App updated.', {
            action: {
              label: 'Reload',
              onClick: () => window.location.reload(),
            },
          } as Partial<ExternalToast>);
        };
        navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
      } catch {
        // No-op in kiosk mode; app should still function without SW
      }
      return () => {
        try {
          if (updateFoundHandler) {
            navigator.serviceWorker.ready.then(reg => {
              reg.removeEventListener('updatefound', updateFoundHandler as EventListener);
            });
          }
          if (controllerChangeHandler) {
            navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler as EventListener);
          }
        } catch {
          // ignore
        }
      };
    };

    const cleanupPromise = register();
    return () => {
      // Await and invoke inner cleanup if provided
      cleanupPromise.then(cleanup => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, []);

  return null;
};

export default SwRegister;
