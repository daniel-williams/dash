import { Component, EventEmitter, Input } from '@angular/core';

import { ColumnSchema, PresenterType } from '../types';

@Component({
  selector: 'presenter',
  templateUrl: './presenter-host.component.html'
})
export class PresenterHost {
  @Input() schema: ColumnSchema;
  @Input() data: {[key: string]: any};

  private PresenterType: any = PresenterType;

  get getData(): string {
    if(this.data && this.schema) {
      return this.data[this.schema.key]
    } else {
      return '-';
    }
  }

  get getKey(): string {
    return this.schema && this.schema.key || '';
  }
}
