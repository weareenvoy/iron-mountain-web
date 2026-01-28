import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { SummitApiResponse, SummitDataResponse } from '@/lib/internal/types';

export async function getSummitData(tourId?: string): Promise<SummitDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const API_KEY = process.env.NEXT_PUBLIC_API_AUTH_KEY;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  const fetchStaticJson = async (path: string) => {
    const res = await fetch(path, { cache: 'force-cache' });
    if (!res.ok) {
      throw new Error(`Bad status: ${res.status}`);
    }
    return (await res.json()) as SummitApiResponse;
  };

  // NOTE: Temporary path fallback while we rely on static mocks and before the API exists.
  // Some tour IDs (e.g., summit-tour-XYZ) may not have a dedicated JSON file yet;
  // in that case we fall back to the base summit.json. This ONLY relaxes file lookup,
  // not data requirements—missing required fields still throw.
  const fetchStaticWithFallback = async (primaryPath: string, fallbackPath: string) => {
    try {
      return await fetchStaticJson(primaryPath);
    } catch (err) {
      if (fallbackPath === primaryPath) throw err;
      return fetchStaticJson(fallbackPath);
    }
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const primaryPath = tourId ? `/api/summit-${tourId}.json` : '/api/summit.json';
      const rawData = await fetchStaticWithFallback(primaryPath, '/api/summit.json');
      return { data: rawData.data, locale: rawData.locale };
    }

    if (!API_KEY) {
      throw new Error('API_KEY is not defined');
    }

    // Online first
    const res = await fetch(`${API_BASE}/summit${tourId ? `/${tourId}` : ''}`, {
      cache: 'no-store',
      headers: {
        'X-API-Key': API_KEY,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as SummitApiResponse;
    return { data: rawData.data, locale: rawData.locale };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const primaryPath = tourId ? `/api/summit-${tourId}.json` : '/api/summit.json';
    const rawData = await fetchStaticWithFallback(primaryPath, '/api/summit.json');
    return { data: rawData.data, locale: rawData.locale };
  }
}
