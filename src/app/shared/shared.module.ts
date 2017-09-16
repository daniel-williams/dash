import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from './pipes/pipes.module';

// config validation
import { SharedService } from './shared.service';
import { SharedCompModule } from './shared-comp';


@NgModule({
  imports: [
    CommonModule,

    PipesModule,
    SharedCompModule,
  ],
  exports: [
    CommonModule,
    FormsModule,

    PipesModule,
    SharedCompModule,
  ],
  providers: [
    SharedService,
  ]
})
export class SharedModule {}