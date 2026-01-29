import toursStatic from '@public/api/tours.json';
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
      clearTimeout(timeout);
      return toursStatic as ToursApiResponse;
    }

    // Online first
    const res = await fetch(`${API_BASE}/tours`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    return (await res.json()) as ToursApiResponse;
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    return toursStatic as ToursApiResponse;
  }
}
