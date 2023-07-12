export type Column =
  | RankColumn
  | TotalScoreColumn
  | NetScoreColumn
  | RaceColumn
  | LabelColumn;

export interface RankColumn {
  type: 'rank';
}
export interface TotalScoreColumn {
  type: 'total';
}
export interface NetScoreColumn {
  type: 'nett';
}
export interface RaceColumn {
  type: 'race';
  index: number;
}
export interface LabelColumn {
  type: 'label';
  name: string;
}
