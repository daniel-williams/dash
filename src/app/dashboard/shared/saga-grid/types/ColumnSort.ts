export interface IColumnSort {
  key: string;
  asc: boolean;
  sort: (a: any, b: any) => number;
}