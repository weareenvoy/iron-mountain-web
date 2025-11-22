'use client';
import { useContext } from 'react';
import { ControllerContext } from './KioskController';

type Handlers = { next?: () => void; prev?: () => void; goTo?: (i: number) => void };

export function useKioskController() {
  const ctx = useContext(ControllerContext as any);
  if (!ctx) {
    // noop controller when provider is not present (safe for tests/dev)
    return {
      next: () => {},
      prev: () => {},
      goTo: (_: number) => {},
      register: (_id: string, _h: Handlers) => {},
      unregister: (_id: string) => {},
      getRegistry: () => [] as any,
    };
  }

  return ctx;
}

export default useKioskController;
