import type { SailedResult } from '../scored-group';

/**
 * Convert a (possibly null) string to a numerical score.
 *
 * @param text the displayed score.
 * @returns the score.
 */
export const parseValue = (text: string | null): number => {
  return text === null ? 0 : parseFloat(text);
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
