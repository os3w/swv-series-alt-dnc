import type { SailedResult } from '../results';

/**
 * Convert a (possibly null) string to a numerical score.
 *
 * @param text the displayed score.
 * @returns the score.
 */
export const parseValue = (text: string | null): number => {
  return text === null ? 0 : parseFloat(text);
};

export const formatOrdinal = (n: number): string => {
  let ordinal = 'th';
  switch (n % 10) {
    case 1:
      if (n % 100 !== 11) ordinal = 'st';
      break;
    case 2:
      if (n % 100 !== 12) ordinal = 'nd';
      break;
    case 3:
      if (n % 100 !== 13) ordinal = 'rd';
      break;
  }
  return n + ordinal;
};

/**
 *
 * @param result
 */
export const formatSailedResult = ({
  code,
  isDiscard,
  score,
}: SailedResult) => {
  // Sailwave Effects import breaks on template strings so don't use them.
  // const text = code ? `${formatScore(score)} ${code}` : formatScore(score);
  // return isDiscard ? `(${text})` : text;
  const text = code ? formatScore(score) + ' ' + code : formatScore(score);
  return isDiscard ? '(' + text + ')' : text;
};

export const formatScore = (score: number) => score.toFixed(1);
