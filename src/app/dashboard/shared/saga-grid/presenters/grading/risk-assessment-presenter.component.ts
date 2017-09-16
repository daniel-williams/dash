import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { RiskAssessmentGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'risk-assessment-presenter',
  templateUrl: './risk-assessment-presenter.component.html'
})
export class RiskAssessmentPresenter {
  @Input() data: any;

  private _cellStyle: any = null;
  private grade: RiskAssessmentGradeDetail = new RiskAssessmentGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset Style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['riskAssessmentGradeDetail'] || new RiskAssessmentGradeDetail()) as RiskAssessmentGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
