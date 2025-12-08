import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { DocentApiResponse, DocentDataResponse } from '@/lib/internal/types';

export async function getDocentData(): Promise<DocentDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/docent.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as DocentApiResponse;
      const enData = rawData.find(item => item.locale === 'en')?.data;
      const ptData = rawData.find(item => item.locale === 'pt')?.data;

      if (!enData || !ptData) {
        throw new Error('Missing required locale data in docent response');
      }

      return {
        data: {
          en: enData,
          pt: ptData,
        },
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
    const enData = rawData.find(item => item.locale === 'en')?.data;
    const ptData = rawData.find(item => item.locale === 'pt')?.data;

    if (!enData || !ptData) {
      throw new Error('Missing required locale data in docent response');
    }

    return {
      data: {
        en: enData,
        pt: ptData,
      },
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/docent.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as DocentApiResponse;
    const enData = rawData.find(item => item.locale === 'en')?.data;
    const ptData = rawData.find(item => item.locale === 'pt')?.data;

    if (!enData || !ptData) {
      throw new Error('Missing required locale data in docent response');
    }

    return {
      data: {
        en: enData,
        pt: ptData,
      },
    };
  }
}
