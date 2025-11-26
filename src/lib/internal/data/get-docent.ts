import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import { getDictionary } from '@/lib/internal/dictionaries';
import type { Dictionary, DocentApiResponse, DocentData, Locale } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getDocentData(): Promise<{ data: DocentData; dict: Dictionary; locale: Locale }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/docent.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as DocentApiResponse;
      const data = rawData.data;
      const locale = getLocaleForTesting();
      const dict = await getDictionary(locale);

      return {
        data,
        dict,
        locale,
      };
    }

    // Online first
    const res = await fetch(`${API_BASE}/docent`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as DocentApiResponse;
    const data = rawData.data;
    const locale = rawData.locale;
    const dict = await getDictionary(locale);

    return {
      data,
      dict,
      locale,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/docent.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as DocentApiResponse;
    const data = rawData.data;
    // Override locale with testing locale
    const locale = getLocaleForTesting();
    const dict = await getDictionary(locale);

    return {
      data,
      dict,
      locale,
    };
  }
}
