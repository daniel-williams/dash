import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from './multi-select-dropdown';
import { PipesModule } from './pipes/pipes.module';
import { SagaGridModule } from './saga-grid/saga-grid.module';

import { FormsSelect } from './select';
import { SagaSearch } from './search';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MultiselectDropdownModule,
    PipesModule,
    SagaGridModule,
  ],
  declarations: [
    FormsSelect,
    SagaSearch,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FormsSelect,
    SagaSearch,
    PipesModule,
    MultiselectDropdownModule,
    SagaGridModule,
  ],
  providers: [
  ]
})
export class SharedModule {}