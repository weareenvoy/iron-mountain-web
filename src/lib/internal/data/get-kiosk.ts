import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { KioskApiResponse, KioskDataResponse } from '@/lib/internal/types';

export async function getKioskData(kioskId: KioskId): Promise<KioskDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  let controllerUsed = false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      clearTimeout(timeout);
      // Controller not used - early return with static data
      const res = await fetch(`/api/${kioskId}.json`, { cache: 'force-cache' });
      const rawData = (await res.json()) as KioskApiResponse;
      const locale = getLocaleForTesting();
      const data = rawData.find(item => item.locale === locale)?.data;

      if (!data) {
        throw new Error(`Missing data for locale: ${locale}`);
      }

      return {
        data,
        locale,
      };
    }

    // Mark that controller is being used for API fetch
    controllerUsed = true;
    const res = await fetch(`${API_BASE}/${kioskId}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as KioskApiResponse;
    const locale = getLocaleForTesting();
    const data = rawData.find(item => item.locale === locale)?.data;

    if (!data) {
      throw new Error(`Missing data for locale: ${locale}`);
    }

    return {
      data,
      locale,
    };
  } catch (originalError) {
    clearTimeout(timeout);

    // Log original error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error(`Failed to fetch ${kioskId} from API:`, originalError);
    }

    // Offline/static fallback
    try {
      const res = await fetch(`/api/${kioskId}.json`, { cache: 'force-cache' });
      const rawData = (await res.json()) as KioskApiResponse;
      const locale = getLocaleForTesting();
      const data = rawData.find(item => item.locale === locale)?.data;

      if (!data) {
        throw new Error(`Missing data for locale: ${locale}`);
      }

      return {
        data,
        locale,
      };
    } catch (fallbackError) {
      // Both API and static fallback failed - provide detailed error
      if (process.env.NODE_ENV === 'development') {
        console.error(`Failed to fetch ${kioskId} from static fallback:`, fallbackError);
      }
      const originalMsg = originalError instanceof Error ? originalError.message : 'Unknown error';
      const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
      throw new Error(
        `Unable to load kiosk data for ${kioskId}. API error: ${originalMsg}. Fallback error: ${fallbackMsg}`
      );
    }
  } finally {
    // Only abort if controller was actually used
    if (controllerUsed) {
      controller.abort();
    }
  }
}
