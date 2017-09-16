import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningSharedModule } from './shared/planning-shared.module';

import { Planning } from './planning.component';
import { PlanningNav } from './planning-nav.component';
import { PlanningSearch } from './planning-search.component';

import { SearchService } from './shared/search';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    PlanningSharedModule,
    PlanningRoutingModule,
  ],
  declarations: [
    Planning,
    PlanningNav,
    PlanningSearch,
  ],
  providers: [
    SearchService,
  ]
})
export class PlanningModule {}
