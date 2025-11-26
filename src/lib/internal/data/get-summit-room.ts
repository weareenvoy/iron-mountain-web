import { getLanguageOverride, shouldUseStaticPlaceholderData } from '@/flags/flags';
import { getDictionary } from '@/lib/internal/dictionaries';
import type { Dictionary, Locale, SummitRoomApiResponse, SummitRoomSlide } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getSummitRoomData(): Promise<{ dict: Dictionary; lang: Locale; slides: SummitRoomSlide[] }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/summit-room.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const data = (await res.json()) as SummitRoomApiResponse;
      const lang = getLanguageOverride();
      const dict = await getDictionary(lang);
      return {
        dict,
        lang,
        slides: data.slides,
      };
    }

    // Online first
    const res = await fetch(`${API_BASE}/summit-room`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as SummitRoomApiResponse;
    const lang = getLanguageOverride();
    const dict = await getDictionary(lang);

    return {
      dict,
      lang,
      slides: data.slides,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/summit-room.json', { cache: 'force-cache' });
    const data = (await res.json()) as SummitRoomApiResponse;
    const lang = getLanguageOverride();
    const dict = await getDictionary(lang);
    return {
      dict,
      lang,
      slides: data.slides,
    };
  }
}
