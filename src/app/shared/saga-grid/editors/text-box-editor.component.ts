import { Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';

import { IEditor } from '../types';

@Component({
  selector: 'text-box-editor',
  templateUrl: './text-box-editor.component.html',
  styleUrls: ['./text-box-editor.component.scss']
})
export class TextBoxEditor implements IEditor {
  @Input() data: string;

  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();

  @ViewChild('textbox') textboxRef: ElementRef;

  private value: string;

  constructor() { }

  ngAfterViewInit() {
    if(this.textboxRef) {
      let el = this.textboxRef.nativeElement as HTMLInputElement;
      el.focus();
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.value = changes['data'].currentValue || '';
  }

  onSave(value: any) {
    this.save.emit(value);
  }

  onCancel() {
    this.cancel.emit();
  }

}