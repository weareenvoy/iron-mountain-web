import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { BasecampApiResponse, BasecampData, BasecampDataResponse } from '@/lib/internal/types';

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
      const locale = getLocaleForTesting();
      const data = rawData.find(item => item.locale === locale)?.data;

      if (!data) {
        throw new Error(`Missing data for locale: ${locale}`);
      }

      validateBasecampData(data);

      return {
        data,
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
    const locale = getLocaleForTesting();
    const data = rawData.find(item => item.locale === locale)?.data;

    if (!data) {
      throw new Error(`Missing data for locale: ${locale}`);
    }

    validateBasecampData(data);

    return {
      data,
      locale,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as BasecampApiResponse;
    const locale = getLocaleForTesting();
    const data = rawData.find(item => item.locale === locale)?.data;

    if (!data) {
      throw new Error(`Missing data for locale: ${locale}`);
    }

    validateBasecampData(data);

    return {
      data,
      locale,
    };
  }
}

// Validates that required fields (music, sfx) are present in BasecampData.
function validateBasecampData(data: BasecampData): void {
  if (!data.music) {
    throw new Error('[basecamp] Missing music data. Populate CMS.');
  }
  if (!data.sfx) {
    throw new Error('[basecamp] Missing sfx data. Populate CMS.');
  }
}
