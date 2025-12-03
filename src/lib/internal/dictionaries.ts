import type { Dictionary } from '@/lib/internal/types';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('../../dictionaries/en.json').then(module => module.default as Dictionary),
  pt: () => import('../../dictionaries/pt.json').then(module => module.default as Dictionary),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] ?? dictionaries['en'];

  if (!loadDictionary) {
    // Should never happen due to fallback, but satisfies TS if it worries about undefined
    return dictionaries['en']!();
  }

  return loadDictionary();
};
