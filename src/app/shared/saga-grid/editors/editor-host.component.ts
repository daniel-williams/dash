import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ColumnSchema, EditorType } from '../types';
import { TextAreaEditor } from './text-area-editor.component';
import { SelectOptionEditor } from './select-option-editor.component';
import { TextBoxEditor } from './text-box-editor.component';

@Component({
  selector: 'editor',
  templateUrl: './editor-host.component.html'
})
export class EditorHost {
  @Input() schema: ColumnSchema;
  @Input() data: {[key: string]: any};

  @Input() trigger: any;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter();

  @ViewChild('textAreaEditor') textAreaEditor: TextAreaEditor;
  @ViewChild('selectOptionEditor') selectOptionEditor: SelectOptionEditor;
  @ViewChild('textBoxEditor') textBoxEditor: TextBoxEditor;

  private EditorType: any = EditorType;

  ngOnChanges(changes: SimpleChanges) {
    if(changes['trigger']) {
      if(!changes['trigger'].currentValue.trigger) {
        changes['trigger'].currentValue.trigger = {};
      }
      changes['trigger'].currentValue.trigger.editorCancel = this.editorCancel.bind(this);
      changes['trigger'].currentValue.trigger.editorSave = this.editorSave.bind(this);
    }
  }

  editorCancel() {
    if(this.textAreaEditor !== null) {
      this.textAreaEditor.triggerCancel();
    }
  }

  editorSave() {
    if(this.textAreaEditor !== null) {
      this.textAreaEditor.triggerSave();
    }
  }

  get getData(): string {
    if(this.data && this.schema) {
      return this.data[this.schema.key]
    } else {
      return '-';
    }
  }

  onSave(value: any) {
    this.save.emit(value);
  }
  onCancel() {
    this.cancel.emit();
  }
}