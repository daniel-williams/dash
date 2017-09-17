import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiselectDropdown } from './multi-select-dropdown.component';
import { MultiSelectSearchFilter } from './multi-select-search-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MultiselectDropdown,
    MultiSelectSearchFilter
  ],
  declarations: [
    MultiselectDropdown,
    MultiSelectSearchFilter
  ],
})
export class MultiselectDropdownModule {}
