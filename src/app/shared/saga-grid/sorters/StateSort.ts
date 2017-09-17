import { IColumnSort } from '../types';


export class StateSort implements IColumnSort {
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
    let emptyA = !a.state;
    let emptyB = !b.state;

    function getStateValue(value: string) {
      let state = (value || '').trim().toLowerCase();

      switch(state) {
        case 'proposed':
          return 1;
        case 'committed':
          return 2;
        case 'started':
          return 3;
        case 'completed':
          return 4;
        default:
          return 5;
      }
    }

    if((emptyA && emptyB) || a.state === b.state) {
      sortResult = 0;
    } else {
      sortResult = emptyB || (getStateValue(a.state) < getStateValue(b.state))
        ? -1
        : 1;
    }

    return this.sortModifier * sortResult;
  }
}
