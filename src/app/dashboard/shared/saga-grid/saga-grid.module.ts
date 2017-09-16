import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '../../../shared/pipes';

import { SagaGrid } from './saga-grid.component';
import { SortIndicator } from './sort-indicator.component';
import {
  PresenterHost,

  AssignedPresenter,
  CollapsibleTextPresenter,
  ColorBoxPresenter,
  ShortnamePresenter,
  TextPresenter,
  WorkitemLinkPresenter,

  AccessibilityPresenter,
  CompletenessPresenter,
  CraftsmanshipPresenter,
  HighImpactBugsPresenter,
  CustomerFeedbackPresenter,
  MeasurableOutcomeMetPresenter,
  OverallGradePresenter,
  RiskAssessmentPresenter,
  ScenarioValidationPresenter,
  StatePresenter,
  TelemetryPresenter,

  PlanningCompliancePresenter,
  PlanningDevDesignPresenter,
  PlanningFuncSpecPresenter,
  PlanningRiskPresenter,
  PlanningStatePresenter
} from './presenters';
import {
  EditorHost,
  TextAreaEditor,
  TextBoxEditor,
  SelectOptionEditor,
} from './editors';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule
  ],
  declarations: [
    SagaGrid,
    SortIndicator,

    PresenterHost,
    EditorHost,

    AssignedPresenter,
    CollapsibleTextPresenter,
    ColorBoxPresenter,
    ShortnamePresenter,
    TextPresenter,
    WorkitemLinkPresenter,

    AccessibilityPresenter,
    CompletenessPresenter,
    CraftsmanshipPresenter,
    HighImpactBugsPresenter,
    CustomerFeedbackPresenter,
    MeasurableOutcomeMetPresenter,
    OverallGradePresenter,
    RiskAssessmentPresenter,
    ScenarioValidationPresenter,
    StatePresenter,
    TelemetryPresenter,

    PlanningCompliancePresenter,
    PlanningDevDesignPresenter,
    PlanningFuncSpecPresenter,
    PlanningRiskPresenter,
    PlanningStatePresenter,

    SelectOptionEditor,
    TextAreaEditor,
    TextBoxEditor,
  ],
  exports: [
    SagaGrid
  ]
})
export class SagaGridModule {
}
