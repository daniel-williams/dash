import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormsSelect } from './select';
import { SagaSearch } from './search';

import { MultiselectDropdownModule } from './multi-select-dropdown';
import { SagaGridModule } from './saga-grid/saga-grid.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MultiselectDropdownModule,
    SagaGridModule,
  ],
  declarations: [
    FormsSelect,
    SagaSearch,
  ],
  exports: [
    FormsSelect,
    SagaSearch,

    MultiselectDropdownModule,
    SagaGridModule,
  ]
})
export class PlanningSharedModule {}
