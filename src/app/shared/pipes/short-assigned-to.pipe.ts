import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortAssignedTo'
})
export class ShortAssignedToPipe {
  transform(assignedTo: string): string {
    let result = assignedTo || '';
    if(result.indexOf('<') >= 0) {
      result = assignedTo.split('<')[0];
    }
    return result;
  }
}
