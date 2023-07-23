export interface ComparableResult {
  score: number;
}

export interface ComparableResults {
  net: number;
  results: ComparableResult[];
}

/**
 * Get the indexes of scores to discard.
 *
 * The indexes are in order of applying the discard algorithm so the index of
 * the highest value is returned first; for equal values the earlier index is
 * returned first.
 *
 * @param scores
 * @param number
 * @returns
 */
export const getDiscardIndexes = (
  scores: number[],
  number: number,
): number[] => {
  if (number < 1) return [];

  // Sort the scores so we know what to discard.
  const sorted = scores.slice().sort((a: number, b: number) => a - b);
  const scoresToDiscard = sorted.slice(-number).reverse();
  const discards = [];

  let lastScore = NaN;
  let lastIndex = NaN;
  for (const score of scoresToDiscard) {
    if (score === lastScore) {
      lastIndex = scores.indexOf(score, lastIndex + 1);
      discards.push(lastIndex);
    } else {
      lastIndex = scores.indexOf(score);
      lastScore = score;
      discards.push(lastIndex);
    }
  }
  return discards;
};
