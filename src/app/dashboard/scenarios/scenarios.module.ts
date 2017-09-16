import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared';
import { PlanningSharedModule } from '../shared/planning-shared.module';

import { Scenarios } from './scenarios.component';
import { ScenariosRoutingModule } from './scenarios-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    PlanningSharedModule,
    ScenariosRoutingModule
  ],
  declarations: [
    Scenarios
  ]
})
export class ScenariosModule {}
