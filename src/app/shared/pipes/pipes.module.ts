import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EllipsisPipe } from './ellipsis.pipe';
import { FilterListPipe } from './filter-list.pipe';
import { LegacyScenarioPipe } from './legacy-scenario.pipe';
import { ShortAssignedToPipe } from './short-assigned-to.pipe';
import { SortOnPipe } from './sort-on.pipe';
import { UrlPipe } from './url.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EllipsisPipe,
    FilterListPipe,
    LegacyScenarioPipe,
    ShortAssignedToPipe,
    SortOnPipe,
    UrlPipe,
  ],
  exports: [
    EllipsisPipe,
    FilterListPipe,
    LegacyScenarioPipe,
    ShortAssignedToPipe,
    SortOnPipe,
    UrlPipe,
  ]
})
export class PipesModule {
}
