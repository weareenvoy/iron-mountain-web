import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { DocentApiResponse, DocentData } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getDocentData(): Promise<{ data: DocentData }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/docent.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as DocentApiResponse;
      const data = rawData.data;

      return {
        data,
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

    return {
      data,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/docent.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as DocentApiResponse;
    const data = rawData.data;

    return {
      data,
    };
  }
}
