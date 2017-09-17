import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { Bugs } from './bugs.component';
import { BugsRoutingModule } from './bugs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    BugsRoutingModule
  ],
  declarations: [
    Bugs
  ]
})
export class BugsModule {}
