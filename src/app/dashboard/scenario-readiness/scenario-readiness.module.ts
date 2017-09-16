import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningSharedModule } from '../shared/planning-shared.module';

import { ScenarioReadiness } from './scenario-readiness.component';
import { ScenarioReadinessRoutingModule } from './scenario-readiness-routing.module';


@NgModule({
  imports: [
    CommonModule,

    PlanningSharedModule,
    ScenarioReadinessRoutingModule,
  ],
  declarations: [
    ScenarioReadiness,
  ]
})
export class ScenarioReadinessModule {}
