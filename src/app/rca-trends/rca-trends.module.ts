import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { RcaTrends } from './rca-trends.component';
import { RcaTrendsRoutingModule } from './rca-trends-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    RcaTrendsRoutingModule,
  ],
  declarations: [
    RcaTrends
  ],
})
export class RcaTrendsModule {}
