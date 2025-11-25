import type { SummitData } from '@/app/(displays)/summit/_types';
import { shouldUseStaticPlaceholderData } from '@/flags/flags';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const SUMMIT_STATIC_DATA_VERSION = '2024-11-23-02';
const SUMMIT_STATIC_ENDPOINT = `/api/summit.json?v=${SUMMIT_STATIC_DATA_VERSION}`;

export const getSummitData = async (): Promise<SummitData> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    if (shouldUseStaticPlaceholderData()) {
      const response = await fetch(SUMMIT_STATIC_ENDPOINT, { cache: 'force-cache' });
      clearTimeout(timeout);
      return (await response.json()) as SummitData;
    }

    const response = await fetch(`${API_BASE}/summit`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Bad status: ${response.status}`);
    return (await response.json()) as SummitData;
  } catch {
    clearTimeout(timeout);
    const response = await fetch(SUMMIT_STATIC_ENDPOINT, { cache: 'force-cache' });
    return (await response.json()) as SummitData;
  }
};
