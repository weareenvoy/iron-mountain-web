'use client';
import { useContext } from 'react';
import { DEFAULT_KIOSK_ID } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import { ControllerContext, type Controller } from './KioskController';

const noopController: Controller = {
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
