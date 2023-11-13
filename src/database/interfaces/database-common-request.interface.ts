export interface IGetAllRowsFromTable {
  table: string;
  returningColumns?: string[];
}

export interface IDeleteRowFromTable {
  table: string;
  label: string;
  value: number;
}

export interface IGetRowsFromTable {
  table: string;
  label: string;
  value: number | string;
  additionalLabel?: string;
  additionalValue?: number | string;
  returningColumns?: string[];
}
