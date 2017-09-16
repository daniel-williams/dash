import {
  Component,
  Pipe,
  OnInit,
  DoCheck,
  HostListener,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  forwardRef,
  IterableDiffers,
  PipeTransform
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl } from '@angular/forms';

import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts } from './multi-select-dropdown.types';

const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectDropdown),
  multi: true
};

const DEFAULT_SETTINGS: IMultiSelectSettings = {
  pullRight: false,
  enableSearch: false,
  checkedStyle: 'checkboxes',
  buttonClasses: 'btn btn-default btn-secondary',
  selectionLimit: 0,
  closeOnSelect: false,
  autoUnselect: false,
  showCheckAll: false,
  showUncheckAll: false,
  dynamicTitleMaxItems: 3,
  maxHeight: '300px',
};

const DEFAULT_TEXTS: IMultiSelectTexts = {
  checkAll: 'Check all',
  uncheckAll: 'Uncheck all',
  checked: 'checked',
  checkedPlural: 'checked',
  searchPlaceholder: 'Search...',
  defaultTitle: 'Select',
  allSelected: 'All selected',
};

@Component({
  selector: 'multiselect-dropdown',
  providers: [MULTISELECT_VALUE_ACCESSOR],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
})
export class MultiselectDropdown implements OnInit, DoCheck, ControlValueAccessor, Validator {
  @Input() options: Array<IMultiSelectOption>;
  @Input() settings: IMultiSelectSettings;
  @Input() texts: IMultiSelectTexts;
  @Input() disabled: boolean = false;

  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  @Output() onRemoved = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
    onDocumentClick(target: HTMLElement) {
      let parentFound = false;
      while (target != null && !parentFound) {
        if (target === this.element.nativeElement) {
          parentFound = true;
        }
        target = target.parentElement;
      }
      if (!parentFound) {
        this.isVisible = false;
        this.dropdownClosed.emit();
      }
    }


  private differ: any;
  private isVisible: boolean = false;
  private model: number[];
  private numSelected: number = 0;
  private searchFilterText: string = '';
  private title: string;


  constructor(private element: ElementRef, differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  getItemStyle(option: IMultiSelectOption): any {
    if (!option.isLabel) {
      return {'cursor': 'pointer'};
    }
  }

  ngOnInit() {
    this.settings = Object.assign(DEFAULT_SETTINGS, this.settings);
    this.texts = Object.assign(DEFAULT_TEXTS, this.texts);
    this.title = this.texts.defaultTitle || '';
  }

  onModelChange: Function = (_: any) => {};
  onModelTouched: Function = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  validate(c: AbstractControl): { [key: string]: any; } {
    return (this.model && this.model.length) ? null : {
      required: {
        valid: false,
      },
    };
  }

  registerOnValidatorChange(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchFilterText = '';
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.dropdownClosed.emit();
    }
  }

  isSelected(option: IMultiSelectOption): boolean {
    return this.model && this.model.indexOf(option.id) > -1;
  }

  setSelected(event: Event, option: IMultiSelectOption) {
    if (!this.model) {
      this.model = [];
    }
    const index = this.model.indexOf(option.id);
    if (index > -1) {
      this.model.splice(index, 1);
      this.onRemoved.emit(option.id);
    } else {
      if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
        this.model.push(option.id);
        this.onAdded.emit(option.id);
      } else {
        if (this.settings.autoUnselect) {
          this.model.push(option.id);
          this.onAdded.emit(option.id);
          const removedOption = this.model.shift();
          this.onRemoved.emit(removedOption);
        } else {
          this.selectionLimitReached.emit(this.model.length);
          return;
        }
      }
    }
    if (this.settings.closeOnSelect) {
      this.toggleDropdown();
    }
    this.onModelChange(this.model);
    this.onModelTouched();
  }

  updateNumSelected() {
    this.numSelected = this.model && this.model.length || 0;
  }

  updateTitle() {
    if (this.numSelected === 0) {
      this.title = this.texts.defaultTitle || '';
    } else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
      this.title = this.options
        .filter((option: IMultiSelectOption) =>
          this.model && this.model.indexOf(option.id) > -1
        )
        .map((option: IMultiSelectOption) => option.name)
        .join(', ');
    } else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
      this.title = this.texts.allSelected || '';
    } else {
      this.title = this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  checkAll() {
    this.model = this.options
      .map((option: IMultiSelectOption) => {
        if (this.model.indexOf(option.id) === -1) {
          this.onAdded.emit(option.id);
        }
        return option.id;
      });
    this.onModelChange(this.model);
    this.onModelTouched();
  }

  uncheckAll() {
    this.model.forEach((id: number) => this.onRemoved.emit(id));
    this.model = [];
    this.onModelChange(this.model);
    this.onModelTouched();
  }

  preventCheckboxCheck(event: Event, option: IMultiSelectOption) {
    if (this.settings.selectionLimit &&
      this.model.length >= this.settings.selectionLimit &&
      this.model.indexOf(option.id) === -1
    ) {
      event.preventDefault();
    }
  }
}
