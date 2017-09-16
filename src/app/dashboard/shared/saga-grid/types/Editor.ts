import { EventEmitter } from '@angular/core';

export interface IEditor {
  data: any;
  save: EventEmitter<any>;
  cancel: EventEmitter<any>;
}