import { IColumnSort } from '../types';


export class RiskSort implements IColumnSort {
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
    let emptyA = !a.risk;
    let emptyB = !b.risk;

    function getRiskValue(value: string) {
      let risk = (value || '').trim().toLowerCase();

      switch(risk) {
        case 'on track':
          return 3;
        case 'at risk':
          return 2;
        case 'not on track':
          return 1;
        default:
          return 4;
      }
    }

    if((emptyA && emptyB) || a.risk === b.risk) {
      sortResult = 0;
    } else {
      sortResult = emptyB || (getRiskValue(a.risk) < getRiskValue(b.risk))
        ? -1
        : 1;
    }

    return this.sortModifier * sortResult;
  }
}
