'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { getKioskData, type KioskFullData } from '@/lib/internal/data/get-kiosk';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

interface KioskContextType {
  data: KioskFullData | null;
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
  const [data, setData] = useState<KioskFullData | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  // Fetch kiosk content data
  const fetchData = useCallback(async () => {
    console.info(`Fetching ${kioskId} data`);
    setLoading(true);

    try {
      const kioskData = await getKioskData(kioskId);
      setData(kioskData.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error(`Error fetching ${kioskId} data:`, err);
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
