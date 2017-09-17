import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SelectOption } from '../../shared/types';

@Component({
  selector: 'forms-select',
  templateUrl: './forms-select.component.html',
})
export class FormsSelect {
  @Input() selectedOption: SelectOption;
  @Input() options: SelectOption[] = [];
  @Input() disabled: boolean = false;

  @Output() optionChange: EventEmitter<SelectOption> = new EventEmitter<SelectOption>();

  onChange(selectedItem: any) {
    this.selectedOption = selectedItem;
    this.optionChange.emit(this.selectedOption);
  }
}
