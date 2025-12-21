import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export interface KioskFullData {
  // Kiosk 1 nested structure
  readonly data?: {
    readonly ambient?: unknown;
    readonly challenge?: unknown;
    readonly hardcoded?: unknown;
    readonly solutions?: unknown;
    readonly value?: unknown;
  };
  // Kiosk 2/3 flat structure
  readonly ambient?: unknown;
  readonly challenge?: unknown;
  readonly challenges?: unknown;
  readonly hardcoded?: unknown;
  readonly solutions?: unknown;
  readonly value?: unknown;
  readonly locale?: string;
  // Allow any other properties
  readonly [key: string]: unknown;
}

const fetchStaticKioskData = async (kioskId: KioskId): Promise<KioskFullData> => {
  const res = await fetch(`/api/${kioskId}.json`, { cache: 'force-cache' });
  return (await res.json()) as KioskFullData;
};

export async function getKioskData(kioskId: KioskId): Promise<{ data: KioskFullData; kioskId: KioskId }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const data = await fetchStaticKioskData(kioskId);
      clearTimeout(timeout);

      return {
        data,
        kioskId,
      };
    }

    const res = await fetch(`${API_BASE}/${kioskId}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as KioskFullData;

    return {
      data,
      kioskId,
    };
  } catch {
    clearTimeout(timeout);
    const data = await fetchStaticKioskData(kioskId);

    return {
      data,
      kioskId,
    };
  }
}
