'use client';
import { useContext } from 'react';
import { ControllerContext } from './KioskController';
import type { Controller } from './KioskController';

const noopController: Controller = {
  getRegistry: () => [],
  goTo: () => {},
  next: () => {},
  prev: () => {},
  register: () => {},
  setRootHandlers: () => {},
  unregister: () => {},
};

export function useKioskController(): Controller {
  const ctx = useContext(ControllerContext);
  if (!ctx) {
    return noopController;
  }

  return ctx;
}

export default useKioskController;
