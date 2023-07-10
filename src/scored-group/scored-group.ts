type GroupResultsTable = {
  columns: unknown;
};

export class ScoredGroup {
  caption: string;
  table: GroupResultsTable;
  id: string | null;
  title: string;

  constructor(partial: Partial<ScoredGroup>) {
    this.id = partial.id ?? null;
    this.caption = partial.caption ?? '';
    this.table = partial.table ?? ({ columns: [] } as GroupResultsTable);
    this.title = partial.title ?? '';
  }
}
