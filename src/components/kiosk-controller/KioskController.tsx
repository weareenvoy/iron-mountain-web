'use client';
import React from 'react';

type Handlers = {
  // return true if this handler consumed the action and no further fallback should occur
  next?: () => boolean | void;
  prev?: () => boolean | void;
  goTo?: (index: number) => boolean | void;
};

type RegistryEntry = { id: string; handlers: Handlers };

export type Controller = {
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  register: (id: string, handlers: Handlers) => void;
  unregister: (id: string) => void;
  // register a top-level/root handler (parallax slide navigation)
  setRootHandlers: (handlers: Handlers | null) => void;
  getRegistry: () => RegistryEntry[];
};

const noop = () => {};

const ControllerContext = React.createContext<Controller | null>(null);
export { ControllerContext };

export const KioskControllerProvider = ({ children }: { children: React.ReactNode }) => {
  const registryRef = React.useRef<RegistryEntry[]>([]);

  const register = (id: string, handlers: Handlers) => {
    // replace if exists
    const idx = registryRef.current.findIndex((r) => r.id === id);
    if (idx >= 0) {
      registryRef.current[idx].handlers = handlers;
    } else {
      registryRef.current.push({ id, handlers });
    }
  };

  const unregister = (id: string) => {
    registryRef.current = registryRef.current.filter((r) => r.id !== id);
  };

  const getActive = (): Handlers | null => {
    if (registryRef.current.length === 0) return null;
    return registryRef.current[registryRef.current.length - 1].handlers;
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
      } catch (e) {
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
      } catch (e) {
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
      } catch (e) {
        // fallthrough
      }
    }

    if (rootRef.current?.goTo) {
      rootRef.current.goTo(i);
    }
  };

  const value: Controller = {
    next,
    prev,
    goTo,
    register,
    unregister,
    setRootHandlers,
    getRegistry: () => registryRef.current,
  };

  return <ControllerContext.Provider value={value}>{children}</ControllerContext.Provider>;
};

export default KioskControllerProvider;
