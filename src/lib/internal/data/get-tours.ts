import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { Tour } from '@/lib/internal/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getTours(): Promise<Tour[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500); // fail fast

  try {
    // If flag is on, prefer static JSON immediately.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/tours.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      return (await res.json()) as Tour[];
    }

    // Online first
    const res = await fetch(`${API_BASE}/tours`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as Tour[];

    // Optional: persist to IndexedDB/localStorage for richer offline
    return data;
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/tours.json', { cache: 'force-cache' });
    return (await res.json()) as Tour[];
  }
}
