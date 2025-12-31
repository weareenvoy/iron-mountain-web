import summitToursStatic from '@public/api/summit-tours.json';
import { shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { SummitTourSummary } from '@/lib/internal/types';

export async function getSummitTours(): Promise<readonly SummitTourSummary[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  let controllerUsed = false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      clearTimeout(timeout);
      // No need to abort controller - it was never used
      return summitToursStatic as readonly SummitTourSummary[];
    }

    controllerUsed = true;
    const res = await fetch('/api/summit-tours.json', { cache: 'force-cache', signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const data = (await res.json()) as readonly SummitTourSummary[];

    return data;
  } catch {
    clearTimeout(timeout);

    return summitToursStatic as readonly SummitTourSummary[];
  } finally {
    // Only abort if controller was actually used (not on early return)
    if (controllerUsed) {
      controller.abort();
    }
  }
}
