import { IColumnSort } from '../types';

export class AlphaSort implements IColumnSort {
  public key: string;
  public asc: boolean;

  constructor(key: string = '', asc: boolean = true) {
    this.key = key;
    this.asc = asc;
  }

  get sortModifier(): number {
    return this.asc ? 1 : -1;
  }

  sort(a: any, b: any): number {
    let sortResult: number = 0;
    let _a = a;
    let _b = b;

    if(typeof a === 'object' && !!this.key) {
      _a = a[this.key] || '';
      _b = b[this.key] || '';
    }
    let hasEmptyA = !_a;
    let hasEmptyB = !_b;

    if(hasEmptyA || hasEmptyB) {
      sortResult = hasEmptyA && hasEmptyB
        ? 0
        : hasEmptyA
          ? 1
          : -1;
    } else {
      sortResult = _a < _b
        ? -1
        : _a > _b
          ? 1
          : 0;
    }

    return this.sortModifier * sortResult;
  }
}
