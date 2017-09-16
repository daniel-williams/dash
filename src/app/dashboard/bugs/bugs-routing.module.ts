import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Bugs } from './bugs.component';

const routes: Routes = [
  {
    path: '',
    component: Bugs
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
export class BugsRoutingModule {}
