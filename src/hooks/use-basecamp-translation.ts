import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import en from '@/dictionaries/en.json';

export const useBasecampTranslation = () => {
  const { dict } = useBasecamp();

  // Fallback to default English dictionary if data is not yet loaded
  const t = dict ?? en;

  return { t };
};
