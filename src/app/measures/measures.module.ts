import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { Measures } from './measures.component';
import { MeasuresRoutingModule } from './measures-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    MeasuresRoutingModule
  ],
  declarations: [
    Measures
  ]
})
export class MeasuresModule {}
