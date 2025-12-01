import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import { getDictionary } from '@/lib/internal/dictionaries';
import type { BasecampApiResponse, Dictionary } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getBasecampData(): Promise<BasecampApiResponse & { dict: Dictionary }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as BasecampApiResponse;
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
    const res = await fetch(`${API_BASE}/basecamp`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as BasecampApiResponse;
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
    const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as BasecampApiResponse;
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
