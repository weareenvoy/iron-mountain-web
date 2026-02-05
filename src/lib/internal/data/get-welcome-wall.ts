import { getLocaleForTesting, shouldUseStaticPlaceholderData } from '@/flags/flags';
import type { WelcomeWallApiResponse, WelcomeWallDataResponse } from '@/lib/internal/types';

export async function getWelcomeWallData(): Promise<WelcomeWallDataResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldUseStaticPlaceholderData()) {
      const res = await fetch('/api/welcome-wall.json', { cache: 'force-cache' });
      clearTimeout(timeout);
      const rawData = (await res.json()) as WelcomeWallApiResponse;
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

    // Online first
    const res = await fetch(`${API_BASE}/welcome_wall`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Bad status: ${res.status}`);
    const rawData = (await res.json()) as WelcomeWallApiResponse;
    const locale = getLocaleForTesting();
    const data = rawData.find(item => item.locale === locale)?.data;

    if (!data) {
      throw new Error(`Missing data for locale: ${locale}`);
    }

    return {
      data,
      locale,
    };
  } catch {
    clearTimeout(timeout);
    // Offline/static fallback
    const res = await fetch('/api/welcome-wall.json', { cache: 'force-cache' });
    const rawData = (await res.json()) as WelcomeWallApiResponse;
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
}
