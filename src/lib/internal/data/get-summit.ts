import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { SummitApiResponse, SummitDataResponse } from '@/lib/internal/types';

export async function getSummitData(tourId?: string): Promise<SummitDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const apiPath = tourId ? `/api/summit-${tourId}.json` : '/api/summit_room.json';
      const res = await fetch(apiPath, { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as SummitApiResponse;

      return { data: rawData.data, locale: rawData.locale };
    }

    // Online first
    const apiPath = `${API_BASE}/summit_room${tourId ? `?tour_id=${tourId}` : ''}`;
    const res = await fetch(apiPath, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const rawData = (await res.json()) as SummitApiResponse;

    return { data: rawData.data, locale: rawData.locale };
  } catch {
    // Offline/static fallback
    const apiPath = tourId ? `/api/summit-${tourId}.json` : '/api/summit_room.json';
    const res = await fetch(apiPath, { cache: 'force-cache' });
    clearTimeout(timeout);
    const rawData = (await res.json()) as SummitApiResponse;

    return { data: rawData.data, locale: rawData.locale };
  }
}
