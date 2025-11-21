import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { BasecampData } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getBasecampData(): Promise<BasecampData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      return (await res.json()) as BasecampData;
    }

    const res = await fetch(`${API_BASE}/basecamp`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as BasecampData;
    return data;
  } catch {
    clearTimeout(timeout);
    const res = await fetch('/api/basecamp.json', { cache: 'force-cache' });
    return (await res.json()) as BasecampData;
  }
}
