import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScenarioReadiness } from './scenario-readiness.component';

const routes: Routes = [
  {
    path: '',
    component: ScenarioReadiness
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
export class ScenarioReadinessRoutingModule {}
