'use client';
import { useContext } from 'react';
import { ControllerContext } from './KioskController';
import type { Controller } from './KioskController';
import { DEFAULT_KIOSK_ID } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

const noopController: Controller = {
  fetchKioskChallenges: async () => {
    throw new Error('Kiosk controller is not available');
  },
  getRegistry: () => [],
  goTo: () => {},
  kioskId: DEFAULT_KIOSK_ID,
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
