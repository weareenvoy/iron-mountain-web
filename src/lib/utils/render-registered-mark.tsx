import { normalizeNewlines } from './normalize-newlines';
import type { ReactNode } from 'react';

// This file renders the registered mark (Ⓡ) for text content with the intended styles.

const REGISTERED_SYMBOL_REGEX = /(\(R\)|\(r\)|[Ⓡ®])/g;

export const renderRegisteredMark = (text?: string): ReactNode => {
  const stringValue = text ?? '';
  if (!stringValue) {
    return '';
  }

  const normalized = normalizeNewlines(stringValue);

  const matches = [...normalized.matchAll(REGISTERED_SYMBOL_REGEX)];
  if (matches.length === 0) {
    return normalized;
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const matchIndex = typeof match.index === 'number' ? match.index : 0;
    if (matchIndex > lastIndex) {
      parts.push(normalized.slice(lastIndex, matchIndex));
    }
    const symbol = match[0].toUpperCase() === '(R)' ? 'Ⓡ' : match[0];
    parts.push(
      <span
        className="inline-block align-text-top text-[0.66em] leading-none"
        key={`registered-mark-${matchIndex}-${index}`}
      >
        {symbol}
      </span>
    );
    lastIndex = matchIndex + match[0].length;
  });

  if (lastIndex < normalized.length) {
    parts.push(normalized.slice(lastIndex));
  }

  return <>{parts}</>;
};

export default renderRegisteredMark;
