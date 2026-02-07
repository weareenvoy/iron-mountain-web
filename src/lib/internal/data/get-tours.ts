import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { ToursApiResponse } from '@/lib/internal/types';

// Fetches the tour schedule data from /api/tours endpoint
export async function getToursData(): Promise<ToursApiResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/tours.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as ToursApiResponse;

      return { tours: rawData.tours };
    }

    // Online first
    const res = await fetch(`${API_BASE}/tours`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const rawData = (await res.json()) as ToursApiResponse;

    return { tours: rawData.tours };
  } catch {
    // Offline/static fallback
    const res = await fetch('/api/tours.json', { cache: 'force-cache' });
    clearTimeout(timeout);
    const rawData = (await res.json()) as ToursApiResponse;

    return { tours: rawData.tours };
  }
}
