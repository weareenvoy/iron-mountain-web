'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { getKioskData } from '@/lib/internal/data/get-kiosk';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { KioskData } from '@/lib/internal/types';

// This file is used to access data from the Kiosk Provider and make it available to components in the Kiosk setup.

interface KioskContextType {
  data: KioskData | null;
  error: null | string;
  kioskId: KioskId;
  loading: boolean;
  refetch: () => Promise<boolean>;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};

type KioskProviderProps = PropsWithChildren<{
  readonly kioskId: KioskId;
}>;

export const KioskProvider = ({ children, kioskId }: KioskProviderProps) => {
  const [data, setData] = useState<KioskData | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  // Fetch kiosk content data
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const kioskData = await getKioskData(kioskId);
      setData(kioskData.data);
      setError(null);
      return true;
    } catch (err) {
      // TODO: Replace with proper logging service (DataDog, Sentry, etc.)
      // For now, errors are tracked via the error state and can be logged at a higher level
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [kioskId]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contextValue = useMemo<KioskContextType>(
    () => ({
      data,
      error,
      kioskId,
      loading,
      refetch: fetchData,
    }),
    [data, error, fetchData, kioskId, loading]
  );

  return <KioskContext.Provider value={contextValue}>{children}</KioskContext.Provider>;
};

export default KioskProvider;
