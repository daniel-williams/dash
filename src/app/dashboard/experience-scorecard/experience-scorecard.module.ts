import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperienceScorecardRoutingModule } from './experience-scorecard-routing.module';
import {
  BrowserCard,
  ExperienceScorecard,
  ScorecardOverview,
  ScorecardFeature,
} from './'

import {
  ExperienceScorecardService,
  ExpVideo,
  WordCloud,
} from './shared';

@NgModule({
  imports: [
    CommonModule,

    ExperienceScorecardRoutingModule
  ],
  declarations: [
    BrowserCard,
    ExperienceScorecard,
    ScorecardOverview,
    ScorecardFeature,

    ExpVideo,
    WordCloud
  ],
  providers: [
    ExperienceScorecardService
  ]
})
export class ExperienceScorecardModule {}
