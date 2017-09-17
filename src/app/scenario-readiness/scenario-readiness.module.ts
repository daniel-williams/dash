import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { ScenarioReadiness } from './scenario-readiness.component';
import { ScenarioReadinessRoutingModule } from './scenario-readiness-routing.module';


@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    ScenarioReadinessRoutingModule,
  ],
  declarations: [
    ScenarioReadiness,
  ]
})
export class ScenarioReadinessModule {}
