import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { KioskApiResponse, KioskDataResponse } from '@/lib/internal/types';

export async function getKioskData(kioskId: KioskId, externalSignal?: AbortSignal): Promise<KioskDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  // Create internal controller for timeout, but respect external signal
  const internalController = new AbortController();
  const timeout = setTimeout(() => internalController.abort(), 3500);

  // Combine external and internal signals
  const combinedSignal = externalSignal
    ? AbortSignal.any([externalSignal, internalController.signal])
    : internalController.signal;

  try {
    const locale = getLocaleForTesting();

    // Kick off simplCMS fetch concurrently with the combined signal
    const simplCMSPromise = getSimplCMSData(combinedSignal);

    const fetchStatic = async (): Promise<KioskApiResponse> => {
      const res = await fetch(`/api/${kioskId}.json`, { cache: 'force-cache', signal: combinedSignal });
      if (!res.ok) throw new Error(`Bad status: ${res.status}`);
      return (await res.json()) as KioskApiResponse;
    };

    const fetchApi = async (): Promise<KioskApiResponse> => {
      const res = await fetch(`${API_BASE}/${kioskId}`, { cache: 'no-store', signal: combinedSignal });
      if (!res.ok) throw new Error(`Bad status: ${res.status}`);
      return (await res.json()) as KioskApiResponse;
    };

    // Primary path: honor placeholder mode (static). Otherwise prefer API.
    let rawData: KioskApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      rawData = await fetchStatic();
    } else {
      try {
        const apiResponse = await fetchApi();
        // Handle both array and object responses from API
        // API might return object directly, but static files are arrays
        rawData = Array.isArray(apiResponse) ? apiResponse : [apiResponse];
      } catch (originalError) {
        // If externally aborted (user cancelled or newer request), skip fallback.
        if (externalSignal?.aborted) {
          throw originalError;
        }

        // Timeout/transport fallback to static JSON.
        rawData = await fetchStatic();
      }
    }

    const data = rawData.find(item => item.locale === locale)?.data;
    if (!data) throw new Error(`Missing data for locale: ${locale}`);

    const simplCMSData = await simplCMSPromise;

    return {
      data: {
        ...data,
        // Use API audio, not simplCMS audio
        customInteractive1: simplCMSData.customInteractive1 ?? data.customInteractive1,
        customInteractive2: simplCMSData.customInteractive2 ?? data.customInteractive2,
        customInteractive3: simplCMSData.customInteractive3 ?? data.customInteractive3,
      },
      locale,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetches centralized custom interactive data from simplCMS
 */
async function getSimplCMSData(signal?: AbortSignal): Promise<Record<string, unknown>> {
  try {
    const res = await fetch('/api/kiosk-simplCMS.json', { cache: 'force-cache', signal });
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as Array<Record<string, unknown>>;
    return rawData[0] ?? {};
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch simplCMS data:', error);
    }
    return {};
  }
}
