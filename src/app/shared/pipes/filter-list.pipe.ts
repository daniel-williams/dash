import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterListPipe {
  transform(list: Array<string>, filter: string): Array<string> {
    return list.filter(item => item.toLowerCase().startsWith(filter.toLowerCase()));
  }
}
