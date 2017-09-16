import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'url'
})
export class UrlPipe {
  transform(url: string): string {
    let urlStart = url.indexOf('http');

    if(urlStart >= 0) {
      url = encodeURI(url.substring(urlStart));
    } else {
      url = '#';
    }

    return url;
  }
}
