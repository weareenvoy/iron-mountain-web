import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { SummitApiResponse, SummitDataResponse } from '@/lib/internal/types';

const pickSummitData = (
  rawData: SummitApiResponse | { readonly data: unknown; readonly locale?: string },
  locale: string
) => {
  if (Array.isArray(rawData)) {
    const matchingData = rawData.find(item => item.locale === locale)?.data;
    if (!matchingData) {
      throw new Error(`Missing summit data for locale: ${locale}`);
    }
    return matchingData as SummitDataResponse['data'];
  }
  if ('data' in rawData) {
    return rawData.data as SummitDataResponse['data'];
  }
  throw new Error('Invalid summit API response shape');
};

const resolveSummitData = (
  rawData: SummitApiResponse | { readonly data: unknown; readonly locale?: string },
  locale: string
) => {
  const data = pickSummitData(rawData, locale);
  return data;
};

export async function getSummitData(tourId?: string): Promise<SummitDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  const fetchStaticJson = async (path: string) => {
    const res = await fetch(path, { cache: 'force-cache' });
    if (!res.ok) {
      throw new Error(`Bad status: ${res.status}`);
    }
    return (await res.json()) as SummitApiResponse | { readonly data: unknown; readonly locale?: string };
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
      const locale = getLocaleForTesting();
      return {
        data: resolveSummitData(rawData, locale),
        locale,
      };
    }

    // Online first
    const res = await fetch(`${API_BASE}/summit${tourId ? `/${tourId}` : ''}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as SummitApiResponse | { readonly data: unknown; readonly locale?: string };
    const locale = getLocaleForTesting();
    return {
      data: resolveSummitData(rawData, locale),
      locale,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const primaryPath = tourId ? `/api/summit-${tourId}.json` : '/api/summit.json';
    const rawData = await fetchStaticWithFallback(primaryPath, '/api/summit.json');
    const locale = getLocaleForTesting();
    return {
      data: resolveSummitData(rawData, locale),
      locale,
    };
  }
}
