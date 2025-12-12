import summitStatic from '@public/api/summit.json';
import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { Locale, SummitData } from '@/lib/internal/types';

export interface SummitDataResponse {
  readonly data: SummitData;
  readonly locale: Locale;
}

type SummitApiResponse = readonly { readonly data: SummitData; readonly locale: string }[];

const pickSummitData = (
  rawData: SummitApiResponse | { readonly data: unknown; readonly locale?: string },
  locale: string,
  fallback?: SummitData
): SummitData | undefined => {
  if (Array.isArray(rawData)) {
    const matchingItem = rawData.find(item => item.locale === locale) ?? rawData[0];
    if (matchingItem) {
      return matchingItem.data;
    }
  }
  if ('data' in rawData) {
    return rawData.data as SummitData;
  }
  return fallback;
};

const resolveSummitData = (
  rawData: SummitApiResponse | { readonly data: unknown; readonly locale?: string },
  locale: string
): SummitData => {
  const staticFallback = pickSummitData(summitStatic as SummitApiResponse, locale);
  const data = pickSummitData(rawData, locale, staticFallback);

  if (!data) {
    throw new Error(`Missing data for locale: ${locale}`);
  }

  return data;
};

export async function getSummitData(): Promise<SummitDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/summit.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as SummitApiResponse | { readonly data: unknown; readonly locale?: string };
      const locale = getLocaleForTesting();
      const data = resolveSummitData(rawData, locale);

      return {
        data,
        locale,
      };
    }

    // Online first
    const res = await fetch(`${API_BASE}/summit`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as SummitApiResponse | { readonly data: unknown; readonly locale?: string };
    const locale = getLocaleForTesting();
    const data = resolveSummitData(rawData, locale);

    return {
      data,
      locale,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/summit.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as SummitApiResponse | { readonly data: unknown; readonly locale?: string };
    const locale = getLocaleForTesting();
    const data = resolveSummitData(rawData, locale);

    return {
      data,
      locale,
    };
  }
}
