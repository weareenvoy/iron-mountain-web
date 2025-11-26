import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import en from '@/dictionaries/en.json';

export const useBasecampTranslation = () => {
  const { data } = useBasecamp();

  // Fallback to default English dictionary if data is not yet loaded
  const t = data?.dict ?? en;

  return { t };
};
