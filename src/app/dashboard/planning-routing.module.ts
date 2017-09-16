import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Planning } from './planning.component';
import { PlanningSearch } from './planning-search.component';

import { BugsModule } from './bugs/bugs.module';
import { DeliverablesModule } from './deliverables/deliverables.module';
import { ExperienceScorecardModule } from './experience-scorecard/experience-scorecard.module';
import { MeasuresModule } from './measures/measures.module';
import { RcaTrendsModule } from './rca-trends/rca-trends.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { ScenarioReadinessModule } from './scenario-readiness/scenario-readiness.module';


const routes: Routes = [
  {
    path: '',
    component: Planning,
    pathMatch: 'prefix',
    children: [
      {
        path: 'experience-scorecard',
        loadChildren: () => ExperienceScorecardModule,
      },
      {
        path: '',
        component: PlanningSearch,
        children: [
          {
            path: '',
            redirectTo: 'scenarios',
            pathMatch: 'full'
          },
          {
            path: 'scenarios',
            loadChildren: () => ScenariosModule
          },
          {
            path: 'deliverables',
            loadChildren: () => DeliverablesModule
          },
          {
            path: 'measures',
            loadChildren: () => MeasuresModule
          },
          {
            path: 'bugs',
            loadChildren: () => BugsModule
          },
          {
            path: 'scenario-readiness',
            loadChildren: () => ScenarioReadinessModule
          },
          {
            path: 'rca-trends',
            loadChildren: () => RcaTrendsModule
          },
        ]
      }

    ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PlanningRoutingModule {}
