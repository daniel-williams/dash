import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { Deliverables } from './deliverables.component';
import { DeliverablesRoutingModule } from './deliverables-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    DeliverablesRoutingModule
  ],
  declarations: [
    Deliverables
  ]
})
export class DeliverablesModule {}
