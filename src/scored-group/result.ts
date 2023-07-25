export const DNC = 'DNC';
export const DNQ = 'DNQ';

export type Result = SailedResult | NotSailedResult;

export interface NotSailedResult {
  element: HTMLElement;
  html: string;
  isNotSailed: true;
}

export interface SailedResult {
  element: HTMLElement;
  html: string;
  isDiscard: boolean;
  score: number;
  code: string | null;
}

const dncCodes = [DNC, 'OOD'];

export const cameToStartingArea = (code: string | null) => code === null || !dncCodes.includes(code);

/**
 * Check if a result is a sailed result.
 *
 * @param result The result to check.
 * @returns The result if sailed, otherwise false.
 */
export const checkIsSailedResult = (result: Result): SailedResult | false =>
  (result as unknown as NotSailedResult).isNotSailed === true
    ? false
    : (result as SailedResult);
