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

  races: unknown[];
  constructor(partial: Partial<Boat>) {
    this.rank = partial.rank ?? 'DNQ';
    this.elements = partial.elements ?? {};
    this.net = partial.net ?? Infinity;
    this.total = partial.total ?? Infinity;
    this.races = partial.races ?? [];
  }
}
