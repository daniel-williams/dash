import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Deliverables } from './deliverables.component';

const routes: Routes = [
  {
    path: '',
    component: Deliverables
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
export class DeliverablesRoutingModule {}
