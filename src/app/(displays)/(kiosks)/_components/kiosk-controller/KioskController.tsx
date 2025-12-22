'use client';
import React from 'react';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import { getKioskData } from '@/lib/internal/data/get-kiosk';
import type { KioskData } from '@/lib/internal/types';

export type Controller = {
  fetchKioskChallenges: () => Promise<KioskData>;
  getRegistry: () => RegistryEntry[];
  goTo: (i: number) => void;
  kioskId: KioskId;
  next: () => void;
  prev: () => void;
  register: (id: string, handlers: Handlers) => void;
  // register a top-level/root handler (parallax slide navigation)
  setRootHandlers: (handlers: Handlers | null) => void;
  unregister: (id: string) => void;
};

type Handlers = {
  // return true if this handler consumed the action and no further fallback should occur
  goTo?: (index: number) => boolean | void;
  next?: () => boolean | void;
  prev?: () => boolean | void;
};

type RegistryEntry = { handlers: Handlers; id: string };

const ControllerContext = React.createContext<Controller | null>(null);
export { ControllerContext };

export const KioskControllerProvider = ({
  children,
  kioskId = DEFAULT_KIOSK_ID,
}: Readonly<{
  children: React.ReactNode;
  kioskId?: KioskId;
}>) => {
  const registryRef = React.useRef<RegistryEntry[]>([]);

  const register = (id: string, handlers: Handlers) => {
    // replace if exists
    const idx = registryRef.current.findIndex(r => r.id === id);
    if (idx >= 0) {
      registryRef.current[idx] = { handlers, id };
      return;
    }

    registryRef.current.push({ handlers, id });
  };

  const unregister = (id: string) => {
    registryRef.current = registryRef.current.filter(r => r.id !== id);
  };

  const getActive = (): Handlers | null => {
    if (registryRef.current.length === 0) return null;
    const last = registryRef.current[registryRef.current.length - 1];
    return last ? last.handlers : null;
  };

  const rootRef = React.useRef<Handlers | null>(null);

  const setRootHandlers = (h: Handlers | null) => {
    rootRef.current = h;
  };

  const next = () => {
    const active = getActive();
    if (active?.next) {
      try {
        const handled = active.next();
        if (handled === true) return;
      } catch {
        // swallow handler errors and continue to root fallback
      }
    }

    // fallback to root/top-level handler
    if (rootRef.current?.next) {
      rootRef.current.next();
    }
  };

  const prev = () => {
    const active = getActive();
    if (active?.prev) {
      try {
        const handled = active.prev();
        if (handled === true) return;
      } catch {
        // continue to root
      }
    }

    if (rootRef.current?.prev) {
      rootRef.current.prev();
    }
  };

  const goTo = (i: number) => {
    const active = getActive();
    if (active?.goTo) {
      try {
        const handled = active.goTo(i);
        if (handled === true) return;
      } catch {
        // fallthrough
      }
    }

    if (rootRef.current?.goTo) {
      rootRef.current.goTo(i);
    }
  };

  const fetchKioskChallenges = React.useCallback(async () => {
    const result = await getKioskData(kioskId);
    return result.data;
  }, [kioskId]);

  const value: Controller = {
    fetchKioskChallenges,
    getRegistry: () => registryRef.current,
    goTo,
    kioskId,
    next,
    prev,
    register,
    setRootHandlers,
    unregister,
  };

  return <ControllerContext.Provider value={value}>{children}</ControllerContext.Provider>;
};

export default KioskControllerProvider;
