import { Pipe, PipeTransform } from '@angular/core';

import { Sort } from '../services/vso';

@Pipe({
  name: 'sort'
})
export class SortOnPipe {
  transform(list: Array<any>, sortOn: string = '', asc: boolean = true): Array<any> {
    if(!list || !sortOn) { return list; }

    let order = asc === true ? 1 : -1;

    return list.sort((a, b) => {
      let result: any;
      let hasEmptyA = !a[sortOn];
      let hasEmptyB = !b[sortOn];

      if(hasEmptyA || hasEmptyB) {
        result = hasEmptyA && hasEmptyB
          ? 0
          : hasEmptyA
            ? order * 1
            : order * -1;
      } else {
        result = a[sortOn] < b[sortOn]
          ? order * -1
          : b[sortOn] < a[sortOn]
            ? order * 1
            : 0;
      }

      return result;
    });
  }
}
