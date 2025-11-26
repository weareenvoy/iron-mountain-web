import { getLanguageOverride, shouldUseStaticPlaceholderData } from '@/flags/flags';
import { getDictionary } from '@/lib/internal/dictionaries';
import type { Dictionary, Locale, Tour, ToursApiResponse } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getTours(): Promise<{ dict: Dictionary; lang: Locale; tours: Tour[] }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500); // fail fast

  try {
    // If flag is on, prefer static JSON immediately.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/tours.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const data = (await res.json()) as ToursApiResponse;
      const lang = getLanguageOverride();
      const dict = await getDictionary(lang);
      return {
        dict,
        lang,
        tours: data.tours,
      };
    }

    // Online first
    const res = await fetch(`${API_BASE}/tours`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as ToursApiResponse;
    const lang = getLanguageOverride();
    const dict = await getDictionary(lang);

    // Optional: persist to IndexedDB/localStorage for richer offline
    return {
      dict,
      lang,
      tours: data.tours,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/tours.json', { cache: 'force-cache' });
    const data = (await res.json()) as ToursApiResponse;
    const lang = getLanguageOverride();
    const dict = await getDictionary(lang);
    return {
      dict,
      lang,
      tours: data.tours,
    };
  }
}
