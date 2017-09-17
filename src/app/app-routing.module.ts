import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Mods
// import { BugsModule } from './dashboard/bugs/bugs.module';
// import { DeliverablesModule } from './dashboard/deliverables/deliverables.module';
// import { ExperienceScorecardModule } from './dashboard/experience-scorecard/experience-scorecard.module';
// import { MeasuresModule } from './dashboard/measures/measures.module';
// import { RcaTrendsModule } from './dashboard/rca-trends/rca-trends.module';
// import { ScenariosModule } from './dashboard/scenarios/scenarios.module';
// import { ScenarioReadinessModule } from './dashboard/scenario-readiness/scenario-readiness.module';

//Comps
import { PlanningSearch } from './planning-search.component';

// NOTE: for lazy mods, use
// loadChildren: './lazy/lazy.module#LazyModule',


const routes: Routes = [
  {
    path: 'experience-scorecard',
    loadChildren: './experience-scorecard/experience-scorecard.module#ExperienceScorecardModule',
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
        loadChildren: './scenarios/scenarios.module#ScenariosModule',
      },
      {
        path: 'deliverables',
        loadChildren: './deliverables/deliverables.module#DeliverablesModule',
      },
      {
        path: 'measures',
        loadChildren: './measures/measures.module#MeasuresModule',
      },
      {
        path: 'bugs',
        loadChildren: './bugs/bugs.module#BugsModule',
      },
      {
        path: 'scenario-readiness',
        loadChildren: './scenario-readiness/scenario-readiness.module#ScenarioReadinessModule',
      },
      {
        path: 'rca-trends',
        loadChildren: './rca-trends/rca-trends.module#RcaTrendsModule',
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }