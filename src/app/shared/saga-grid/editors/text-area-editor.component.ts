import { Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';

import { IEditor, ColumnSchema } from '../types';

@Component({
  selector: 'text-area-editor',
  templateUrl: './text-area-editor.component.html',
  styleUrls: ['./text-area-editor.component.scss']
})
export class TextAreaEditor implements IEditor {
  @Input() data: string;
  @Input() schema: ColumnSchema;

  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();

  @ViewChild('textarea') textareaRef: ElementRef;

  private value: string;

  constructor() { }

  ngAfterViewInit() {
    if(this.textareaRef) {
      let el = this.textareaRef.nativeElement as HTMLTextAreaElement;
      el.focus();
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.value = changes['data'].currentValue || '';
  }

  public triggerSave(): void {
    this.onSave(this.textareaRef.nativeElement.value);
  }

  public triggerCancel(): void {
    this.cancel.emit();
  }

  onSave(value: any) {
    this.save.emit(value);
  }

  onCancel() {
    this.cancel.emit();
  }

}