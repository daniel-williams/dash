import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlanningSharedModule } from '../shared/planning-shared.module';

import { Measures } from './measures.component';
import { MeasuresRoutingModule } from './measures-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PlanningSharedModule,
    MeasuresRoutingModule
  ],
  declarations: [
    Measures
  ]
})
export class MeasuresModule {}
