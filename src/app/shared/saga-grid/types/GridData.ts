import { ColumnSchema } from './ColumnSchema';
import { IColumnSort } from './ColumnSort';
import { EditorType } from './EditorType';
import { PresenterType } from './PresenterType';
import { SortType } from './SortType';

import { AlphaSort, MeasurableOutcomesMetSort } from '../sorters';

export interface ISortInfo {
  order: number;
  asc: boolean;
}

export class GridData {
  private pristineData: any[]; // original
  private _rowData: any[]; // backing field for readonly prop

  public sorts: IColumnSort[] = [];

  constructor(data: any[]) {
    this.pristineData = data || [];
  }

  addSort(schema: ColumnSchema, event: MouseEvent): void {
    let sameSort = false;

    this.sorts.forEach(item => {
      // if sort exists, flip sort asc
      if(!sameSort && item.key === schema.key) {
        sameSort = true;
        item.asc = !item.asc;
      }
    });

    if(!sameSort) {
      if(event && event.ctrlKey) {
        // with control key, add sort
        this.sorts.push(this.getSorter(schema));
      } else {
        // replace existing sorts
        this.clearSorts();
        this.sorts.push(this.getSorter(schema));
      }
    }

    this.resort();
  }

  getSortOrderOf(key: string): number {
    for(let i = 0; i < this.sorts.length; i++) {
      if(this.sorts[i].key === key) {
        return i;
      }
    }
    return null;
  }

  getSortAscOf(key: string): boolean {
    for(let i = 0; i < this.sorts.length; i++) {
      if(this.sorts[i].key === key) {
        return this.sorts[i].asc;
      }
    }
    return null;
  }

  getSortIndex(key: string): number {
    for(let i = 0; i < this.sorts.length; i++) {
      if(this.sorts[i].key === key) {
        return i;
      }
    }

    return null;
  }

  isSortAsc(index: number): boolean {
    return index >= 0 && index < this.sorts.length
      ? this.sorts[index].asc
      : false;
  }

  private getSorter(schema: ColumnSchema): IColumnSort {
    switch(schema.sorter) {
      default:
        return new AlphaSort(schema.key);
    }
  }

  get rowData(): any[] {
    if(!this._rowData) {
      this.resort();
    }

    return this._rowData;
  }

  clearSorts(): void {
    this.sorts = [];
  }

  resort() {
    this._rowData = this.pristineData.sort((a, b) => {
      let res = 0;
      for(let i = 0; i < this.sorts.length; i++) {
        res = this.sorts[i].sort(a, b);
        if(res !== 0) { break; }
      }
      return res;
    });
  }

  update(row: any, key: string, value: any) {
    this.pristineData.forEach(item => {
      if(item.id === row.id) {
        item[key] = value;
      }
    });
    this.resort();
  }
}