import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { Scenarios } from './scenarios.component';
import { ScenariosRoutingModule } from './scenarios-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    ScenariosRoutingModule
  ],
  declarations: [
    Scenarios
  ]
})
export class ScenariosModule {}
