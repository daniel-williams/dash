import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe {
  transform(content: string, length: number = 100, factor: number = 1): string {
    if(!content) { return; }
    
    let max = Math.floor(length * factor);
    let result = content.length > max - 2
      ? (content.substring(0, max - 2) + '...')
      : content;

    return result;
  }
}
