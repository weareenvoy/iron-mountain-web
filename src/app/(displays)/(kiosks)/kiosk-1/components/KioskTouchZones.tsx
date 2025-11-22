'use client';
import React from 'react';
import useKioskController from '@/components/kiosk-controller/useKioskController';

export default function KioskTouchZones() {
  const controller = useKioskController();

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none', zIndex: 999 }}>
      <button
        aria-label="Previous"
        onPointerDown={() => controller.prev()}
        style={{ pointerEvents: 'auto', flex: 1, background: 'transparent', border: 0 }}
      />
      <button
        aria-label="Next"
        onPointerDown={() => controller.next()}
        style={{ pointerEvents: 'auto', flex: 1, background: 'transparent', border: 0 }}
      />
    </div>
  );
}
