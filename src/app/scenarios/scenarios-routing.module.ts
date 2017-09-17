import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Scenarios } from './scenarios.component';

const routes: Routes = [
  {
    path: '',
    component: Scenarios
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
export class ScenariosRoutingModule {}
