import summitStatic from '@public/api/summit.json';
import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { SummitApiResponse, SummitDataResponse } from '@/lib/internal/types';

const hasMinimumSummitFields = (data: null | Partial<SummitDataResponse['data']> | undefined) => {
  if (!data?.basecamp || !data.overlook || !data.kiosk1 || !data.kiosk2 || !data.kiosk3) return false;

  const basecamp = data.basecamp as Partial<SummitDataResponse['data']['basecamp']>;
  const kiosk1 = data.kiosk1 as Partial<SummitDataResponse['data']['kiosk1']>;
  const kiosk2 = data.kiosk2 as Partial<SummitDataResponse['data']['kiosk2']>;
  const kiosk3 = data.kiosk3 as Partial<SummitDataResponse['data']['kiosk3']>;

  const hasProblem1 = Boolean(basecamp.problem1?.title);
  const hasProblem2 = Array.isArray(basecamp.problem2) && basecamp.problem2.length > 0;
  const challenges = basecamp.problem3?.challenges;
  const hasProblem3 = Array.isArray(challenges) && challenges.length > 0;
  const hasKiosks = Boolean(kiosk1.ambient && kiosk2.ambient && kiosk3.ambient);
  const hasSlides = Array.isArray(data.summitSlides) && data.summitSlides.length > 0;

  return hasProblem1 && hasProblem2 && hasProblem3 && hasKiosks && hasSlides;
};

const pickSummitData = (
  rawData: SummitApiResponse | { readonly data: unknown; readonly locale?: string },
  locale: string,
  fallback?: SummitDataResponse['data']
) => {
  if (Array.isArray(rawData)) {
    const matchingData = rawData.find(item => item.locale === locale)?.data ?? rawData[0]?.data;
    if (matchingData) {
      return matchingData;
    }
  }
  if ('data' in rawData) {
    return rawData.data as SummitDataResponse['data'];
  }
  return fallback;
};

const resolveSummitData = (
  rawData: SummitApiResponse | { readonly data: unknown; readonly locale?: string },
  locale: string
) => {
  const staticFallback = pickSummitData(summitStatic as SummitApiResponse, locale);
  const data = pickSummitData(rawData, locale, staticFallback);

  if (!data) {
    throw new Error(`Missing data for locale: ${locale}`);
  }

  if (!hasMinimumSummitFields(data) && hasMinimumSummitFields(staticFallback)) {
    return staticFallback!;
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
