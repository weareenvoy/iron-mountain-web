import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { KioskApiResponse, KioskDataResponse } from '@/lib/internal/types';

export async function getKioskData(kioskId: KioskId): Promise<KioskDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch(`/api/${kioskId}.json`, { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as KioskApiResponse;

      return { data: rawData.data, locale: rawData.locale };
    }

    const res = await fetch(`${API_BASE}/${kioskId}`, { cache: 'no-store', signal: controller.signal });
    clearTimeout(timeout);
    const rawData = (await res.json()) as KioskApiResponse;

    return { data: rawData.data, locale: rawData.locale };
  } catch {
    // Offline/static fallback
    const res = await fetch(`/api/${kioskId}.json`, { cache: 'force-cache' });
    clearTimeout(timeout);
    const rawData = (await res.json()) as KioskApiResponse;

    return { data: rawData.data, locale: rawData.locale };
  }
}
