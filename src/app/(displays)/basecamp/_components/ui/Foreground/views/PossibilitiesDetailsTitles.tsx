'use client';

type Props = {
  readonly data: readonly string[];
};

// Animation timing constants
const BLOCK_DELAYS_MS = [2000, 3500, 5000] as const;
const WORD_STAGGER_MS = 100 as const;

// 3 blocks of text. First shows up in left, second in center, third in right

const PossibilitiesDetailsTitles = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex">
      {data.map((title, index) => {
        const baseDelay = BLOCK_DELAYS_MS[index] ?? 0;
        const titleWords = title.split(' ');

        return (
          <div
            className="flex flex-1 flex-col items-center justify-center font-geometria text-white"
            key={`${title}-${index}`}
          >
            <div className="text-center">
              {/* Title: word by word with small jump */}
              <div className="mt-10 w-150 text-center text-6xl tracking-[-5%]">
                {titleWords.map((word, i) => (
                  <span
                    className="animate-char-in inline-block"
                    key={i}
                    style={{ animationDelay: `${baseDelay + i * WORD_STAGGER_MS}ms` }}
                  >
                    {word}
                    {i < titleWords.length - 1 && '\u00A0'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PossibilitiesDetailsTitles;
