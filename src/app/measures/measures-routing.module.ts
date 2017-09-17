import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Measures } from './measures.component';

const routes: Routes = [
  {
    path: '',
    component: Measures
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MeasuresRoutingModule {}
