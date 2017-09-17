import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ExperienceScorecard,
  ScorecardOverview,
  ScorecardFeature
} from './';

const routes: Routes = [
  {
    path: '',
    component: ExperienceScorecard,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: ScorecardOverview
      },
      {
        path: 'feature',
        component: ScorecardFeature
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
export class ExperienceScorecardRoutingModule {}
