import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { BasecampApiResponse, BasecampDataResponse } from '@/lib/internal/types';

export async function getBasecampData(): Promise<BasecampDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as BasecampApiResponse;

      return { data: rawData.data, locale: rawData.locale };
    }

    const res = await fetch(`${API_BASE}/basecamp`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const rawData = (await res.json()) as BasecampApiResponse;

    return { data: rawData.data, locale: rawData.locale };
  } catch {
    // Offline/static fallback
    const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
    clearTimeout(timeout);
    const rawData = (await res.json()) as BasecampApiResponse;

    return { data: rawData.data, locale: rawData.locale };
  }
}
