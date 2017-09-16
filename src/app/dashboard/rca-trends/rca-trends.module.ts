import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlanningSharedModule } from '../shared/planning-shared.module';

import { RcaTrends } from './rca-trends.component';
import { RcaTrendsRoutingModule } from './rca-trends-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PlanningSharedModule,
    RcaTrendsRoutingModule,
  ],
  declarations: [
    RcaTrends
  ],
})
export class RcaTrendsModule {}
