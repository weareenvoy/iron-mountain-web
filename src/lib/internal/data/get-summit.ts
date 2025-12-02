import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import { getDictionary } from '@/lib/internal/dictionaries';
import type { SummitData } from '@/app/(displays)/summit/_types';
import type { Dictionary, Locale } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const SUMMIT_STATIC_DATA_VERSION = '2024-12-02';
const SUMMIT_STATIC_ENDPOINT = `/api/summit.json?v=${SUMMIT_STATIC_DATA_VERSION}`;

type SummitApiResponse = {
  readonly data: SummitData;
  readonly locale: Locale;
};

const loadStaticSummitData = async (): Promise<{
  readonly data: SummitData;
  readonly dict: Dictionary;
  readonly locale: Locale;
}> => {
  const response = await fetch(SUMMIT_STATIC_ENDPOINT, { cache: 'force-cache' });
  const data = (await response.json()) as SummitData;
  const locale = getLocaleForTesting();
  const dict = await getDictionary(locale);
  return { data, dict, locale };
};

export const getSummitData = async (): Promise<{
  readonly data: SummitData;
  readonly dict: Dictionary;
  readonly locale: Locale;
}> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      clearTimeout(timeout);
      return await loadStaticSummitData();
    }

    const response = await fetch(`${API_BASE}/summit`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Bad status: ${response.status}`);
    const rawData = (await response.json()) as SummitApiResponse;
    const dict = await getDictionary(rawData.locale);
    return {
      data: rawData.data,
      dict,
      locale: rawData.locale,
    };
  } catch {
    clearTimeout(timeout);
    return await loadStaticSummitData();
  }
};
