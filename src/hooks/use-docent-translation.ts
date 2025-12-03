import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import en from '@/dictionaries/en.json';

export const useDocentTranslation = () => {
  const { dict } = useDocent();

  // Fallback to default English dictionary if not yet loaded
  const t = dict ?? en;

  return { t };
};
