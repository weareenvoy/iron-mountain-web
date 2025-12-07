'use client';
import { useContext } from 'react';
import { ControllerContext } from './KioskController';
import type { Controller } from './KioskController';
import { DEFAULT_KIOSK_ID } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

const noopController: Controller = {
  getRegistry: () => [],
  goTo: () => {},
  next: () => {},
  prev: () => {},
  register: () => {},
  setRootHandlers: () => {},
  unregister: () => {},
  kioskId: DEFAULT_KIOSK_ID,
  fetchKioskChallenges: async () => {
    throw new Error('Kiosk controller is not available');
  },
};

export function useKioskController(): Controller {
  const ctx = useContext(ControllerContext);
  if (!ctx) {
    return noopController;
  }

  return ctx;
}

export default useKioskController;
