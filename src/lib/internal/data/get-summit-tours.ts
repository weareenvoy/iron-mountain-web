import summitToursStatic from '@public/api/summit-tours.json';
import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { SummitTourSummary } from '@/lib/internal/types';

export async function getSummitTours(): Promise<readonly SummitTourSummary[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      clearTimeout(timeout);
      return summitToursStatic as readonly SummitTourSummary[];
    }

    const res = await fetch('/api/summit-tours.json', { cache: 'force-cache', signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as readonly SummitTourSummary[];
    return data;
  } catch {
    clearTimeout(timeout);
    return summitToursStatic as readonly SummitTourSummary[];
  }
}
