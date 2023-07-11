export type BoatResult = BoatSailedResult | BoatNotSailedResult;

export interface BoatNotSailedResult {
  element: HTMLElement;
  html: string;
  isNotSailed: true;
}

export interface BoatSailedResult {
  element: HTMLElement;
  html: string;
  isCts: boolean;
  isDiscard: boolean;
  score: number;
  code: string | null;
}

export class Boat {
  // The finishing rank.
  rank: number | 'DNQ';
  // The net series score as a number x 10.
  net: number;
  // The total series score as a number x 10.
  total: number;

  elements: {
    rank?: Element;
    net?: Element;
    total?: Element;
  };

  races: BoatResult[];

  constructor(partial: Partial<Boat>) {
    this.rank = partial.rank ?? 'DNQ';
    this.elements = partial.elements ?? {};
    this.net = partial.net ?? Infinity;
    this.total = partial.total ?? Infinity;
    this.races = partial.races ?? [];
  }
}
