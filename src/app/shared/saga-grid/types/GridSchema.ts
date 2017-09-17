import { ColumnSchema } from './ColumnSchema';
import { IColumnSort } from './ColumnSort';

export class GridSchema {
  private _visibleColumnSchemas: ColumnSchema[] = null;
  private orderedKeys: string[] = [];

  public readonly collapsibleColumnSchemas: ColumnSchema[];
  public columns: {[key: string]: ColumnSchema} = {};

  constructor(columnSchemas: ColumnSchema[] = []) {
    columnSchemas.slice().forEach(item => {
      this.orderedKeys.push(item.key);
      this.columns[item.key] = item;
    });
    this.collapsibleColumnSchemas = this.orderedKeys.map(key => this.columns[key]).filter(item => item.isCollapsible);
  }

  get keys(): string[] {
    return this.orderedKeys;
  }

  get count(): number {
    return this.orderedKeys.length;
  }

  get columnSchemas(): ColumnSchema[] {
    return this.orderedKeys.map(key => this.columns[key]);
  }

  get visibleColumnSchemas(): ColumnSchema[] {
    if(this._visibleColumnSchemas === null) {
      this._visibleColumnSchemas = this.orderedKeys.map(key => this.columns[key]).filter(item => item.visible);
    }
    return this._visibleColumnSchemas;
  }

  get visibleColumnCount(): number {
    return this.visibleColumnSchemas.length;
  }

  toggleVisibility(key: string): void {
    let column = this.columns[key];
    if(column) {
      column.visible = !column.visible;
      this._visibleColumnSchemas = null;
    }
  }

  updateSorts(sorts: IColumnSort[] = []) {
    this.columnSchemas.forEach(x => {
      x['sortOrder'] = undefined;
      x['sortAsc'] = undefined;
    });

    sorts.forEach((sort, index) => {
      this.columnSchemas.forEach(x => {
        if(x.key === sort.key) {
          x['sortOrder'] = index + 1;
          x['sortAsc'] = sort.asc;
        }
      });
    });
  }
}
