'use client';
import { createContext, useCallback, useRef, type ReactNode } from 'react';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type Controller = {
  readonly getRegistry: () => RegistryEntry[];
  readonly goTo: (i: number) => void;
  readonly kioskId: KioskId;
  readonly next: () => void;
  readonly prev: () => void;
  readonly register: (id: string, handlers: Handlers) => void;
  // register a top-level/root handler (parallax slide navigation)
  readonly setRootHandlers: (handlers: Handlers | null) => void;
  readonly unregister: (id: string) => void;
};

type Handlers = {
  // return true if this handler consumed the action and no further fallback should occur
  readonly goTo?: (index: number) => boolean | void;
  readonly next?: () => boolean | void;
  readonly prev?: () => boolean | void;
};

type RegistryEntry = { readonly handlers: Handlers; readonly id: string };

const ControllerContext = createContext<Controller | null>(null);
export { ControllerContext };

export const KioskControllerProvider = ({
  children,
  kioskId = DEFAULT_KIOSK_ID,
}: {
  readonly children: ReactNode;
  readonly kioskId?: KioskId;
}) => {
  const registryRef = useRef<RegistryEntry[]>([]);

  const register = useCallback((id: string, handlers: Handlers) => {
    // replace if exists
    const idx = registryRef.current.findIndex(r => r.id === id);
    if (idx >= 0) {
      registryRef.current[idx] = { handlers, id };
      return;
    }

    registryRef.current.push({ handlers, id });
  }, []);

  const unregister = useCallback((id: string) => {
    registryRef.current = registryRef.current.filter(r => r.id !== id);
  }, []);

  const getActive = useCallback((): Handlers | null => {
    if (registryRef.current.length === 0) return null;
    const last = registryRef.current[registryRef.current.length - 1];
    return last ? last.handlers : null;
  }, []);

  const rootRef = useRef<Handlers | null>(null);

  const setRootHandlers = useCallback((h: Handlers | null) => {
    rootRef.current = h;
  }, []);

  const next = useCallback(() => {
    const active = getActive();
    if (active?.next) {
      try {
        const handled = active.next();
        if (handled === true) return;
      } catch (error) {
        console.error('[KioskController] Error in active.next():', error);
        // swallow handler errors and continue to root fallback
      }
    }

    // fallback to root/top-level handler
    if (rootRef.current?.next) {
      rootRef.current.next();
    } else {
      console.warn('[KioskController] No root handler available!');
    }
  }, [getActive]);

  const prev = useCallback(() => {
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
  }, [getActive]);

  const goTo = useCallback(
    (i: number) => {
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
    },
    [getActive]
  );

  const value: Controller = {
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
