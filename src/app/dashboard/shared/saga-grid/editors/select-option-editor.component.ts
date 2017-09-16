import { Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';

import { IEditor } from '../types';

@Component({
  selector: 'select-option-editor',
  templateUrl: './select-option-editor.component.html',
  styleUrls: ['./select-option-editor.component.scss']
})
export class SelectOptionEditor implements IEditor {
  @Input() data: string;
  @Input() key: string;

  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();

  @ViewChild('selectElementRef') selectElementRef: ElementRef;

  private options: string[] = [];
  private selectedOption: string;

  constructor() { }

  ngOnInit() {
    // TODO djw: really dislike
    switch(this.key) {
      case 'measurableOutcomeDefined':
        this.options = measurableOutcomeDefined;
        break;
      case 'measurableOutcomeMet':
        this.options = measurableOutcomeMet;
        break;
      case 'scenarioValidation':
        this.options = scenarioValidation;
        break;
      case 'testCoverageExists':
        this.options = testCoverageExistsOptions;
        break;
      default:
        this.options = defaultOptions;
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.selectedOption = changes['data'].currentValue || '';
  }


  public triggerSave(): void {
    this.saveValue(this.selectElementRef.nativeElement.value);
  }

  saveValue(value: any) {
    this.save.emit(value);
  }

  public triggerCancel() {
    this.cancel.emit();
  }

}


const defaultOptions: string[] = [
  'default option',
];

const measurableOutcomeDefined: string[] = [
  'Not Applicable',
  'Yes',
  'No',
  'Not Graded',
  'Renew Grade',
];

const measurableOutcomeMet: string[] = [
  'Gray',
  'Red',
  'Yellow',
  'Green',
  'Not Graded',
  'Renew Grade',
];

const scenarioValidation: string[] = [
  'Gray',
  'Red',
  'Yellow',
  'Green',
  'Not Graded',
  'Renew Grade',
];

const testCoverageExistsOptions: string[] = [
  'Exists',
  'Does Not Exist',
  'Not Applicable',
];
