import type { SailedResult } from '../scored-group';

/**
 * Convert a (possibly null) string to a numerical score x 10.
 *
 * @param text the displayed score.
 * @returns the score x 10.
 */
export const parseValue = (text: string | null): number => {
  if (text === null) return 0;
  return Math.round(parseFloat(text) * 10);
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

export const formatScore = (score: number) => (score / 10).toFixed(1);
