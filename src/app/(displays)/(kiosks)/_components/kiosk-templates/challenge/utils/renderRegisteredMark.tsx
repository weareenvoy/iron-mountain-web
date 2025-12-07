import type { ReactNode } from 'react';

const REGISTERED_SYMBOL_REGEX = /[Ⓡ®]/g;

type TextValue = string | string[] | undefined;

const toText = (value: TextValue) => {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  return value ?? '';
};

const normalizeNewlines = (input: string) => input.replace(/\\\\n/g, '\n').replace(/\r?\n/g, '\n');

export const renderRegisteredMark = (text?: string | string[]): ReactNode => {
  const stringValue = toText(text);
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
    parts.push(
      <span className="registered-mark" key={`registered-mark-${matchIndex}-${index}`}>
        {match[0]}
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
