import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'confidence'
})
export class ConfidencePipe {
  transform(tags: Array<string>): string {
    if(!tags || !tags.length) { return ''; }

    let confidence = ConfidenceLevel.UNKNOWN;

    tags.forEach(tag => {
      let t = tag.toLowerCase();

      if(t.startsWith('edgeconf:')) {
        switch(t.slice(9)) {
          case 'low':
            confidence = ConfidenceLevel.LOW;
            break;
          case 'med':
            confidence = ConfidenceLevel.MED;
            break;
          case 'high':
            confidence = ConfidenceLevel.HIGH;
            break;
        }
      }
    });
    return confidence.toString();
  }
}

enum ConfidenceLevel {
  UNKNOWN = <any>"",
  LOW = <any>"Low",
  MED = <any>"Med",
  HIGH = <any>"High"
}
