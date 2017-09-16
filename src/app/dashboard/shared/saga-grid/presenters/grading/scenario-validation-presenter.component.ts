import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { ScenarioValidationGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'scenario-validation-presenter',
  templateUrl: './scenario-validation-presenter.component.html'
})
export class ScenarioValidationPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: ScenarioValidationGradeDetail = new ScenarioValidationGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['scenarioValidationGradeDetail'] || new ScenarioValidationGradeDetail()) as ScenarioValidationGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
