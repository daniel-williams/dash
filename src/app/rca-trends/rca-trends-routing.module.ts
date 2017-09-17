import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RcaTrends } from './rca-trends.component';

const routes: Routes = [
  {
    path: '',
    component: RcaTrends
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
export class RcaTrendsRoutingModule {}
