import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlanningSharedModule } from '../shared/planning-shared.module';

import { Deliverables } from './deliverables.component';
import { DeliverablesRoutingModule } from './deliverables-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PlanningSharedModule,
    DeliverablesRoutingModule
  ],
  declarations: [
    Deliverables
  ]
})
export class DeliverablesModule {}
