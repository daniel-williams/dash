import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { MeasurableOutcomeMetGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'measurable-outcome-met-presenter',
  templateUrl: './measurable-outcome-met-presenter.component.html'
})
export class MeasurableOutcomeMetPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: MeasurableOutcomeMetGradeDetail = new MeasurableOutcomeMetGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['measurableOutcomeMetGradeDetail'] || new MeasurableOutcomeMetGradeDetail()) as MeasurableOutcomeMetGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
