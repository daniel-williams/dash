import { IColumnSort } from '../types';

export class MeasurableOutcomesMetSort implements IColumnSort {
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
    let getValue = function(value: string) {
      let val = (value || '').trim().toLowerCase();

      switch(val) {
        case 'red':
          return 1;
        case 'yellow':
          return 2;
        case 'green':
          return 3;
        case 'gray':
          return 4;
        case 'not graded':
          return 5;
        case 'renew grade':
          return 6;
        default:
          return 7;
      }
    }

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
      sortResult = getValue(_a) < getValue(_b)
        ? -1
        : getValue(_a) > getValue(_b)
          ? 1
          : 0;
    }

    return this.sortModifier * sortResult;
  }

  
}